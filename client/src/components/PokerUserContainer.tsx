import { User, UserStory } from "../types";
import PokerUser from "./PokerUser";
import styled from "styled-components";
import { RoomStates } from "../constants/enums";
import { LanguageContext } from "../contexts/LanguageContext";
import { useLanguage } from "../hooks/useLanguage";

type Props = {
    userList: User[];
    roomState: string;
    currentUserStory: UserStory;
};

function PokerUserContainer(props: Props) {
    const language = useLanguage();

    const getNumberOfVotes = () => {
        return props.userList.reduce((count: number, user: User) => {
            if (user.state === RoomStates.Voted) {
                return count + 1;
            }
            return count;
        }, 0);
    };

    return (
        <Container>
            <Text>
                {language.strings.points}{" "}
                {props.roomState === RoomStates.Voting
                    ? ` - ${getNumberOfVotes()}/${props.userList.length} ${
                          language.strings.votes
                      }`
                    : null}
            </Text>
            <Users>
                {props.userList.map((user: User) => {
                    return (
                        <PokerUser
                            key={user.sessionId}
                            user={user}
                            roomState={props.roomState}
                            currentUserStory={props.currentUserStory}
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
