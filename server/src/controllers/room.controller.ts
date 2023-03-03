import { io } from "../index";
import { Socket } from "socket.io";
import { checkUserInput, generateWordSlug } from "../utils";
import { createRoom, deleteRoom, getRoomName } from "../models/room";
import {
    addUserStories,
    getCurrentUserStory,
    deleteRoomUserStories,
    getUserStories,
    getCurrentUserStoryId,
    setCurrentUserStoryId, checkDone, setUserStoryResult, getUserStoryResults,
} from "../models/userStory";
import {
    doesRoomExist,
    getRoomVotingSystem,
    getRoomState,
    getRoomTheme,
    setRoomState,
} from "../models/room";
import {
    getOldestConnectionFromRoom,
    createUser,
    deleteUser,
    getRoomModerator,
    giveUserModeratorRights,
    getUsersInRoom,
    resetUserVotes,
} from "../models/user";
import { ApplicationErrorMessages, RoomStates } from "../constants/enums";
import { broadcastVotes, areVotesUnanimous } from "./vote.controller";
import { ApplicationError } from "../errors/application.error";
import {
    EndOfVotingPacket,
    RoomClosePayload,
    RoomCreationPayload,
    RoomJoinPayload,
    User,
    UserStory, UserStoryResultPacket,
} from "../types";
import {DisconnectReason} from "socket.io/dist/socket";
import {handleErrors} from "../middleware/error.middleware";

export function create(socket: Socket, payload: RoomCreationPayload): void {
    const roomCode: string = generateWordSlug(3, "-");
    const now: number = Math.floor(Date.now() / 1000);

    if (!checkUserInput(payload.base.roomName))
        throw new ApplicationError(
            ApplicationErrorMessages.ROOM_NAME_INVALID,
            true
        );
    if (!checkUserInput(payload.base.username))
        throw new ApplicationError(
            ApplicationErrorMessages.USER_NAME_INVALID,
            true
        );

    createRoom(
        roomCode,
        payload.base.roomName,
        "waiting",
        payload.options.votingSystem,
        -1,
        payload.options.theme
    );
    if (payload.options.userStories.length === 0)
        throw new ApplicationError(
            ApplicationErrorMessages.MISSING_USERSTORY,
            true
        );
    addUserStories(payload.options.userStories, roomCode);

    socket.join(roomCode);
    join(socket, { roomCode: roomCode, username: payload.base.username }, true);
}

export async function join(
    socket: Socket,
    payload: RoomJoinPayload,
    isModerator?: boolean
) {
    socket.on("disconnecting", (reason: DisconnectReason) =>
        handleErrors(leave, {
            socket: socket,
        })
    );

    const roomCode: string = payload.roomCode;
    const username: string = payload.username;
    const now: number = Math.floor(Date.now() / 1000);

    const roomFound: boolean = await doesRoomExist(roomCode);
    if (!roomFound) return socket.emit("room:denied");
    if (!checkUserInput(username))
        throw new ApplicationError(
            ApplicationErrorMessages.USER_NAME_INVALID,
            true
        );

    const roomName = await getRoomName(roomCode);

    if (isModerator === undefined) {
        isModerator = (await getOldestConnectionFromRoom(roomCode)) === "";
    }

    createUser(socket.id, username, now, roomCode, isModerator);

    //Makes sure user doesn't join same room twice
    if ([...socket.rooms][1] != roomCode) socket.join(roomCode);

    socket.join("scrumpoker")

    const votingSystem: string = await getRoomVotingSystem(roomCode);
    const roomState: string = await getRoomState(roomCode);
    const currentUserStory: UserStory = await getCurrentUserStory(roomCode);
    const roomTheme: string = await getRoomTheme(roomCode);
    socket.emit("room:joined", {
        roomName: roomName,
        roomCode: roomCode,
        votingSystem: votingSystem,
        roomState: roomState,
        currentUserStory: currentUserStory,
        theme: roomTheme,
    });
    await handleUserListUpdate(roomCode);
}

export async function leave(socket: Socket, force? : boolean) {
    const sessionId: string = socket.id;
    const roomCode: string = [...socket.rooms][1];
    const forceful = force !== undefined ? force : false;
    const roomModeratorId: string | undefined = await getRoomModerator(
        roomCode
    );
    console.log(forceful + " FORCEFULL")
    deleteUser(sessionId);

    if(!forceful) {

        if (roomModeratorId === undefined) throw new ApplicationError(ApplicationErrorMessages.NO_MODERATOR, true);
        const isModerator: boolean = sessionId === roomModeratorId;


        if (isModerator) {
            const newModeratorId: string | undefined = await getOldestConnectionFromRoom(
                roomCode
            );
            if (newModeratorId === "") return;
            if (newModeratorId)
                await giveUserModeratorRights(newModeratorId);
        }
    }
    await handleUserListUpdate(roomCode);
}

export async function close(socket: Socket, payload: RoomClosePayload) {
    const roomCode: string = payload.roomCode;
    const roomFound: boolean = await doesRoomExist(roomCode);
    if (!roomFound) throw new ApplicationError(ApplicationErrorMessages.ROOM_NOT_FOUND, true);

    socket.removeAllListeners()

    const sockets: any[] = await io.in(roomCode).fetchSockets();
    io.in(roomCode).emit("room:closed"); //COMMENT THE FIRST leave(out) -> then it should have no issues
    let result = sockets.map((socket: Socket) => leave(socket, true));
    await Promise.all(result);
    io.in(roomCode).disconnectSockets(true);

    deleteRoomUserStories(roomCode);
    deleteRoom(roomCode);
}

export async function handleUserListUpdate(roomCode: string): Promise<void> {
    const users: User[] = await getUsersInRoom(roomCode);
    io.in(roomCode).emit("room:userListUpdate", users);
}

export async function nextRound(socket: Socket) {
    const roomCode: string = [...socket.rooms][1];
    const currentState: string = await getRoomState(roomCode);
    const userStories: UserStory[] = await getUserStories(roomCode);
    const currentUserStoryId: number = await getCurrentUserStoryId(roomCode);
    const isDone : boolean = await checkDone(roomCode);
    const curResult : EndOfVotingPacket = await areVotesUnanimous(roomCode)
    console.log(curResult.result + " : " + curResult.success);
    if (
        (currentState != RoomStates.CLOSEABLE &&
        isDone) && curResult.success
    ) {
        await broadcastVotes(socket);
        setUserStoryResult(currentUserStoryId, curResult.result!)
        setRoomState(RoomStates.CLOSEABLE, roomCode);
    } else {
        switch (currentState) {
            case RoomStates.CLOSEABLE: {
                await close(socket, { roomCode: roomCode });
                return;
            }
            case RoomStates.VOTING: {
                await broadcastVotes(socket);
                setRoomState(RoomStates.WAITING, roomCode);
                break;
            }
            case RoomStates.WAITING: {
                if ( curResult.success
                     ||
                    currentUserStoryId == -1
                ) {

                    if(currentUserStoryId != -1)
                        setCurrentUserStoryId(roomCode, currentUserStoryId + 1);
                    else
                        setCurrentUserStoryId(roomCode, userStories[0].id!);
                    if(currentUserStoryId != -1)
                        io.in(roomCode).emit(
                        "room:userStoryUpdate",
                        userStories[currentUserStoryId - userStories[0].id! + 1 ]
                    );
                    else
                        io.in(roomCode).emit(
                            "room:userStoryUpdate",
                            userStories[0]
                        );
                    console.log(JSON.stringify(userStories) + "ID OF NEXT");
                    if(currentUserStoryId != -1) {
                        setUserStoryResult(currentUserStoryId, curResult.result!)
                    }
                } else
                    new ApplicationError(
                        ApplicationErrorMessages.REVOTE_STARTED,
                        false
                    ).send(socket, true);
                resetUserVotes(roomCode);
                setRoomState(RoomStates.VOTING, roomCode);
                await handleUserListUpdate(roomCode);
                break;
            }
        }
    }
    const newRoomState: string = await getRoomState(roomCode);
    io.in(roomCode).emit("room:stateUpdate", newRoomState);
}

export async function sendUserStoryResults(socket: Socket) {
    const roomCode: string = [...socket.rooms][1];
    const results: UserStoryResultPacket[] = await getUserStoryResults(roomCode);
    socket.emit("room:exportedResults", results)
}


