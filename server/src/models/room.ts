import {connection} from "../index";

export function getRoomVotingSystem(roomCode : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT votingSystem FROM Room WHERE id LIKE ?', [roomCode], (err, rows) => {
            if (err) throw err;
            resolve(rows[0].votingSystem);
        });
    });
}

export function setRoomVotingSystem(votingSystem : string, roomCode : string) : void {
    connection.query('UPDATE Room SET votingSystem = ? WHERE id = ?', [votingSystem, roomCode], (err, rows) => {
        if(err) throw err;
    });
}

export function getRoomState(roomCode : string) : Promise<string>{
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Room WHERE id LIKE ?', [roomCode], (err, rows) => { // TODO: SELECT state instead of *
            if (err) throw err;
            resolve(rows[0].state);
        });
    });
}

export function setRoomState(state : string, roomCode : string) : void {
    connection.query('UPDATE Room SET state = ? WHERE id = ?', [state, roomCode], (err, rows) => {
        if (err) throw err;
    });
}

export function getRoomTheme(roomCode : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT theme FROM Room WHERE id LIKE ?', [roomCode], (err, rows) => {
            if (err) throw err;
            resolve(rows[0].theme);
        });
    });
}

export function setRoomTheme(theme : string, roomCode : string) {
    connection.query('UPDATE Room SET theme = ? WHERE id = ?', [theme, roomCode], (err, rows) => {
        if (err) throw err;
    });
}

export function createRoom(roomCode : string, roomName : string, roomState: string, roomVotingSystem : string) {
    const now : number = Math.floor(Date.now() / 1000);
    connection.query('INSERT INTO Room(id, displayName, state, createdAt, votingSystem) VALUES (?, ?, ?, ?, ?)', [roomCode, roomName, roomState, now, roomVotingSystem], (err, rows) => {
        if(err) throw err;
    });
}

export function deleteRoom(roomCode : string) {
    connection.query('DELETE FROM Room WHERE id = ?', roomCode, (err, rows) => {
        if (err) throw err;
    });
}

export function doesRoomExist(roomCode : string) : Promise<boolean> {
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

export function getRoomModerator(roomCode : string) : Promise<boolean> {
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