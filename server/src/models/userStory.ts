import { RowDataPacket } from "mysql2";
import { connection } from "../index";
import {UserStory, UserStoryResultPacket} from "../types";

export async function addUserStories(userStories: UserStory[], roomCode: string) {
    const data: string[][] = userStories.map((userStory: UserStory) => {
        return [userStory.name, userStory.content, roomCode];
    });
    await connection.query(
        "INSERT INTO UserStory (name, content, roomId) VALUES ?",
        [data]
    );
}

export async function getUserStories(roomCode: string): Promise<UserStory[]> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM UserStory WHERE roomId = ?",
        [roomCode]
    );
    return rows.map((row: RowDataPacket) => {
        return {
            id: row.id,
            name: row.name,
            content: row.content,
            roomId: row.roomId,
        } as UserStory;
    });
}

export async function getCurrentUserStoryId(roomCode: string): Promise<number> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT currentUserStory FROM Room WHERE id = ?",
        [roomCode]
    );
    return rows[0].currentUserStory;
}

export async function getUserStory(userStoryId : number) : Promise<UserStory> {
    const [rows] = await
        connection.query<RowDataPacket[]>(
            "SELECT * FROM UserStory WHERE id = ?",
            [userStoryId]
        );
    return rows[0] as UserStory;
}

export async function getCurrentUserStory(roomCode : string) : Promise<UserStory> {
    const currentId : number = await getCurrentUserStoryId(roomCode)
    if(currentId == -1)
        return { id: -1, roomId: roomCode, name: "Waiting", content: "" };
    const userStories : UserStory[] = await getUserStories(roomCode);
    return userStories[currentId];
}

export async function setCurrentUserStoryId(
    roomCode: string,
    userStoryId: number
): Promise<void> {
    await connection.query(
        "UPDATE Room SET currentUserStory = ? WHERE id = ?",
        [userStoryId, roomCode]
    );
}

export async function deleteRoomUserStories(roomCode: string) {
    await connection.query("DELETE FROM UserStory WHERE roomId = ?", [
        roomCode,
    ]);
}

export async function checkDone(roomcode: string): Promise<boolean> {
    return (await getCurrentUserStoryId(roomcode)) >= ((await getUserStories(roomcode)).length -1) + (await getUserStories(roomcode))[0].id!
}

export async function setUserStoryResult(userStoryId : number, result : string) {
    console.log("WRITING : "+ result + " TO " + userStoryId)
    await connection.query("UPDATE UserStory SET result = ? WHERE id = ?",
        [result, userStoryId]
        );
}

export async function getUserStoryResults(roomcode : string) : Promise<UserStoryResultPacket[]>{
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT name, result FROM UserStory WHERE roomId = ?",
        [roomcode]
    );
    return rows.map((row: RowDataPacket) => {
        return {
            name: row.name,
            result: row.result
        } as UserStoryResultPacket;
    });
}

