import Constants from 'expo-constants';

interface EnvConfig {
    API_URL: string;
    APP_NAME: string;
    APP_VERSION: string;
    ENABLE_ANALYTICS: boolean;
    ENABLE_DEBUG: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = Constants.expoConfig?.extra?.[key] || process.env[key];

    if (!value && !defaultValue) {
        console.warn(`Environment variable ${key} is not set`);
        return '';
    }

    return value || defaultValue || '';
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
    const value = getEnvVar(key);
    if (!value) return defaultValue;
    return value === 'true' || value === '1';
};

export const ENV: EnvConfig = {
    API_URL: getEnvVar('EXPO_PUBLIC_API_URL', 'https://jsonplaceholder.typicode.com'),
    APP_NAME: getEnvVar('EXPO_PUBLIC_APP_NAME', 'Modern Expo App'),
    APP_VERSION: getEnvVar('EXPO_PUBLIC_APP_VERSION', '1.0.0'),
    ENABLE_ANALYTICS: getBooleanEnvVar('EXPO_PUBLIC_ENABLE_ANALYTICS', false),
    ENABLE_DEBUG: getBooleanEnvVar('EXPO_PUBLIC_ENABLE_DEBUG', true),
};

export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

if (ENV.ENABLE_DEBUG) {
    console.log('🔧 Environment Configuration:', {
        API_URL: ENV.API_URL,
        APP_NAME: ENV.APP_NAME,
        APP_VERSION: ENV.APP_VERSION,
        ENABLE_ANALYTICS: ENV.ENABLE_ANALYTICS,
        ENABLE_DEBUG: ENV.ENABLE_DEBUG,
        isDevelopment,
        isProduction,
    });
}
