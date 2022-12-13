import React from 'react';
import { User } from '../types';
import PokerCardContainer from './PokerCardContainer';
import PokerUserContainer from './PokerUserContainer';



function PokerVoteContainer({ userList, nextRound, userIsModerator, roomState, revealVotes, closeRoom, sendVote } : { userList : User[], nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function, sendVote : Function }) {
    const cards : string[] = ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"]
    return (
        <React.Fragment>
            <div style={{display: "flex", flexDirection: "row", gap: "3rem"}}>
                <PokerUserContainer userList={userList} roomState={roomState} />
                <PokerCardContainer cards={cards} roomState={roomState} sendVote={sendVote}/>
            </div>
            <div>
                {userIsModerator && <>
                    {(roomState === "voting") ? <button onClick={() => nextRound()}>Reveal votes</button> : (roomState === "waiting") ? <button onClick={() => nextRound()}>Next round</button> : <button onClick={() => nextRound()}>Close room</button>}
                </>}
            </div>
        </React.Fragment>       

    );
}

export default PokerVoteContainer;