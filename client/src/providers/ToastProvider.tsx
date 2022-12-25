import { useState } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";
import { ToastContext } from "../contexts/ToastContext";
import styled from "styled-components";
import "../index.css";

type Props = {
    children: any;
};

export function ToastProvider(props: Props) {
    const [toasts, setToasts] = useState<any[]>([]);

    const open = (message: string, type: string, onClick?: Function) => {
        const toast = {
            id: Date.now(),
            message: message,
            type: type,
            onClick: onClick,
        };
        setToasts([toast, ...toasts]);
    };

    const success = (message: string, onClick?: Function) => {
        open(message, "success", onClick);
    };

    const error = (message: string) => {
        open(message, "error");
    };

    const alert = (message: string) => {
        open(message, "alert");
    };

    const close = (id: number) => {
        setTimeout(() => {
            setToasts([...toasts.filter((toast) => toast.id !== id)]);
        }, 500);
    };

    return (
        <ToastContext.Provider value={{ success, error, alert }}>
            {props.children}
            {createPortal(
                <Container>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            toast={toast}
                            onClick={toast.onClick ? toast.onClick : null}
                            close={() => close(toast.id)}
                        />
                    ))}
                </Container>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

const Container = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 0.5rem;
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    height: 100%;
    padding: 1rem;
    box-sizing: border-box;
    width: fit-content;
    //TODO: make non clickable (pointer-events: none)
`;
