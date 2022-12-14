import React from 'react';
import { User } from '../types';
import PokerCardContainer from './PokerCardContainer';
import PokerUserContainer from './PokerUserContainer';



function PokerVoteContainer({ userList, nextRound, userIsModerator, roomState, revealVotes, closeRoom, sendVote, disconnect } : { userList : User[], nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function, sendVote : Function, disconnect : Function }) {
    const cards : string[] = ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "80", "100"];
    return (
        <div style={{backgroundColor: "#f3f3f3", width: "40vw", padding: "2rem", height: "fit-content", boxSizing: "border-box", borderRadius: "0.5rem"}}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <PokerUserContainer userList={userList} roomState={roomState} />
                <PokerCardContainer cards={cards} roomState={roomState} sendVote={sendVote}/>
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem"}}>
                    {(roomState === "voting") ? <button style={{padding: "0.5rem"}} onClick={() => nextRound()}>Karten aufdecken</button> : (roomState === "waiting") ? <button style={{padding: "0.5rem"}}  onClick={() => nextRound()}>Nächste Runde</button> : <button style={{padding: "0.5rem"}} onClick={() => nextRound()}>Raum schließen</button>}
		   <button onClick={() => disconnect()}>Raum verlassen</button>
            </div>
        </div>

    );
}

export default PokerVoteContainer;