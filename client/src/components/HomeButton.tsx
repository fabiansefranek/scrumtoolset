import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function HomeButton() {
    const navigate = useNavigate();
    return (
        <Button
            onClick={() => {
                navigate("/");
            }}
        >
            <img src={`${process.env.PUBLIC_URL}/home.svg`} />
        </Button>
    );
}

const Button = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default HomeButton;
