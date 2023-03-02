import { useEffect } from "react";
import Confetti from "react-confetti";
import styled from "styled-components";

type Props = {
    text: string;
    closePopup: Function;
};
function LuckyWheelPopup(props: Props) {
    const audio = new Audio(`${process.env.PUBLIC_URL}/applause.mp3`);
    useEffect(() => {
        audio.volume = 0.5;
        audio.play();
    }, []);
    return (
        <Container
            onClick={() => {
                props.closePopup();
                audio.pause();
                audio.currentTime = 0;
            }}
        >
            <Confetti></Confetti>
            <Text>{props.text}</Text>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
`;

const Text = styled.p`
    color: white;
    font-size: xxx-large;
    font-weight: bold;
`;

export default LuckyWheelPopup;
