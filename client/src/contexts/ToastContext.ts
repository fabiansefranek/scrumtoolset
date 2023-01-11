import { createContext } from "react";

type ToastContextType = {
    success: Function;
    error: Function;
    alert: Function;
};

export const ToastContext = createContext<ToastContextType>(
    {} as ToastContextType
);
