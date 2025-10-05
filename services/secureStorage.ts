import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export enum SecureStorageKeys {
    ACCESS_TOKEN = 'access_token',
    REFRESH_TOKEN = 'refresh_token',
    USER_ID = 'user_id',
    USER_EMAIL = 'user_email',
    BIOMETRIC_ENABLED = 'biometric_enabled',
}

export class SecureStorageService {
    private static isAvailable = Platform.OS !== 'web';

    static async setItem(key: string, value: string): Promise<boolean> {
        try {
            if (!this.isAvailable) {
                console.warn('SecureStore is not available on web platform');
                localStorage.setItem(key, value);
                return true;
            }

            await SecureStore.setItemAsync(key, value, {
                keychainAccessible: SecureStore.WHEN_UNLOCKED,
            });
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to SecureStore:`, error);
            return false;
        }
    }

    static async getItem(key: string): Promise<string | null> {
        try {
            if (!this.isAvailable) {
                return localStorage.getItem(key);
            }

            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error(`Error reading ${key} from SecureStore:`, error);
            return null;
        }
    }

    static async removeItem(key: string): Promise<boolean> {
        try {
            if (!this.isAvailable) {
                localStorage.removeItem(key);
                return true;
            }

            await SecureStore.deleteItemAsync(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from SecureStore:`, error);
            return false;
        }
    }

    static async clear(): Promise<boolean> {
        try {
            const keys = Object.values(SecureStorageKeys);
            const promises = keys.map(key => this.removeItem(key));
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Error clearing SecureStore:', error);
            return false;
        }
    }

    static async saveToken(accessToken: string, refreshToken?: string): Promise<boolean> {
        try {
            await this.setItem(SecureStorageKeys.ACCESS_TOKEN, accessToken);

            if (refreshToken) {
                await this.setItem(SecureStorageKeys.REFRESH_TOKEN, refreshToken);
            }

            return true;
        } catch (error) {
            console.error('Error saving tokens:', error);
            return false;
        }
    }

    static async getAccessToken(): Promise<string | null> {
        return this.getItem(SecureStorageKeys.ACCESS_TOKEN);
    }

    static async getRefreshToken(): Promise<string | null> {
        return this.getItem(SecureStorageKeys.REFRESH_TOKEN);
    }

    static async clearTokens(): Promise<boolean> {
        try {
            await this.removeItem(SecureStorageKeys.ACCESS_TOKEN);
            await this.removeItem(SecureStorageKeys.REFRESH_TOKEN);
            return true;
        } catch (error) {
            console.error('Error clearing tokens:', error);
            return false;
        }
    }

    static async saveUserInfo(userId: string, email: string): Promise<boolean> {
        try {
            await this.setItem(SecureStorageKeys.USER_ID, userId);
            await this.setItem(SecureStorageKeys.USER_EMAIL, email);
            return true;
        } catch (error) {
            console.error('Error saving user info:', error);
            return false;
        }
    }

    static async getUserInfo(): Promise<{ userId: string | null; email: string | null }> {
        try {
            const userId = await this.getItem(SecureStorageKeys.USER_ID);
            const email = await this.getItem(SecureStorageKeys.USER_EMAIL);
            return { userId, email };
        } catch (error) {
            console.error('Error getting user info:', error);
            return { userId: null, email: null };
        }
    }

    static async clearUserInfo(): Promise<boolean> {
        try {
            await this.removeItem(SecureStorageKeys.USER_ID);
            await this.removeItem(SecureStorageKeys.USER_EMAIL);
            return true;
        } catch (error) {
            console.error('Error clearing user info:', error);
            return false;
        }
    }
}

export default SecureStorageService;
