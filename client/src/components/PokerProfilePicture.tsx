import React from "react";
import styled from "styled-components";

type Props = {
    username: string;
};

function PokerProfilePicture(props: Props) {
    return <ProfilePicture>{props.username.charAt(0)}</ProfilePicture>;
}

const ProfilePicture = styled.p`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.highlight};
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0;
    user-select: none;
    text-transform: capitalize;
`;

export default PokerProfilePicture;
