import { io } from "../index";
import { Socket } from "socket.io";
import { setUserVote, getRoomModerator, getUserVotes } from "../models/user";
import { VotingStates } from "../constants/enums";

export function handleVote(payload: RoomVotePayload, socket: Socket): void {
    const sessionId: string = socket.id;
    const roomCode: string = [...socket.rooms][1];
    const state: string = VotingStates.VOTED;
    const vote: string = payload.vote;

    setUserVote(state, vote, sessionId);

    io.in(roomCode).emit("room:broadcastVote", {
        sessionId: sessionId,
        vote: state,
    } as Vote);
}

export async function broadcastVotes(socket: Socket) {
    const roomCode: string = [...socket.rooms][1];
    const sessionId: string = socket.id;
    const roomModerator: string = await getRoomModerator(roomCode);
    if (sessionId !== roomModerator) return;
    const votes: Vote[] = await getUserVotes(roomCode);
    io.in(roomCode).emit("room:revealedVotes", votes);
}

export async function areVotesUnanimous(roomCode: string): Promise<boolean> {
    const rawVotes: Vote[] = await getUserVotes(roomCode);
    let votes: string[] = rawVotes.map((vote: Vote) => vote.vote);
    votes = votes.filter((vote: string) => vote !== "");
    let flag: boolean = true;
    if (votes.length == 0) return flag;
    votes.reduce((previousValue: string, currentValue: string) => {
        if (previousValue !== currentValue) flag = false;
        return currentValue;
    });
    return flag;
}
