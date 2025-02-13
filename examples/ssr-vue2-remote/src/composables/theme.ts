import { type Ref, ref } from 'vue';

export interface Theme {
    colorPrimary: string;
    colorPrimaryDark: string;
    colorSecondary: string;
    colorSecondaryDark: string;
    colorSuccess: string;
    colorSuccessDark: string;
    colorWarning: string;
    colorWarningDark: string;
    colorDanger: string;
    colorDangerDark: string;
    colorTextPrimary: string;
    colorTextSecondary: string;
    colorBackground: string;
    colorBorder: string;
}

export interface UseThemeReturn {
    theme: Ref<Theme>;
    updateTheme: (newTheme: Partial<Theme>) => void;
}

export const defaultTheme: Theme = {
    colorPrimary: '#FFA000',
    colorPrimaryDark: '#F57C00',
    colorSecondary: '#6B7280',
    colorSecondaryDark: '#4B5563',
    colorSuccess: '#10B981',
    colorSuccessDark: '#059669',
    colorWarning: '#F59E0B',
    colorWarningDark: '#D97706',
    colorDanger: '#EF4444',
    colorDangerDark: '#DC2626',
    colorTextPrimary: '#111827',
    colorTextSecondary: '#6B7280',
    colorBackground: '#FFFFFF',
    colorBorder: '#E5E7EB'
};

const theme = ref<Theme>(defaultTheme);

export const useTheme = (): UseThemeReturn => {
    const updateTheme = (newTheme: Partial<Theme>) => {
        theme.value = { ...theme.value, ...newTheme };
        applyTheme(theme.value);
    };

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            const cssVar =
                '--' + key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
            root.style.setProperty(cssVar, value);
        });
    };

    // 初始化主题
    if (typeof window !== 'undefined') {
        applyTheme(theme.value);
    }

    return {
        theme,
        updateTheme
    };
};
