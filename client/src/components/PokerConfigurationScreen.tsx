function convertLinesToUserStoryArray(lines : string) {
    return lines.split("\n").map((line : string) => ({
        name: line.split(',')[0],
        content: line.split(',')[1]
    })
    )
}

function PokerConfigurationScreen({ setRoomName, setUsername, setVotingSystem, setUserStories, createRoom } : { setRoomName : Function, setUsername : Function, setVotingSystem : Function, setUserStories : Function, createRoom : any }) {
    return (
        <>
            <input placeholder="Username" onChange={(event : any) => setUsername(event.target.value)}></input>
            <input placeholder="Room Name" onChange={(event : any) => setRoomName(event.target.value)}></input>
            <select onChange={(event : any) => setVotingSystem(event.target.value) }>
                <option value="fibonacci">Fibonacci (☕,0,1/2,1,2,3,5,8,13,21,34,55)</option>
                <option value="fibonacci">Scrum (☕,0,1/2,1,2,3,5,8,13,20,40,100)</option>
            </select>
            <textarea onChange={(event : any) => setUserStories(convertLinesToUserStoryArray(event.target.value))}></textarea>
            <button onClick={createRoom}>Create room</button>
        </>
    );
}

export default PokerConfigurationScreen;