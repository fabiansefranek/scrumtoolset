import React, {useState} from 'react';
import { UserStory } from '../types';

function PokerUserStoryContainer({ userStories, currentUserStory } : { userStories : UserStory[], currentUserStory : UserStory }) {
    const [showUserStories, setShowUserStories] = useState<boolean>(false);
    return (
        <React.Fragment>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between",  width: "500px"}}>
                <p style={{margin: 0}}>Current User Story: {currentUserStory.name}</p>
                <button onClick={() => setShowUserStories(!showUserStories)}>{(showUserStories) ? 'Hide user stories' : 'Show user stories'}</button>
            </div>
            {showUserStories && userStories.map((userStory : UserStory) => {
                    return <li>{userStory.name}</li>
            })}
        </React.Fragment>
    );
}

export default PokerUserStoryContainer;
