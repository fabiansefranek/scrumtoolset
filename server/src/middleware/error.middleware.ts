import { Socket } from "socket.io";

export async function handleErrors(
    arg: any,
    socket: Socket,
    callback: Function
) {
    try {
        await callback(arg, socket);
    } catch (error: any) {
        console.error("ERROR: " + error.message);
        socket.emit("error", error.message);
    }
}
