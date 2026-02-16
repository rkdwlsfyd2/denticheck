/**
 * Frontend Context: Language Provider
 * Path: console/src/features/dashboard/context/LanguageContext.tsx
 * Description: [관리자 기능] 다국어(KO/EN) 지원 컨텍스트
 * - 전역 언어 상태 관리 및 번역 함수(t) 제공
 */
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "ko" | "en";

interface LanguageContextType {
    lang: Language;
    toggleLang: () => void;
    t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>("ko");

    const toggleLang = () => {
        setLang((prev) => (prev === "ko" ? "en" : "ko"));
    };

    const translations: Record<string, Record<Language, string>> = {
        // Auth & Status
        PENDING: { ko: "대기", en: "Pending" },
        OPEN: { ko: "처리중", en: "In Progress" },
        ANSWERED: { ko: "완료", en: "Completed" },
        RESOLVED: { ko: "해결됨", en: "Resolved" },
        CLOSED: { ko: "종료", en: "Closed" },
        ADMIN: { ko: "관리자", en: "Admin" },
        USER: { ko: "일반", en: "User" },
        ACTIVE: { ko: "활성", en: "Active" },
        SUSPENDED: { ko: "정지", en: "Suspended" },
        Partner: { ko: "제휴", en: "Partner" },

        // Layout & Navigation & Shared
        admin_system: { ko: "관리자 시스템", en: "Admin System" },
        menu_dashboard: { ko: "대시보드", en: "Dashboard" },
        menu_users: { ko: "회원 관리", en: "User Management" },
        menu_dentists: { ko: "제휴 치과 관리", en: "Dentist Management" },
        menu_products: { ko: "제휴 상품 관리", en: "Product Management" },
        menu_insurances: { ko: "제휴 보험 상품 관리", en: "Insurance Management" },
        btn_logout: { ko: "로그아웃", en: "Logout" },
        placeholder_search: { ko: "검색어를 입력하세요...", en: "Search..." },
        lang_ko: { ko: "한국어", en: "Korean" },
        lang_en: { ko: "English", en: "English" },

        // Page Descriptions
        desc_users: {
            ko: "회원 정보를 관리하고 계정 상태를 확인하세요",
            en: "Manage user information and account status.",
        },
        desc_dentists: {
            ko: "제휴 치과 정보와 광고 노출을 관리하세요",
            en: "Manage partner dentists and ad exposure.",
        },
        desc_products: {
            ko: "제휴 상품 정보와 광고 노출을 관리하세요",
            en: "Manage partner products and ad exposure.",
        },
        desc_insurances: {
            ko: "제휴 보험 상품 정보와 광고 노출을 관리하세요",
            en: "Manage insurance products and ad exposure.",
        },

        // Common Buttons
        btn_search: { ko: "검색", en: "Search" },
        btn_save: { ko: "저장", en: "Save" },
        btn_saving: { ko: "저장 중...", en: "Saving..." },
        btn_cancel: { ko: "취소", en: "Cancel" },
        btn_edit: { ko: "수정", en: "Edit" },
        btn_delete: { ko: "삭제", en: "Delete" },
        btn_activate: { ko: "활성화", en: "Activate" },
        btn_suspend: { ko: "정지", en: "Suspend" },
        btn_file_attach: { ko: "파일 첨부", en: "Attach File" },
        btn_partner_on: { ko: "제휴 설정", en: "Set Partner" },
        btn_partner_off: { ko: "제휴 해제", en: "Unset Partner" },
        btn_add_dentist: { ko: "+ 치과 추가", en: "+ Add Dentist" },
        btn_add_product: { ko: "+ 상품 추가", en: "+ Add Product" },
        btn_add_insurance: { ko: "+ 보험 상품 추가", en: "+ Add Insurance" },

        // Table Headers
        th_id: { ko: "ID", en: "ID" },
        th_nickname: { ko: "닉네임", en: "Nickname" },
        th_email: { ko: "이메일", en: "Email" },
        th_role: { ko: "권한", en: "Role" },
        th_status: { ko: "상태", en: "Status" },
        th_created_at: { ko: "가입일", en: "Joined At" },
        th_action: { ko: "관리", en: "Action" },
        th_hospital_name: { ko: "병원명", en: "Hospital Name" },
        th_address: { ko: "주소", en: "Address" },
        th_phone: { ko: "전화번호", en: "Phone" },
        th_partner: { ko: "제휴여부", en: "Partner" },
        th_category: { ko: "카테고리", en: "Category" },
        th_product_name: { ko: "제품명", en: "Product Name" },
        th_manufacturer: { ko: "제조사", en: "Manufacturer" },
        th_company: { ko: "보험사", en: "Company" },
        th_price: { ko: "가격", en: "Price" },

        // Filters
        filter_all: { ko: "전체", en: "All" },
        filter_name: { ko: "명칭", en: "Name" },
        filter_address: { ko: "주소", en: "Address" },
        filter_email: { ko: "이메일", en: "Email" },
        filter_nickname: { ko: "닉네임", en: "Nickname" },

        // Categories
        cat_toothbrush: { ko: "칫솔류", en: "Toothbrushes" },
        cat_paste: { ko: "치약 및 세정제", en: "Toothpaste & Cleaners" },
        cat_interdental: { ko: "치간, 혀 및 구강", en: "Interdental & Oral" },
        cat_special: { ko: "특수케어", en: "Special Care" },
        cat_etc: { ko: "기타", en: "Etc" },
        cat_insurance_dental: { ko: "치아보험", en: "Dental" },
        cat_insurance_total: { ko: "종합보험", en: "Total" },
        cat_insurance_actual: { ko: "실비보험", en: "Actual Exp" },
        cat_insurance_child: { ko: "어린이보험", en: "Child" },

        // Status Labels
        status_partnered: { ko: "제휴", en: "Partner" },
        status_unpartnered: { ko: "미제휴", en: "Unpartnered" },

        // Messages & Alerts
        hello_user: { ko: "안녕하세요, {name}님", en: "Hello, {name}" },
        msg_save_success: { ko: "저장되었습니다.", en: "Saved successfully." },
        msg_save_fail: { ko: "저장에 실패했습니다.", en: "Failed to save." },
        msg_delete_success: { ko: "삭제되었습니다.", en: "Deleted successfully." },
        msg_delete_fail: { ko: "삭제에 실패했습니다.", en: "Failed to delete." },
        msg_status_changed: { ko: "상태가 변경되었습니다.", en: "Status has been changed." },
        msg_status_fail: { ko: "상태 변경에 실패했습니다.", en: "Failed to change status." },
        msg_confirm_delete: {
            ko: "'{name}'을(를) 정말로 삭제하시겠습니까?",
            en: "Are you sure you want to delete '{name}'?",
        },
        msg_confirm_status: {
            ko: "정말로 '{name}' 상태를 {status}(으)로 변경하시겠습니까?",
            en: "Are you sure you want to change the status of '{name}' to {status}?",
        },
        title_success: { ko: "성공", en: "Success" },
        title_error: { ko: "오류", en: "Error" },
        title_notice: { ko: "알림", en: "Notice" },
        title_confirm: { ko: "확인", en: "Confirm" },
        no_dentists: { ko: "등록된 제휴 치과가 없습니다.", en: "No dentists found." },
        no_products: { ko: "등록된 제휴 상품이 없습니다.", en: "No products found." },
        no_insurances: { ko: "등록된 제휴 보험이 없습니다.", en: "No insurance products found." },
        no_users: { ko: "가입된 회원이 없습니다.", en: "No users found." },
        no_inquiries: { ko: "최근 문의 내역이 없습니다.", en: "No recent inquiries found." },

        // Dashboard Specific
        stat_total_users: { ko: "총 이용자", en: "Total Users" },
        stat_partner_dentists: { ko: "제휴 치과", en: "Partner Dentists" },
        stat_new_inquiries: { ko: "신규 문의", en: "New Inquiries" },
        stat_recent_usage: { ko: "최근 이용", en: "Recent Usage" },
        daily_usage_title: { ko: "일일 이용자 현황", en: "Daily User Trends" },
        weekly_usage_title: { ko: "주간 이용자 현황", en: "Weekly User Trends" },
        recent_inquiries_title: { ko: "최근 문의 현황", en: "Recent Inquiries" },
        th_user: { ko: "사용자", en: "User" },
        th_title: { ko: "제목", en: "Title" },
        th_date: { ko: "날짜", en: "Date" },

        // Login Page
        login_title: { ko: "DentiCheck 관리자 콘솔", en: "DentiCheck Admin Console" },
        login_desc: { ko: "관리자 로그인을 진행해주세요.", en: "Please sign in to continue." },
        login_google: { ko: "Google 계정으로 계속하기", en: "Continue with Google" },
        login_dev_admin: { ko: "Dev Login (관리자)", en: "Dev Login (Admin)" },
        login_or_continue: { ko: "또는 다음으로 계속", en: "Or continue with" },
        login_error_forbidden: {
            ko: "관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.",
            en: "Access denied. Please log in with an admin account.",
        },
        login_error_title: { ko: "접근 거부", en: "Access Denied" },
        login_success_dev: { ko: "개발자 계정으로 로그인되었습니다.", en: "Logged in with developer account." },
        login_success_title: { ko: "로그인 성공", en: "Login Success" },
    };

    const t = (key: string, params?: Record<string, string>) => {
        let text = translations[key]?.[lang] || key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        return text;
    };

    return <LanguageContext.Provider value={{ lang, toggleLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
