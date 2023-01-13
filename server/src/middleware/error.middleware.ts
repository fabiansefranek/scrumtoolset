import { Socket } from "socket.io";
import { ApplicationError } from "../errors/application.error";

export async function handleErrors(
    socket: Socket,
    callback: Function,
    payload?: unknown
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
            error.send(socket, false);
        }
    }
}
