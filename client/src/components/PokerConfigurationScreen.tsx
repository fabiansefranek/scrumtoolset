import { UserStory } from "../types";
import styled from "styled-components";
import { votingSystems } from "../App";
import { Button } from "./Button";
import { Theme } from "../types";
import { themes } from "../themes";

function convertLinesToUserStoryArray(lines: string): UserStory[] {
    return lines.split("\n").map((line: string) => ({
        name: line.split(";")[0],
        content: line.split(";")[1],
    }));
}

type Props = {
    setRoomName: Function;
    setUsername: Function;
    setVotingSystem: Function;
    setUserStories: Function;
    createRoom: any;
    setCurrentUserStory: Function;
    joinRoom: Function;
    setRoomCode: Function;
    setTheme: Function;
};

function PokerConfigurationScreen(props: Props) {
    return (
        <Container>
            <InputContainer>
                <Text>Raum beitreten</Text>
                <Input
                    placeholder="Benutzername"
                    onChange={(event: any) =>
                        props.setUsername(event.target.value)
                    }
                />
                <Input
                    type="text"
                    placeholder="Raum Code"
                    onInput={(event: any) =>
                        props.setRoomCode(event.target.value)
                    }
                />
                <Button onClick={() => props.joinRoom()}>Beitreten</Button>
            </InputContainer>
            <InputContainer>
                <Text>Raum erstellen</Text>
                <Input
                    placeholder="Benutzername"
                    onChange={(event: any) =>
                        props.setUsername(event.target.value)
                    }
                />
                <Input
                    placeholder="Raum Name"
                    onChange={(event: any) =>
                        props.setRoomName(event.target.value)
                    }
                />
                <Select
                    onChange={(event: any) =>
                        props.setVotingSystem(event.target.value)
                    }
                >
                    {Object.keys(votingSystems).map((votingSystem: string) => {
                        return (
                            <option key={votingSystem} value={votingSystem}>
                                {votingSystem.charAt(0).toUpperCase() +
                                    votingSystem.slice(1) +
                                    ` (${votingSystems[votingSystem].join(
                                        ","
                                    )})`}
                            </option>
                        );
                    })}
                </Select>
                <Select
                    onChange={(event: any) =>
                        props.setTheme(
                            themes.find(
                                (theme) => theme.name === event.target.value
                            )
                        )
                    }
                >
                    {themes.map((theme: Theme) => {
                        return (
                            <option key={theme.name} value={theme.name}>
                                {theme.name.charAt(0).toUpperCase() +
                                    theme.name.slice(1)}
                            </option>
                        );
                    })}
                </Select>
                <TextArea
                    onChange={(event: any) => {
                        const userStories: UserStory[] =
                            convertLinesToUserStoryArray(event.target.value);
                        props.setUserStories(userStories);
                    }}
                    placeholder="Userstories"
                ></TextArea>
                <Button onClick={props.createRoom}>Erstellen</Button>
            </InputContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 30vw;
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
    border-radius: 0.5rem;
    padding: 2rem;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const Text = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
    padding: 0.5rem;
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.text};
    border: ${(props) => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;

    &:focus {
        outline: none;
    }
`;

const Select = styled.select`
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.text};
    border: ${(props) => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
`;

const TextArea = styled.textarea`
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.text};
    border: ${(props) => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
    resize: none;

    &:focus {
        outline: none;
    }
`;

export default PokerConfigurationScreen;
