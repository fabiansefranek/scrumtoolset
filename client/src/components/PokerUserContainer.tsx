import React, { useEffect } from 'react';
import { User } from '../types';
import PokerUser from './PokerUser';

function PokerUserContainer({ userList, roomState } : { userList : User[], roomState : string }) {
    return ( 
        <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            <p style={{margin: 0}}>Votes</p>
            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "100px", overflowY: "scroll", padding: "0 1rem 0 1rem"}}>
                {userList.map((user : User) => {
                    return <PokerUser key={user.sessionId} user={user} roomState={roomState} />
                })}
            </div>
        </div>
    );
}

export default PokerUserContainer;