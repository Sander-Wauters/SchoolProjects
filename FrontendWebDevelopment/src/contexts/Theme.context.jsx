import { createContext, useState, useCallback, useMemo, useContext } from "react";

export const themes = {
    dark: "dark",
    light: "light"
};

export const ThemeContext = createContext();

export function useThemeContext() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(sessionStorage.getItem("themeMode") || themes.dark);

    // Forgive me father for I have sinned.
    // Couldn't find a better way to set the background color of the entire page.
    document.body.className=`body-${theme}`;

    const toggleTheme = useCallback(() => {
        const newTheme = theme === themes.dark ? themes.light : themes.dark;
        setTheme(newTheme);
        sessionStorage.setItem("themeMode", newTheme);
    }, [theme]);

    const value = useMemo(() => ({
        theme, 
        toggleTheme 
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
