import {addTeam as addTeamDb, getTeam, getTeams} from "../models/team";
import {Socket} from "socket.io";
import {Team} from "../types";
import {ApplicationError} from "../errors/application.error";
import {ApplicationErrorMessages} from "../constants/enums";

export async function sendTeams(socket : Socket): Promise<void> {
    const teams: Team[] = await getTeams();
    socket.emit("receivedTeams", teams)
}

export async function addTeam(packet : Team) {
    if((await getTeam(packet.name)).length == 0)
        await addTeamDb(packet);
    else throw new ApplicationError(ApplicationErrorMessages.DUPLICATE_TEAM, true);
}
