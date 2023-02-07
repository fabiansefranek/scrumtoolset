import { Socket } from "socket.io";

type User = {
    sessionId: string;
    username: string;
    createdAt: number;
    roomId: string;
    isModerator: boolean;
    state: string;
    vote: string;
};

type Room = {
    id: string;
    displayName: string;
    state: string;
    createdAt: number;
    votingSystem: string;
    currentUserStory: number;
    theme: string;
};

type UserStory = {
    id?: number;
    name: string;
    content: string;
    roomId?: string;
};

type Vote = {
    sessionId: string;
    vote: string;
};

type RoomCreationOptionsPayload = {
    votingSystem: string;
    userStories: UserStory[];
    theme: string;
};

type RoomCreationBasePayload = {
    roomName: string;
    username: string;
};

type RoomCreationPayload = {
    base: RoomCreationBasePayload;
    options: RoomCreationOptionsPayload;
};

type RoomJoinPayload = {
    roomCode: string;
    username: string;
};

type RoomVotePayload = {
    vote: string;
};

type RoomClosePayload = {
    roomCode: string;
};

type ErrorHandlerPayload = {
    socket: Socket;
    args?: unknown;
};

type EndOfVotingPacket = {
    success: boolean;
    result? : string;
}

type UserStoryResultPacket = {
    name: string;
    result: string;
}
