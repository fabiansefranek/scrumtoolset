type User = {
    sessionId: string,
    username: string,
    state: string
}

type UserStory = {
    id? : number,
    name: string,
    content: string
}

export type {User, UserStory}