import { User } from "../types";
import PokerUser from "./PokerUser";
import styled from "styled-components";

type Props = {
    userList: User[];
    roomState: string;
};

function PokerUserContainer(props: Props) {
    const getNumberOfVotes = () => {
        return props.userList.reduce((count: number, user: User) => {
            if (user.state === "voted") {
                return count + 1;
            }
            return count;
        }, 0);
    };

    return (
        <Container>
            <Text>
                Punkte{" "}
                {props.roomState === "voting"
                    ? ` - ${getNumberOfVotes()}/${
                          props.userList.length
                      } Stimmen`
                    : null}
            </Text>
            <Users>
                {props.userList.map((user: User) => {
                    return (
                        <PokerUser
                            key={user.sessionId}
                            user={user}
                            roomState={props.roomState}
                        />
                    );
                })}
            </Users>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 35%;
    max-height: 100%;
    overflow: hidden;
`;

const Text = styled.p`
    margin: 0;
    color: ${(props) => props.theme.colors.text};
`;

const Users = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: hidden;
    max-height: 100%;
`;

export default PokerUserContainer;
