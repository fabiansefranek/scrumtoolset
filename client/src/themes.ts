import { Theme } from "./types"

export const light : Theme = {
    name: "hell",
    colors : {
        background: "#fff",
        secondaryBackground: "#f3f3f3",
        highlight: "#0093A3",
        highlightText: "#fff",
        secondaryHighlight: "#dadada",
        darkerHighlight: "#006f7b",
        text: "#000",
        inputBackground: "#fafafa",
        border: "#d7d7d7",
        cardBackgroundActive: "#ffffff",
        cardBackgroundInactive: "#f5f5f5"
    }
}

export const dark : Theme = {
    name: "dunkel",
    colors : {
        background : "#101010",
        secondaryBackground: "#212121",
        highlight: "#0093A3",
        highlightText: "#fff",
        secondaryHighlight: "#3d3d3d",
        darkerHighlight: "#006f7b",
        text: "#fff",
        inputBackground: "#373737",
        border: "#343434",
        cardBackgroundActive: "#3d3d3d",
        cardBackgroundInactive: "#373737"
    }
}

export const themes : Theme[] = [light,dark];