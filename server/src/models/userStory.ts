import {connection} from "../index";

export function addUserStories(userStories : UserStory[], roomCode : string) {
    const data : string[][] = userStories.map((userStory : UserStory) => {
        return [userStory.name, userStory.content, roomCode]
    })
    connection.query('INSERT INTO UserStory (name, content, roomId) VALUES ?', [data], (err, rows) => {
        if (err) throw err;
    });
}

export function getUserStories(roomCode : string) : Promise<UserStory[]> {
    return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM UserStory WHERE roomId = ?', [roomCode], (err, rows) => {
                if (err) throw err;
                resolve(rows)
            })
    })
}

export function getCurrentUserStoryId(roomCode : string) : Promise<number>{
    return new Promise((resolve, reject) => {
        connection.query('SELECT currentUserStory FROM Room WHERE id = ?', roomCode, (err, rows) => {
            if (err) throw err;
            resolve(rows[0].currentUserStory);
        });
    });
}

export async function getCurrentUserStory(roomCode : string) : Promise<UserStory> {
    const currentUserStoryId : number = await getCurrentUserStoryId(roomCode);
    if(currentUserStoryId == -1) return {id: -1, roomId: roomCode, name: "Waiting", content: ""};
    const userStoryId : number = (await getUserStories(roomCode))[currentUserStoryId].id || -97; //TODO replace -97 with error
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM UserStory WHERE id = ?', [userStoryId], (err, rows) => {
            if (err) throw err;
            resolve(rows[0]);
        });
    });
}

export function setCurrentUserStoryId(roomCode : string, userStoryId : number) : void {
    connection.query('UPDATE Room SET currentUserStory = ? WHERE id = ?', [userStoryId, roomCode], (err, rows) => {
        if (err) throw err;
    });
}

export function deleteRoomUserStories(roomCode : string) {
    connection.query('DELETE FROM UserStory WHERE roomId = ?', [roomCode], (err, rows) => {
        if(err) throw err;
    });
}