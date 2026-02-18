/**
 * Frontend Library: Auth API Utilities
 * Path: console/src/shared/lib/authApi.ts
 * Description: JWT 토큰 관리 및 인증된 요청을 위한 유틸리티
 */

const BACKEND_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Memory storage for accessToken
let memoryToken: string | null = null;

/**
 * 전역에서 토큰을 설정하기 위한 함수 (AuthContext에서 호출)
 */
export function setMemoryToken(token: string | null) {
    memoryToken = token;
}

/**
 * AccessToken 만료시 Refreshing (HttpOnly 쿠키 방식)
 */
export async function refreshAccessToken(): Promise<string> {
    const response = await fetch(`${BACKEND_API_BASE_URL}/jwt/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 포함 필수
        body: JSON.stringify({}), // 하이브리드 지원을 위해 빈 객체 전송
    });

    if (!response.ok) {
        throw new Error("AccessToken 갱신 실패");
    }

    const data = await response.json();
    setMemoryToken(data.accessToken);
    return data.accessToken;
}

/**
 * 서버 측 로그아웃 호출
 */
export async function logout(): Promise<void> {
    try {
        await fetch(`${BACKEND_API_BASE_URL}/jwt/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({}),
        });
    } catch (error) {
        console.error("Server-side logout failed:", error);
    } finally {
        setMemoryToken(null);
        // localStorage 청소 (기존 데이터가 있을 경우 대비)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

// AccessToken과 함께 fetch
export async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
    // 메모리에 있는 AccessToken 사용
    let accessToken = memoryToken;

    // 헤더 초기화
    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // 옵션 업데이트 - credentials: "include" 추가하여 쿠키 연동
    const newOptions: FetchOptions = {
        ...options,
        headers,
        credentials: "include",
    };

    // 요청 진행
    let response = await fetch(url, newOptions);

    // AccessToken 만료로 401 뜨면, Refresh로 재발급
    if (response.status === 401) {
        try {
            accessToken = await refreshAccessToken();
            headers.set("Authorization", `Bearer ${accessToken}`);

            // 재요청
            const retryOptions: FetchOptions = {
                ...options,
                headers,
                credentials: "include",
            };
            response = await fetch(url, retryOptions);
        } catch (err) {
            setMemoryToken(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // 현재 페이지가 로그인이 필요한 페이지라면 로그인 페이지로 리디렉션
            if (!window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
        }
    }

    return response;
}
