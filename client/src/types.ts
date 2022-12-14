type User = {
    sessionId: string,
    username: string,
    state: string,
    vote?: string
}

type UserStory = {
    id? : number,
    name: string,
    content: string
}

export type {User, UserStory}