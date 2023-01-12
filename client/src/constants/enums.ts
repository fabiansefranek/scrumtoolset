export enum Languages {
    English = "en",
    German = "de",
}

export enum RoomStates {
    Voted = "voted",
    Voting = "voting",
    Waiting = "waiting",
    Closeable = "closeable",
}

export const votingSystems: {
    [index: string]: string[];
    fibonacci: string[];
    scrum: string[];
    tshirts: string[];
} = {
    fibonacci: [
        "?",
        "0",
        "1",
        "2",
        "3",
        "5",
        "8",
        "13",
        "21",
        "34",
        "55",
        "89",
    ],
    scrum: ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"],
    tshirts: ["?", "xs", "s", "m", "l", "xl"],
};
