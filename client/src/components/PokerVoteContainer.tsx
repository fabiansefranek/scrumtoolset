import React from 'react';
import { User } from '../types';
import PokerCardContainer from './PokerCardContainer';
import PokerUserContainer from './PokerUserContainer';



function PokerVoteContainer({ userList } : { userList : User[] }) {
    const cards : string[] = ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"]
    return (
        <div style={{display: "flex", flexDirection: "row", gap: "3rem"}}>
            <PokerUserContainer userList={userList} />
            <PokerCardContainer cards={cards} />
        </div>
    );
}

export default PokerVoteContainer;