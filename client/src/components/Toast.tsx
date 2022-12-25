import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import "../index.css";

const ToastTypeImages: { [key: string]: string } = {
    success: "check",
    error: "x-circle",
    alert: "alert-triangle",
};

type Props = {
    toast: any;
    close: Function;
    onClick: Function;
};

const Toast = (props: Props) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            props.close();
        }, 2000);
        return () => {
            clearTimeout(timeout);
        };
    }, [props]);

    return (
        <Container onClick={() => props.onClick()}>
            <img
                src={`${process.env.PUBLIC_URL}/${
                    ToastTypeImages[props.toast.type]
                }.svg`}
                alt={`${props.toast.type} icon`}
            />
            {props.toast.message}
        </Container>
    );
};

const slideFromRight = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateY(0);
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
    width: fit-content;
    padding: 0.75rem 0.75rem;
    font-size: medium;
    background-color: ${(props) => props.theme.colors.cardBackgroundActive};
    color: ${(props) => props.theme.colors.text};
    animation: ${slideFromRight} 0.5s ease-in-out;
    border-radius: 0.25rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    max-width: 20vw;
    cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`;

export default Toast;
