import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PokerSessionScreen from './components/PokerSessionScreen';

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    if(socket === null) return;

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room:joined', () => {
      console.log('joinedRoom')
      setIsConnected(true)
    })

    socket.on('room:userListUpdate', (args : any) => {
      setUserList(args);
      console.log(args)
    })

    socket.on('room:broadcastVote', (args : any) => {
      console.log(args)
    })

    socket.on('error', (args : any) => {
      console.error(JSON.parse(args))
    })

    return () => {
      socket.off('room:joined');
      socket.off('room:userListUpdate');
      socket.off('room:broadcastVote');
      socket.off('disconnect');
      socket.off('error');
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
    const socket = connect()
    socket.emit('room:create', {roomName: roomName, username: username})
  }

  function joinRoom() {
    const socket = connect();
    socket.emit('room:join', {roomCode: roomCode, username: username})
  }

  function vote() {
    socket.emit('room:vote', {state: 'voted', vote: '5'})
  }

  return (
    <div>
      {!isConnected && <input type="text" placeholder="Username" onInput={(event : any) => setUsername(event.target.value)}></input>}
      {!isConnected && <input type="text" placeholder="Room Name" onInput={(event : any) => setRoomName(event.target.value)}></input>}
      {!isConnected && <input type="text" placeholder="Room Code" onInput={(event : any) => setRoomCode(event.target.value)}></input>}
      {!isConnected && <button onClick={ createRoom }>Create room</button>}
      {!isConnected && <button onClick={ joinRoom }>Join room</button>}
      {isConnected && <PokerSessionScreen userList={userList} />}
      {isConnected && <button onClick={ disconnect }>Disconnect</button>}
    </div>
  );
}

export default App;