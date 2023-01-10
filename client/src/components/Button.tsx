import styled from "styled-components";
import { Theme } from "../types";

type Props = {
    theme: Theme;
};

export const Button = styled.button`
    border: 0;
    outline: 0;
    background-color: ${(props: Props) => props.theme.colors.highlight};
    color: ${(props: Props) => props.theme.colors.highlightText};
    padding: 0.75rem;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
        background-color: ${(props: Props) =>
            props.theme.colors.darkerHighlight};
    }
`;
