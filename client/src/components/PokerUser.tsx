import { useEffect } from "react";
import { User } from "../types";
import PokerProfilePicture from "./PokerProfilePicture";

function PokerUser({ user, roomState } : { user : User, roomState : string }) {
    return(
        <div key={user.sessionId} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem"}}>
                <PokerProfilePicture username={user.username} />
                <p style={{margin: "0", textTransform: "capitalize"}}>{user.username}</p>
            </div>
            
            <p style={{margin: 0, textTransform: "capitalize"}}>{(roomState === "voting") ? user.state : user.vote} </p>
        </div>
    )
}

export default PokerUser;