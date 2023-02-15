import { User, UserStory } from "../types";
import ProfilePicture from "./ProfilePicture";
import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguage";
import { RoomStates } from "../constants/enums";
import {useEffect} from "react";

type Props = {
    user: User;
    roomState: string;
    currentUserStory: UserStory;
};

function UserContainer(props: Props) {
    const language = useLanguage();
    useEffect(() => {
        console.log(props.currentUserStory);
    })
    return (
        <Container key={props.user.sessionId}>
            <NameAndPictureContainer>
                <ProfilePicture username={props.user.username} />
                <Username>{props.user.username}</Username>
            </NameAndPictureContainer>

            <State>
                {props.currentUserStory.name === "Waiting"
                    ? ""
                    : props.roomState === RoomStates.Voting
                    ? language.strings.userState[props.user.state]
                    : props.user.vote
                    ? props.user.vote
                    : language.strings.userState.not_voted}
            </State>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const NameAndPictureContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
`;

const Username = styled.p`
    margin: 0;
    text-transform: capitalize;
    color: ${(props) => props.theme.colors.text};
    font-size: 20px;
`;

const State = styled.p`
    margin: 0;
    text-transform: capitalize;
    color: ${(props) => props.theme.colors.text};
    font-size: 20px;
`;

export default UserContainer;
