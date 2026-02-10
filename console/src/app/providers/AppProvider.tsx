import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

interface AppProviderProps {
    children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <BrowserRouter>
            {/* Add other providers here (Theme, QueryClient, Auth, etc.) */}
            {children}
        </BrowserRouter>
    )
}
