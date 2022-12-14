import React, {useState} from 'react';
import { UserStory } from '../types';

function PokerUserStoryContainer({ userStories, currentUserStory, userIsModerator } : { userStories : UserStory[], currentUserStory : UserStory, userIsModerator : Boolean }) {
    const [showUserStories, setShowUserStories] = useState<boolean>(false);
    return (
        <React.Fragment>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f5f5f5", width: "40vw", padding: "2rem", boxSizing: "border-box", borderRadius: "0.5rem"}}>
                <p style={{margin: 0}}>{currentUserStory.name}</p>
                {userIsModerator && <button style={{padding: "0.5rem"}}  onClick={() => setShowUserStories(!showUserStories)}>{(showUserStories) ? 'Userstories verstecken' : 'Userstories anzeigen'}</button>}
            </div>
            {showUserStories && 
		<div style={{backgroundColor: "#f5f5f5", width: "40vw", borderRadius: "0.5rem"}}>
			<ul style={{listStyle: "none"}}>{
				userStories.map((userStory : UserStory) => {
                    			return <li>{userStory.name}</li>
            			})}
			</ul>
		</div>
	    }
        </React.Fragment>
    );
}

export default PokerUserStoryContainer;
