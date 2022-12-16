import React, {useState} from 'react';
import { UserStory } from '../types';
import styled from 'styled-components';

function PokerUserStoryContainer({ userStories, currentUserStory, userIsModerator } : { userStories : UserStory[], currentUserStory : UserStory, userIsModerator : Boolean }) {
    const [showUserStories, setShowUserStories] = useState<boolean>(false);
    return (
        <React.Fragment>
            <CurrentUserStoryContainer>
                <Text>{currentUserStory.name}</Text>
                {userIsModerator && 
                    <Button onClick={() => setShowUserStories(!showUserStories)}>
                        {(showUserStories) ? 'Userstories verstecken' : 'Userstories anzeigen'}
                    </Button>
                }
            </CurrentUserStoryContainer>
                {showUserStories && 
		            <AllUserstoriesContainer>
                        <Text>Alle Userstories</Text>
			            <List>{userStories.map((userStory : UserStory) => {
                    		return <li key={userStory.id}>{userStory.name}</li>
                        })}
			            </List>
		            </AllUserstoriesContainer>
	            }
        </React.Fragment>
    );
}

const CurrentUserStoryContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    width: 40vw;
    padding: 2rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
`;

const AllUserstoriesContainer = styled.div`
    background-color: #f5f5f5;
    width: 40vw;
    border-radius: 0.5rem;
    padding: 2rem;
    box-sizing: border-box;
`;

const Text = styled.p`
    margin: 0;
`;

const Button = styled.button`
  padding: 0.5rem;  
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
`;

export default PokerUserStoryContainer;
