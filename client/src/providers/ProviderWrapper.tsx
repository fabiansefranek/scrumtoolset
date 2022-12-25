import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { light } from "../themes";
import { Theme } from "../types";
import { ToastProvider } from "./ToastProvider";
import App from "../App";

export function ProviderWrapper() {
    const [theme, setTheme] = useState<Theme>(light);
    return (
        <ThemeProvider theme={theme}>
            <ToastProvider>
                <App theme={theme} setTheme={setTheme} />
            </ToastProvider>
        </ThemeProvider>
    );
}
