import React from "react";
import styled from "styled-components";

function deriveHeight(width: number) {
    return (width / 2) * 3;
}

type Props = {
    text: string;
    active: boolean;
    sendVote: Function;
};

function Card(props: Props) {
    const width: number = 50;
    return (
        <Container
            onClick={() => props.active && props.sendVote(props.text)}
            active={props.active}
            width={width}
        >
            <Text>{props.text}</Text>
        </Container>
    );
}

const Container = styled.div<{ width: number; active: boolean }>`
    width: ${(props) => props.width}px;
    height: ${(props) => deriveHeight(props.width)}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 0.5rem;
    user-select: "none";
    cursor: ${(props) => (props.active ? "pointer" : "not-allowed")};
    background-color: ${(props) =>
        props.active
            ? props.theme.colors.cardBackgroundActive
            : props.theme.colors.cardBackgroundInactive};
    user-select: none;
`;

const Text = styled.p`
    margin: 0;
    color: ${(props) => props.theme.colors.text};
`;

export default Card;
