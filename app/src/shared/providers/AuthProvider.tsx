import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
    id: string;
    email: string;
    name: string;
    photoUrl?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInDev: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorage();
    }, []);

    const loadStorage = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
            const storedUser = await SecureStore.getItemAsync(USER_KEY);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load auth storage', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        console.log('Google Sign-In logic will be implemented here');
        // TODO: Implement Native Google Sign-In
        // 1. Get idToken from Google SDK
        // 2. Send idToken to backend
        // 3. Receive access/refresh tokens and user info
        // 4. Save to state and SecureStore
    };

    const signInDev = async () => {
        const mockUser: User = {
            id: 'dev-user-001',
            email: 'dev@denticheck.com',
            name: 'Dev User',
            photoUrl: 'https://via.placeholder.com/150',
        };
        const mockToken = 'dev-token-xyz-123';

        setToken(mockToken);
        setUser(mockUser);

        await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));
    };

    const signOut = async () => {
        setToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                signInWithGoogle,
                signInDev,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
