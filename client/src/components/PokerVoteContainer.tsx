import React from 'react';
import { User, UserStory } from '../types';
import PokerCardContainer from './PokerCardContainer';
import PokerUserContainer from './PokerUserContainer';
import { votingSystems } from '../App';
import styled from 'styled-components';

function PokerVoteContainer({ userList, nextRound, userIsModerator, roomState, sendVote, disconnect, votingSystem, currentUserStory } : { userList : User[], nextRound : Function, userIsModerator : Boolean, roomState : string, revealVotes : Function, closeRoom : Function, sendVote : Function, disconnect : Function, votingSystem : any, currentUserStory : UserStory }) {
    return (
        <Container>
            <UserAndCardContainer>
                <PokerUserContainer userList={userList} roomState={roomState} />
                <PokerCardContainer cards={votingSystems[votingSystem]} roomState={roomState} sendVote={sendVote}/>
            </UserAndCardContainer>
            <ButtonContainer>
                    {(userIsModerator) ? (roomState === "voting") 
                        ? <Button onClick={() => nextRound()}>Karten aufdecken</Button>
                        : (roomState === "waiting") 
                        ? <Button onClick={() => nextRound()}>
                            {(userIsModerator && currentUserStory.name === "Waiting") ? 'Runde starten' : 'Nächste Runde' }
                          </Button> 
                        : <Button onClick={() => nextRound()}>Raum schließen</Button> 
                        : <></>}
		            <Button onClick={() => disconnect()}>Raum verlassen</Button>
            </ButtonContainer>
        </Container>

    );
}

const Container = styled.div`
    background-color: #f5f5f5;
    width: 80vw;
    padding: 2rem;
    height: fit-content;
    box-sizing: border-box;
    border-radius: 0.5rem;
`;

const UserAndCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 2rem;
    gap: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem;
`;

export default PokerVoteContainer;