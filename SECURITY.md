# 🔐 Security Guide

Comprehensive security documentation for secure token storage and authentication.

## 🎯 Overview

This app implements enterprise-grade security features:

- **SecureStore** - Hardware-backed secure storage (Keychain/Keystore)
- **Token Management** - Access & refresh token handling
- **Auto Token Injection** - Automatic Authorization header
- **Token Refresh** - Automatic token refresh on 401
- **Secure User Data** - Encrypted user information storage

## 🛡️ SecureStore Implementation

### What is SecureStore?

SecureStore provides a way to encrypt and securely store key–value pairs locally on the device:

- **iOS**: Uses Keychain Services
- **Android**: Uses Keystore system
- **Web**: Falls back to localStorage (not encrypted)

### Security Features

| Platform | Storage      | Encryption | Hardware-backed |
| -------- | ------------ | ---------- | --------------- |
| iOS      | Keychain     | AES-256    | ✅ Yes          |
| Android  | Keystore     | AES-256    | ✅ Yes          |
| Web      | localStorage | ❌ No      | ❌ No           |

## 📦 SecureStorageService

### Available Methods

```typescript
import SecureStorageService from "./services/secureStorage";

// Token Management
await SecureStorageService.saveToken(accessToken, refreshToken);
const accessToken = await SecureStorageService.getAccessToken();
const refreshToken = await SecureStorageService.getRefreshToken();
await SecureStorageService.clearTokens();

// User Information
await SecureStorageService.saveUserInfo(userId, email);
const { userId, email } = await SecureStorageService.getUserInfo();
await SecureStorageService.clearUserInfo();

// Generic Methods
await SecureStorageService.setItem(key, value);
const value = await SecureStorageService.getItem(key);
await SecureStorageService.removeItem(key);
await SecureStorageService.clear();
```

### Storage Keys

```typescript
enum SecureStorageKeys {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  USER_ID = "user_id",
  USER_EMAIL = "user_email",
  BIOMETRIC_ENABLED = "biometric_enabled",
}
```

## 🔑 Authentication Flow

### 1. Login

```typescript
import { useAuthStore } from "./store/useAuthStore";

const { login } = useAuthStore();

// Login with credentials
const user = { id: "123", email: "user@example.com", name: "User" };
const accessToken = "jwt_access_token_here";
const refreshToken = "jwt_refresh_token_here";

await login(user, accessToken, refreshToken);
```

**What happens:**

1. Tokens saved to SecureStore
2. User info saved to SecureStore
3. Auth state updated in Zustand
4. User is authenticated

### 2. Auto Token Injection

All API requests automatically include the Authorization header:

```typescript
// No need to manually add token
const posts = await api.getPosts();

// Token is automatically added by interceptor
// Authorization: Bearer <access_token>
```

**Implementation:**

```typescript
// api/interceptor.ts
apiClient.addRequestInterceptor(async (config) => {
  const token = await SecureStorageService.getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return { ...config, headers };
});
```

### 3. Token Refresh on 401

When a request fails with 401 (Unauthorized):

```typescript
// api/interceptor.ts
apiClient.addErrorInterceptor(async (error) => {
  if (error.status === 401) {
    const refreshToken = await SecureStorageService.getRefreshToken();

    if (refreshToken) {
      // Call your refresh token endpoint
      const newTokens = await refreshTokenAPI(refreshToken);
      await SecureStorageService.saveToken(
        newTokens.accessToken,
        newTokens.refreshToken
      );

      // Retry the original request
      return retryRequest(originalRequest);
    }
  }
});
```

### 4. Logout

```typescript
const { logout } = useAuthStore();

await logout();
```

**What happens:**

1. Tokens cleared from SecureStore
2. User info cleared from SecureStore
3. Auth state cleared in Zustand
4. User is logged out

### 5. Load Auth State (On App Start)

```typescript
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { loadAuthState } = useAuthStore();

  useEffect(() => {
    loadAuthState(); // Restore auth state from SecureStore
  }, []);
}
```

## 🔒 Best Practices

### 1. Never Store Sensitive Data in AsyncStorage

```typescript
// ❌ BAD - AsyncStorage is not encrypted
await AsyncStorage.setItem("token", accessToken);

// ✅ GOOD - SecureStore is encrypted
await SecureStorageService.saveToken(accessToken);
```

### 2. Always Clear Tokens on Logout

```typescript
// ✅ GOOD
await logout(); // Automatically clears tokens

// Or manually
await SecureStorageService.clearTokens();
await SecureStorageService.clearUserInfo();
```

### 3. Handle Token Expiration

```typescript
// ✅ GOOD - Check token validity
const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const token = await SecureStorageService.getAccessToken();
if (token && isTokenExpired(token)) {
  // Refresh token
  await refreshToken();
}
```

### 4. Use HTTPS Only

```typescript
// ❌ BAD
EXPO_PUBLIC_API_URL=http://api.example.com

// ✅ GOOD
EXPO_PUBLIC_API_URL=https://api.example.com
```

### 5. Implement Certificate Pinning (Production)

For production apps, implement SSL certificate pinning to prevent man-in-the-middle attacks.

## 🔐 Token Security

### JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  <- Header
eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZX <- Payload
UzI1NiJ9.4KepzPQfLjdSqYKFLCDRZaKOFmNfXJh <- Signature
```

**Important:**

- Header & Payload are Base64 encoded (NOT encrypted)
- Signature verifies integrity
- Never store sensitive data in JWT payload
- Always transmit over HTTPS

### Token Rotation

```typescript
// Implement token rotation for enhanced security
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

const shouldRefreshToken = (token: string) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiresIn = payload.exp * 1000 - Date.now();
  return expiresIn < REFRESH_THRESHOLD;
};
```

## 🚨 Common Security Pitfalls

### 1. ❌ Storing Tokens in State Only

```typescript
// ❌ BAD - Lost on app restart
const [token, setToken] = useState("");

// ✅ GOOD - Persisted securely
await SecureStorageService.saveToken(token);
```

### 2. ❌ Logging Sensitive Data

```typescript
// ❌ BAD
console.log("Token:", accessToken);
console.log("User password:", password);

// ✅ GOOD
console.log("User authenticated successfully");
```

### 3. ❌ Hardcoded Secrets

```typescript
// ❌ BAD
const API_KEY = "sk_live_1234567890";

// ✅ GOOD
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
```

### 4. ❌ No Token Validation

```typescript
// ❌ BAD
const token = await SecureStorageService.getAccessToken();
// Use token without checking

// ✅ GOOD
const token = await SecureStorageService.getAccessToken();
if (token && !isTokenExpired(token)) {
  // Use token
}
```

## 📱 Platform-Specific Considerations

### iOS (Keychain)

```typescript
await SecureStore.setItemAsync(key, value, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED, // Only when device unlocked
});
```

**Keychain Access Levels:**

- `WHEN_UNLOCKED` - Default, most secure
- `AFTER_FIRST_UNLOCK` - Accessible after first unlock
- `ALWAYS` - Always accessible (not recommended)

### Android (Keystore)

- Requires API Level 23+ for hardware-backed storage
- Older devices use software encryption
- Biometric authentication supported

### Web (Fallback)

```typescript
// Web fallback to localStorage
if (Platform.OS === "web") {
  // SecureStore automatically falls back to localStorage
  // Note: localStorage is NOT encrypted!
  // Consider using IndexedDB with encryption for web
}
```

## 🔍 Security Auditing

### Check Stored Data

```typescript
// Development only - never in production!
if (__DEV__) {
  const token = await SecureStorageService.getAccessToken();
  const user = await SecureStorageService.getUserInfo();

  console.log("Stored data:", {
    hasToken: !!token,
    user,
  });
}
```

### Monitor Token Usage

```typescript
// Add logging to interceptor
apiClient.addRequestInterceptor(async (config) => {
  const token = await SecureStorageService.getAccessToken();

  if (ENV.ENABLE_DEBUG) {
    console.log("Token present:", !!token);
    console.log("Token expired:", isTokenExpired(token));
  }

  return config;
});
```

## 📚 Additional Resources

- [Expo SecureStore Documentation](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [iOS Keychain Services](https://developer.apple.com/documentation/security/keychain_services)
- [Android Keystore System](https://developer.android.com/training/articles/keystore)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## ⚠️ Production Checklist

Before deploying to production:

- [ ] All API calls use HTTPS
- [ ] Tokens stored in SecureStore (not AsyncStorage)
- [ ] Token refresh implemented
- [ ] Certificate pinning configured
- [ ] No sensitive data in logs
- [ ] No hardcoded secrets
- [ ] Token expiration handling
- [ ] Logout clears all tokens
- [ ] Auth state persists across app restarts
- [ ] Error handling for auth failures
- [ ] Rate limiting on auth endpoints
- [ ] Biometric authentication (optional)

---

**Remember**: Security is not a feature, it's a requirement!
