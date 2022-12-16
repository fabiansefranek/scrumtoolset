import React from 'react';
import PokerCard from './PokerCard';
import styled from 'styled-components';

function PokerCardContainer({ cards, roomState, sendVote } : { cards : string[], roomState : string, sendVote : Function }) {
    return (
        <Container>
            <Text>Karten</Text>
            <Cards>
                {cards.map((card : string) => {
                    return <PokerCard key={card} text={card} sendVote={sendVote} active={(roomState==="voting" ? true : false)}/>
                })}
            </Cards>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Text = styled.p`
    margin: 0;
`;

const Cards = styled.div`
    display: grid;
    gap: 0.75rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`;

export default PokerCardContainer;