import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ColorTheme, ThemeName } from '../theme/themeConfig';

type ThemeContextType = {
    currentThemeName: ThemeName;
    theme: ColorTheme;
    setTheme: (theme: ThemeName) => void;
    themes: Record<string, ColorTheme>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'user_theme_preference';

export function ColorThemeProvider({ children }: { children: ReactNode }) {
    const [currentThemeName, setCurrentThemeName] = useState<ThemeName>('ocean');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && themes[savedTheme]) {
                setCurrentThemeName(savedTheme as ThemeName);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const setTheme = async (themeName: ThemeName) => {
        if (themes[themeName]) {
            setCurrentThemeName(themeName);
            try {
                await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
            } catch (error) {
                console.error('Failed to save theme:', error);
            }
        }
    };

    const theme = themes[currentThemeName];

    return (
        <ThemeContext.Provider value={{ currentThemeName, theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useColorTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useColorTheme must be used within ColorThemeProvider');
    }
    return context;
}
