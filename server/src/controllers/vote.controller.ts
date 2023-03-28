import { io } from "../index";
import { Socket } from "socket.io";
import { setUserVote, getRoomModerator, getUserVotes } from "../models/user";
import { VotingStates } from "../constants/enums";
import {EndOfVotingPacket, RoomVotePayload, Vote} from "../types";

export function handleVote(socket: Socket, payload: RoomVotePayload): void {
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
    const roomModerator: string | undefined = await getRoomModerator(roomCode);
    if (!roomModerator) return;
    if (sessionId !== roomModerator) return;
    const votes: Vote[] = await getUserVotes(roomCode);
    io.in(roomCode).emit("room:revealedVotes", votes);
}

export async function areVotesUnanimous(roomCode: string): Promise<EndOfVotingPacket> {
    const rawVotes: Vote[] = await getUserVotes(roomCode);
    let votes: string[] = rawVotes.map((vote: Vote) => vote.vote);
    votes = votes.filter((vote: string) => vote !== "");
    let flag: boolean = true;
    let value: string = "";
    if (votes.length <= 1) return {success:true, result: votes[0]};
    votes.reduce((previousValue: string, currentValue: string) => {
        value = previousValue;
        if (previousValue !== currentValue) flag = false;
        return currentValue;
    });
    return {success:flag, result: value};
}
