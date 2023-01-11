import { Socket } from "socket.io";

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
        if (error instanceof Error) {
            console.error(`${error.message}: ${error.stack}}`);
            socket.emit("error", {
                name: error.name,
                message: error.message,
            });
        }
    }
}
