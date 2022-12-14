import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PokerConfigurationScreen from './components/PokerConfigurationScreen';
import PokerSessionScreen from './components/PokerSessionScreen';
import { User, UserStory } from './types';

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [votingSystem, setVotingSystem] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomState, setRoomState] = useState<string>("");
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [currentUserStory, setCurrentUserStory] = useState<UserStory>({name: "", content: ""});
  const [userList, setUserList] = useState<User[]>([]);
  const [userIsModerator, setUserIsModerator] = useState<boolean>(false);

  const userListRef = React.useRef(userList);

  useEffect(() => {
    if(socket === null) return;

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room:joined', (args : any) => {
      console.log(`Joined room and got payload: ${JSON.stringify(args)}`);
      setRoomCode(args.roomCode);
      setCurrentUserStory(args.currentUserStory);
      setRoomState(args.roomState);
      setIsConnected(true);
    })

    socket.on('room:userListUpdate', (args : any) => {
      console.log(`The user list updated. Payload: ${JSON.stringify(args)}`);
      userListRef.current = args;
      setUserList(args);
    })

    socket.on('room:broadcastVote', (args : any) => {
      let tempUserList : User[] = [...userList];
      tempUserList[tempUserList.findIndex((user) => user.sessionId == args.sessionId)].state = args.state;
      setUserList(tempUserList);
      console.log(`Someone voted. Payload: ${JSON.stringify(args)}`)
    })

    socket.on('room:userStoryUpdate', (args : any) => {
      setCurrentUserStory(args.currentUserStory);
      setRoomState("voting");
      console.log(`New round! Payload: ${JSON.stringify(args)}`);
    })

    socket.on('room:stateUpdate', (args : any) => {
      console.log(`Room state updated. Payload: ${JSON.stringify(args)}`);
      setRoomState(args.roomState);
    })

    socket.on('room:revealedVotes', (args : any) => {
      let tempUserList : User[] = [...userList];
      console.warn(args);
      args.forEach((vote : any) => {
        tempUserList[tempUserList.findIndex((user) => user.sessionId == vote.sessionId)].vote = vote.vote;
      })
      setUserList(tempUserList);
      console.info(`Votes were revealed!`)
    })

    socket.on('error', (args : any) => {
      console.error(JSON.parse(args))
    })

    return () => {
      socket.off('room:joined');
      socket.off('room:userListUpdate');
      socket.off('room:broadcastVote');
      socket.off('room:userStoryUpdate');
      socket.off('room:stateUpdate');
      socket.off('room:revealedVotes');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [socket, userList]);

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
    setUserIsModerator(true);
    console.log(`Create room with payload: ${JSON.stringify(payload)}`);
  }

  function joinRoom() {
    const socket = connect();
    const payload : any = {roomCode: roomCode, username: username};
    socket.emit('room:join', payload);
    setUserIsModerator(false);
    console.log(`Trying to join room with payload: ${JSON.stringify(payload)}`);
  }

  function vote(text : string) {
    socket.emit('room:vote', {state: 'voted', vote: text})
  }

  function nextRound() {
    if(!userIsModerator) throw('User is not a moderator');
    socket.emit('room:nextRound');
      
  }

  function revealVotes() {
    if(!userIsModerator) throw ('User is not a moderator');
    console.log('reveal votes');
    socket.emit('room:revealVotes');
  }

  function closeRoom() {
    if(!userIsModerator) throw ('User is not a moderator');
    socket.emit('room:close', roomCode);
  }

  return (
    <div>
      {!isConnected && <p>Join room</p>}
      {!isConnected && <input type="text" placeholder="Room Code" onInput={(event : any) => setRoomCode(event.target.value)}></input>}
      {!isConnected && <button onClick={ joinRoom }>Join room</button>}
      {!isConnected && <p>Create room</p>}
      {!isConnected && <PokerConfigurationScreen createRoom={createRoom} setRoomName={setRoomName} setUsername={setUsername} setUserStories={setUserStories} setVotingSystem={setVotingSystem} setCurrentUserStory={setCurrentUserStory}/>}
      {isConnected && <p>Room code: {roomCode}</p>}
      {isConnected && <PokerSessionScreen userList={userList} userStories={userStories} currentUserStory={currentUserStory} nextRound={nextRound} userIsModerator={userIsModerator} roomState={roomState} revealVotes={revealVotes} closeRoom={closeRoom} sendVote={vote} />}
      {isConnected && <button onClick={ disconnect }>Disconnect</button>}
    </div>
  );
}

export default App;