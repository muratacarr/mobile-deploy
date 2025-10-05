import { ENV } from '../config/env';

export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface RequestConfig extends RequestInit {
    timeout?: number;
    retries?: number;
}

class ApiInterceptor {
    private baseURL: string;
    private defaultTimeout: number = 30000;
    private requestInterceptors: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>> = [];
    private responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = [];
    private errorInterceptors: Array<(error: ApiError) => void | Promise<void>> = [];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>) {
        this.requestInterceptors.push(interceptor);
    }

    addResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>) {
        this.responseInterceptors.push(interceptor);
    }

    addErrorInterceptor(interceptor: (error: ApiError) => void | Promise<void>) {
        this.errorInterceptors.push(interceptor);
    }

    private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
        let modifiedConfig = config;
        for (const interceptor of this.requestInterceptors) {
            modifiedConfig = await interceptor(modifiedConfig);
        }
        return modifiedConfig;
    }

    private async executeResponseInterceptors(response: Response): Promise<Response> {
        let modifiedResponse = response;
        for (const interceptor of this.responseInterceptors) {
            modifiedResponse = await interceptor(modifiedResponse);
        }
        return modifiedResponse;
    }

    private async executeErrorInterceptors(error: ApiError): Promise<void> {
        for (const interceptor of this.errorInterceptors) {
            await interceptor(error);
        }
    }

    private async fetchWithTimeout(url: string, config: RequestConfig): Promise<Response> {
        const timeout = config.timeout || this.defaultTimeout;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408, 'TIMEOUT');
            }
            throw error;
        }
    }

    private async fetchWithRetry(url: string, config: RequestConfig): Promise<Response> {
        const retries = config.retries || 0;
        let lastError: Error | null = null;

        for (let i = 0; i <= retries; i++) {
            try {
                return await this.fetchWithTimeout(url, config);
            } catch (error) {
                lastError = error as Error;
                if (i < retries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                }
            }
        }

        throw lastError;
    }

    async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        try {
            const url = `${this.baseURL}${endpoint}`;

            let modifiedConfig = await this.executeRequestInterceptors(config);

            if (ENV.ENABLE_DEBUG) {
                console.log('🌐 API Request:', {
                    url,
                    method: modifiedConfig.method || 'GET',
                    headers: modifiedConfig.headers,
                });
            }

            let response = await this.fetchWithRetry(url, modifiedConfig);

            response = await this.executeResponseInterceptors(response);

            if (!response.ok) {
                const errorData = await this.parseErrorResponse(response);
                const error = new ApiError(
                    errorData.message || `HTTP Error ${response.status}`,
                    response.status,
                    errorData.code,
                    errorData.data
                );

                await this.executeErrorInterceptors(error);
                throw error;
            }

            const data = await response.json();

            if (ENV.ENABLE_DEBUG) {
                console.log('✅ API Response:', {
                    url,
                    status: response.status,
                    data,
                });
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            const apiError = new ApiError(
                error instanceof Error ? error.message : 'Unknown error',
                undefined,
                'NETWORK_ERROR'
            );

            await this.executeErrorInterceptors(apiError);
            throw apiError;
        }
    }

    private async parseErrorResponse(response: Response): Promise<{ message: string; code?: string; data?: any }> {
        try {
            const data = await response.json();
            return {
                message: data.message || data.error || 'An error occurred',
                code: data.code,
                data: data,
            };
        } catch {
            return {
                message: response.statusText || 'An error occurred',
                code: `HTTP_${response.status}`,
            };
        }
    }

    get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    post<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    patch<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

const apiClient = new ApiInterceptor(ENV.API_URL);

// Request interceptor - Add default headers and auth token
apiClient.addRequestInterceptor(async (config) => {
    const headers = new Headers(config.headers);

    // Add default headers
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    headers.set('Accept', 'application/json');

    // Add auth token if available
    try {
        const SecureStorageService = (await import('../services/secureStorage')).default;
        const token = await SecureStorageService.getAccessToken();

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);

            if (ENV.ENABLE_DEBUG) {
                console.log('🔑 Auth token added to request');
            }
        }
    } catch (error) {
        // Token not available, continue without auth
        if (ENV.ENABLE_DEBUG) {
            console.log('ℹ️ No auth token available');
        }
    }

    return {
        ...config,
        headers,
    };
});

apiClient.addResponseInterceptor((response) => {
    if (ENV.ENABLE_DEBUG) {
        console.log('📥 Response received:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
        });
    }
    return response;
});

// Error interceptor - Handle auth errors and token refresh
apiClient.addErrorInterceptor(async (error) => {
    console.error('❌ API Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        data: error.data,
    });

    if (error.status === 401) {
        console.warn('🔒 Unauthorized - Token may be expired');

        // Try to refresh token
        try {
            const SecureStorageService = (await import('../services/secureStorage')).default;
            const refreshToken = await SecureStorageService.getRefreshToken();

            if (refreshToken) {
                console.log('🔄 Attempting to refresh token...');
                // Here you would call your refresh token endpoint
                // const newTokens = await refreshTokenAPI(refreshToken);
                // await SecureStorageService.saveToken(newTokens.accessToken, newTokens.refreshToken);
            } else {
                console.warn('⚠️ No refresh token available - User needs to login');
                // Clear auth state
                await SecureStorageService.clearTokens();
                await SecureStorageService.clearUserInfo();
            }
        } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
        }
    } else if (error.status === 403) {
        console.warn('🚫 Forbidden - Insufficient permissions');
    } else if (error.status === 404) {
        console.warn('🔍 Not Found - Resource does not exist');
    } else if (error.status === 500) {
        console.error('💥 Server Error - Internal server error');
    } else if (error.code === 'TIMEOUT') {
        console.error('⏱️ Request Timeout');
    } else if (error.code === 'NETWORK_ERROR') {
        console.error('📡 Network Error - Check your connection');
    }
});

export { apiClient };
export default apiClient;
