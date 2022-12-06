import {connection} from './index';
import { v4 as uuidv4 } from 'uuid';
import {Socket} from "socket.io";

export async function join(payload : any, socket : Socket) {

    let roomcode: string = payload[0];
    if(await roomExists(roomcode)) {
    let username: string = payload[1];
    const now: number = Math.floor(Date.now() / 1000);
    connection.query('INSERT INTO User(sessionId, username, createdAt , roomId) VALUES (?, ?, ?, ?)', [socket.id, username, now, roomcode], (err, rows) => {
        if(err) throw err;
    });
    socket.emit("room:joined");
    }
    socket.emit("room:denied");
}

export function create(payload : any, socket : Socket) {
    let roomPayload: string = payload[0];
    let userPayload: string = payload[1];
    let roomcode: string = uuidv4();
    const now: number = Math.floor(Date.now() / 1000);
    connection.query('INSERT INTO Room(id, displayName, state, createdAt) VALUES (?, ?, ?, ?)', [roomcode, roomPayload,'INIT', now], (err, rows) => {
        if(err) throw err;
    });
    join([roomcode, userPayload], socket);
}

function roomExists(roomcode : string) {
    return new Promise((resolve, reject) => {
        connection.query('Select id from Room where id like ?', [roomcode], (err, rows) => {
            if (err) throw err;
            if (rows != null)
                resolve(true);
        });
        resolve(false);
    });
}