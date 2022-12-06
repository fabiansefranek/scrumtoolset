import {connection} from './index';
import { v4 as uuidv4 } from 'uuid';
import {Socket} from "socket.io";

export function join(payload : any, socket : Socket) {
    let roomcode = payload[0];
    let username = payload[1];
    const now = Math.floor(Date.now() / 1000);
    connection.query('INSERT INTO User(sessionId, username, createdAt , roomId) VALUES (?, ?, ?, ?)', [socket.id, username, now, roomcode], (err, rows) => {
        if(err) throw err;
    });
}

export function create(payload : any, socket : Socket) {
    let roomPayload = payload[0];
    let userPayload = payload[1];
    let roomcode = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    connection.query('INSERT INTO Room(id, displayName, state, createdAt) VALUES (?, ?, ?, ?)', [roomcode, roomPayload,'INIT', now], (err, rows) => {
        if(err) throw err;
    });
    join([roomcode, userPayload], socket);
}