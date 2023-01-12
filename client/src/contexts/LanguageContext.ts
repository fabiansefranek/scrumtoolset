import { createContext } from "react";
import { LanguageObject } from "../types";

type LanguageContextType = {
    language: string;
    setLanguage: Function;
    strings: LanguageObject;
};

export const LanguageContext = createContext<LanguageContextType>(
    {} as LanguageContextType
);
