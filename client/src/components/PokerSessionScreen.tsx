import React from 'react';
import PokerVoteContainer from './PokerVoteContainer';
import PokerUserStoryContainer from './PokerUserStoryContainer';
import { User, UserStory } from '../types';

function PokerSessionScreen({ userList, userStories, currentUserStory, nextRound, userIsModerator, roomState, revealVotes, closeRoom } : { userList : User[], userStories : UserStory[], currentUserStory : UserStory, nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function }) {
    return (
        <div>
            <p>State: {roomState}</p>
            <PokerUserStoryContainer userStories={userStories} currentUserStory={currentUserStory} userIsModerator={userIsModerator} />
            <PokerVoteContainer userList={userList} nextRound={nextRound} userIsModerator={userIsModerator} roomState={roomState} revealVotes={revealVotes} closeRoom={closeRoom} />
        </div>
    )
}

export default PokerSessionScreen;