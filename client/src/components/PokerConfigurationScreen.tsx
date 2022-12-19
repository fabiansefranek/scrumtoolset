import { UserStory } from "../types";
import styled from "styled-components";
import { votingSystems } from "../App";
import { Button } from "./Button";
import { Theme } from "../types";
import { themes } from "../themes";

function convertLinesToUserStoryArray(lines : string) {
    return lines.split("\n").map((line : string) => ({
        name: line.split(';')[0],
        content: line.split(';')[1]
    })
    )
}

function PokerConfigurationScreen({ setRoomName, setUsername, setVotingSystem, setUserStories, createRoom, setCurrentUserStory, joinRoom, setRoomCode, setTheme } : { setRoomName : Function, setUsername : Function, setVotingSystem : Function, setUserStories : Function, createRoom : any, setCurrentUserStory : Function, joinRoom : Function, setRoomCode : Function, setTheme : Function }) {
    return (
        <Container>
            <InputContainer>
                <Text>Raum beitreten</Text>
                <Input placeholder="Benutzername" onChange={(event : any) => setUsername(event.target.value)} />
                <Input type="text" placeholder="Raum Code" onInput={(event : any) => setRoomCode(event.target.value)} />
                <Button onClick={ () => joinRoom() }>Beitreten</Button>
            </InputContainer>
            <InputContainer>
		        <Text>Raum erstellen</Text>
                <Input placeholder="Benutzername" onChange={(event : any) => setUsername(event.target.value)} />
                <Input placeholder="Raum Name" onChange={(event : any) => setRoomName(event.target.value)} />
                <Select onChange={(event : any) => setVotingSystem(event.target.value) }>
                    {Object.keys(votingSystems).map((votingSystem : string) => {
                        return <option key={votingSystem} value={votingSystem}>{votingSystem.charAt(0).toUpperCase() + votingSystem.slice(1) + ` (${votingSystems[votingSystem].join(',')})`}</option>
                    })}
                </Select>
                <Select onChange={(event : any) => setTheme(themes.find(theme => theme.name == event.target.value)) }>
                    {themes.map((theme : Theme) => {
                        return <option key={theme.name} value={theme.name}>{theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}</option>
                    })}
                </Select>
                <TextArea onChange={(event : any) => {
                    const userStories : UserStory[] = convertLinesToUserStoryArray(event.target.value);
                    setUserStories(userStories);
                    }} placeholder="Userstories"></TextArea>
                <Button onClick={createRoom}>Erstellen</Button>
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
    color: ${({theme}) => theme.colors.text}
`;

const Input = styled.input`
    padding: 0.5rem;
    background-color: ${props => props.theme.colors.inputBackground};
    color: ${props => props.theme.colors.text};
    border: ${props => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;

    &:focus {
        outline: none;
    }
`

const Select = styled.select`
    background-color: ${props => props.theme.colors.inputBackground};
    color: ${props => props.theme.colors.text};
    border: ${props => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
`;

const TextArea = styled.textarea`
    background-color: ${props => props.theme.colors.inputBackground};
    color: ${props => props.theme.colors.text};
    border: ${props => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
    resize: none;

    &:focus {
        outline: none;
    }
`;

export default PokerConfigurationScreen;