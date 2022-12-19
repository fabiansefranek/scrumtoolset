import { findByLabelText } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PokerConfigurationScreen from './components/PokerConfigurationScreen';
import PokerSessionScreen from './components/PokerSessionScreen';
import { Theme, User, UserStory } from './types';
import styled from 'styled-components';
import { light, dark } from './themes';
import { ThemeProvider } from 'styled-components';

export const votingSystems : any = {
  fibonacci: ["?", "0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"],
  scrum: ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"],
  tshirts: ["?", "xs", "s", "m", "l", "xl"]
}

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [votingSystem, setVotingSystem] = useState<string>("fibonacci");
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomState, setRoomState] = useState<string>("");
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [currentUserStory, setCurrentUserStory] = useState<UserStory>({name: "", content: ""});
  const [userList, setUserList] = useState<User[]>([]);
  const [userIsModerator, setUserIsModerator] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(light);

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
      const moderatorSessionId : string = args[args.findIndex((user : User) => user.isModerator === 1)].sessionId;
      if(socket.id === moderatorSessionId) {
        setUserIsModerator(true);
        console.warn('You are now a moderator');
      }
      console.log(`The user list updated. Payload: ${JSON.stringify(args)}`);
      setUserList(args);
    })

    socket.on('room:broadcastVote', (args : any) => {
      let tempUserList : User[] = [...userList];
      tempUserList[tempUserList.findIndex((user) => user.sessionId === args.sessionId)].state = args.state;
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
        tempUserList[tempUserList.findIndex((user) => user.sessionId === vote.sessionId)].vote = vote.vote;
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
    const payload : object = {base: {roomName: roomName, username: username}, options: {votingSystem: (votingSystem) ? votingSystem : "fibonacci", userStories: userStories}};
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
    if(!userIsModerator) throw new Error('User is not a moderator');
    socket.emit('room:nextRound');
      
  }

  function revealVotes() {
    if(!userIsModerator) throw new Error('User is not a moderator');
    console.log('reveal votes');
    socket.emit('room:revealVotes');
  }

  function closeRoom() {
    if(!userIsModerator) throw new Error('User is not a moderator');
    socket.emit('room:close', roomCode);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected && <PokerConfigurationScreen createRoom={createRoom} setRoomName={setRoomName} setUsername={setUsername} setUserStories={setUserStories} setVotingSystem={setVotingSystem} setCurrentUserStory={setCurrentUserStory} setRoomCode={setRoomCode} joinRoom={joinRoom} setTheme={setTheme} />}
        {isConnected && <PokerSessionScreen userList={userList} userStories={userStories} currentUserStory={currentUserStory} nextRound={nextRound} userIsModerator={userIsModerator} roomState={roomState} revealVotes={revealVotes} closeRoom={closeRoom} sendVote={vote} disconnect={disconnect} votingSystem={votingSystem} />}
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default App;