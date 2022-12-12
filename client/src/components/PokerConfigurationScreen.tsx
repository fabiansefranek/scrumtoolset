function PokerConfigurationScreen({ setRoomName, setUsername, setVotingSystem } : { setRoomName : Function, setUsername : Function, setVotingSystem : Function }) {
    return (
        <>
            <input placeholder="Username" onChange={(event : any) => setUsername(event.target.value)}></input>
            <input placeholder="Room Name" onChange={(event : any) => setRoomName(event.target.value)}></input>
            <select onChange={(event : any) => setVotingSystem(event.target.value) }>
                <option value="fibonacci">Fibonacci (☕,0,1/2,1,2,3,5,8,13,21,34,55)</option>
                <option value="fibonacci">Scrum (☕,0,1/2,1,2,3,5,8,13,20,40,100)</option>
            </select>
            <button>Create room</button>
        </>
    );
}

export default PokerConfigurationScreen;