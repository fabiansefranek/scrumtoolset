import styled from "styled-components";

export const Button = styled.button`
    border: 0;
    outline: 0;
    background-color: ${(props) => props.theme.colors.highlight};
    color: ${(props) => props.theme.colors.highlightText};
    padding: 0.75rem;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.colors.darkerHighlight};
    }
`;
