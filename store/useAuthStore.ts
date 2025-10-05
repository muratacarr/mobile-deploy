import { create } from 'zustand';
import SecureStorageService from '../services/secureStorage';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;

    // Actions
    login: (user: User, accessToken: string, refreshToken?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateToken: (accessToken: string, refreshToken?: string) => Promise<void>;
    loadAuthState: () => Promise<void>;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,

    login: async (user, accessToken, refreshToken) => {
        try {
            // Save tokens to SecureStore
            await SecureStorageService.saveToken(accessToken, refreshToken);

            // Save user info to SecureStore
            await SecureStorageService.saveUserInfo(user.id, user.email);

            // Update state
            set({
                isAuthenticated: true,
                user,
                accessToken,
                refreshToken,
            });

            console.log('✅ Login successful');
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            // Clear tokens from SecureStore
            await SecureStorageService.clearTokens();

            // Clear user info
            await SecureStorageService.clearUserInfo();

            // Update state
            set({
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
            });

            console.log('✅ Logout successful');
        } catch (error) {
            console.error('❌ Logout failed:', error);
            throw error;
        }
    },

    updateToken: async (accessToken, refreshToken) => {
        try {
            await SecureStorageService.saveToken(accessToken, refreshToken);

            set({
                accessToken,
                ...(refreshToken && { refreshToken }),
            });

            console.log('✅ Token updated');
        } catch (error) {
            console.error('❌ Token update failed:', error);
            throw error;
        }
    },

    loadAuthState: async () => {
        try {
            set({ isLoading: true });

            // Load tokens from SecureStore
            const accessToken = await SecureStorageService.getAccessToken();
            const refreshToken = await SecureStorageService.getRefreshToken();

            // Load user info
            const { userId, email } = await SecureStorageService.getUserInfo();

            if (accessToken && userId && email) {
                set({
                    isAuthenticated: true,
                    user: { id: userId, email },
                    accessToken,
                    refreshToken,
                    isLoading: false,
                });
                console.log('✅ Auth state loaded');
            } else {
                set({ isLoading: false });
                console.log('ℹ️ No auth state found');
            }
        } catch (error) {
            console.error('❌ Failed to load auth state:', error);
            set({ isLoading: false });
        }
    },

    setUser: (user) => {
        set({ user });
    },
}));
