import {connection, io} from './index';
import { v4 as uuidv4 } from 'uuid';
import {Socket} from "socket.io";
import {start} from "./session";
import { getCurrentUserStory } from './session';


export async function join(payload : any, socket : Socket, isModerator? : boolean) {
    const roomCode: string = payload.roomCode;
    const username: string = payload.username;
    const now: number = Math.floor(Date.now() / 1000);

    const roomFound = await doesRoomExist(roomCode);
    if(!roomFound) return socket.emit("room:denied");

    if(typeof isModerator === "undefined") {
        const moderatorNotExists : boolean = (await getOldestConnectionFromRoom(roomCode) == ""); //Checks if any user is connected
        isModerator = moderatorNotExists;
    }
    
    connection.query('INSERT INTO User(sessionId, username, createdAt , roomId, isModerator, state, vote) VALUES (?, ?, ?, ?, ?, ?, ?)', [socket.id, username, now, roomCode, isModerator, "voting", ""], (err, rows) => {
        if(err) throw err;
    });

    if([...socket.rooms][1] != roomCode) //Please comment your code :)
    socket.join(roomCode);
    const votingSystem : string = await getRoomVotingSystem(roomCode);
    const roomState : string = await getRoomState(roomCode);
    const currentUserStory : any = await getCurrentUserStory(roomCode);
    const current : any = (currentUserStory) ? currentUserStory : {name: "Waiting"};
    socket.emit("room:joined", {roomCode: roomCode, votingSystem : votingSystem, roomState: roomState, currentUserStory: current});
    await handleUserListUpdate(roomCode);
}

export async function leave(socket : Socket) {
    const sessionId : string = socket.id;
    const roomCode = [...socket.rooms][1];
    const roomModerator = await getRoomModerator(roomCode);

    const isModerator : boolean = (sessionId == roomModerator);
    connection.query('DELETE FROM User WHERE sessionId = ?', [sessionId], (err, rows) => {
        if(err) throw err;
    });

    if(isModerator) {
        const newModerator = await getOldestConnectionFromRoom(roomCode);
        if(newModerator == "") return;
        connection.query('UPDATE User SET isModerator = 1 WHERE sessionId = ?', [newModerator], (err, rows) => {
            if(err) throw err;
        });
    }

    await handleUserListUpdate(roomCode);
}

export function create(payload : any, socket : Socket) {
    const roomName: string = payload.base.roomName;
    const username: string = payload.base.username;
    const options : any = payload.options;
    const roomCode: string = uuidv4();
    const now: number = Math.floor(Date.now() / 1000);

    connection.query('INSERT INTO Room(id, displayName, state, createdAt, votingSystem) VALUES (?, ?, ?, ?, ?)', [roomCode, roomName,'waiting', now, ''], (err, rows) => {
        if(err) throw err;
    });

    socket.join(roomCode);
    start(options, socket);
    join({roomCode: roomCode, username: username}, socket, true);
}

function doesRoomExist(roomCode : string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM Room WHERE id = ?', [roomCode], (err, rows) => {
            if (err) throw err;
            if (rows.length != 0)
                resolve(true);
            else
                resolve(false);
        });
    });
}

function getRoomModerator(roomCode : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT sessionId FROM User WHERE roomId LIKE ? AND isModerator = 1', [roomCode], (err, rows) => {
            if (err) throw err;
            if (rows.length != 0)
                resolve(rows[0].sessionId);
            else
                resolve("");
        });
    });
}

function getOldestConnectionFromRoom(roomCode : string) : Promise<String> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT sessionId FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC LIMIT 1', [roomCode], (err, rows) => {
            if (err) throw err;
            if (rows.length != 0)
                resolve(rows[0].sessionId);
            else
                resolve("");
        });
    });
}

function getUsersInRoom(roomCode : string) : Promise<any> { //Used to display all users
    return new Promise((resolve, reject) => {
        connection.query('SELECT sessionId, username, state, isModerator, vote FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC', [roomCode], (err, rows) => {
            if (err) throw err;
                resolve(rows);
        });
    });
}

export async function handleUserListUpdate(roomcode : string) : Promise<void> {
    const users : any[] = await getUsersInRoom(roomcode);
    const userList : any[] = users.map((user : any) => {return {sessionId: user.sessionId, username: user.username, state: user.state, isModerator : user.isModerator}});
    io.in(roomcode).emit("room:userListUpdate", userList)
}

export function handleVote(payload : any, socket : Socket) : void {
    const sessionId : string = socket.id;
    const roomCode : string = [...socket.rooms][1];
    const state : string = "voted";
    const vote : string = payload.vote;

    connection.query('UPDATE User SET state = ?, vote = ? WHERE sessionId = ?', [state, vote, sessionId], (err, rows) => {
        if(err) throw err;
    });

    io.in(roomCode).emit("room:broadcastVote", {sessionId : sessionId, state : state});
}


export function setVotingSystem(votingSystem : String, socket : Socket) : void {
    const roomCode : string =[...socket.rooms][1];
    connection.query('UPDATE Room SET votingSystem = ? WHERE id = ?', [votingSystem, roomCode], (err, rows) => {
        if(err) throw err;
    });
}

export function getRoomState(roomCode : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Room WHERE id LIKE ?', [roomCode], (err, rows) => {
            if (err) throw err;
            resolve(rows[0].state);
        });
    });
}

export function setRoomState(roomCode : string, state : string) : void {
    connection.query('UPDATE Room SET state = ? WHERE id = ?', [state, roomCode], (err, rows) => {
        if (err) throw err;
    });
}

function getRoomVotingSystem(roomCode : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT votingSystem FROM Room WHERE id LIKE ?', [roomCode], (err, rows) => {
            if (err) throw err;
            resolve(rows[0].votingSystem);
        });
    });
}

export async function close(roomCode : string, socket : Socket) {
    const roomFound : boolean = await doesRoomExist(roomCode);
    if(!roomFound)  return socket.emit("room:notfound");

    const sockets : any = await io.in(roomCode).fetchSockets();
    let result = sockets.map((socket : Socket) => leave(socket));
    await Promise.all(result);
    io.in(roomCode).disconnectSockets(true);

    connection.query('DELETE FROM UserStory WHERE roomId = ?', roomCode, (err, rows) => {
        if(err) throw err;
    });
    connection.query('DELETE FROM Room WHERE id = ?', roomCode, (err, rows) => {
        if (err) throw err;
    });
    socket.emit("room:closed")
}

export function addUserstories(userStories : any[], socket : Socket){
    const userStory : any[] = userStories;
    const roomCode : string =[...socket.rooms][1];
    const data : any[] = [];
    userStory.forEach((userStory) => {
        data.push([userStory.name, userStory.content, roomCode])
    })
    connection.query('INSERT INTO UserStory (name, content, roomId) VALUES ?', [data], (err, rows) => {
        if (err) throw err;
    });
}

export async function broadcastVotes(socket : Socket){
    const roomCode : string =[...socket.rooms][1];
    const sessionId : string = socket.id;
    const roomModerator = await getRoomModerator(roomCode);
    console.log("Broadcast check:")
    if(sessionId !== roomModerator) return;
    console.log("Broadcast TRUE")
    const rawVotes : any = await getVotes(roomCode);
    const votes : any = rawVotes.map((vote : any) => {return {sessionId : vote.sessionId, vote : vote.vote}});
    io.in(roomCode).emit("room:revealedVotes", votes);
}

export function getVotes(roomCode : string) : Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT sessionId, vote FROM User WHERE roomId LIKE ?', [roomCode], (err, rows) => {
            if (err) throw err;
            resolve(rows);
        });
    });
}

export function getNotEmptyVotes(roomCode : string) : Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT vote FROM User WHERE roomId LIKE ? AND vote != ""', [roomCode], (err, rows) => {
            if (err) throw err;
            resolve(rows);
        });
    });
}




