import React from 'react';

function PokerProfilePicture({ username } : { username : string }) {
    return (
        <p style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#0093A3", color: "white", width: "40px", height: "40px", borderRadius: "50%", margin: "0", userSelect: "none", textTransform: "capitalize"}}>{username.charAt(0)}</p>
    );
}

export default PokerProfilePicture;
