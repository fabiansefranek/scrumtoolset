import {Socket} from "socket.io";
import {setVotingSystem, addUserstories} from "./room";

export function start(options : any, socket : Socket) {
    const votingSystem : string = options.votingSystem;
    const userStories : any[] = options.userStories;

    setVotingSystem(votingSystem, socket);
    addUserstories(userStories, socket);
}