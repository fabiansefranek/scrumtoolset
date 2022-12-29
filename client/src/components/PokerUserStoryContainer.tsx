import React, { useState } from "react";
import { UserStory } from "../types";
import styled from "styled-components";
import { Button } from "./Button";

type Props = {
    userStories: UserStory[];
    currentUserStory: UserStory;
    userIsModerator: Boolean;
};

function PokerUserStoryContainer(props: Props) {
    const [showUserStories, setShowUserStories] = useState<boolean>(false);
    return (
        <React.Fragment>
            <CurrentUserStoryContainer>
                <Text>{props.currentUserStory.name}</Text>
                {props.userIsModerator && (
                    <Button
                        onClick={() => setShowUserStories(!showUserStories)}
                    >
                        {showUserStories
                            ? "Userstories verstecken"
                            : "Userstories anzeigen"}
                    </Button>
                )}
            </CurrentUserStoryContainer>
            {showUserStories && (
                <AllUserstoriesContainer>
                    <Text>Alle Userstories</Text>
                    <Text>
                        {props.userStories.map(
                            (userStory: UserStory) => userStory.name + ","
                        )}
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
    border-radius: 0.25rem;
    background-color: ${(props) => props.theme.colors.secondaryBackground};
    color: ${(props) => props.theme.colors.text};
`;

const AllUserstoriesContainer = styled.div`
    background-color: ${(props) => props.theme.colors.secondaryBackground};
    width: 80vw;
    border-radius: 0.25rem;
    padding: 2rem;
    box-sizing: border-box;
`;

const Text = styled.p`
    margin: 0;
    color: ${(props) => props.theme.colors.text};
`;

export default PokerUserStoryContainer;
