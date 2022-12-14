import React from 'react';

function deriveHeight(width: number) {
    return (width/2)*3;
}

function PokerCard({ text, active, sendVote } : { text : string, active : boolean, sendVote : Function }) {
    const width : number = 50;
    const height : number = deriveHeight(width); 
    return (
        <div onClick={() => {active && sendVote(text)}} style={{width: `${width}px`, height: `${height}px`, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: active ? "white" : "#F6F6F6", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", borderRadius: "0.5rem", cursor: active ? "pointer" : "not-allowed", userSelect: "none"}}>
            <p style={{margin: "0"}}>{text}</p>
        </div>
    );
}

export default PokerCard;