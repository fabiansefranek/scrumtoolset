import { getTeams } from "../models/team";
import { Socket } from "socket.io";
import { Team } from "../types";

export async function sendTeams(socket: Socket): Promise<void> {
    const teams: Team[] = await getTeams();
    socket.emit("receivedTeams", teams); // TODO: rename to "lucky:receivedTeams"
}
