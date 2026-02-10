import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

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
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/graphql', '') || 'http://localhost:8080';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorage();
        // Web Client ID (Backend Server Client ID)
        GoogleSignin.configure({
            webClientId: '1021358190527-5pvv06ji3j626itofgsndt8cvf4q6nal.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        });
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
        setIsLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;

            if (!idToken) {
                throw new Error('No ID Token found');
            }

            // Send ID Token to Backend
            console.log('Sending ID Token to:', `${API_URL}/auth/mobile/google`);
            const response = await axios.post(`${API_URL}/auth/mobile/google`, { idToken });

            const { accessToken, refreshToken } = response.data;

            // TODO: Decode JWT to get user info or fetch /me endpoint
            // For now, use info from Google SDK
            const user: User = {
                id: userInfo.data.user.id,
                email: userInfo.data.user.email,
                name: userInfo.data.user.name || 'User',
                photoUrl: userInfo.data.user.photo || undefined,
            };

            await handleLoginSuccess(user, accessToken);

        } catch (error) {
            console.error('Google Sign-In failed', error);
            alert('구글 로그인 실패: ' + JSON.stringify(error));
        } finally {
            setIsLoading(false);
        }
    };

    const signInDev = async () => {
        const mockUser: User = {
            id: 'dev-user-001',
            email: 'dev@denticheck.com',
            name: 'Dev User',
            photoUrl: 'https://via.placeholder.com/150',
        };
        const mockToken = 'dev-token-xyz-123';
        await handleLoginSuccess(mockUser, mockToken);
    };

    const handleLoginSuccess = async (user: User, token: string) => {
        setToken(token);
        setUser(user);
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
        } catch (e) {
            console.log('Google signOut error', e);
        }
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
