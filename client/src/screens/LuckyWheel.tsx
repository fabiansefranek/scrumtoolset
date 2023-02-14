import { Theme } from "../types";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import WheelComponent from "../components/Wheel";

type Props = {
    theme: Theme;
    setTheme: Function;
};

function LuckyWheel(props: Props) {
    const segments = [
        "better luck next time",
        "won 70",
        "won 10",
        "better luck next time",
        "won 2",
        "won uber pass",
        "better luck next time",
        "won a voucher",
        "won 70",
        "won 10",
        "better luck next time",
        "won 2",
        "won uber pass",
        "better luck next time",
        "won a voucher",
    ];
    const segColors = [
        "#EE4040",
        "#F0CF50",
        "#815CD1",
        "#3DA5E0",
        "#34A24F",
        "#F9AA1F",
        "#EC3F3F",
        "#FF9000",
        "#F0CF50",
        "#815CD1",
        "#3DA5E0",
        "#34A24F",
        "#F9AA1F",
        "#EC3F3F",
        "#FF9000",
    ];
    const onFinished = (winner: any) => {
        console.log(winner);
    };
    return (
        <ThemeProvider theme={props.theme}>
            <Container>
                <LogoContainer>
                    <Logo src={`${process.env.PUBLIC_URL}/wheel.png`} />
                    <LogoText>Lucky Wheel</LogoText>
                </LogoContainer>
                <div style={{ margin: "0 auto" }}>
                    <WheelComponent
                        segments={segments}
                        segColors={segColors}
                        winningSegment={
                            segments[
                                Math.floor(Math.random() * segments.length)
                            ]
                        }
                        onFinished={(winner: any) => onFinished(winner)}
                        primaryColor="black"
                        contrastColor="white"
                        buttonText="Spin"
                        isOnlyOnce={false}
                        size={300}
                        upDuration={200}
                        downDuration={1000}
                        fontFamily="Arial"
                    />
                </div>
            </Container>
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
