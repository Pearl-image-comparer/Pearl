import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        common: {
            black: "#000000",
            white: "#ffffff",
        },
        primary: {
            main: "#39881C",
            light: "#63B146",
            dark: "#296413",
        },
        background: {
            default: "#FAFFFF",
            paper: "#E6F0F0",
        },
        text: {
            primary: "#636731",
            secondary: "#747844",
        },
        success: {
            main: "#2e7d32",
            light: "#E1FFDA",
            dark: "#1b5e20",
        },
    },
});
