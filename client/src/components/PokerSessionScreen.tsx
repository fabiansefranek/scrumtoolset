import React from 'react';
import PokerVoteContainer from './PokerVoteContainer';
import PokerUserStoryContainer from './PokerUserStoryContainer';
import { User, UserStory } from '../types';

function PokerSessionScreen({ userList, userStories, currentUserStory, nextRound, userIsModerator, roomState, revealVotes, closeRoom, sendVote } : { userList : User[], userStories : UserStory[], currentUserStory : UserStory, nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function, sendVote : Function }) {
    return (
        <div>
            <p>State: {roomState}</p>
            <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                <PokerUserStoryContainer userStories={userStories} currentUserStory={currentUserStory} userIsModerator={userIsModerator} />
                <PokerVoteContainer userList={userList} nextRound={nextRound} userIsModerator={userIsModerator} roomState={roomState} revealVotes={revealVotes} closeRoom={closeRoom} sendVote={sendVote} />
            </div>
        </div>
    )
}

export default PokerSessionScreen;