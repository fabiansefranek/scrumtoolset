import React from 'react';
import styled from 'styled-components';

function deriveHeight(width: number) {
    return (width/2)*3;
}

function PokerCard({ text, active, sendVote } : { text : string, active : boolean, sendVote : Function }) {
    const width : number = 50;
    return (
        <Card onClick={() => sendVote(text)} active={active} width={width}>
            <CardText>{text}</CardText>
        </Card>
    );
}

const Card = styled.div.attrs((props : {width: number, active : boolean}) => props)`
    width: ${props => props.width}px;
    height: ${props => deriveHeight(props.width)}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 0.5rem;
    user-select: "none";
    cursor: ${props => props.active ? "pointer" : "not-allowed"};
    background-color: ${props => props.active ? "white" : "#F6F6F6"};
`;

const CardText = styled.p`
    margin: 0;
`;

export default PokerCard;