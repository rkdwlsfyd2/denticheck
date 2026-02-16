import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { AlertProvider } from "@/shared/context/AlertContext";
import { LanguageProvider } from "@/features/dashboard/context/LanguageContext";

import { AuthProvider } from "@/features/auth/context/AuthContext";

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <BrowserRouter>
            <LanguageProvider>
                <AlertProvider>
                    <AuthProvider>{children}</AuthProvider>
                </AlertProvider>
            </LanguageProvider>
        </BrowserRouter>
    );
}
