import React, {useState} from 'react';
import { UserStory } from '../types';

function PokerUserStoryContainer({ userStories, currentUserStory, userIsModerator } : { userStories : UserStory[], currentUserStory : UserStory, userIsModerator : Boolean }) {
    const [showUserStories, setShowUserStories] = useState<boolean>(false);
    return (
        <React.Fragment>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f5f5f5", width: "40vw", padding: "1rem", boxSizing: "border-box", borderRadius: "0.5rem"}}>
                <p style={{margin: 0}}>Current User Story: {currentUserStory.name}</p>
                {userIsModerator && <button onClick={() => setShowUserStories(!showUserStories)}>{(showUserStories) ? 'Hide user stories' : 'Show user stories'}</button>}
            </div>
            {showUserStories && userStories.map((userStory : UserStory) => {
                    return <li>{userStory.name}</li>
            })}
        </React.Fragment>
    );
}

export default PokerUserStoryContainer;
