import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface AppVersion {
    version: string;
    buildNumber: string;
    bundleId: string;
    nativeVersion: string;
    expoVersion: string;
    platform: string;
    isDevice: boolean;
}

export class VersionManager {
    private static instance: VersionManager;
    private version: AppVersion;

    private constructor() {
        this.version = this.getVersionInfo();
    }

    static getInstance(): VersionManager {
        if (!VersionManager.instance) {
            VersionManager.instance = new VersionManager();
        }
        return VersionManager.instance;
    }

    private getVersionInfo(): AppVersion {
        const manifest = Constants.expoConfig;
        const nativeBuildVersion = Constants.nativeBuildVersion || 'N/A';
        const nativeAppVersion = Constants.nativeAppVersion || manifest?.version || '1.0.0';

        return {
            version: manifest?.version || '1.0.0',
            buildNumber: nativeBuildVersion,
            bundleId: manifest?.ios?.bundleIdentifier || manifest?.android?.package || 'com.app',
            nativeVersion: nativeAppVersion,
            expoVersion: Constants.expoVersion || 'N/A',
            platform: Platform.OS,
            isDevice: Constants.isDevice || false,
        };
    }

    getVersion(): AppVersion {
        return this.version;
    }

    getVersionString(): string {
        return `${this.version.version} (${this.version.buildNumber})`;
    }

    getFullVersionString(): string {
        return `v${this.version.version} Build ${this.version.buildNumber} - ${this.version.platform}`;
    }

    isNewerThan(version: string): boolean {
        return this.compareVersions(this.version.version, version) > 0;
    }

    private compareVersions(v1: string, v2: string): number {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;

            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }

        return 0;
    }

    logVersion(): void {
        if (__DEV__) {
            console.log('📱 App Version Info:', {
                version: this.version.version,
                build: this.version.buildNumber,
                platform: this.version.platform,
                bundleId: this.version.bundleId,
                expoVersion: this.version.expoVersion,
                isDevice: this.version.isDevice,
            });
        }
    }
}

// Export singleton instance
export const versionManager = VersionManager.getInstance();
export default versionManager;
