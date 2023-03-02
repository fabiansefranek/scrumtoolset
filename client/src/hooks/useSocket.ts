import { useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    function connect(url: string): void {
        const socket = io(url);
        setSocket(socket);
    }

    function disconnect() {
        if (socket === null) return;
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
    }

    return { isConnected, socket, connect, disconnect };
}
