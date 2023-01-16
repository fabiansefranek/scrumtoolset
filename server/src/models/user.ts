import { RowDataPacket } from "mysql2";
import { VotingStates } from "../constants/enums";
import { connection } from "../index";
import { User, Vote } from "../types";

export async function createUser(
    sessionId: string,
    username: string,
    now: number,
    roomCode: string,
    isModerator: boolean
): Promise<void> {
    await connection.query(
        "INSERT INTO User(sessionId, username, createdAt , roomId, isModerator, state, vote) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            sessionId,
            username,
            now,
            roomCode,
            isModerator,
            VotingStates.VOTING,
            "",
        ]
    );
}

export async function deleteUser(sessionId: string): Promise<void> {
    await connection.query("DELETE FROM User WHERE sessionId = ?", sessionId);
}

export async function getOldestConnectionFromRoom(
    roomCode: string
): Promise<string> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT sessionId FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC LIMIT 1",
        [roomCode]
    );
    return rows[0].sessionId;
}

export async function getUsersInRoom(roomCode: string): Promise<User[]> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM User WHERE roomId LIKE ? ORDER BY createdAt ASC",
        [roomCode]
    );
    return rows.map((row: RowDataPacket) => {
        return {
            sessionId: row.sessionId,
            username: row.username,
            createdAt: row.createdAt,
            roomId: row.roomId,
            isModerator: row.isModerator,
            state: row.state,
            vote: row.vote,
        } as User;
    });
}

export async function setUserVote(
    state: string,
    vote: string,
    sessionId: string
): Promise<void> {
    await connection.query(
        "UPDATE User SET state = ?, vote = ? WHERE sessionId = ?",
        [state, vote, sessionId]
    );
}

export async function giveUserModeratorRights(
    sessionId: string
): Promise<void> {
    await connection.query(
        "UPDATE User SET isModerator = 1 WHERE sessionId = ?",
        [sessionId]
    );
}

export async function resetUserVotes(roomCode: string): Promise<void> {
    await connection.query(
        "UPDATE User SET vote = '', state = 'voting' WHERE roomId = ?",
        [roomCode]
    );
}

export async function getUserVotes(roomCode: string): Promise<Vote[]> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT sessionId, vote FROM User WHERE roomId LIKE ?",
        [roomCode]
    );
    return rows.map((row: RowDataPacket) => {
        return {
            sessionId: row.sessionId,
            vote: row.vote,
        } as Vote;
    });
}

export async function getRoomModerator(
    roomCode: string
): Promise<string | undefined> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT sessionId FROM User WHERE roomId LIKE ? AND isModerator = 1",
        [roomCode]
    );
    if (rows.length != 0) return rows[0].sessionId;
    else return undefined;
}
