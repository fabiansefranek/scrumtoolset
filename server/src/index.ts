import { Server, Socket } from "socket.io";
import * as dotenv from "dotenv";
import { connect, setup } from "./database/connection";
import {
    join,
    create,
    leave,
    close,
    nextRound,
} from "./controllers/room.controller";
import { handleVote } from "./controllers/vote.controller";
import { handleErrors } from "./middleware/error.middleware";
import { DisconnectReason } from "socket.io/dist/socket";

dotenv.config();

export const connection = connect();
setup(connection);

export const io = new Server({
    cors: {
        origin: "*", //TODO Look up how to do safer
    },
});

io.on("connection", (socket: Socket) => {
    socket.on("room:join", (payload: RoomJoinPayload) =>
        handleErrors(socket, join, payload)
    );
    socket.on("room:create", (payload: RoomCreationPayload) =>
        handleErrors(socket, create, payload)
    );
    socket.on("room:vote", (payload: RoomVotePayload) =>
        handleErrors(socket, handleVote, payload)
    );
    socket.on("room:close", (payload: RoomClosePayload) =>
        handleErrors(socket, close, payload)
    );
    socket.on("disconnecting", (reason: DisconnectReason) =>
        handleErrors(socket, leave)
    );
    socket.on("room:nextRound", () => handleErrors(socket, nextRound));
});

io.listen(parseInt(process.env.PORT!));
