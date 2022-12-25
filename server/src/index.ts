import { Server, Socket } from "socket.io";
import * as dotenv from "dotenv";
import { connect, setup } from "./db";
import { join, create, leave, handleVote, close } from "./room";
import { nextRound } from "./session";

dotenv.config();

export const connection = connect();
setup(connection);

export const io = new Server({
    cors: {
        origin: "*", //TODO Look up how to do safer
    },
});

io.on("connection", (socket: Socket) => {
    socket.on("room:join", (arg: RoomJoinPayload) => join(arg, socket));
    socket.on("room:create", (arg: RoomCreationPayload) => create(arg, socket));
    socket.on("room:vote", (arg: RoomVotePayload) => handleVote(arg, socket));
    socket.on("room:close", (arg: RoomClosePayload) => close(arg, socket));
    socket.on("disconnecting", (reason: string) => leave(socket));
    socket.on("room:nextRound", (arg: RoomNextRoundPayload) =>
        nextRound(socket)
    );
});

io.listen(parseInt(process.env.PORT!));
