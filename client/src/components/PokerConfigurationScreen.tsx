import { UserStory } from "../types";
import styled from "styled-components";
import { votingSystems } from "../App";

function convertLinesToUserStoryArray(lines : string) {
    return lines.split("\n").map((line : string) => ({
        name: line.split(';')[0],
        content: line.split(';')[1]
    })
    )
}

function PokerConfigurationScreen({ setRoomName, setUsername, setVotingSystem, setUserStories, createRoom, setCurrentUserStory, joinRoom, setRoomCode } : { setRoomName : Function, setUsername : Function, setVotingSystem : Function, setUserStories : Function, createRoom : any, setCurrentUserStory : Function, joinRoom : Function, setRoomCode : Function }) {
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
    background-color: #f5f5f5;
    padding: 2rem;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const Text = styled.p`
    margin: 0;
`;

const Input = styled.input`
    padding: 0.5rem;
`
const Button = styled.button`
    padding: 0.5rem;
`;

const Select = styled.select`
    padding: 0.5rem;
`;

const TextArea = styled.textarea`
    padding: 0.5rem;
`;

export default PokerConfigurationScreen;