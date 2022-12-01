import { Server } from "socket.io";
import * as dotenv from 'dotenv';
dotenv.config();

const io = new Server({
    cors: {
        origin: '*', //TODO Look up how to do safer
    }
});

io.on("connection",  (socket : any) => {
    console.log('hello world!')
});

const requestListener = function (req : any, res : any) {
    res.writeHead(200);
    res.end('Hello, World!');
  }
  
io.listen(parseInt(process.env.PORT!));