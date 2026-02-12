import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import axios from "axios";

const API_SERVER_URL = process.env.EXPO_PUBLIC_API_SERVER_URL;
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
// iOS까지 Dev Build로 네이티브 Sign-In 할 거면 보통 iosClientId도 필요할 수 있어(선택)
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

if (!API_SERVER_URL) throw new Error("EXPO_PUBLIC_API_SERVER_URL is missing");
if (!GOOGLE_WEB_CLIENT_ID)
  throw new Error("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is missing");

// Expo Go 여부 (deprecated appOwnership 대신)
const isExpoGo = Constants.executionEnvironment === "storeClient";

export interface AuthUser {
  email?: string;
  name?: string;
  picture?: string;
}

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInDev: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const googleConfiguredRef = useRef(false);

  const saveSession = async (
    accessToken: string,
    refreshToken?: string,
    u?: AuthUser,
  ) => {
    setToken(accessToken);
    if (u) setUser(u);

    await SecureStore.setItemAsync("accessToken", accessToken);

    if (refreshToken) {
      await SecureStore.setItemAsync("refreshToken", refreshToken);
    } else {
      await SecureStore.deleteItemAsync("refreshToken");
    }

    if (u) {
      await SecureStore.setItemAsync("user", JSON.stringify(u));
    } else {
      await SecureStore.deleteItemAsync("user");
    }
  };

  const clearSession = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
  };

  const loadStorage = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      const storedUser = await SecureStore.getItemAsync("user");

      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Failed to load auth storage:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const exchangeIdTokenToJwt = async (idToken: string, user: AuthUser) => {
    // api 서버에서 idToken 검증 후 JWT(access/refresh) 발급
    const jwtRes = await axios.post(`${API_SERVER_URL}/auth/mobile/google`, {
      idToken,
    });
    console.log("JWT RES DATA:", jwtRes.data);
    const { accessToken, refreshToken } = jwtRes.data ?? {};

    if (!accessToken) throw new Error("Server did not return accessToken");
    console.log("serverUser : ", user);

    // 서버가 user를 같이 주면 그걸 쓰고, 아니면 최소 provider만 저장
    const mergedUser: AuthUser = user;

    await saveSession(accessToken, refreshToken, mergedUser);
  };

  const signInWithGoogle = async () => {
    if (isLoading) return; // ✅ 연타 방지 + 로딩 시작
    setIsLoading(true);
    setError(null);

    try {
      // Dev Build에서만 동작하도록 동적 import
      const mod = await import("@react-native-google-signin/google-signin");
      const { GoogleSignin, statusCodes } = mod;

      if (!googleConfiguredRef.current) {
        GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
          offlineAccess: false,
        });
        googleConfiguredRef.current = true;
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const user: AuthUser = {
        email: userInfo.data?.user.email,
        name: userInfo.data?.user.name,
        picture: userInfo.data?.user.photo,
      };

      // ✅ 이걸로 idToken 다시 요청 가능(가끔 signIn 결과에 없을 때가 있음)
      const tokens = await GoogleSignin.getTokens().catch(() => null);

      const idToken =
        userInfo?.idToken ||
        (tokens as any)?.idToken || // 버전에 따라 형태가 다를 수 있음
        null;

      if (!idToken)
        throw new Error("No idToken. Check webClientId / console settings.");

      await exchangeIdTokenToJwt(idToken, user);
    } catch (e: any) {
      try {
        const mod = await import("@react-native-google-signin/google-signin");
        const { statusCodes } = mod;

        if (e?.code === statusCodes.IN_PROGRESS) return; // ✅ 진행 중이면 무시
        if (e?.code === statusCodes.SIGN_IN_CANCELLED) return;
      } catch {}

      setError(e?.message ?? String(e));
      console.log("Google Sign-In failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInDev = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const mockUser: AuthUser = {
        email: "dev@denticheck.com",
        name: "Dev User",
        picture: "https://via.placeholder.com/150",
      };
      const mockAccessToken = "dev-access-token";
      const mockRefreshToken = "dev-refresh-token";

      await saveSession(mockAccessToken, mockRefreshToken, mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // Dev Build에서만 Google 로그아웃 시도
      if (!isExpoGo) {
        try {
          const mod = await import("@react-native-google-signin/google-signin");
          await mod.GoogleSignin.signOut();
        } catch {
          // 구글 모듈 로그아웃 실패는 무시하고 세션만 정리
        }
      }
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, { ...options, headers });
  };

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      error,
      signInWithGoogle,
      signInDev,
      signOut,
      fetchWithAuth,
    }),
    [user, token, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
