import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import PokerConfigurationScreen from "../components/PokerConfigurationScreen";
import SessionScreen from "../components/SessionScreen";
import {
    Theme,
    User,
    UserStory,
    ApplicationError,
    RoomJoinedPayload,
    Vote,
} from "../types";
import styled from "styled-components";
import { light } from "../constants/themes";
import { ThemeProvider } from "styled-components";
import { themes } from "../constants/themes";
import { useToast } from "../hooks/useToast";
import { checkUserInput } from "../utils";
import { useLanguage } from "../hooks/useLanguage";
import { votingSystems } from "../constants/enums";

type Props = {
    theme: Theme;
    setTheme: Function;
    title: string;
};

function ScrumPoker(props: Props) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    const [votingSystem, setVotingSystem] = useState<string>("fibonacci");
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomState, setRoomState] = useState<string>("");
    const [userStories, setUserStories] = useState<UserStory[]>([]);
    const [currentUserStory, setCurrentUserStory] = useState<UserStory>(
        {} as UserStory
    );
    const [userList, setUserList] = useState<User[]>([]);
    const [userIsModerator, setUserIsModerator] = useState<boolean>(false);
    const toast = useToast();
    const language = useLanguage();

    document.title = props.title;

    useEffect(() => {
        if (socket === null) return;

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("room:joined", (args: RoomJoinedPayload) => {
            console.log(`Joined room and got payload: ${JSON.stringify(args)}`);
            toast.success(
                `${language.strings.notifications.copy_roomcode} ${args.roomCode}`,
                () => navigator.clipboard.writeText(args.roomCode)
            );
            setRoomCode(args.roomCode);
            setCurrentUserStory(args.currentUserStory);
            setRoomState(args.roomState);
            setVotingSystem(args.votingSystem);
            const theme: Theme = themes.find(
                (theme: Theme) => theme.name === args.theme
            )!;
            props.setTheme(theme);
            setIsConnected(true);
            setRoomName(args.roomName);
        });

        socket.on("room:userListUpdate", (users: User[]) => {
            const moderatorSessionId: string =
                users[users.findIndex((user: User) => user.isModerator === 1)]
                    .sessionId;
            if (socket.id === moderatorSessionId && !userIsModerator) {
                setUserIsModerator(true);
                console.warn("You are now a moderator");
                toast.alert(language.strings.notifications.now_a_moderator);
            }
            console.log(
                `The user list updated. Payload: ${JSON.stringify(users)}`
            );
            setUserList(users);
        });

        socket.on("room:broadcastVote", (vote: Vote) => {
            let tempUserList: User[] = [...userList];
            tempUserList[
                tempUserList.findIndex(
                    (user) => user.sessionId === vote.sessionId
                )
            ].state = vote.vote;
            setUserList(tempUserList);
            console.log(`Someone voted. Payload: ${JSON.stringify(vote)}`);
        });

        socket.on("room:userStoryUpdate", (userStory: UserStory) => {
            setCurrentUserStory(userStory);
            setRoomState("voting");
            console.log(`New round! Payload: ${JSON.stringify(userStory)}`);
        });

        socket.on("room:stateUpdate", (roomState: string) => {
            console.log(
                `Room state updated. Payload: ${JSON.stringify(roomState)}`
            );
            setRoomState(roomState);
        });

        socket.on("room:revealedVotes", (votes: Vote[]) => {
            let tempUserList: User[] = [...userList];
            votes.forEach((vote: Vote) => {
                tempUserList[
                    tempUserList.findIndex(
                        (user) => user.sessionId === vote.sessionId
                    )
                ].vote = vote.vote;
            });
            setUserList(tempUserList);
            console.info(`Votes were revealed!`);
        });

        socket.on("room:closed", () => {
            disconnect();
            toast.alert(
                language.strings.notifications.room_closed_by_moderator
            );
        });

        socket.on("room:exportedResults", (results: any) => {
            console.log(results);
            const filename = `${
                new Date().toISOString() + "-" + roomName
            }.json`;
            downloadFile(results, filename);
            toast.success(language.strings.notifications.results_exported);
        });

        socket.on("error", (error: ApplicationError) => {
            error.critical
                ? toast.error(language.strings.notifications[error.message])
                : toast.alert(language.strings.notifications[error.message]);
            console.error(error);
        });

        socket.on("connect_error", (error: Error) => {
            console.error(error);
        });

        socket.on("disconnect", (reason: string) =>
            console.log(`Disconnected: ${reason}`)
        );

        return () => {
            socket.off("room:joined");
            socket.off("room:userListUpdate");
            socket.off("room:broadcastVote");
            socket.off("room:userStoryUpdate");
            socket.off("room:stateUpdate");
            socket.off("room:revealedVotes");
            socket.off("room:exportedResults");
            socket.off("disconnect");
            socket.off("error");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, userList, toast, props.setTheme, userIsModerator, language]);

    function disconnect() {
        if (!socket) return;
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
        props.setTheme(light);
        toast.alert(language.strings.notifications.disconnected);
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
            return toast.error(
                language.strings.notifications.user_name_invalid
            );
        if (!checkUserInput(roomName))
            return toast.error(
                language.strings.notifications.room_name_invalid
            );
        if (userStories.length === 0)
            return toast.error(
                language.strings.notifications.missing_userstory
            );
        const socket = connect();
        const payload: object = {
            base: { roomName: roomName, username: username },
            options: {
                votingSystem: votingSystem
                    ? votingSystem
                    : votingSystems.fibonacci,
                userStories: userStories,
                theme: props.theme.name,
            },
        };
        console.log(userStories);
        console.log(payload);
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
        if (!socket) return;
        socket.emit("room:vote", { state: "voted", vote: text });
    }

    function nextRound() {
        if (!socket) return;
        if (!userIsModerator) {
            toast.error(language.strings.notifications.must_be_moderator);
            return;
        }
        socket.emit("room:nextRound");
    }

    function revealVotes() {
        if (!socket) return;
        if (!userIsModerator) {
            toast.error(language.strings.notifications.must_be_moderator);
            return;
        }
        console.log("reveal votes");
        socket.emit("room:revealVotes");
    }

    function exportResults() {
        if (!socket) return;
        console.log("export results");
        socket.emit("room:exportResults");
    }

    function closeRoom() {
        if (!userIsModerator) {
            toast.error(language.strings.notifications.must_be_moderator);
            return;
        }
        socket?.emit("room:close", { roomCode: roomCode });
    }

    function downloadFile(text: string, filename: string) {
        const json = JSON.stringify(text);
        const blob = new Blob([json], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
    }

    return (
        <ThemeProvider theme={props.theme}>
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
                        setTheme={props.setTheme}
                    />
                )}
                {isConnected && (
                    <SessionScreen
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
                        roomName={roomName}
                        roomCode={roomCode}
                        exportResults={exportResults}
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

export default ScrumPoker;
