import { Server } from "socket.io";
import * as dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const io = new Server({
    cors: {
        origin: '*', //TODO Look up how to do safer
    }
});

io.on("connection",  (socket) => {
    console.log('hello world!')
});

const requestListener = function (req : any, res : any) {
    res.writeHead(200);
    res.end('Hello, World!');
  }
  
const server = http.createServer(requestListener);
server.listen(process.env.PORT);
//io.listen(parseInt(process.env.PORT!));