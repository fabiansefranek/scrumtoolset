import styled from "styled-components";
import React from "react";

import PokerCardContainer from "./PokerCardContainer";
import PokerUserContainer from "./PokerUserContainer";
import { User, UserStory } from "../types";
import { votingSystems } from "../App";
import { Button } from "./Button";
import { useLanguage } from "../hooks/useLanguage";
import { RoomStates } from "../constants/enums";

type Props = {
    userList: User[];
    nextRound: Function;
    userIsModerator: Boolean;
    roomState: string;
    revealVotes: Function;
    closeRoom: Function;
    sendVote: Function;
    disconnect: Function;
    votingSystem: any;
    currentUserStory: UserStory;
};

function PokerVoteContainer(props: Props) {
    const language = useLanguage();

    return (
        <Container>
            <UserAndCardContainer>
                <PokerUserContainer
                    userList={props.userList}
                    roomState={props.roomState}
                    currentUserStory={props.currentUserStory}
                />
                <PokerCardContainer
                    cards={votingSystems[props.votingSystem]}
                    roomState={props.roomState}
                    sendVote={props.sendVote}
                />
            </UserAndCardContainer>
            <ButtonContainer>
                {props.userIsModerator ? (
                    props.roomState === RoomStates.Voting ? (
                        <CustomButton onClick={() => props.nextRound()}>
                            {language.strings.buttons.reveal_votes}
                        </CustomButton>
                    ) : props.roomState === RoomStates.Waiting ? (
                        <CustomButton onClick={() => props.nextRound()}>
                            {props.userIsModerator &&
                            props.currentUserStory.name === "Waiting"
                                ? language.strings.buttons.start_round
                                : language.strings.buttons.next_round}
                        </CustomButton>
                    ) : (
                        <CustomButton onClick={() => props.nextRound()}>
                            {language.strings.buttons.close_room}
                        </CustomButton>
                    )
                ) : (
                    <></>
                )}
                <CustomButton onClick={() => props.disconnect()}>
                    {language.strings.buttons.leave_room}
                </CustomButton>
                {props.userIsModerator &&
                props.roomState !== RoomStates.Closeable ? (
                    <CustomButton onClick={() => props.closeRoom()}>
                        {language.strings.buttons.close_room}
                    </CustomButton>
                ) : null}
            </ButtonContainer>
        </Container>
    );
}

const CustomButton = styled(Button)`
    width: 9vw;
`;

const Container = styled.div`
    background-color: ${(props) => props.theme.colors.secondaryBackground};
    width: 80vw;
    padding: 2rem;
    height: fit-content;
    box-sizing: border-box;
    border-radius: 0.25rem;
`;

const UserAndCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 2rem;
    gap: 1rem;
`;

export default PokerVoteContainer;
