import { connection } from "../index";

export function createUser(
    sessionId: string,
    username: string,
    now: number,
    roomCode: string,
    isModerator: boolean
) {
    connection.query(
        "INSERT INTO User(sessionId, username, createdAt , roomId, isModerator, state, vote) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [sessionId, username, now, roomCode, isModerator, "voting", ""],
        (err, rows) => {
            if (err) throw err;
        }
    );
}

export function deleteUser(sessionId: string): void {
    connection.query(
        "DELETE FROM User WHERE sessionId = ?",
        [sessionId],
        (err, rows) => {
            if (err) throw err;
        }
    );
}

export function getOldestConnectionFromRoom(roomCode: string): Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT sessionId FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC LIMIT 1",
            [roomCode],
            (err, rows) => {
                if (err) throw err;
                if (rows.length != 0) resolve(rows[0].sessionId);
                else resolve("");
            }
        );
    });
}

export function getUsersInRoom(roomCode: string): Promise<User[]> {
    //Used to display all users
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC",
            [roomCode],
            (err, rows) => {
                if (err) throw err;
                resolve(rows);
            }
        );
    });
}

export function setUserVote(state: string, vote: string, sessionId: string) {
    connection.query(
        "UPDATE User SET state = ?, vote = ? WHERE sessionId = ?",
        [state, vote, sessionId],
        (err, rows) => {
            if (err) throw err;
        }
    );
}

export function giveUserModeratorRights(sessionId: string) {
    connection.query(
        "UPDATE User SET isModerator = 1 WHERE sessionId = ?",
        [sessionId],
        (err, rows) => {
            if (err) throw err;
        }
    );
}

export function resetUserVotes(roomCode: string): void {
    connection.query(
        'UPDATE User SET vote = "", state = "voting" WHERE roomId = ?',
        roomCode,
        (err, rows) => {
            if (err) throw err;
        }
    );
}

export function getUserVotes(roomCode: string): Promise<Vote[]> {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT sessionId, vote FROM User WHERE roomId LIKE ?",
            [roomCode],
            (err, rows) => {
                if (err) throw err;
                resolve(rows);
            }
        );
    });
}

export function getRoomModerator(roomCode: string): Promise<string> {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT sessionId FROM User WHERE roomId LIKE ? AND isModerator = 1",
            [roomCode],
            (err, rows) => {
                if (err) throw err;
                if (rows.length != 0) resolve(rows[0].sessionId);
                else resolve("");
            }
        );
    });
}
