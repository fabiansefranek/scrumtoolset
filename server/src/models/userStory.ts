import { RowDataPacket } from "mysql2";
import { connection } from "../index";
import { User, UserStory } from "../types";

export async function addUserStories(
    userStories: UserStory[],
    roomCode: string
): Promise<void> {
    const data: string[][] = userStories.map((userStory: UserStory) => {
        return [userStory.name, userStory.content, roomCode];
    });
    await connection.query(
        "INSERT INTO UserStory (name, content, roomId) VALUES ?",
        [data]
    );
}


export function getUserStories(roomCode: string): Promise<UserStory[]> {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM UserStory WHERE roomId = ? ORDER BY id ASC",
            [roomCode],
            (err, rows) => {
                if (err) throw err;
                resolve(rows);
            }
        );

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
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM UserStory WHERE id = ?",
            [userStoryId],
            (err, rows) => {
                if (err) throw err;
                resolve(rows[0]);
            }
        );
    });
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
    offset: number
): void {
    connection.query(
        "UPDATE Room SET currentUserStory = ? WHERE id = ?",
        [offset, roomCode],
        (err, rows) => {
            if (err) throw err;
        }

    );
}

export async function deleteRoomUserStories(roomCode: string): Promise<void> {
    await connection.query("DELETE FROM UserStory WHERE roomId = ?", [
        roomCode,
    ]);
}

export async function checkDone(roomcode: string): Promise<boolean> {
    return (await getCurrentUserStoryId(roomcode)) >= ((await getUserStories(roomcode)).length -1)
}
