import VoteContainer from "./VoteContainer";
import UserStoryContainer from "./UserStoryContainer";
import { User, UserStory } from "../types";
import styled from "styled-components";

type Props = {
    userList: User[];
    userStories: UserStory[];
    currentUserStory: UserStory;
    nextRound: Function;
    userIsModerator: Boolean;
    roomState: string;
    revealVotes: Function;
    closeRoom: Function;
    sendVote: Function;
    disconnect: Function;
    votingSystem: string;
    roomName: string;
    roomCode: string;
};

function SessionScreen(props: Props) {
    return (
        <Container>
            <UserStoryContainer
                userStories={props.userStories}
                currentUserStory={props.currentUserStory}
                userIsModerator={props.userIsModerator}
                roomName={props.roomName}
                roomCode={props.roomCode}
            />
            <VoteContainer
                userList={props.userList}
                nextRound={props.nextRound}
                userIsModerator={props.userIsModerator}
                roomState={props.roomState}
                revealVotes={props.revealVotes}
                closeRoom={props.closeRoom}
                sendVote={props.sendVote}
                disconnect={props.disconnect}
                votingSystem={props.votingSystem}
                currentUserStory={props.currentUserStory}
            />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
`;

export default SessionScreen;
