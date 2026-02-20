import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { refreshAccessToken, setMemoryToken } from "@/shared/lib/authApi";

interface AuthContextType {
    accessToken: string | null;
    saveToken: (token: string) => void;
    clearToken: () => void;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Module-level variable to persist across StrictMode remounts
let globalRefreshPromise: Promise<string> | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const saveToken = useCallback((token: string) => {
        setAccessToken(token);
        setMemoryToken(token);
    }, []);

    const clearToken = useCallback(() => {
        setAccessToken(null);
        setMemoryToken(null);
    }, []);

    // Initial check (Silent Refresh)
    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            // 로그인 페이지에서는 리프레시 시도 건너뛰기 (사용자 요청: 불필요한 API 호출/에러 방지)
            if (window.location.pathname.startsWith("/login")) {
                console.log("Skipping silent refresh on login page.");
                if (isMounted) {
                    setIsInitialized(true);
                    setIsLoading(false);
                }
                return;
            }
            // 이미 다른 곳에서 refresh가 진행 중이면 그 결과를 기다림
            if (globalRefreshPromise) {
                try {
                    const token = await globalRefreshPromise;
                    if (isMounted) setAccessToken(token);
                } catch (e) {
                    // 무시 (메인 요청에서 처리됨)
                } finally {
                    if (isMounted) {
                        setIsInitialized(true);
                        setIsLoading(false);
                    }
                }
                return;
            }

            try {
                // 이미 진행 중인 Promise가 있다면 그것을 기다리고, 없으면 새로 시작하여 캐싱
                const currentPromise = globalRefreshPromise
                    ? globalRefreshPromise
                    : (globalRefreshPromise = refreshAccessToken());

                const token = await currentPromise;

                if (isMounted) {
                    setAccessToken(token);
                }
            } catch (error) {
                console.log("Silent refresh failed or no session exists.");
                if (isMounted) clearToken();
            } finally {
                // 주의: StrictMode 등으로 인해 먼저 unmount된 인스턴스는 상태를 변경하지 않음
                // 나중에 mount되어 살아있는 인스턴스만 초기화 완료 처리를 수행

                // Request finished, clear the global promise reference
                globalRefreshPromise = null;

                if (isMounted) {
                    setIsInitialized(true);
                    setIsLoading(false);
                }
            }
        };

        initAuth();
        return () => {
            isMounted = false;
        };
    }, [clearToken]);

    const value = {
        accessToken,
        saveToken,
        clearToken,
        isAuthenticated: !!accessToken,
        isInitialized,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
