import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [roomname, setRoomname] = useState("");

  useEffect(() => {
    if(socket === null) return;

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room:joined', () => {
      console.log('joinedRoom')
      setIsConnected(true)
    })

    socket.on('error', (args : any) => {
      console.error(JSON.parse(args))
    })

    return () => {
      socket.off('room:joined');
      socket.off('disconnect');
    };
  }, [socket]);

  function disconnect() {
    socket.disconnect();
  }

  function connect() {
    const socket = io('http://localhost:3000')
    setSocket(socket)
    return socket;
  }

  function createRoom() {
    console.log('create room')
    const userName = "fabian";
    const socket = connect()
    socket.emit('room:create',[roomname, username])
  }

  return (
    <div>
      <p>Connected: { '' + isConnected }</p>
      {!isConnected && <input type="text" onInput={(event : any) => setUsername(event.target.value)}></input>}
      {!isConnected && <input type="text" onInput={(event : any) => setRoomname(event.target.value)}></input>}
      {isConnected && <button onClick={ disconnect }>Disconnect</button>}
      {!isConnected && <button onClick={ createRoom }>Create room</button>}
    </div>
  );
}

export default App;