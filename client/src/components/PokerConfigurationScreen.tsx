import { UserStory } from "../types";

function convertLinesToUserStoryArray(lines : string) {
    return lines.split("\n").map((line : string) => ({
        name: line.split(';')[0],
        content: line.split(';')[1]
    })
    )
}

function PokerConfigurationScreen({ setRoomName, setUsername, setVotingSystem, setUserStories, createRoom, setCurrentUserStory, joinRoom, setRoomCode } : { setRoomName : Function, setUsername : Function, setVotingSystem : Function, setUserStories : Function, createRoom : any, setCurrentUserStory : Function, joinRoom : Function, setRoomCode : Function }) {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "2rem", width: "30vw", backgroundColor: "#f3f3f3", padding: "2rem"}}>
	    <p style={{margin:"0"}}>Raum beitreten</p>
            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
	    <input style={{padding: "0.5rem"}} placeholder="Benutzername" onChange={(event : any) => setUsername(event.target.value)}></input>
            <input style={{padding: "0.5rem"}} type="text" placeholder="Raum Code" onInput={(event : any) => setRoomCode(event.target.value)}></input>
            <button style={{padding: "0.5rem"}} onClick={ () => joinRoom() }>Beitreten</button>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
		<p style={{margin:"0"}}>Raum erstellen</p>
                <input style={{padding: "0.5rem"}} placeholder="Benutzername" onChange={(event : any) => setUsername(event.target.value)}></input>
                <input style={{padding: "0.5rem"}} placeholder="Raum Name" onChange={(event : any) => setRoomName(event.target.value)}></input>
                <select style={{padding: "0.5rem"}}  onChange={(event : any) => setVotingSystem(event.target.value) }>
                    <option value="fibonacci">Fibonacci (☕,0,1/2,1,2,3,5,8,13,21,34,55)</option>
                    <option value="scrum">Scrum (☕,0,1/2,1,2,3,5,8,13,20,40,100)</option>
                </select>
                <textarea style={{padding: "0.5rem"}} onChange={(event : any) => {
                    const userStories : UserStory[] = convertLinesToUserStoryArray(event.target.value);
                    setUserStories(userStories);
                    setCurrentUserStory(userStories[0]);
                    }} placeholder="Userstories"></textarea>
                <button style={{padding: "0.5rem"}} onClick={createRoom}>Erstellen</button>
            </div>
        </div>
    );
}

export default PokerConfigurationScreen;