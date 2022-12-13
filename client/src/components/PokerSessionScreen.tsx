import React from 'react';
import PokerVoteContainer from './PokerVoteContainer';
import PokerUserStoryContainer from './PokerUserStoryContainer';
import { User, UserStory } from '../types';

function PokerSessionScreen({ userList, userStories, currentUserStory, nextRound, userIsModerator, roomState, revealVotes } : { userList : User[], userStories : UserStory[], currentUserStory : UserStory, nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function }) {
    return (
        <div>
            <p>State: {roomState}</p>
            <PokerUserStoryContainer userStories={userStories} currentUserStory={currentUserStory} />
            <PokerVoteContainer userList={userList} nextRound={nextRound} userIsModerator={userIsModerator} roomState={roomState} revealVotes={revealVotes} />
        </div>
    )
}

export default PokerSessionScreen;