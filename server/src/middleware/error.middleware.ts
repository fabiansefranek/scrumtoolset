import { ApplicationError } from "../errors/application.error";
import { errorHandlerPayload } from "../types";

export async function handleErrors(
    callback: Function,
    payload?: errorHandlerPayload
) {
    try {
        payload
            ? payload.args
                ? await callback(payload.socket, payload.args)
                : await callback(payload.socket)
            : await callback();
    } catch (error: unknown) {
        if (error instanceof Error)
            console.error(`[${error.name}] ${error.message}: ${error.stack}}`);
        if (error instanceof ApplicationError && payload !== undefined) {
            error.send(payload!.socket, false);
        }
    }
}
