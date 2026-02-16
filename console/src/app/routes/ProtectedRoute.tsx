import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

/**
 * [관리자 기능] 인증 여부를 확인하여 보호된 라우트에 접근을 제어하는 컴포넌트
 */
export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // 인증 초기화 중일 때는 로딩 표시 (필요시 전용 Spinner 컴포넌트 사용 가능)
        return <div className="flex items-center justify-center p-10">Loading...</div>;
    }

    if (!isAuthenticated) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        return <Navigate to="/login" replace />;
    }

    // 토큰이 있으면 자식 라우트(Outlet) 또는 children 렌더링
    return <Outlet />;
}
