import React from "react";
import Card from "./Card";
import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguage";
import { RoomStates } from "../constants/enums";

type Props = {
    cards: string[];
    roomState: string;
    sendVote: Function;
};

function CardContainer(props: Props) {
    const language = useLanguage();

    return (
        <Container>
            <Text>{language.strings.cards}</Text>
            <Cards cards={props.cards}>
                {props.cards.map((card: string) => {
                    return (
                        <Card
                            key={card}
                            text={card}
                            sendVote={props.sendVote}
                            active={
                                props.roomState === RoomStates.Voting
                                    ? true
                                    : false
                            }
                        />
                    );
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
    color: ${(props) => props.theme.colors.text};
`;

const Cards = styled.div.attrs((props: { cards: string[] }) => props)`
    display: grid;
    gap: 0.75rem;
    grid-template-columns: ${(props) =>
        props.cards.length % 4 === 0
            ? "1fr 1fr 1fr 1fr"
            : props.cards.length % 3 === 0
            ? "1fr 1fr 1fr"
            : "1fr 1fr 1fr 1fr"};
`;

export default CardContainer;
