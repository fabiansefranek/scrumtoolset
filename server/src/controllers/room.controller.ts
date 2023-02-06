import { io } from "../index";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { checkUserInput, generateWordSlug } from "../utils";
import { createRoom, deleteRoom } from "../models/room";
import {
    addUserStories,
    deleteRoomUserStories,
    getUserStories,
    getCurrentUserStory,
    getCurrentUserStoryId,
    setCurrentUserStoryId, checkDone,
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

export function create(payload: RoomCreationPayload, socket: Socket): void {
    const roomCode: string = generateWordSlug(3, "-");
    const now: number = Math.floor(Date.now() / 1000);

    if (!checkUserInput(payload.base.roomName))
        throw new ApplicationError(
            ApplicationErrorMessages.ROOM_NAME_INVALID,
            true
        ); //TODO change to emit error when failing
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
    join({ roomCode: roomCode, username: payload.base.username }, socket, true);
}

export async function join(
    payload: RoomJoinPayload,
    socket: Socket,
    isModerator?: boolean
) {
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

    if (isModerator === undefined) {
        isModerator = (await getOldestConnectionFromRoom(roomCode)) === "";
    }

    createUser(socket.id, username, now, roomCode, isModerator);

    //Makes sure user doesn't join same room twice
    if ([...socket.rooms][1] != roomCode) socket.join(roomCode);

    const votingSystem: string = await getRoomVotingSystem(roomCode);
    const roomState: string = await getRoomState(roomCode);
    const currentUserStory: UserStory = await getCurrentUserStory(roomCode);
    const roomTheme: string = await getRoomTheme(roomCode);
    socket.emit("room:joined", {
        roomCode: roomCode,
        votingSystem: votingSystem,
        roomState: roomState,
        currentUserStory: currentUserStory,
        theme: roomTheme,
    });
    await handleUserListUpdate(roomCode);
}

export async function leave(socket: Socket) {
    const sessionId: string = socket.id;
    const roomCode: string = [...socket.rooms][1];
    const roomModeratorId: string = await getRoomModerator(roomCode);
    const isModerator: boolean = sessionId === roomModeratorId;

    deleteUser(sessionId);

    if (isModerator) {
        const newModeratorId: string = await getOldestConnectionFromRoom(
            roomCode
        );
        if (newModeratorId === "") return;
        giveUserModeratorRights(newModeratorId);
    }
    await handleUserListUpdate(roomCode);
}

export async function close(payload: RoomClosePayload, socket: Socket) {
    const roomCode: string = payload.roomCode;
    const roomFound: boolean = await doesRoomExist(roomCode);
    if (!roomFound) return socket.emit("room:notfound");

    const sockets: any[] = await io.in(roomCode).fetchSockets();
    io.in(roomCode).emit("room:closed");
    let result = sockets.map((socket: Socket) => leave(socket));
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
    if (
        currentState != RoomStates.CLOSEABLE &&
        isDone
    ) {
        await broadcastVotes(socket);
        setRoomState(RoomStates.CLOSEABLE, roomCode);
    } else {
        switch (currentState) {
            case RoomStates.CLOSEABLE: {
                await close({ roomCode: roomCode }, socket); // ? Should this be await?
                return;
            }
            case RoomStates.VOTING: {
                await broadcastVotes(socket); // ? Should this be await?
                setRoomState(RoomStates.WAITING, roomCode);
                break;
            }
            case RoomStates.WAITING: {
                if (
                    (await areVotesUnanimous(roomCode)) ||
                    currentUserStoryId == -1
                ) {
                    setCurrentUserStoryId(roomCode, currentUserStoryId + 1);
                    io.in(roomCode).emit(
                        "room:userStoryUpdate",
                        userStories[currentUserStoryId + 1]
                    );
                } else
                    new ApplicationError(
                        ApplicationErrorMessages.REVOTE_STARTED,
                        false
                    ).send(socket, true);
                resetUserVotes(roomCode);
                setRoomState(RoomStates.VOTING, roomCode);
                await handleUserListUpdate(roomCode); // ? Should this be await?
                break;
            }
        }
    }
    const newRoomState: string = await getRoomState(roomCode);
    io.in(roomCode).emit("room:stateUpdate", newRoomState);
}
