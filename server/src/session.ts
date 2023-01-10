import { Socket } from "socket.io";
import { close, broadcastVotes, handleUserListUpdate } from "./room";
import { connection, io } from "./index";
import { getRoomState, setRoomState } from "./models/room";
import { getUserVotes, resetUserVotes } from "./models/user";
import {
    getCurrentUserStoryId,
    getUserStories,
    setCurrentUserStoryId,
} from "./models/userStory";
import { RoomStates } from "./enums";

export async function nextRound(socket: Socket) {
    const roomCode: string = [...socket.rooms][1];
    const currentState: string = await getRoomState(roomCode);
    const userStories: UserStory[] = await getUserStories(roomCode);
    const currentUserStoryId: number = await getCurrentUserStoryId(roomCode);
    if (
        userStories.length - 1 == currentUserStoryId &&
        currentState != RoomStates.CLOSEABLE
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
                    io.in(roomCode).emit("room:userStoryUpdate", {
                        currentUserStory: userStories[currentUserStoryId + 1],
                    });
                }
                resetUserVotes(roomCode);
                setRoomState(RoomStates.VOTING, roomCode);
                await handleUserListUpdate(roomCode); // ? Should this be await?
                break;
            }
        }
    }
    const newRoomState: string = await getRoomState(roomCode);
    io.in(roomCode).emit("room:stateUpdate", { roomState: newRoomState });
}

async function areVotesUnanimous(roomCode: string): Promise<boolean> {
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
