import { UserStory } from "../types";

function convertLinesToUserStoryArray(lines : string) {
    return lines.split("\n").map((line : string) => ({
        name: line.split(';')[0],
        content: line.split(';')[1]
    })
    )
}

function PokerConfigurationScreen({ setRoomName, setUsername, setVotingSystem, setUserStories, createRoom, setCurrentUserStory } : { setRoomName : Function, setUsername : Function, setVotingSystem : Function, setUserStories : Function, createRoom : any, setCurrentUserStory : Function }) {
    return (
        <>
            <input placeholder="Username" onChange={(event : any) => setUsername(event.target.value)}></input>
            <input placeholder="Room Name" onChange={(event : any) => setRoomName(event.target.value)}></input>
            <select onChange={(event : any) => setVotingSystem(event.target.value) }>
                <option value="fibonacci">Fibonacci (☕,0,1/2,1,2,3,5,8,13,21,34,55)</option>
                <option value="scrum">Scrum (☕,0,1/2,1,2,3,5,8,13,20,40,100)</option>
            </select>
            <textarea onChange={(event : any) => {
                const userStories : UserStory[] = convertLinesToUserStoryArray(event.target.value);
                setUserStories(userStories);
                setCurrentUserStory(userStories[0]);
                }}></textarea>
            <button onClick={createRoom}>Create room</button>
        </>
    );
}

export default PokerConfigurationScreen;