import {Server, Socket} from "socket.io";
import * as dotenv from 'dotenv';
import {connect, setup} from "./db";
import {join, create, leave, close} from './room';
dotenv.config();

export const connection = connect();
setup(connection);

const io = new Server({
    cors: {
        origin: '*', //TODO Look up how to do safer
    }
});

io.on("connection",  (socket : Socket) => {
    socket.on("room:join", (arg : any) => join(arg, socket))
    socket.on("room:create", (arg : any) => create(arg, socket))
    socket.on("disconnect", (reason : any) => leave(socket))
});

io.listen(parseInt(process.env.PORT!));