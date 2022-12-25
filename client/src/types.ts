type User = {
    sessionId: string;
    username: string;
    state: string;
    vote?: string;
    isModerator?: number;
};

type UserStory = {
    id?: number;
    name: string;
    content: string;
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

export type { User, UserStory, Theme };
