# Version Control & Configuration

This document explains the version management and configuration system of the application.

## 📋 Table of Contents

- [Overview](#overview)
- [Version Management](#version-management)
- [App Configuration](#app-configuration)
- [Feature Flags](#feature-flags)
- [Usage Examples](#usage-examples)

---

## Overview

The app uses a centralized configuration system with:

- **VersionManager**: Manages app versioning, build numbers, and platform info
- **ConfigManager**: Manages app settings, feature flags, and constants
- **Environment Variables**: External configuration via `.env` file

---

## Version Management

### VersionManager

Located at `config/version.ts`, this singleton manages all version-related information.

#### Features

```typescript
interface AppVersion {
  version: string; // App version (e.g., "1.0.0")
  buildNumber: string; // Native build number
  bundleId: string; // iOS/Android bundle identifier
  nativeVersion: string; // Native app version
  expoVersion: string; // Expo SDK version
  platform: string; // 'ios' | 'android' | 'web'
  isDevice: boolean; // Running on real device or simulator
}
```

#### Usage

```typescript
import { versionManager } from "./config/version";

// Get full version info
const version = versionManager.getVersion();
console.log(version.version); // "1.0.0"
console.log(version.buildNumber); // "123"

// Get formatted version strings
const shortVersion = versionManager.getVersionString();
// "1.0.0 (123)"

const fullVersion = versionManager.getFullVersionString();
// "v1.0.0 Build 123 - ios"

// Compare versions
if (versionManager.isNewerThan("0.9.0")) {
  console.log("App is up to date");
}

// Log version info in development
versionManager.logVersion();
```

---

## App Configuration

### ConfigManager

Located at `config/appConfig.ts`, this singleton manages app-wide settings.

#### Configuration Structure

```typescript
interface AppConfig {
  app: {
    name: string;
    version: string;
    buildNumber: string;
    bundleId: string;
  };
  api: {
    baseURL: string;
    timeout: number;
    retries: number;
    version: string;
  };
  cache: {
    staleTime: number; // 5 minutes
    cacheTime: number; // 10 minutes
    maxSize: number; // 50 items
  };
  features: FeatureFlags;
  constants: {
    maxFileSize: number; // 10 MB
    maxImageSize: number; // 5 MB
    itemsPerPage: number; // 20
    minPasswordLength: number; // 8
  };
}
```

#### Usage

```typescript
import { configManager } from "./config/appConfig";

// Get full config
const config = configManager.getConfig();

// Get specific config sections
const apiConfig = configManager.getAPIConfig();
console.log(apiConfig.baseURL); // "https://api.example.com"
console.log(apiConfig.timeout); // 30000

const cacheConfig = configManager.getCacheConfig();
console.log(cacheConfig.staleTime); // 300000 (5 minutes)

// Get constants
const maxSize = configManager.getConstant("maxFileSize");
console.log(maxSize); // 10485760 (10 MB)

// Log config in development
configManager.logConfig();
```

---

## Feature Flags

Feature flags allow you to enable/disable features at runtime.

### Available Flags

```typescript
interface FeatureFlags {
  enableAnalytics: boolean;
  enableDebug: boolean;
  enableBiometrics: boolean;
  enablePushNotifications: boolean;
  enableOfflineMode: boolean;
}
```

### Usage

```typescript
import { configManager } from "./config/appConfig";

// Check if feature is enabled
if (configManager.isFeatureEnabled("enableAnalytics")) {
  trackEvent("page_view");
}

// Toggle feature at runtime
configManager.updateFeatureFlag("enableDebug", true);

// Conditional rendering
function MyComponent() {
  const showBiometrics = configManager.isFeatureEnabled("enableBiometrics");

  return <View>{showBiometrics && <BiometricLogin />}</View>;
}
```

### Feature Flag Configuration

Flags are initialized from environment variables:

```env
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_DEBUG=false
```

---

## Usage Examples

### 1. Display Version in UI

```typescript
import { versionManager } from "./config/version";

function AboutScreen() {
  const version = versionManager.getVersion();

  return (
    <View>
      <Text>App Version: {version.version}</Text>
      <Text>Build: {version.buildNumber}</Text>
      <Text>Platform: {version.platform}</Text>
      <Text>Bundle ID: {version.bundleId}</Text>
    </View>
  );
}
```

### 2. Initialize App with Version Logging

```typescript
// App.tsx
import { versionManager } from "./config/version";
import { configManager } from "./config/appConfig";

export default function App() {
  useEffect(() => {
    versionManager.logVersion();
    configManager.logConfig();
  }, []);

  return <NavigationContainer>...</NavigationContainer>;
}
```

### 3. Use Configuration in API Client

```typescript
// api/client.ts
import { configManager } from "../config/appConfig";

const apiConfig = configManager.getAPIConfig();

export const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    "X-App-Version": versionManager.getVersion().version,
  },
});
```

### 4. Conditional Feature Implementation

```typescript
import { configManager } from "./config/appConfig";

async function uploadFile(file: File) {
  const maxSize = configManager.getConstant("maxFileSize");

  if (file.size > maxSize) {
    throw new Error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
  }

  // Upload logic...
}
```

### 5. Debug Mode Features

```typescript
import { configManager } from "./config/appConfig";

function MyComponent() {
  const isDebugEnabled = configManager.isFeatureEnabled("enableDebug");

  return (
    <View>
      <MainContent />
      {isDebugEnabled && <DebugPanel />}
    </View>
  );
}
```

---

## Version Update Process

When releasing a new version:

1. **Update `app.json`**:

   ```json
   {
     "expo": {
       "version": "1.1.0"
     }
   }
   ```

2. **Update native build numbers** (for production builds):

   - iOS: Increment `CFBundleVersion` in `Info.plist`
   - Android: Increment `versionCode` in `build.gradle`

3. **Version Manager automatically reads** from `Constants.expoConfig`:

   ```typescript
   const version = versionManager.getVersion();
   // version.version === "1.1.0" (from app.json)
   // version.buildNumber === "124" (from native build)
   ```

4. **Environment variables** are loaded from `.env`:
   ```env
   EXPO_PUBLIC_APP_VERSION=1.1.0
   ```

---

## Constants Management

All magic numbers should be defined in `configManager`:

```typescript
// ❌ Bad
const MAX_SIZE = 10 * 1024 * 1024;

// ✅ Good
const maxSize = configManager.getConstant("maxFileSize");
```

### Adding New Constants

Edit `config/appConfig.ts`:

```typescript
constants: {
  maxFileSize: 10 * 1024 * 1024,
  maxImageSize: 5 * 1024 * 1024,
  itemsPerPage: 20,
  minPasswordLength: 8,
  // Add new constant
  maxRetries: 3,
}
```

---

## Best Practices

1. **Version Logging**: Always log version info on app start in development
2. **Feature Flags**: Use for A/B testing and gradual rollouts
3. **Constants**: Keep all magic numbers in config
4. **Type Safety**: Use TypeScript types for config access
5. **Singleton Pattern**: Access managers via exported instances only
6. **Environment Separation**: Use different configs for dev/staging/prod

---

## API Reference

### VersionManager

| Method                   | Return Type  | Description                              |
| ------------------------ | ------------ | ---------------------------------------- |
| `getVersion()`           | `AppVersion` | Get full version info                    |
| `getVersionString()`     | `string`     | Get "version (build)" string             |
| `getFullVersionString()` | `string`     | Get "vX.X.X Build XXX - platform" string |
| `isNewerThan(version)`   | `boolean`    | Compare with another version             |
| `logVersion()`           | `void`       | Log version info (dev only)              |

### ConfigManager

| Method                                | Return Type   | Description            |
| ------------------------------------- | ------------- | ---------------------- |
| `getConfig()`                         | `AppConfig`   | Get full configuration |
| `getAPIConfig()`                      | `APIConfig`   | Get API settings       |
| `getCacheConfig()`                    | `CacheConfig` | Get cache settings     |
| `getConstant(key)`                    | `number`      | Get constant value     |
| `isFeatureEnabled(feature)`           | `boolean`     | Check feature flag     |
| `updateFeatureFlag(feature, enabled)` | `void`        | Update feature flag    |
| `logConfig()`                         | `void`        | Log config (dev only)  |

---

## Troubleshooting

### Version not updating

1. Clear Expo cache: `npx expo start --clear`
2. Check `app.json` version field
3. Rebuild native app if using EAS Build

### TypeScript errors

1. Restart TypeScript server in your IDE
2. Delete `node_modules/.cache`
3. Run `npm install` again

### Feature flag not working

1. Check `.env` file exists and is loaded
2. Verify environment variable naming: `EXPO_PUBLIC_*`
3. Restart Expo dev server

---

## Related Documentation

- [Environment Setup](./ENV_SETUP.md)
- [Error Handling](./ERROR_HANDLING.md)
- [Security Guide](./SECURITY.md)
