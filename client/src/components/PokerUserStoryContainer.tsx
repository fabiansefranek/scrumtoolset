import React from 'react';

function PokerUserStoryContainer({ userStory } : { userStory : string }) {
    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between",  width: "500px"}}>
            <p style={{margin: 0}}>{userStory}</p>
            <button>All user stories</button>
        </div>
    );
}

export default PokerUserStoryContainer;
