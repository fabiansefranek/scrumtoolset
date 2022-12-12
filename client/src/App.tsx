import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PokerConfigurationScreen from './components/PokerConfigurationScreen';
import PokerSessionScreen from './components/PokerSessionScreen';

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [votingSystem, setVotingSystem] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [userStories, setUserStories] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    if(socket === null) return;

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room:joined', (args : any) => {
      console.log(`Joined room and got payload: ${JSON.stringify(args)}`);
      setRoomCode(args.roomCode);
      setIsConnected(true);
    })

    socket.on('room:userListUpdate', (args : any) => {
      console.log(`The user list updated. Payload: ${JSON.stringify(args)}`)
      setUserList(args);
    })

    socket.on('room:broadcastVote', (args : any) => {
      console.log(`Someone voted. Payload: ${JSON.stringify(args)}`)
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
    console.log('Disconnected from server')
  }

  function connect() {
    const socket = io('http://localhost:3000')
    setSocket(socket)
    console.log('Connected to server')
    return socket;
  }

  function createRoom() {
    const socket = connect();
    const payload : object = {base: {roomName: roomName, username: username}, options: {votingSystem: votingSystem, userStories: userStories}};
    socket.emit('room:create', payload);
    console.log(`Create room with payload: ${JSON.stringify(payload)}`);
  }

  function joinRoom() {
    const socket = connect();
    const payload : any = {roomCode: roomCode, username: username};
    socket.emit('room:join', payload)
    console.log(`Trying to join room with payload: ${JSON.stringify(payload)}`);
  }

  function vote() {
    socket.emit('room:vote', {state: 'voted', vote: '5'})
  }

  return (
    <div>
      {!isConnected && <p>Join room</p>}
      {!isConnected && <input type="text" placeholder="Room Code" onInput={(event : any) => setRoomCode(event.target.value)}></input>}
      {!isConnected && <button onClick={ joinRoom }>Join room</button>}
      {!isConnected && <p>Create room</p>}
      {!isConnected && <PokerConfigurationScreen createRoom={createRoom} setRoomName={setRoomName} setUsername={setUsername} setUserStories={setUserStories} setVotingSystem={setVotingSystem}/>}
      {isConnected && <p>Room code: {roomCode}</p>}
      {isConnected && <PokerSessionScreen userList={userList} />}
      {isConnected && <button onClick={ disconnect }>Disconnect</button>}
    </div>
  );
}

export default App;