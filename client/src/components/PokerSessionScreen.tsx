import React from 'react';
import PokerVoteContainer from './PokerVoteContainer';
import PokerUserStoryContainer from './PokerUserStoryContainer';
import { User, UserStory } from '../types';

function PokerSessionScreen({ userList, userStories, currentUserStory } : { userList : User[], userStories : UserStory[], currentUserStory : UserStory }) {
    const roomState : string = "Voted";
    return (
        <div>
            <p>State: {roomState}</p>
            <PokerUserStoryContainer userStories={userStories} currentUserStory={currentUserStory} />
            <PokerVoteContainer userList={userList} />
        </div>
    )
}

export default PokerSessionScreen;