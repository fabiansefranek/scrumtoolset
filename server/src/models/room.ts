import { RowDataPacket } from "mysql2";
import { connection } from "../index";

export async function getRoomVotingSystem(roomCode: string): Promise<string> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT votingSystem FROM Room WHERE id LIKE ?",
        [roomCode]
    );
    return rows[0].votingSystem;
}

export async function setRoomVotingSystem(
    votingSystem: string,
    roomCode: string
): Promise<void> {
    await connection.query("UPDATE Room SET votingSystem = ? WHERE id = ?", [
        votingSystem,
        roomCode,
    ]);
}

export async function getRoomState(roomCode: string): Promise<string> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT state FROM Room WHERE id LIKE ?",
        [roomCode]
    );
    return rows[0].state;
}

export async function setRoomState(
    state: string,
    roomCode: string
): Promise<void> {
    await connection.query("UPDATE Room SET state = ? WHERE id = ?", [
        state,
        roomCode,
    ]);
}

export async function getRoomTheme(roomCode: string): Promise<string> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT theme FROM Room WHERE id LIKE ?",
        [roomCode]
    );
    return rows[0].theme;
}

export async function setRoomTheme(
    theme: string,
    roomCode: string
): Promise<void> {
    await connection.query("UPDATE Room SET theme = ? WHERE id = ?", [
        theme,
        roomCode,
    ]);
}

export async function createRoom(
    roomCode: string,
    roomName: string,
    roomState: string,
    roomVotingSystem: string,
    roomCurrentUserStory: number,
    roomTheme: string
): Promise<void> {
    const now: number = Math.floor(Date.now() / 1000);
    await connection.query(
        "INSERT INTO Room(id, displayName, state, createdAt, votingSystem, currentUserStory, theme) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            roomCode,
            roomName,
            roomState,
            now,
            roomVotingSystem,
            roomCurrentUserStory,
            roomTheme,
        ]
    );
}

export async function deleteRoom(roomCode: string): Promise<void> {
    await connection.query("DELETE FROM Room WHERE id = ?", roomCode);
}

export async function doesRoomExist(roomCode: string): Promise<boolean> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM Room WHERE id = ?",
        [roomCode]
    );
    return rows.length != 0;
}
