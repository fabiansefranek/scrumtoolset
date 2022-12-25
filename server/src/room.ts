import { connection, io } from "./index";
import { v4 as uuidv4 } from "uuid";
import { RemoteSocket, Socket } from "socket.io";
import {
    createUser,
    deleteUser,
    giveUserModeratorRights,
    getOldestConnectionFromRoom,
    getRoomModerator,
    getUsersInRoom,
    setUserVote,
    getUserVotes,
} from "./models/user";
import {
    addUserStories,
    deleteRoomUserStories,
    getCurrentUserStory,
} from "./models/userStory";
import {
    createRoom,
    deleteRoom,
    doesRoomExist,
    getRoomState,
    getRoomTheme,
    getRoomVotingSystem,
} from "./models/room";
import { checkUserInput } from "./utils";

export function create(payload: RoomCreationPayload, socket: Socket): void {
    const roomCode: string = uuidv4();
    const now: number = Math.floor(Date.now() / 1000);

    if (!checkUserInput(payload.base.roomName)) return; //TODO change to emit error when failing
    if (!checkUserInput(payload.base.username)) return;

    createRoom(
        roomCode,
        payload.base.roomName,
        "waiting",
        payload.options.votingSystem,
        -1,
        payload.options.theme
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
    if (!checkUserInput(username)) return socket.emit("room:denied");

    if (isModerator === undefined) {
        isModerator = (await getOldestConnectionFromRoom(roomCode)) === "";
    }

    createUser(socket.id, username, now, roomCode, isModerator);

    if ([...socket.rooms][1] != roomCode)
        //Makes sure user doesn't join same room twice
        socket.join(roomCode);
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

export function handleVote(payload: RoomVotePayload, socket: Socket): void {
    const sessionId: string = socket.id;
    const roomCode: string = [...socket.rooms][1];
    const state: string = "voted"; //TODO add enum
    const vote: string = payload.vote;

    setUserVote(state, vote, sessionId);

    io.in(roomCode).emit("room:broadcastVote", {
        sessionId: sessionId,
        state: state,
    });
}

export async function broadcastVotes(socket: Socket) {
    const roomCode: string = [...socket.rooms][1];
    const sessionId: string = socket.id;
    const roomModerator: string = await getRoomModerator(roomCode);
    if (sessionId !== roomModerator) return;
    const votes: Vote[] = await getUserVotes(roomCode);
    io.in(roomCode).emit("room:revealedVotes", votes);
}
