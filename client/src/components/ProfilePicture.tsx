import styled from "styled-components";

type Props = {
    username: string;
};

function ProfilePicture(props: Props) {
    return <Paragraph>{props.username.charAt(0)}</Paragraph>;
}

const Paragraph = styled.p`
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
    font-size: 20px;
`;

export default ProfilePicture;
