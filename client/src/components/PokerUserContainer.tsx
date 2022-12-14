import React, { useEffect } from 'react';
import { User } from '../types';
import PokerUser from './PokerUser';

function PokerUserContainer({ userList, roomState } : { userList : User[], roomState : string }) {
    return ( 
        <div style={{display: "flex", flexDirection: "column", gap: "1rem", width: "15vw", maxHeight: "100%", overflow: "hidden"}}>
            <p style={{margin: 0}}>Votes</p>
            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "hidden", maxHeight: "100%"}}>
                {userList.map((user : User) => {
                    return <PokerUser key={user.sessionId} user={user} roomState={roomState} />
                })}
            </div>
        </div>
    );
}

export default PokerUserContainer;