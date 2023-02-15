import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type Props = {
    title: string;
};

function Home(props: Props) {
    document.title = props.title;
    const navigate = useNavigate();

    return (
        <Container>
            <img
                alt="Team Meeting"
                style={{ width: "35vw", height: "35vw", userSelect: "none" }}
                src={`${process.env.PUBLIC_URL}/Team_Meeting_Monochromatic.svg`}
                draggable={false}
            />
            <CardContainer>
                <Card onClick={() => navigate("/scrumpoker")}>
                    <Image src={`${process.env.PUBLIC_URL}/cards.png`} />
                    Scrum Poker
                </Card>
                <Card onClick={() => navigate("/luckywheel")}>
                    <Image src={`${process.env.PUBLIC_URL}/wheel.png`} />
                    Lucky Wheel
                </Card>
            </CardContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
`;

const CardContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    position: relative;
    top: -80px;
`;

const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 100px;
    background-color: white;
    border-radius: 10px;
    border: 1px solid #e6e6e6;
    //box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    font-size: 24px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    &:hover {
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
        background-color: #fdfdfd;
    }
`;

const Image = styled.img`
    width: 30px;
`;

export default Home;
