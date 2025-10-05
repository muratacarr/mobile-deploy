# Environment Variables Setup Guide

This guide explains how to configure environment variables for the Modern Expo App.

## 📋 Overview

The app uses Expo's environment variable system with the `EXPO_PUBLIC_` prefix for client-side variables.

## 🔧 Configuration Files

### `.env` (Local Development)

Your local environment configuration. **This file is gitignored** and should never be committed.

### `.env.example` (Template)

Template file showing all available environment variables. This file is committed to the repository.

## 📝 Available Variables

### API Configuration

```bash
EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

- **Description**: Backend API base URL
- **Required**: Yes
- **Default**: `https://jsonplaceholder.typicode.com`
- **Example**: `https://api.yourapp.com`

### App Configuration

```bash
EXPO_PUBLIC_APP_NAME=Modern Expo App
EXPO_PUBLIC_APP_VERSION=1.0.0
```

- **APP_NAME**: Display name of the application
- **APP_VERSION**: Current version number

### Feature Flags

```bash
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_DEBUG=true
```

- **ENABLE_ANALYTICS**: Toggle analytics tracking
- **ENABLE_DEBUG**: Enable debug logging and features

## 🚀 Setup Instructions

### 1. Initial Setup

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your values
nano .env  # or use your preferred editor
```

### 2. Configure Your Values

Edit `.env` with your specific configuration:

```bash
# Development
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=MyApp Dev
EXPO_PUBLIC_ENABLE_DEBUG=true

# Production
EXPO_PUBLIC_API_URL=https://api.production.com
EXPO_PUBLIC_APP_NAME=MyApp
EXPO_PUBLIC_ENABLE_DEBUG=false
```

### 3. Restart Development Server

After changing environment variables, restart the Expo development server:

```bash
# Stop the current server (Ctrl+C)
# Start again
npm start
```

## 💻 Usage in Code

### Import and Use

```typescript
import { ENV } from "./config/env";

// Access environment variables
console.log(ENV.API_URL);
console.log(ENV.APP_NAME);
console.log(ENV.APP_VERSION);

// Check environment
import { isDevelopment, isProduction } from "./config/env";

if (isDevelopment) {
  console.log("Running in development mode");
}
```

### In API Calls

```typescript
import { ENV } from "../config/env";

const response = await fetch(`${ENV.API_URL}/api/endpoint`);
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They contain sensitive information
2. **Use SecureStore for sensitive data** - Tokens, passwords, API keys
3. **Prefix all variables with `EXPO_PUBLIC_`** - Required for Expo
4. **Different configs for different environments** - Dev, staging, production
5. **Validate environment variables** - Check if required variables are set

## 🌍 Multiple Environments

### Development

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENABLE_DEBUG=true
```

### Staging

```bash
EXPO_PUBLIC_API_URL=https://staging-api.yourapp.com
EXPO_PUBLIC_ENABLE_DEBUG=true
```

### Production

```bash
EXPO_PUBLIC_API_URL=https://api.yourapp.com
EXPO_PUBLIC_ENABLE_DEBUG=false
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

## 🐛 Troubleshooting

### Variables Not Loading

1. **Restart the development server** - Environment variables are loaded at startup
2. **Check the prefix** - All variables must start with `EXPO_PUBLIC_`
3. **Check app.json** - Ensure variables are listed in `extra` section
4. **Clear cache** - `expo start -c` to clear cache

### Common Issues

**Issue**: Environment variable is undefined

```typescript
// ❌ Wrong
console.log(process.env.API_URL);

// ✅ Correct
import { ENV } from "./config/env";
console.log(ENV.API_URL);
```

**Issue**: Changes not reflected

```bash
# Solution: Restart with cache clear
expo start -c
```

## 📚 Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [React Native Config](https://reactnative.dev/docs/environment-variables)
- [Security Best Practices](https://docs.expo.dev/guides/security/)

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
env:
  EXPO_PUBLIC_API_URL: ${{ secrets.API_URL }}
  EXPO_PUBLIC_APP_NAME: ${{ secrets.APP_NAME }}
```

### EAS Build

Configure in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.production.com"
      }
    }
  }
}
```

---

**Note**: Always keep your `.env` file secure and never commit it to version control!
