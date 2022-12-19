import PokerVoteContainer from './PokerVoteContainer';
import PokerUserStoryContainer from './PokerUserStoryContainer';
import { User, UserStory } from '../types';
import styled from 'styled-components';

function PokerSessionScreen({ userList, userStories, currentUserStory, nextRound, userIsModerator, roomState, revealVotes, closeRoom, sendVote, disconnect, votingSystem } : { userList : User[], userStories : UserStory[], currentUserStory : UserStory, nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function, sendVote : Function, disconnect : Function, votingSystem : any }) {
    return (
            <Container>
                <PokerUserStoryContainer userStories={userStories} currentUserStory={currentUserStory} userIsModerator={userIsModerator} />
                <PokerVoteContainer userList={userList} nextRound={nextRound} userIsModerator={userIsModerator} roomState={roomState} revealVotes={revealVotes} closeRoom={closeRoom} sendVote={sendVote} disconnect={disconnect} votingSystem={votingSystem} currentUserStory={currentUserStory} />
            </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
`

export default PokerSessionScreen;