/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: '#f0f9ff', // ocean.background
                foreground: '#1f1f1f', // standard dark text
                primary: '#0EA5E9', // ocean.primary
                'primary-foreground': '#ffffff',
                secondary: '#6366F1', // ocean.secondary
                'secondary-foreground': '#ffffff',
                accent: '#93C5FD', // ocean.accent
                'accent-foreground': '#030213',
                muted: '#DBEAFE', // ocean.muted
                'muted-foreground': '#717182', // maintained standard muted text
                border: 'rgba(14, 165, 233, 0.15)', // ocean.border
                input: '#F0F9FF', // ocean.inputBg
                ring: '#0EA5E9', // ocean.primary
            }
        },
    },
    plugins: [],
}
