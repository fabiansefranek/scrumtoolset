import {Socket} from "socket.io";
import {setVotingSystem, addUserstories, getRoomState, setRoomState, close, broadcastVotes, handleUserListUpdate} from "./room";
import {connection, io} from "./index";

export function start(options : any, socket : Socket) {
    const votingSystem : string = options.votingSystem;
    const userStories : any[] = options.userStories;

    setVotingSystem(votingSystem, socket);
    addUserstories(userStories, socket);
    setCurrentUserStoryId([...socket.rooms][1],-1)
}

export async function nextRound(socket: Socket) {
    const roomCode : string = [...socket.rooms][1];
    const currentState : string = await getRoomState(roomCode);
    const userStories : any[] = await getUserStories(roomCode);
    const currentUserStoryId : number = await getCurrentUserStoryId(roomCode);
    console.log("LENGTH: "+userStories.length);
    console.log("ID: "+currentUserStoryId);
    console.log("CURRENSTATE: "+currentState);
    if(userStories.length - 1 == currentUserStoryId && currentState != "closeable") {
        setRoomState(roomCode, "closeable");
    }
    else {
        switch (currentState) {
            case "closeable": {
                console.log("closeable");
                await close(roomCode, socket);
                return;
            }
            case "voting": {
                console.log("voting");
                broadcastVotes(socket);
                setRoomState(roomCode, "waiting");
                break;
            }
            case "waiting": {
                console.log("waiting");
                resetVotes(roomCode);
                setCurrentUserStoryId(roomCode, currentUserStoryId + 1)
                io.in(roomCode).emit("room:userStoryUpdate", {currentUserStory: userStories[currentUserStoryId + 1]})
                setRoomState(roomCode, "voting");
                await handleUserListUpdate(roomCode);
                break;
            }
        }
    }
    const newRoomState = await getRoomState(roomCode);
    console.log(`New room state: ${newRoomState}`);
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
    console.log(currentUserStoryId);
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM UserStory WHERE id = ?', [currentUserStoryId], (err, rows) => {
            if (err) throw err;
            console.log(rows[0]);
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