import { Server } from "socket.io";
import * as dotenv from 'dotenv';

dotenv.config();

const io = new Server({
    cors: {
        origin: '*', //TODO Look up how to do safer
    }
});

io.on("connection",  (socket) => {
    console.log('hello world!')
});

io.listen(parseInt(process.env.PORT!));