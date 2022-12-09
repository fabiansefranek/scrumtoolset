import {connection} from './index';
import { v4 as uuidv4 } from 'uuid';
import {Socket} from "socket.io";


export async function join(payload : any, socket : Socket, isMod? : boolean) {
    const roomcode: string = payload[0];
    const roomFound = await roomExists(roomcode);
    if(roomFound) {
        if(typeof isMod == "undefined") {
            const modNotExists : boolean = (await getOldestConnectionFromRoom(roomcode) == ""); //Checks if any user is connected
            isMod = modNotExists;
        }
        const username: string = payload[1];
        const now: number = Math.floor(Date.now() / 1000);
        connection.query('INSERT INTO User(sessionId, username, createdAt , roomId, isModerator) VALUES (?, ?, ?, ?, ?)', [socket.id, username, now, roomcode, isMod], (err, rows) => {
           if(err) throw err;
        });
        socket.join(roomcode);
        socket.emit("room:joined");
    }
    else
    socket.emit("room:denied");
}

export async function leave(socket : Socket) {
    const room = [...socket.rooms][1];
    const roomAdmin = await getRoomAdmin(room);
    const isMod : boolean = (socket.id == roomAdmin);
    connection.query('DELETE FROM User WHERE sessionId = ?', [socket.id], (err, rows) => {
        if(err) throw err;
    });
    if(isMod) {
        const newMod = await getOldestConnectionFromRoom(room);
        if(newMod == "") return
        connection.query('UPDATE User SET isModerator = 1 WHERE sessionId = ?', [newMod], (err, rows) => {
            if(err) throw err;
        });
    }
}

export function create(payload : any, socket : Socket) {
    let roomPayload: string = payload[0];
    let userPayload: string = payload[1];
    let roomcode: string = uuidv4();
    const now: number = Math.floor(Date.now() / 1000);
    connection.query('INSERT INTO Room(id, displayName, state, createdAt) VALUES (?, ?, ?, ?)', [roomcode, roomPayload,'INIT', now], (err, rows) => {
        if(err) throw err;
    });
    join([roomcode, userPayload], socket, true);
}

function roomExists(roomcode : string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM Room WHERE id = ?', [roomcode], (err, rows) => {
            if (err) throw err;
            if (rows.length != 0)
                resolve(true);
            else
                resolve(false);
        });
    });
}

function getRoomAdmin(roomcode : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT sessionId FROM User WHERE roomId LIKE ? AND isModerator = 1', [roomcode], (err, rows) => {
            if (err) throw err;
            if (rows.length != 0)
                resolve(rows[0].sessionId);
            else
                reject("No Moderator found");
        });
    });
}

function getOldestConnectionFromRoom(roomcode : string) : Promise<String>{
    return new Promise((resolve, reject) => {
        connection.query('SELECT sessionId FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC LIMIT 1', [roomcode], (err, rows) => {
            if (err) throw err;
            if (rows.length != 0)
                resolve(rows[0].sessionId);
            else
                resolve("");
        });
    });
}

function handleUserListUpdate(socket : Socket) {
    socket.emit("room:userListChange")
}