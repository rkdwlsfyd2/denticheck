import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { AlertProvider } from "@/shared/context/AlertContext";
import { LanguageProvider } from "@/features/dashboard/context/LanguageContext";

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <BrowserRouter>
            <LanguageProvider>
                <AlertProvider>
                    {/* Add other providers here (Theme, QueryClient, Auth, etc.) */}
                    {children}
                </AlertProvider>
            </LanguageProvider>
        </BrowserRouter>
    );
}
