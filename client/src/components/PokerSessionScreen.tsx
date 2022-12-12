import React from 'react';
import PokerVoteContainer from './PokerVoteContainer';
import PokerUserStoryContainer from './PokerUserStoryContainer';
import { User } from '../types';

function PokerSessionScreen({ userList } : { userList : User[] }) {
    const roomState : string = "Voted";
    return (
        <div>
            <p>State: {roomState}</p>
            <PokerUserStoryContainer userStory="#21 Scrum Poker" />
            <PokerVoteContainer userList={userList} />
        </div>
    )
}

export default PokerSessionScreen;