import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./screens/Home";
import LuckyWheel from "./screens/LuckyWheel";
import ScrumPoker from "./screens/ScrumPoker";
import { Theme } from "./types";

type Props = {
    theme: Theme;
    setTheme: Function;
};

function App(props: Props) {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home title={"Home"} />,
        },
        {
            path: "/luckywheel",
            element: (
                <LuckyWheel
                    theme={props.theme}
                    setTheme={props.setTheme}
                    title={"Lucky Wheel"}
                />
            ),
        },
        {
            path: "/scrumpoker",
            element: (
                <ScrumPoker
                    theme={props.theme}
                    setTheme={props.setTheme}
                    title={"Scrum Poker"}
                />
            ),
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
