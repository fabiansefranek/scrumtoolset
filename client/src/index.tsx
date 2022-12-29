import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { ProviderWrapper } from "./providers/ProviderWrapper";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(<ProviderWrapper />);
