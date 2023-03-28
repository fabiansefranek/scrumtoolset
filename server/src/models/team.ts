import { connection } from "../index";
import { Team } from "../types";
import { RowDataPacket } from "mysql2";

export async function getTeams(): Promise<Team[]> {
    const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM Team"
    );
    return rows as Team[];
}

export async function addTeam(packet: Team): Promise<void> {
    if((await getTeam(packet.name)).length > 0) return;

    await connection.query("INSERT INTO Team(name, members) VALUES (?, ?)", [
        packet.name,
        packet.members,
    ]);
}

export async function deleteTeam(name: string): Promise<void> {
    await connection.query("DELETE FROM Team WHERE name = ?", [name]);
}

export async function updateTeam(packet: Team): Promise<void> {
    await connection.query("UPDATE Team SET members = ? WHERE name = ?", [
        packet.members,
        packet.name,
    ]);
}

export async function getTeam(name : String) {
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM Team WHERE name = ?",
        [name]);
    return rows as Team[];
}
