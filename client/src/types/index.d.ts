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

export type { User, UserStory, Theme, ToastType };
