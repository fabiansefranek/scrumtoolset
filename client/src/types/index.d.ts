import { StringMappingType } from "typescript";

declare global {
    interface String {
        capitalize(): string;
    }
}

type User = {
    sessionId: string;
    username: string;
    createdAt?: number;
    roomId?: string;
    isModerator?: number;
    state: string;
    vote?: string;
};

type UserStory = {
    id?: number;
    name: string;
    content: string;
    roomId?: string;
};

type Theme = {
    name: string;
    colors: {
        background: string;
        secondaryBackground: string;
        highlight: string;
        highlightText: string;
        secondaryHighlight: string;
        darkerHighlight: string;
        text: string;
        inputBackground: string;
        border: string;
        cardBackgroundActive: string;
        cardBackgroundInactive: string;
    };
};

type ToastType = {
    id: number;
    message: string;
    type: string;
    onClick?: Function;
};

type ErrorObject = {
    message: string;
    stack: string;
};

type LanguageObject = {
    cards: string;
    points: string;
    votes: string;
    join_room: string;
    create_room: string;
    username: string;
    all_userstories: string;
    roomState: {
        voting: string;
    };
    userState: {
        [index: string]: string;
        not_voted: string;
        voted: string;
    };
    buttons: {
        reveal_votes: string;
        leave_room: string;
        close_room: string;
        show_userstories: string;
        hide_userstories: string;
        join: string;
        create: string;
        next_round: string;
        start_round: string;
    };
    room: {
        name: string;
        code: string;
    };
    theme: {
        [index: string]: string;
        dark: string;
        light: string;
    };
};

type LanguageStringsType = {
    en: LanguageObject;
    de: LanguageObject;
};

export type {
    User,
    UserStory,
    Theme,
    ToastType,
    ErrorObject,
    LanguageObject,
    LanguageStringsType,
};
