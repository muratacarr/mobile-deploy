# Error Handling Guide

Comprehensive error handling documentation for the Modern Expo App.

## 🎯 Overview

This app implements a multi-layered error handling strategy:

1. **API Interceptor** - Catches and processes HTTP errors
2. **Error Handler Utility** - Centralizes error processing and user feedback
3. **Error Boundary** - Catches React component errors
4. **TanStack Query** - Handles async data fetching errors

## 🔧 Architecture

### 1. API Interceptor (`api/interceptor.ts`)

The API interceptor provides:

- ✅ Request/Response interception
- ✅ Automatic retries with exponential backoff
- ✅ Timeout handling
- ✅ Custom error types
- ✅ Centralized error logging

#### Features

**Request Interceptors**

```typescript
apiClient.addRequestInterceptor((config) => {
  // Add auth token
  const headers = new Headers(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...config, headers };
});
```

**Response Interceptors**

```typescript
apiClient.addResponseInterceptor((response) => {
  // Log all responses
  console.log("Response:", response.status);
  return response;
});
```

**Error Interceptors**

```typescript
apiClient.addErrorInterceptor((error) => {
  // Handle specific errors
  if (error.status === 401) {
    // Redirect to login
  }
});
```

#### Usage

```typescript
// GET request with timeout and retries
const posts = await apiClient.get("/posts", {
  timeout: 10000,
  retries: 2,
});

// POST request
const newPost = await apiClient.post("/posts", {
  title: "New Post",
  body: "Content",
});

// PUT request
await apiClient.put("/posts/1", { title: "Updated" });

// DELETE request
await apiClient.delete("/posts/1");
```

### 2. Error Handler (`utils/errorHandler.ts`)

Centralized error processing and user-friendly messages.

#### Error Types

| HTTP Status | User Message      | Action           |
| ----------- | ----------------- | ---------------- |
| 400         | Bad Request       | Check your input |
| 401         | Unauthorized      | Log in again     |
| 403         | Forbidden         | Contact support  |
| 404         | Not Found         | Try again        |
| 408         | Request Timeout   | Check connection |
| 429         | Too Many Requests | Wait and retry   |
| 500+        | Server Error      | Try again later  |
| Network     | Network Error     | Check connection |

#### Usage

```typescript
import { handleError, getErrorMessage } from "../utils/errorHandler";

try {
  await api.getPosts();
} catch (error) {
  // Show alert with retry option
  handleError(error, "Loading posts", () => refetch());

  // Or just get the message
  const message = getErrorMessage(error);
  console.log(message);
}
```

### 3. Error Boundary (`components/ErrorBoundary.tsx`)

Catches React component errors and provides fallback UI.

#### Usage

```typescript
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}

// With custom fallback
<ErrorBoundary fallback={<CustomErrorScreen />}>
  <YourApp />
</ErrorBoundary>;
```

### 4. TanStack Query Error Handling

Automatic error handling for data fetching.

```typescript
const { data, error, isError, refetch } = useQuery({
  queryKey: ["posts"],
  queryFn: api.getPosts,
  retry: 2,
});

if (isError) {
  return <ErrorView error={error} onRetry={refetch} />;
}
```

## 🎨 Error UI Components

### Loading State

```typescript
{
  isLoading && (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text>Loading...</Text>
    </View>
  );
}
```

### Error State

```typescript
{
  error && (
    <View style={styles.centerContainer}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Error Title</Text>
      <Text style={styles.errorText}>{getErrorMessage(error)}</Text>
      <TouchableOpacity onPress={refetch}>
        <Text>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🔍 Error Types

### ApiError

Custom error class for API errors:

```typescript
class ApiError extends Error {
  status?: number; // HTTP status code
  code?: string; // Custom error code
  data?: any; // Additional error data
}
```

### Common Error Codes

- `TIMEOUT` - Request timeout
- `NETWORK_ERROR` - Network connection issue
- `HTTP_400` - Bad request
- `HTTP_401` - Unauthorized
- `HTTP_403` - Forbidden
- `HTTP_404` - Not found
- `HTTP_500` - Server error

## 📝 Best Practices

### 1. Always Handle Errors

```typescript
// ❌ Bad
const data = await api.getPosts();

// ✅ Good
try {
  const data = await api.getPosts();
} catch (error) {
  handleError(error, "Fetching posts");
}
```

### 2. Provide Context

```typescript
// ❌ Bad
handleError(error);

// ✅ Good
handleError(error, "Loading user profile", () => refetch());
```

### 3. Use Appropriate Error Messages

```typescript
// ❌ Bad
Alert.alert("Error", error.toString());

// ✅ Good
const message = getErrorMessage(error);
Alert.alert("Error", message);
```

### 4. Log Errors for Debugging

```typescript
ErrorHandler.logError(error, "User action context");
```

### 5. Provide Retry Options

```typescript
handleError(error, "Loading data", () => {
  // Retry logic
  refetch();
});
```

## 🐛 Debugging

### Enable Debug Mode

In `.env`:

```bash
EXPO_PUBLIC_ENABLE_DEBUG=true
```

This enables:

- ✅ Request/response logging
- ✅ Error stack traces
- ✅ Detailed error information

### Console Logs

The app logs errors with context:

```
🌐 API Request: { url, method, headers }
✅ API Response: { url, status, data }
❌ API Error: { message, status, code, data }
🔴 Error: { context, title, message, code }
```

## 🔐 Security Considerations

1. **Never expose sensitive data in errors**

   ```typescript
   // ❌ Bad
   console.log("Error:", error.data.password);

   // ✅ Good
   console.log("Error:", error.message);
   ```

2. **Sanitize error messages for users**

   - Don't show stack traces to users
   - Don't expose internal API details
   - Use user-friendly messages

3. **Log errors securely**
   - In production, send to error tracking service
   - Don't log sensitive user data
   - Comply with privacy regulations

## 📊 Error Monitoring

### Future Integration

Consider integrating with:

- **Sentry** - Error tracking and monitoring
- **Bugsnag** - Real-time error reporting
- **Firebase Crashlytics** - Crash reporting

Example Sentry integration:

```typescript
import * as Sentry from "@sentry/react-native";

apiClient.addErrorInterceptor((error) => {
  Sentry.captureException(error);
});
```

## 🧪 Testing Error Handling

### Simulate Errors

```typescript
// Timeout error
await apiClient.get("/posts", { timeout: 1 });

// Network error (offline)
// Turn off network in simulator

// 404 error
await apiClient.get("/invalid-endpoint");

// 500 error
// Mock server error response
```

## 📚 Additional Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [TanStack Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Remember**: Good error handling improves user experience and makes debugging easier!
