import { useState, useEffect } from "react";
import io from "socket.io-client";
import PokerConfigurationScreen from "./components/PokerConfigurationScreen";
import PokerSessionScreen from "./components/PokerSessionScreen";
import { Theme, ToastType, User, UserStory } from "./types";
import styled from "styled-components";
import { light } from "./themes";
import { ThemeProvider } from "styled-components";
import { themes } from "./themes";
import { useToast } from "./hooks/useToast";
import { checkUserInput } from "./utils";

export const votingSystems: any = {
    fibonacci: [
        "?",
        "0",
        "1",
        "2",
        "3",
        "5",
        "8",
        "13",
        "21",
        "34",
        "55",
        "89",
    ],
    scrum: ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"],
    tshirts: ["?", "xs", "s", "m", "l", "xl"],
};

function App({ theme, setTheme }: { theme: Theme; setTheme: Function }) {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    const [votingSystem, setVotingSystem] = useState<string>("fibonacci");
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomState, setRoomState] = useState<string>("");
    const [userStories, setUserStories] = useState<UserStory[]>([]);
    const [currentUserStory, setCurrentUserStory] = useState<UserStory>({
        name: "",
        content: "",
    });
    const [userList, setUserList] = useState<User[]>([]);
    const [userIsModerator, setUserIsModerator] = useState<boolean>(false);
    const toast = useToast();

    useEffect(() => {
        if (socket === null) return;

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("room:joined", (args: any) => {
            console.log(`Joined room and got payload: ${JSON.stringify(args)}`);
            toast.success(`Click to copy the roomcode: ${args.roomCode}`, () =>
                navigator.clipboard.writeText(args.roomCode)
            );
            setRoomCode(args.roomCode);
            setCurrentUserStory(args.currentUserStory);
            setRoomState(args.roomState);
            setVotingSystem(args.votingSystem);
            const theme: Theme = themes.find(
                (theme: Theme) => theme.name === args.theme
            )!;
            setTheme(theme);
            setIsConnected(true);
        });

        socket.on("room:userListUpdate", (args: any) => {
            const moderatorSessionId: string =
                args[args.findIndex((user: User) => user.isModerator === 1)]
                    .sessionId;
            if (socket.id === moderatorSessionId && !userIsModerator) {
                setUserIsModerator(true);
                console.warn("You are now a moderator");
                toast.alert("You are now a moderator");
            }
            console.log(
                `The user list updated. Payload: ${JSON.stringify(args)}`
            );
            setUserList(args);
        });

        socket.on("room:broadcastVote", (args: any) => {
            let tempUserList: User[] = [...userList];
            tempUserList[
                tempUserList.findIndex(
                    (user) => user.sessionId === args.sessionId
                )
            ].state = args.state;
            setUserList(tempUserList);
            console.log(`Someone voted. Payload: ${JSON.stringify(args)}`);
        });

        socket.on("room:userStoryUpdate", (args: any) => {
            setCurrentUserStory(args.currentUserStory);
            setRoomState("voting");
            console.log(`New round! Payload: ${JSON.stringify(args)}`);
        });

        socket.on("room:stateUpdate", (args: any) => {
            console.log(`Room state updated. Payload: ${JSON.stringify(args)}`);
            setRoomState(args.roomState);
        });

        socket.on("room:revealedVotes", (args: any) => {
            let tempUserList: User[] = [...userList];
            console.warn(args);
            args.forEach((vote: any) => {
                tempUserList[
                    tempUserList.findIndex(
                        (user) => user.sessionId === vote.sessionId
                    )
                ].vote = vote.vote;
            });
            setUserList(tempUserList);
            console.info(`Votes were revealed!`);
        });

        socket.on("room:closed", (args: any) => {
            disconnect();
            toast.alert("The room was closed by the moderator");
        });

        socket.on("error", (args: any) => {
            console.error(JSON.parse(args));
        });

        return () => {
            socket.off("room:joined");
            socket.off("room:userListUpdate");
            socket.off("room:broadcastVote");
            socket.off("room:userStoryUpdate");
            socket.off("room:stateUpdate");
            socket.off("room:revealedVotes");
            socket.off("disconnect");
            socket.off("error");
        };
    }, [socket, userList, toast, setTheme, userIsModerator]);

    function disconnect() {
        setIsConnected(false);
        setUsername("");
        setRoomName("");
        setVotingSystem("fibonacci");
        setRoomCode("");
        setRoomState("");
        setUserStories([]);
        setCurrentUserStory({ name: "", content: "" });
        setUserList([]);
        setUserIsModerator(false);
        setTheme(light);
        toast.alert("You disconnected!");
        socket.disconnect();
        console.log("Disconnected from server");
    }

    function connect() {
        const socket = io("http://localhost:3000");
        setSocket(socket);
        console.log("Connected to server");
        return socket;
    }

    function createRoom() {
        if (!checkUserInput(username))
            return toast.error("Please enter a valid user name");
        if (!checkUserInput(roomName))
            return toast.error("Please enter a valid room name");
        if (userStories.length === 0)
            return toast.error("Please enter at least one user story");
        const socket = connect();
        const payload: object = {
            base: { roomName: roomName, username: username },
            options: {
                votingSystem: votingSystem ? votingSystem : "fibonacci",
                userStories: userStories,
                theme: theme.name,
            },
        };
        socket.emit("room:create", payload);
        setUserIsModerator(true);
        console.log(`Create room with payload: ${JSON.stringify(payload)}`);
    }

    function joinRoom() {
        const socket = connect();
        const payload: object = { roomCode: roomCode, username: username };
        socket.emit("room:join", payload);
        setUserIsModerator(false);
        console.log(
            `Trying to join room with payload: ${JSON.stringify(payload)}`
        );
    }

    function vote(text: string) {
        socket.emit("room:vote", { state: "voted", vote: text });
    }

    function nextRound() {
        if (!userIsModerator) throw new Error("User is not a moderator");
        socket.emit("room:nextRound");
    }

    function revealVotes() {
        if (!userIsModerator) throw new Error("User is not a moderator");
        console.log("reveal votes");
        socket.emit("room:revealVotes");
    }

    function closeRoom() {
        if (!userIsModerator) throw new Error("User is not a moderator");
        socket.emit("room:close", { roomCode: roomCode });
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                {!isConnected && (
                    <PokerConfigurationScreen
                        createRoom={createRoom}
                        setRoomName={setRoomName}
                        setUsername={setUsername}
                        setUserStories={setUserStories}
                        setVotingSystem={setVotingSystem}
                        setCurrentUserStory={setCurrentUserStory}
                        setRoomCode={setRoomCode}
                        joinRoom={joinRoom}
                        setTheme={setTheme}
                    />
                )}
                {isConnected && (
                    <PokerSessionScreen
                        userList={userList}
                        userStories={userStories}
                        currentUserStory={currentUserStory}
                        nextRound={nextRound}
                        userIsModerator={userIsModerator}
                        roomState={roomState}
                        revealVotes={revealVotes}
                        closeRoom={closeRoom}
                        sendVote={vote}
                        disconnect={disconnect}
                        votingSystem={votingSystem}
                    />
                )}
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
