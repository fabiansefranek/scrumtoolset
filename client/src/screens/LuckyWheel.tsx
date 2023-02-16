import { LuckyWheelSegment, Theme } from "../types";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import Wheel from "../components/Wheel";
import { useState } from "react";
import LuckyWheelPopup from "../components/LuckyWheelPopup";
import { useLanguage } from "../hooks/useLanguage";

type Props = {
    theme: Theme;
    setTheme: Function;
    title: string;
};

function LuckyWheel(props: Props) {
    const [segments] = useState<LuckyWheelSegment[]>([
        { text: "Andrea", color: "#EE4040" },
        { text: "Michelle", color: "#F0CF50" },
        { text: "Steve", color: "#815CD1" },
        { text: "Max", color: "#3DA5E0" },
    ]);
    const [winner, setWinner] = useState<LuckyWheelSegment>(
        {} as LuckyWheelSegment
    );
    const language = useLanguage();

    document.title = props.title;

    return (
        <ThemeProvider theme={props.theme}>
            <Container>
                <LogoContainer>
                    <Logo src={`${process.env.PUBLIC_URL}/wheel.png`} />
                    <LogoText>Lucky Wheel</LogoText>
                </LogoContainer>
                <Wheel
                    segments={segments}
                    canvasSize={700}
                    fontSize={24}
                    fontFamily="Ubuntu"
                    spinText={language.strings.luckyWheel.spin}
                    onFinished={(winnerSegment: LuckyWheelSegment) => {
                        setWinner(winnerSegment);
                    }}
                />
            </Container>
            {winner.text !== undefined ? (
                <LuckyWheelPopup
                    text={`${language.strings.luckyWheel.the_winner_is} ${winner.text}!`}
                    closePopup={() => setWinner({} as LuckyWheelSegment)}
                />
            ) : null}
        </ThemeProvider>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
`;

const LogoContainer = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    user-select: none;
    opacity: 0.3;
`;

const LogoText = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
`;

const Logo = styled.img`
    width: 30px;
    height: 30px;
    filter: ${({ theme }) =>
        theme.name === "Dark" ? "invert(1)" : "invert(0)"};
`;

export default LuckyWheel;
