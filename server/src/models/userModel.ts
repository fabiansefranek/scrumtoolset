import {connection} from "../index";

//Create User
export function createUser(socketId : string, username : string, now :number, roomCode : string, isModerator : boolean) {
    connection.query('INSERT INTO User(sessionId, username, createdAt , roomId, isModerator, state, vote) VALUES (?, ?, ?, ?, ?, ?, ?)', [socketId, username, now, roomCode, isModerator, "voting", ""], (err, rows) => {
        if(err) throw err;
    });
}