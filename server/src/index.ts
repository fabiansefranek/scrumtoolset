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
import {
    RoomClosePayload,
    RoomCreationPayload,
    RoomJoinPayload,
    RoomVotePayload,
} from "./types";
import mysql from "mysql2/promise";

dotenv.config();

export let connection: mysql.Connection;

connect().then((con: mysql.Connection) => {
    setup(con);
    connection = con;
});

export const io = new Server({
    cors: {
        origin: "*", //TODO Look up how to do safer
    },
});

io.on("connection", (socket: Socket) => {
    socket.on("room:join", (payload: RoomJoinPayload) =>
        handleErrors(join, {
            socket: socket,
            args: payload,
        })
    );
    socket.on("room:create", (payload: RoomCreationPayload) =>
        handleErrors(create, {
            socket: socket,
            args: payload,
        })
    );
    socket.on("room:vote", (payload: RoomVotePayload) =>
        handleErrors(handleVote, {
            socket: socket,
            args: payload,
        })
    );
    socket.on("room:close", (payload: RoomClosePayload) =>
        handleErrors(close, {
            socket: socket,
            args: payload,
        })
    );
    socket.on("disconnecting", (reason: DisconnectReason) =>
        handleErrors(leave, {
            socket: socket,
        })
    );
    socket.on("room:nextRound", () =>
        handleErrors(nextRound, {
            socket: socket,
        })
    );
});

io.listen(parseInt(process.env.PORT!));
