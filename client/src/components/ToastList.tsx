import { useState, useEffect } from "react";
import Toast from "./Toast";
import styled, {keyframes} from "styled-components"

export default function ToastList({list} : {list: string[]}) {
    return (
        <Container>
            {list.map((text, index) => {
                return <Toast text={text} key={index} />
            })}
        </Container> 
    );
}

const Container = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 0.75rem;
    position: absolute;
    top: 10px;
    right: 10px;
    overflow: hidden;
    height: 100%;
    padding: 1rem;
    width: fit-content;
`;