import styled from "styled-components";
import { Theme } from "../types";

type Props = {
    theme: Theme;
    secondary?: boolean;
};

export const Button = styled.button<Props>`
    border: 0;
    outline: 0;
    background-color: ${(props: Props) =>
        props.secondary ? "transparent" : props.theme.colors.highlight};
    border: ${(props: Props) =>
            props.secondary ? props.theme.colors.highlight : "none"}
        2px solid;
    color: ${(props: Props) =>
        props.secondary
            ? props.theme.colors.highlight
            : props.theme.colors.highlightText};
    padding: 0.75rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: ${(props: Props) =>
            props.secondary
                ? props.theme.colors.highlight
                : props.theme.colors.darkerHighlight};
        color: ${(props: Props) => props.theme.colors.highlightText};
    }

    &:active {
        transform: scale(0.995);
    }
`;
