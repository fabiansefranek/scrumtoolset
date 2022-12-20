type User = {
    sessionId : string,
    username : string,
    createdAt : number,
    roomId : string,
    isModerator : boolean,
    state : string,
    vote : string
};

type Room = {
    id : string,
    displayName : string,
    state : string,
    createdAt : number,
    votingSystem : string,
    currentUserStory : number,
    theme : string
};

type UserStory = {
    id : number,
    name : string,
    content : string,
    roomId : string
};

type RoomCreationOptionsPayload = {
    votingSystem: string,
    userStories: UserStory[],
    theme : string
};

type RoomCreationBasePayload = {
    roomName : string,
    username : string
};

type RoomCreationPayload = {
    options : RoomCreationOptionsPayload,
    base : RoomCreationBasePayload
}