import {connection} from "../index";
import {Team} from "../types";
import {RowDataPacket} from "mysql2";

export async function getTeams() : Promise<Team[]> {
    const [rows] = await
        connection.query<RowDataPacket[]>(
            "SELECT * FROM Team",
        );
    return rows as Team[];
}

export async function addTeam(packet : Team) : Promise<void> {
    const data : string[] = [packet.name, packet.members];
    await connection.query(
        "INSERT INTO Team (name, members) VALUES ?",
        [data]
    );
}

export async function deleteTeam(name: string) : Promise<void> {
    await connection.query("DELETE FROM Team WHERE name = ?", [
        name
    ]);
}
