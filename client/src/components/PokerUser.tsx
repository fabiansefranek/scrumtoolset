import { User } from "../types";
import PokerProfilePicture from "./PokerProfilePicture";
import styled from "styled-components";

type Props = {
    user: User;
    roomState: string;
};

function PokerUser(props: Props) {
    return (
        <Container key={props.user.sessionId}>
            <UserContainer>
                <PokerProfilePicture username={props.user.username} />
                <Username>{props.user.username}</Username>
            </UserContainer>

            <State>
                {props.roomState === "voting"
                    ? props.user.state
                    : props.user.vote
                    ? props.user.vote
                    : "Not voted"}
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

const UserContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
`;

const Username = styled.p`
    margin: 0;
    text-transform: capitalize;
    color: ${(props) => props.theme.colors.text};
`;

const State = styled.p`
    margin: 0;
    text-transform: capitalize;
    color: ${(props) => props.theme.colors.text};
`;

export default PokerUser;
