import styled from "styled-components";
import CardContainer from "./CardContainer";
import UserList from "./UserList";
import { User, UserStory } from "../types";
import { votingSystems } from "../constants/enums";
import { Button } from "./Button";
import { useLanguage } from "../hooks/useLanguage";
import { RoomStates } from "../constants/enums";
import { Fragment } from "react";

type Props = {
    userList: User[];
    nextRound: Function;
    userIsModerator: Boolean;
    roomState: string;
    revealVotes: Function;
    closeRoom: Function;
    sendVote: Function;
    disconnect: Function;
    votingSystem: string;
    currentUserStory: UserStory;
    exportResults: Function;
};

function VoteContainer(props: Props) {
    const language = useLanguage();

    return (
        <Container>
            <LogoContainer>
                <Logo src={`${process.env.PUBLIC_URL}/cards.png`} />
                <LogoText>Scrum Poker</LogoText>
            </LogoContainer>
            <UserAndCardContainer>
                <UserList
                    userList={props.userList}
                    roomState={props.roomState}
                    currentUserStory={props.currentUserStory}
                />
                <CardContainer
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
                        <Fragment>
                            <CustomButton onClick={() => props.exportResults()}>
                                {language.strings.buttons.export_results}
                            </CustomButton>
                            <CustomButton onClick={() => props.nextRound()}>
                                {language.strings.buttons.close_room}
                            </CustomButton>
                        </Fragment>
                    )
                ) : null}
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
    width: 10.5vw;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${(props) => props.theme.colors.secondaryBackground};
    width: 70vw;
    height: fit-content;
    padding: 2.5rem;
    box-sizing: border-box;
    box-shadow: ${({ theme }) =>
        theme.name === "Light"
            ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            : null};
    border-radius: 0.3rem;
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

const LogoContainer = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    user-select: none;
    opacity: 0.3;
`;

const LogoText = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
`;

const Logo = styled.img`
    width: 30px;
    height: 30px;
    filter: ${({ theme }) =>
        theme.name === "Dark" ? "invert(1)" : "invert(0)"};
`;

export default VoteContainer;
