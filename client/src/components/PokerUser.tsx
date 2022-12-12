import { User } from "../types";
import PokerProfilePicture from "./PokerProfilePicture";

function PokerUser({ user } : { user : User }) {
    return(
        <div key={user.sessionId} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "200px"}}>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem"}}>
                <PokerProfilePicture username={user.username} />
                <p style={{margin: "0", textTransform: "capitalize"}}>{user.username}</p>
            </div>
            
            <p style={{margin: 0, textTransform: "capitalize"}}>{user.state}</p>
        </div>
    )
}

export default PokerUser;