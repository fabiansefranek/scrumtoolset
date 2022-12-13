import {Socket} from "socket.io";
import {setVotingSystem, addUserstories, getRoomState, setRoomState, close} from "./room";
import {connection, io} from "./index";

export function start(options : any, socket : Socket) {
    const votingSystem : string = options.votingSystem;
    const userStories : any[] = options.userStories;

    setVotingSystem(votingSystem, socket);
    addUserstories(userStories, socket);
    setCurrentUserStoryId([...socket.rooms][1],-1)
}

export async function nextRound(socket: Socket) {
    const roomId : string = [...socket.rooms][1];
    const currentState : string = await getRoomState(roomId);
    const userStories : any[] = getUserStories(roomId);
    const currentUserStoryId : number = await getCurrentUserStoryId(socket);
    console.log("LENGTH: "+userStories.length);
    console.log("ID: "+currentUserStoryId);
    console.log("CURRENSTATE: "+currentState);
    if(userStories.length - 1 == currentUserStoryId && currentState != "closeable") {
        setRoomState(roomId, "closeable");
    }
    else {
        switch (currentState) {
            case "closeable": {
                console.log("closeable");
                await close(roomId, socket);
                break;
            }
            case "voting": {
                console.log("voting");
                setRoomState(roomId, "waiting");
                break;
            }
            case "waiting": {
                console.log("waiting");
                resetVotes(roomId);
                setCurrentUserStoryId(roomId, currentUserStoryId + 1)
                io.in(roomId).emit("room:userStoryUpdate", {name:userStories[currentUserStoryId + 1].name,content:userStories[currentUserStoryId + 1].content})
                setRoomState(roomId, "voting");
                break;
            }
        }
    }
}

function getUserStories(roomId : string) : any[]{
    const userStories : any[] = [];
    connection.query('SELECT id, name, content FROM UserStory WHERE roomId = ?', roomId, (err, rows) => {
        if (err) throw err;
        rows.forEach((row : any) => {
            userStories.push([row.id, row.name, row.content])
        })
    })
    return userStories;
}

function getCurrentUserStoryId(socket : Socket) : Promise<number>{
    const roomId : string = [...socket.rooms][1];
    return new Promise((resolve, reject) => {
        connection.query('SELECT currentUserStory FROM Room WHERE id = ?', roomId, (err, rows) => {
            if (err) throw err;
            resolve(rows[0].currentUserStory);
        });
    });
}

function setCurrentUserStoryId(roomId : string, id : number) : void{
    connection.query('UPDATE Room SET currentUserStory = ? WHERE id = ?', [id, roomId], (err, rows) => {
        if (err) throw err;
    });
}

function resetVotes(roomId : string) : void{
    connection.query('UPDATE User SET vote = "" WHERE roomId = ?', roomId, (err, rows) => {
        if (err) throw err;
    });
}