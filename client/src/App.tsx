import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
            element: <div>Home</div>,
        },
        {
            path: "/luckywheel",
            element: <div>Lucky Wheel</div>,
        },
        {
            path: "/scrumpoker",
            element: (
                <ScrumPoker theme={props.theme} setTheme={props.setTheme} />
            ),
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
