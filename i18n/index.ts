import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import tr from './locales/tr.json';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Supported languages
export const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
];

const supportedLanguageCodes = languages.map((lang) => lang.code);

// Get best matching language
const getBestMatchingLanguage = (deviceLanguage: string): string => {
    // Exact match
    if (supportedLanguageCodes.includes(deviceLanguage)) {
        return deviceLanguage;
    }

    // Try base language (e.g., 'en-US' -> 'en')
    const baseLanguage = deviceLanguage.split('-')[0];
    if (supportedLanguageCodes.includes(baseLanguage)) {
        return baseLanguage;
    }

    // Default fallback
    return 'en';
};

// Language detector with improved auto-detection
const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            // 1. Check for saved language preference
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLanguage && supportedLanguageCodes.includes(savedLanguage)) {
                if (__DEV__) {
                    console.log('🌐 Using saved language:', savedLanguage);
                }
                callback(savedLanguage);
                return;
            }

            // 2. Auto-detect from device settings
            const locales = Localization.getLocales();
            const deviceLanguage = locales[0]?.languageCode || 'en';
            const bestMatch = getBestMatchingLanguage(deviceLanguage);

            if (__DEV__) {
                console.log('🌐 Device locales:', locales.map(l => l.languageCode).join(', '));
                console.log('🌐 Auto-detected language:', bestMatch);
            }

            // Save auto-detected language
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, bestMatch);
            callback(bestMatch);
        } catch (error) {
            console.error('❌ Error detecting language:', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
            if (__DEV__) {
                console.log('💾 Language saved:', language);
            }
        } catch (error) {
            console.error('❌ Error saving language:', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            tr: { translation: tr },
        },
        fallbackLng: 'en',
        supportedLngs: supportedLanguageCodes,
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
        debug: __DEV__,
    });

// Log initialization
if (__DEV__) {
    console.log('🌍 i18n initialized with languages:', supportedLanguageCodes.join(', '));
}

export default i18n;

// Export language change function
export const changeLanguage = async (language: string) => {
    if (!supportedLanguageCodes.includes(language)) {
        console.warn(`⚠️ Language "${language}" is not supported`);
        return;
    }
    await i18n.changeLanguage(language);
    if (__DEV__) {
        console.log('🌐 Language changed to:', language);
    }
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Check if language is supported
export const isLanguageSupported = (language: string) =>
    supportedLanguageCodes.includes(language);

