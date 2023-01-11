import { useEffect, useState, ReactNode } from "react";
import { Languages } from "../constants/enums";
import { LanguageContext } from "../contexts/LanguageContext";
import { LanguageObject } from "../types";
import languageStrings from "../constants/languageStrings";

type LanguageProviderProps = {
    children: ReactNode;
};

function getPreferredLanguage(): Languages {
    for (const language of Object.values(Languages)) {
        if (navigator.language.slice(0, 2) === language) {
            return language;
        }
    }
    return Languages.English;
}

export function LanguageProvider(props: LanguageProviderProps) {
    const [language, setLanguage] = useState<Languages>(getPreferredLanguage());
    const [strings, setStrings] = useState<LanguageObject>(
        languageStrings[language]
    );

    useEffect(() => {
        setStrings(languageStrings[language]);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, strings }}>
            {props.children}
        </LanguageContext.Provider>
    );
}
