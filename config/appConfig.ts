import { ENV } from './env';
import { versionManager } from './version';

export interface FeatureFlags {
    enableAnalytics: boolean;
    enableDebug: boolean;
    enableBiometrics: boolean;
    enablePushNotifications: boolean;
    enableOfflineMode: boolean;
}

export interface APIConfig {
    baseURL: string;
    timeout: number;
    retries: number;
    version: string;
}

export interface CacheConfig {
    staleTime: number;
    cacheTime: number;
    maxSize: number;
}

export interface AppConfig {
    app: {
        name: string;
        version: string;
        buildNumber: string;
        bundleId: string;
    };
    api: APIConfig;
    cache: CacheConfig;
    features: FeatureFlags;
    constants: {
        maxFileSize: number;
        maxImageSize: number;
        itemsPerPage: number;
        minPasswordLength: number;
    };
}

class ConfigManager {
    private static instance: ConfigManager;
    private config: AppConfig;

    private constructor() {
        this.config = this.initializeConfig();
    }

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private initializeConfig(): AppConfig {
        const version = versionManager.getVersion();

        return {
            app: {
                name: ENV.APP_NAME,
                version: version.version,
                buildNumber: version.buildNumber,
                bundleId: version.bundleId,
            },
            api: {
                baseURL: ENV.API_URL,
                timeout: 30000,
                retries: 2,
                version: 'v1',
            },
            cache: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                cacheTime: 10 * 60 * 1000, // 10 minutes
                maxSize: 50, // Max cached items
            },
            features: {
                enableAnalytics: ENV.ENABLE_ANALYTICS,
                enableDebug: ENV.ENABLE_DEBUG,
                enableBiometrics: true,
                enablePushNotifications: true,
                enableOfflineMode: false,
            },
            constants: {
                maxFileSize: 10 * 1024 * 1024, // 10 MB
                maxImageSize: 5 * 1024 * 1024, // 5 MB
                itemsPerPage: 20,
                minPasswordLength: 8,
            },
        };
    }

    getConfig(): AppConfig {
        return this.config;
    }

    isFeatureEnabled(feature: keyof FeatureFlags): boolean {
        return this.config.features[feature];
    }

    updateFeatureFlag(feature: keyof FeatureFlags, enabled: boolean): void {
        this.config.features[feature] = enabled;
        if (ENV.ENABLE_DEBUG) {
            console.log(`🔧 Feature "${feature}" set to:`, enabled);
        }
    }

    getAPIConfig(): APIConfig {
        return this.config.api;
    }

    getCacheConfig(): CacheConfig {
        return this.config.cache;
    }

    getConstant<K extends keyof AppConfig['constants']>(key: K): AppConfig['constants'][K] {
        return this.config.constants[key];
    }

    logConfig(): void {
        if (__DEV__) {
            console.log('⚙️ App Configuration:', {
                app: this.config.app,
                api: {
                    baseURL: this.config.api.baseURL,
                    timeout: `${this.config.api.timeout}ms`,
                    retries: this.config.api.retries,
                },
                features: this.config.features,
            });
        }
    }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();
export default configManager;
