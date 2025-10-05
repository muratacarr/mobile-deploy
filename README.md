# 🚀 Modern Expo Mobile App

A modern, production-ready React Native mobile application built with Expo, featuring state management, navigation, and persistent storage.

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful dark theme with smooth animations
- 🔄 **State Management** - Zustand for efficient state handling
- 💾 **Persistent Storage** - AsyncStorage & SecureStore integration
- 🔐 **Secure Token Storage** - Hardware-backed token encryption
- 🔑 **Auto Token Injection** - Automatic Authorization header
- 🔄 **Token Refresh** - Automatic token refresh on 401
- 🧭 **Navigation** - React Navigation with bottom tabs
- 🌐 **API Integration** - TanStack Query for server state management
- 🛡️ **Error Handling** - Comprehensive error handling with interceptors
- 🔄 **Auto Retry** - Automatic retry with exponential backoff
- ⏱️ **Timeout Handling** - Request timeout management
- 🌍 **Internationalization** - i18n support with auto-detection (TR/EN)
- 📱 **TypeScript** - Full type safety
- ⚡ **Latest Tech Stack** - Expo 54, React 19, React Native 0.81

## 📦 Tech Stack

- **React Native** 0.81.4
- **React** 19.1.0
- **Expo** ~54.0.12
- **TypeScript** ~5.9.2
- **Zustand** ^5.0.8 (State Management)
- **TanStack Query** ^5.x (Server State)
- **React Navigation** ^7.1.18
- **AsyncStorage** ^2.2.0
- **Expo SecureStore** ^15.0.7
- **i18next** ^23.x (Internationalization)
- **Expo Localization** (Device Language Detection)

## 📱 Screens

### 🏠 Home Screen

- Counter demo with Zustand state management
- Persistent counter value using AsyncStorage
- Interactive increment/decrement buttons

### ✅ Tasks Screen

- Full-featured task manager
- Add, complete, and delete tasks
- Task persistence with AsyncStorage
- Clear completed tasks functionality

### 🌐 API Screen

- TanStack Query data fetching
- Posts and Users from API
- Pull to refresh
- Advanced error handling
- Loading states

### 🔐 Auth Screen

- Demo authentication
- Secure token storage (SecureStore)
- View stored tokens
- Automatic token injection
- Token refresh on 401

### 👤 Profile Screen

- App statistics and metrics
- Authentication status
- Settings overview
- Tech stack information
- Reset all data option

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
# EXPO_PUBLIC_API_URL=https://your-api-url.com
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## 📁 Project Structure

```
mobile-deploy/
├── App.tsx                 # Main app with navigation & ErrorBoundary
├── api/
│   ├── client.ts          # API client methods
│   └── interceptor.ts     # HTTP interceptor with retry & timeout
├── components/
│   └── ErrorBoundary.tsx  # React error boundary
├── config/
│   └── env.ts             # Environment configuration
├── hooks/
│   └── useApi.ts          # TanStack Query hooks
├── screens/               # Screen components
│   ├── HomeScreen.tsx     # Home screen with counter
│   ├── TasksScreen.tsx    # Task manager screen
│   ├── ApiScreen.tsx      # API demo with error handling
│   ├── AuthDemoScreen.tsx # Auth demo with secure storage
│   └── ProfileScreen.tsx  # Profile and settings screen
├── services/
│   └── secureStorage.ts   # SecureStore service for tokens
├── store/                 # Zustand stores
│   ├── storage.ts         # Storage adapters (AsyncStorage & SecureStore)
│   ├── useCounterStore.ts # Counter state management
│   ├── useTaskStore.ts    # Task state management
│   └── useAuthStore.ts    # Auth state (SecureStore example)
├── utils/
│   └── errorHandler.ts    # Error handling utilities
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment template
├── ERROR_HANDLING.md      # Error handling documentation
├── ENV_SETUP.md           # Environment setup guide
├── SECURITY.md            # Security & token storage guide
└── README.md              # This file
```

## 🌍 Environment Variables

This app uses environment variables for configuration. All variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

### Available Variables

| Variable                       | Description       | Default                                |
| ------------------------------ | ----------------- | -------------------------------------- |
| `EXPO_PUBLIC_API_URL`          | Backend API URL   | `https://jsonplaceholder.typicode.com` |
| `EXPO_PUBLIC_APP_NAME`         | Application name  | `Modern Expo App`                      |
| `EXPO_PUBLIC_APP_VERSION`      | App version       | `1.0.0`                                |
| `EXPO_PUBLIC_ENABLE_ANALYTICS` | Enable analytics  | `false`                                |
| `EXPO_PUBLIC_ENABLE_DEBUG`     | Enable debug mode | `true`                                 |

### Setup

1. Copy `.env.example` to `.env`
2. Update values as needed
3. Restart the development server

```bash
cp .env.example .env
npm start
```

### Usage in Code

```typescript
import { ENV } from "./config/env";

console.log(ENV.API_URL); // Access environment variables
```

## 🔧 State Management

This app uses **Zustand** with persistence middleware:

- **AsyncStorage**: For general app data (counter, tasks)
- **SecureStore**: For sensitive data (auth tokens, user credentials)

### Example Store

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter } from "./storage";

export const useCounterStore = create()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "counter-storage",
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
```

## 🛡️ Error Handling

This app implements comprehensive error handling:

### Features

- ✅ **API Interceptor** - Request/response interception
- ✅ **Automatic Retries** - Exponential backoff (2 retries)
- ✅ **Timeout Handling** - 30s default timeout
- ✅ **Error Boundary** - Catches React errors
- ✅ **User-Friendly Messages** - Clear error messages
- ✅ **Error Logging** - Debug mode logging

### Usage

```typescript
import { handleError, getErrorMessage } from "./utils/errorHandler";

try {
  await api.getPosts();
} catch (error) {
  handleError(error, "Loading posts", () => refetch());
}
```

See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for detailed documentation.

## 🔐 Secure Token Storage

This app implements secure token storage using SecureStore:

### Features

- ✅ **Hardware-backed Encryption** - iOS Keychain & Android Keystore
- ✅ **Automatic Token Injection** - Tokens added to API requests
- ✅ **Token Refresh** - Auto refresh on 401 errors
- ✅ **Secure User Data** - Encrypted storage for user info
- ✅ **Web Fallback** - localStorage for web platform

### Usage

```typescript
import SecureStorageService from "./services/secureStorage";
import { useAuthStore } from "./store/useAuthStore";

// Login
const { login } = useAuthStore();
await login(user, accessToken, refreshToken);

// Tokens are automatically:
// 1. Stored in SecureStore (encrypted)
// 2. Added to API requests (Authorization header)
// 3. Refreshed on 401 errors

// Logout
const { logout } = useAuthStore();
await logout(); // Clears all tokens
```

See [SECURITY.md](./SECURITY.md) for comprehensive security documentation.

## ⚙️ Version Control & Configuration

This app includes a centralized configuration system:

### Features

- ✅ **Version Manager** - App versioning, build numbers, platform info
- ✅ **Config Manager** - Centralized app settings and constants
- ✅ **Feature Flags** - Runtime feature toggles
- ✅ **API Configuration** - Timeout, retries, base URL
- ✅ **Cache Settings** - Configurable cache times
- ✅ **Constants Management** - No magic numbers

### Usage

```typescript
import { versionManager } from "./config/version";
import { configManager } from "./config/appConfig";

// Get version info
const version = versionManager.getVersionString(); // "1.0.0 (123)"

// Check feature flags
if (configManager.isFeatureEnabled("enableAnalytics")) {
  trackEvent("page_view");
}

// Get constants
const maxSize = configManager.getConstant("maxFileSize");
```

See [VERSION_CONTROL.md](./VERSION_CONTROL.md) for detailed documentation.

## 🌍 Internationalization (i18n)

The app supports multiple languages with automatic detection:

### Features

- ✅ **Auto Language Detection** - Detects device language on first launch
- ✅ **Persistent Preference** - Saves selected language
- ✅ **JSON-Based Translations** - Easy-to-edit locale files
- ✅ **Supported Languages** - Turkish (TR) and English (EN)
- ✅ **Hot Reload** - Language changes apply instantly

### Usage

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t("home.title")}</Text>;
}
```

### Change Language

```typescript
import { changeLanguage } from "./i18n";

await changeLanguage("tr"); // Switch to Turkish
await changeLanguage("en"); // Switch to English
```

See [I18N.md](./I18N.md) for detailed documentation.

## 📖 Documentation

- [Environment Setup Guide](./ENV_SETUP.md)
- [Error Handling Guide](./ERROR_HANDLING.md)
- [Security Guide](./SECURITY.md)
- [Version Control & Config Guide](./VERSION_CONTROL.md)
- [Internationalization Guide](./I18N.md)

## 🎨 Customization

### Colors

The app uses a dark theme with these primary colors:

- Background: `#0f172a`
- Card Background: `#1e293b`
- Primary Blue: `#3b82f6`
- Success Green: `#10b981`
- Danger Red: `#ef4444`

### Navigation

Bottom tab navigation is configured in `App.tsx`. To add new screens:

1. Create screen component in `screens/`
2. Add to Tab.Navigator in `App.tsx`
3. Configure tab icon and options

## 📝 Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## 🔐 Security

- Sensitive data (tokens, credentials) stored in SecureStore
- General app data stored in AsyncStorage
- TypeScript for type safety

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Expo

---

**Happy Coding!** 🎉
