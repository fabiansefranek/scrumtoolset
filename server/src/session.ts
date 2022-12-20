import {Socket} from "socket.io";
import {setVotingSystem, addUserstories, getRoomState, setRoomState, close, broadcastVotes, handleUserListUpdate, getNotEmptyVotes, setRoomTheme} from "./room";
import {connection, io} from "./index";

export function start(options : any, socket : Socket) {
    const roomCode = [...socket.rooms][1];
    const votingSystem : string = options.votingSystem;
    const userStories : any[] = options.userStories;
    const roomTheme : string = options.theme;

    setRoomTheme(roomCode, roomTheme);
    setVotingSystem(votingSystem, socket);
    addUserstories(userStories, socket);
    setCurrentUserStoryId(roomCode,-1)
}

export async function nextRound(socket: Socket) {
    const roomCode : string = [...socket.rooms][1];
    const currentState : string = await getRoomState(roomCode);
    const userStories : any[] = await getUserStories(roomCode);
    const currentUserStoryId : number = await getCurrentUserStoryId(roomCode);
    if(userStories.length - 1 == currentUserStoryId && currentState != "closeable") {
        broadcastVotes(socket);
        setRoomState(roomCode, "closeable");
    }
    else {
        switch (currentState) {
            case "closeable": {
                await close(roomCode, socket);
                return;
            }
            case "voting": {
                await broadcastVotes(socket);
                setRoomState(roomCode, "waiting");
                break;
            }
            case "waiting": {
                if(await areVotesUnanimous(roomCode) || currentUserStoryId == -1) {
                    setCurrentUserStoryId(roomCode, currentUserStoryId + 1)
                    io.in(roomCode).emit("room:userStoryUpdate", {currentUserStory: userStories[currentUserStoryId + 1]})
                }
                resetVotes(roomCode);
                setRoomState(roomCode, "voting");
                await handleUserListUpdate(roomCode);
                break;

            }
        }
    }
    const newRoomState = await getRoomState(roomCode);
    io.in(roomCode).emit("room:stateUpdate", {roomState: newRoomState});
}

export async function getUserStories(roomId : string) : Promise<any[]> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, name, content FROM UserStory WHERE roomId = ?', roomId, (err, rows) => {
            if (err) throw err;
            const userStories : any[] = rows.map((userStory : any) => ({
                id: userStory.id,
                name: userStory.name,
                content: userStory.content
            }))
            resolve(userStories)
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

export async function getCurrentUserStory(roomCode : string) : Promise<any> {
    const currentUserStoryId = await getCurrentUserStoryId(roomCode);
    const userStories = await getUserStories(roomCode);
    const userStoryId = (userStories[currentUserStoryId]) ? userStories[currentUserStoryId].id : userStories[currentUserStoryId];
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM UserStory WHERE id = ?', [userStoryId], (err, rows) => {
            if (err) throw err;
            resolve(rows[0]);
        });
    });
}

function setCurrentUserStoryId(roomCode : string, id : number) : void{
    connection.query('UPDATE Room SET currentUserStory = ? WHERE id = ?', [id, roomCode], (err, rows) => {
        if (err) throw err;
    });
}

function resetVotes(roomCode : string) : void{
    connection.query('UPDATE User SET vote = "", state = "voting" WHERE roomId = ?', roomCode, (err, rows) => {
        if (err) throw err;
    });
}

async function areVotesUnanimous(roomCode: string) : Promise<boolean> {
    const rawVotes: any[] = await getNotEmptyVotes(roomCode);
    const votes: any[] = rawVotes.map((vote: any) => {
        return {vote: vote.vote}
    });
    if(votes.length == 0) return false;
    let flag: boolean = true;
    votes.reduce((previousValue, currentValue) => {
        if (previousValue.vote != currentValue.vote) flag = false;
    })
    return flag;
}