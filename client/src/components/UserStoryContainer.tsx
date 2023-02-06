import React, { useState } from "react";
import { UserStory } from "../types";
import styled from "styled-components";
import { Button } from "./Button";
import { useLanguage } from "../hooks/useLanguage";

type Props = {
    userStories: UserStory[];
    currentUserStory: UserStory;
    userIsModerator: Boolean;
    roomName: string;
};

function UserStoryContainer(props: Props) {
    const [showUserStories, setShowUserStories] = useState<boolean>(false);
    const language = useLanguage();

    return (
        <React.Fragment>
            <CurrentUserStoryContainer>
                <RoomNameAndCurrentStoryContainer>
                    <RoomName>{props.roomName}</RoomName>
                    <Text>
                        {props.currentUserStory.id === -1
                            ? language.strings.waiting_for_moderator_to_start
                            : `Userstory: ${props.currentUserStory.name}`}
                    </Text>
                </RoomNameAndCurrentStoryContainer>
                {props.userIsModerator && (
                    <Button
                        onClick={() => setShowUserStories(!showUserStories)}
                    >
                        {showUserStories
                            ? language.strings.buttons.hide_userstories
                            : language.strings.buttons.show_userstories}
                    </Button>
                )}
            </CurrentUserStoryContainer>
            {showUserStories && (
                <AllUserstoriesContainer>
                    <Text>{language.strings.all_userstories}</Text>
                    <Text>
                        {props.userStories
                            .map((userStory: UserStory) => userStory.name)
                            .join(",")}
                    </Text>
                </AllUserstoriesContainer>
            )}
        </React.Fragment>
    );
}

const CurrentUserStoryContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
    padding: 2rem;
    box-sizing: border-box;
    border-radius: 0.3rem;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    background-color: ${(props) => props.theme.colors.secondaryBackground};
    color: ${(props) => props.theme.colors.text};
`;

const AllUserstoriesContainer = styled.div`
    background-color: ${(props) => props.theme.colors.secondaryBackground};
    width: 80vw;
    border-radius: 0.25rem;
    padding: 2rem;
    box-sizing: border-box;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const Text = styled.p`
    margin: 0;
    color: ${(props) => props.theme.colors.text};
`;

const RoomName = styled.h3`
    margin: 0;
    color: ${(props) => props.theme.colors.text};
`;

const RoomNameAndCurrentStoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export default UserStoryContainer;
