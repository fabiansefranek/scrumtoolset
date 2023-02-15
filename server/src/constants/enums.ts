export enum RoomStates {
    WAITING = "waiting",
    VOTING = "voting",
    CLOSEABLE = "closeable",
}

export enum VotingStates {
    VOTED = "voted",
    VOTING = "voting",
}

export enum ApplicationErrorMessages {
    USER_NAME_INVALID = "user_name_invalid",
    ROOM_NAME_INVALID = "room_name_invalid",
    MISSING_USERSTORY = "missing_userstory",
    REVOTE_STARTED = "revote_started",
    ROOM_NOT_FOUND = "room_not_found",
    NO_MODERATOR = "no_moderator"
}
