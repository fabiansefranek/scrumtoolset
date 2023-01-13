import { Socket } from "socket.io";
import { io } from "../index";

export class ApplicationError extends Error {
    public readonly critical: boolean; //If the Error blocks Program-Flow (Excluding Repeating Events like Re-Voting)
    constructor(message: string, critical: boolean) {
        super(message);
        this.name = "ApplicationError";
        this.critical = critical;
    }

    public send(socket: Socket, broadcast: boolean) {
        if (!broadcast)
            socket.emit("error", {
                name: this.name,
                message: this.message,
                critical: this.critical,
            });
        else
            io.in([...socket.rooms][1]).emit("error", {
                name: this.name,
                message: this.message,
                critical: this.critical,
            });
    }
}
