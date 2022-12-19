import { User } from '../types';
import PokerUser from './PokerUser';
import styled from 'styled-components';

function PokerUserContainer({ userList, roomState } : { userList : User[], roomState : string }) {
    return ( 
        <Container>
            <Text>Punkte</Text>
            <Users>
                {userList.map((user : User) => {
                    return <PokerUser key={user.sessionId} user={user} roomState={roomState} />
                })}
            </Users>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 35%;
    max-height: 100%;
    overflow: hidden;
`;

const Text = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.text}
`;

const Users = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: hidden;
    max-height: 100%;
`;

export default PokerUserContainer;