import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { light } from "./constants/themes";
import { LanguageProvider } from "./providers/LanguageProvider";
import { ToastProvider } from "./providers/ToastProvider";
import Home from "./screens/Home";
import LuckyWheel from "./screens/LuckyWheel";
import ScrumPoker from "./screens/ScrumPoker";
import { Theme } from "./types";

function App() {
    const [theme, setTheme] = useState<Theme>(light);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home title={"Home"} setTheme={setTheme} />,
        },
        {
            path: "/luckywheel",
            element: (
                <LuckyWheel
                    theme={theme}
                    setTheme={setTheme}
                    title={"Lucky Wheel"}
                />
            ),
        },
        {
            path: "/scrumpoker",
            element: (
                <ScrumPoker
                    theme={theme}
                    setTheme={setTheme}
                    title={"Scrum Poker"}
                />
            ),
        },
    ]);

    return (
        <ThemeProvider theme={theme}>
            <ToastProvider>
                <LanguageProvider>
                    <RouterProvider router={router} />
                </LanguageProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
