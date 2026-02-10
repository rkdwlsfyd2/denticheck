export type ColorTheme = {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    muted: string;
    inputBg: string;
    border: string;
    gradient: [string, string]; // Changed to array for LinearGradient usage in RN
};

export const themes: Record<string, ColorTheme> = {
    coral: {
        name: '코랄 피치',
        primary: '#FF6B6B',
        secondary: '#8B5CF6',
        accent: '#FFB8A8',
        background: '#fef8f6',
        muted: '#FFF0ED',
        inputBg: '#FFF5F3',
        border: 'rgba(255, 107, 107, 0.15)',
        gradient: ['#FF6B6B', '#FFB8A8'],
    },
    mint: {
        name: '민트 그린',
        primary: '#10B981',
        secondary: '#06B6D4',
        accent: '#A7F3D0',
        background: '#f0fdf4',
        muted: '#D1FAE5',
        inputBg: '#ECFDF5',
        border: 'rgba(16, 185, 129, 0.15)',
        gradient: ['#10B981', '#A7F3D0'],
    },
    lavender: {
        name: '라벤더 퍼플',
        primary: '#9333EA',
        secondary: '#EC4899',
        accent: '#E9D5FF',
        background: '#faf5ff',
        muted: '#F3E8FF',
        inputBg: '#FAF5FF',
        border: 'rgba(147, 51, 234, 0.15)',
        gradient: ['#9333EA', '#E9D5FF'],
    },
    ocean: {
        name: '오션 블루',
        primary: '#0EA5E9',
        secondary: '#6366F1',
        accent: '#93C5FD',
        background: '#f0f9ff',
        muted: '#DBEAFE',
        inputBg: '#F0F9FF',
        border: 'rgba(14, 165, 233, 0.15)',
        gradient: ['#0EA5E9', '#93C5FD'],
    },
    sunset: {
        name: '선셋 오렌지',
        primary: '#F97316',
        secondary: '#EF4444',
        accent: '#FDBA74',
        background: '#fff7ed',
        muted: '#FFEDD5',
        inputBg: '#FFF7ED',
        border: 'rgba(249, 115, 22, 0.15)',
        gradient: ['#F97316', '#FDBA74'],
    },
};

export type ThemeName = keyof typeof themes;
