import { UserStory } from "../types";
import styled from "styled-components";
import { votingSystems } from "../constants/enums";
import { Button } from "./Button";
import { Theme } from "../types";
import { themes } from "../constants/themes";
import { useLanguage } from "../hooks/useLanguage";
import { ChangeEvent } from "react";

function convertLinesToUserStoryArray(lines: string): UserStory[] {
    if (lines.length === 0) return [];
    return lines
        .trim()
        .split("\n")
        .map((line: string) => ({
            name: line.split(";")[0],
            content: line.split(";")[1],
        }));
}

type Props = {
    setRoomName: Function;
    setUsername: Function;
    setVotingSystem: Function;
    setUserStories: Function;
    createRoom: Function;
    setCurrentUserStory: Function;
    joinRoom: Function;
    setRoomCode: Function;
    setTheme: Function;
};

function ConfigurationScreen(props: Props) {
    const language = useLanguage();
    return (
        <Container>
            <InputContainer>
                <Text>{language.strings.join_room}</Text>
                <Input
                    placeholder={language.strings.username}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        props.setUsername(event.target.value)
                    }
                />
                <Input
                    type="text"
                    placeholder={language.strings.room.code}
                    onInput={(event: ChangeEvent<HTMLInputElement>) =>
                        props.setRoomCode(event.target.value)
                    }
                />
                <Button onClick={() => props.joinRoom()}>
                    {language.strings.buttons.join}
                </Button>
            </InputContainer>
            <InputContainer>
                <Text>{language.strings.create_room}</Text>
                <Input
                    placeholder={language.strings.username}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        props.setUsername(event.target.value)
                    }
                />
                <Input
                    placeholder={language.strings.room.name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        props.setRoomName(event.target.value)
                    }
                />
                <Select
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        props.setVotingSystem(event.target.value)
                    }
                >
                    {Object.keys(votingSystems).map((votingSystem: string) => {
                        return (
                            <option key={votingSystem} value={votingSystem}>
                                {votingSystem.capitalize() +
                                    ` (${votingSystems[votingSystem].join(
                                        ","
                                    )})`}
                            </option>
                        );
                    })}
                </Select>
                <Select
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
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
                                {
                                    language.strings.theme[
                                        theme.name.toLowerCase()
                                    ]
                                }
                            </option>
                        );
                    })}
                </Select>
                <TextArea
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                        const userStories: UserStory[] =
                            convertLinesToUserStoryArray(event.target.value);
                        props.setUserStories(userStories);
                    }}
                    placeholder="Userstories"
                ></TextArea>
                <Button onClick={() => props.createRoom()}>
                    {language.strings.buttons.create}
                </Button>
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

export default ConfigurationScreen;
