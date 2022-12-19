import { useState, useEffect } from "react";
import styled, {keyframes} from "styled-components"

export default function ToastList({text} : {text: string}) {
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        visible ? <Container>{text}</Container> : null
    );
}

const toastAnimation = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    padding: 0.75rem 1.5rem;
    background-color: #fff;
    color: #000;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    animation: ${toastAnimation} 0.3s ease-in-out;
`;