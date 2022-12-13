import React from 'react';
import { User } from '../types';
import PokerCardContainer from './PokerCardContainer';
import PokerUserContainer from './PokerUserContainer';



function PokerVoteContainer({ userList, nextRound, userIsModerator, roomState, revealVotes, closeRoom } : { userList : User[], nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function }) {
    const cards : string[] = ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"]
    return (
        <React.Fragment>
            <div style={{display: "flex", flexDirection: "row", gap: "3rem"}}>
                <PokerUserContainer userList={userList} />
                <PokerCardContainer cards={cards} />
            </div>
            <div>
                {userIsModerator && <>
                    <button onClick={() => nextRound()}>{(roomState === "voting") ? "Reveal votes" : (roomState === "waiting") ? "Next round" : "Close room"}</button>
                    <button onClick={() => closeRoom()}>Force close room</button>
                </>}
            </div>
        </React.Fragment>       

    );
}

export default PokerVoteContainer;