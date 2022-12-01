import {enterRoom, leaveRoom} from './room';
import {pool} from './db';

export function join(payload : any) {

}

export function joinAndCreate(payload : any) {
    join(payload);
}