import {Socket} from "socket.io";
import {setVotingSystem, addUserstories, getRoomState, setRoomState, close, broadcastVotes, handleUserListUpdate, getNotEmptyVotes, setRoomTheme, getVotes} from "./room";
import {connection, io} from "./index";

export function start(options : any, socket : Socket) { // TODO: Implement startOptions type
    const roomCode = [...socket.rooms][1];
    const votingSystem : string = options.votingSystem;
    const userStories : UserStory[] = options.userStories;
    const roomTheme : string = options.theme;

    setRoomTheme(roomCode, roomTheme);
    setVotingSystem(votingSystem, socket);
    addUserstories(userStories, socket);
    setCurrentUserStoryId(roomCode,-1)
}

export async function nextRound(socket: Socket) {
    const roomCode : string = [...socket.rooms][1];
    const currentState : string = await getRoomState(roomCode);
    const userStories : UserStory[] = await getUserStories(roomCode);
    const currentUserStoryId : number = await getCurrentUserStoryId(roomCode);
    if(userStories.length - 1 == currentUserStoryId && currentState != "closeable") {
        broadcastVotes(socket);
        setRoomState(roomCode, "closeable"); // TODO: Use enum for room states
    }
    else {
        switch (currentState) {
            case "closeable": { // TODO: Use enum for room states
                await close(roomCode, socket); // ? Should this be await?
                return;
            }
            case "voting": { // TODO: Use enum for room states
                await broadcastVotes(socket); // ? Should this be await?
                setRoomState(roomCode, "waiting"); // TODO: Use enum for room states
                break;
            }
            case "waiting": { // TODO: Use enum for room states
                if(await areVotesUnanimous(roomCode) || currentUserStoryId == -1) {
                    setCurrentUserStoryId(roomCode, currentUserStoryId + 1)
                    io.in(roomCode).emit("room:userStoryUpdate", {currentUserStory: userStories[currentUserStoryId + 1]})
                }
                resetVotes(roomCode);
                setRoomState(roomCode, "voting");
                await handleUserListUpdate(roomCode); // ? Should this be await?
                break;

            }
        }
    }
    const newRoomState : string = await getRoomState(roomCode);
    io.in(roomCode).emit("room:stateUpdate", {roomState: newRoomState}); // TODO: Create type for room state update payload
}

export async function getUserStories(roomCode : string) : Promise<UserStory[]> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM UserStory WHERE roomId = ?', roomCode, (err, rows) => {
            if (err) throw err;
            resolve(rows)
        })
    })
}

function getCurrentUserStoryId(roomCode : string) : Promise<number>{
    return new Promise((resolve, reject) => {
        connection.query('SELECT currentUserStory FROM Room WHERE id = ?', roomCode, (err, rows) => {
            if (err) throw err;
            resolve(rows[0].currentUserStory);
        });
    });
}

export async function getCurrentUserStory(roomCode : string) : Promise<UserStory> {
    const currentUserStoryId : number = await getCurrentUserStoryId(roomCode);
    if(currentUserStoryId == -1) return {id: -1, roomId: roomCode, name: "Waiting", content: ""};
    const userStoryId : number = (await getUserStories(roomCode))[currentUserStoryId].id || -97;
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM UserStory WHERE id = ?', [userStoryId], (err, rows) => {
            if (err) throw err;
            resolve(rows[0]);
        });
    });
}

function setCurrentUserStoryId(roomCode : string, id : number) : void {
    connection.query('UPDATE Room SET currentUserStory = ? WHERE id = ?', [id, roomCode], (err, rows) => {
        if (err) throw err;
    });
}

function resetVotes(roomCode : string) : void {
    connection.query('UPDATE User SET vote = "", state = "voting" WHERE roomId = ?', roomCode, (err, rows) => {
        if (err) throw err;
    });
}

async function areVotesUnanimous(roomCode: string) : Promise<boolean> {
    const rawVotes: any[] = await getNotEmptyVotes(roomCode); // TODO: Rewrite this to use getVotes and filter
    const votes: any[] = rawVotes.map((vote: any) => {
        return {vote: vote.vote}
    });
    if(votes.length === 0) return false;
    let flag: boolean = true;
    votes.reduce((previousValue, currentValue) => {
        if (previousValue.vote != currentValue.vote) flag = false;
    })
    return flag;
}