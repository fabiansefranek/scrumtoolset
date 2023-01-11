import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { light } from "../constants/themes";
import { Theme } from "../types";
import { ToastProvider } from "./ToastProvider";
import App from "../App";
import { LanguageProvider } from "./LanguageProvider";

export function ProviderWrapper() {
    const [theme, setTheme] = useState<Theme>(light);
    return (
        <ThemeProvider theme={theme}>
            <ToastProvider>
                <LanguageProvider>
                    <App theme={theme} setTheme={setTheme} />
                </LanguageProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
