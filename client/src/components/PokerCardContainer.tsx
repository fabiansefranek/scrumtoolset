import React from 'react';
import PokerCard from './PokerCard';

function PokerCardContainer({ cards } : { cards : string[] }) {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            <p style={{margin: 0}}>Cards</p>
            <div style={{display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>
                {cards.map((card : string) => {
                    return <PokerCard key={card} text={card} active={false}/>
                })}
            </div>
        </div>
    );
}

export default PokerCardContainer;