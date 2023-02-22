import { ApplicationError } from "../errors/application.error";
import { ErrorHandlerPayload } from "../types";

export async function handleErrors(
    callback: Function,
    payload?: ErrorHandlerPayload
) {
    try {
        payload
            ? payload.args && payload.socket
                ? await callback(payload.socket, payload.args)
                : payload.args
                ? await callback(payload.args)
                : payload.socket
                ? await callback(payload.socket)
                    : await callback()
            : await callback();
    } catch (error: unknown) {
        if (error instanceof Error)
            console.error(`[${error.name}] ${error.message}: ${error.stack}}`);
        if (error instanceof ApplicationError && payload !== undefined && payload!.socket) {
            error.send(payload!.socket, false);
        }
    }
}
