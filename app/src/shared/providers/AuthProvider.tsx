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

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

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
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
  provider?: "google" | "dev";
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

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }

    if (u) {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(u));
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  };

  const clearSession = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  };

  const loadStorage = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

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

  const exchangeIdTokenToJwt = async (idToken: string) => {
    // api 서버에서 idToken 검증 후 JWT(access/refresh) 발급
    const jwtRes = await axios.post(`${API_SERVER_URL}/auth/mobile/google`, {
      idToken,
    });
    console.log("JWT RES DATA:", jwtRes.data);
    const { accessToken, refreshToken, user: serverUser } = jwtRes.data ?? {};

    if (!accessToken) throw new Error("Server did not return accessToken");
    console.log("serverUser : " + serverUser);

    // 서버가 user를 같이 주면 그걸 쓰고, 아니면 최소 provider만 저장
    const mergedUser: AuthUser = serverUser
      ? { ...serverUser, provider: "google" }
      : { provider: "google" };

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
        console.log("No googleConfiguredRef.current");
        console.log("GOOGLE_WEB_CLIENT_ID : " + GOOGLE_WEB_CLIENT_ID);
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
      console.log("userInfo : ", userInfo);

      // ✅ 이걸로 idToken 다시 요청 가능(가끔 signIn 결과에 없을 때가 있음)
      const tokens = await GoogleSignin.getTokens().catch(() => null);
      console.log("tokens : ", tokens);

      const idToken =
        userInfo?.idToken ||
        (tokens as any)?.idToken || // 버전에 따라 형태가 다를 수 있음
        null;

      if (!idToken)
        throw new Error("No idToken. Check webClientId / console settings.");

      await exchangeIdTokenToJwt(idToken);
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
        id: "dev-user-001",
        email: "dev@denticheck.com",
        name: "Dev User",
        picture: "https://via.placeholder.com/150",
        provider: "dev",
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
