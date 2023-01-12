import { Socket } from "socket.io";
import { ApplicationError } from "../errors/application.error";

export async function handleErrors(
    socket: Socket,
    callback: Function,
    payload?: any
) {
    try {
        if (payload) {
            await callback(payload, socket);
        } else {
            await callback(socket);
        }
    } catch (error: unknown) {
        if (error instanceof Error)
            console.error(`[${error.name}] ${error.message}: ${error.stack}}`);
        if (error instanceof ApplicationError) {
            socket.emit("error", {
                name: error.name,
                message: error.message,
                critical : error.critical
            });
        }
    }
}

//UTIL for handeling notifications as errors
export function sendAsError(socket : Socket, error : ApplicationError) {
    socket.emit("error", {
        name: error.name,
        message: error.message,
        critical : error.critical
    });
}
