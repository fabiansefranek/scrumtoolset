import { User } from "../types";
import PokerProfilePicture from "./PokerProfilePicture";
import styled from "styled-components";

function PokerUser({ user, roomState }: { user: User; roomState: string }) {
    return (
        <Container key={user.sessionId}>
            <UserContainer>
                <PokerProfilePicture username={user.username} />
                <Username>{user.username}</Username>
            </UserContainer>

            <State>{roomState === "voting" ? user.state : user.vote}</State>
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
