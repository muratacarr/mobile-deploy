import { Alert } from 'react-native';
import { ApiError } from '../api/interceptor';

export interface ErrorInfo {
    title: string;
    message: string;
    code?: string;
    action?: string;
}

export class ErrorHandler {
    static getErrorInfo(error: unknown): ErrorInfo {
        if (error instanceof ApiError) {
            return this.handleApiError(error);
        }

        if (error instanceof Error) {
            return {
                title: 'Error',
                message: error.message,
                action: 'Please try again',
            };
        }

        return {
            title: 'Unknown Error',
            message: 'An unexpected error occurred',
            action: 'Please try again',
        };
    }

    private static handleApiError(error: ApiError): ErrorInfo {
        switch (error.status) {
            case 400:
                return {
                    title: 'Bad Request',
                    message: error.message || 'Invalid request. Please check your input.',
                    code: error.code,
                    action: 'Check your input and try again',
                };

            case 401:
                return {
                    title: 'Unauthorized',
                    message: 'Your session has expired. Please log in again.',
                    code: error.code,
                    action: 'Log in again',
                };

            case 403:
                return {
                    title: 'Forbidden',
                    message: 'You do not have permission to perform this action.',
                    code: error.code,
                    action: 'Contact support if you need access',
                };

            case 404:
                return {
                    title: 'Not Found',
                    message: error.message || 'The requested resource was not found.',
                    code: error.code,
                    action: 'Please try again',
                };

            case 408:
                return {
                    title: 'Request Timeout',
                    message: 'The request took too long to complete.',
                    code: 'TIMEOUT',
                    action: 'Check your connection and try again',
                };

            case 429:
                return {
                    title: 'Too Many Requests',
                    message: 'You have made too many requests. Please slow down.',
                    code: error.code,
                    action: 'Wait a moment and try again',
                };

            case 500:
            case 502:
            case 503:
            case 504:
                return {
                    title: 'Server Error',
                    message: 'The server encountered an error. Please try again later.',
                    code: error.code,
                    action: 'Try again later',
                };

            default:
                if (error.code === 'NETWORK_ERROR') {
                    return {
                        title: 'Network Error',
                        message: 'Unable to connect to the server. Please check your internet connection.',
                        code: 'NETWORK_ERROR',
                        action: 'Check your connection and try again',
                    };
                }

                if (error.code === 'TIMEOUT') {
                    return {
                        title: 'Request Timeout',
                        message: 'The request took too long to complete.',
                        code: 'TIMEOUT',
                        action: 'Check your connection and try again',
                    };
                }

                return {
                    title: 'Error',
                    message: error.message || 'An error occurred',
                    code: error.code,
                    action: 'Please try again',
                };
        }
    }

    static showErrorAlert(error: unknown, onRetry?: () => void): void {
        const errorInfo = this.getErrorInfo(error);

        const buttons: any[] = [
            { text: 'OK', style: 'cancel' },
        ];

        if (onRetry) {
            buttons.unshift({
                text: 'Retry',
                onPress: onRetry,
            });
        }

        Alert.alert(
            errorInfo.title,
            `${errorInfo.message}\n\n${errorInfo.action || ''}`,
            buttons
        );
    }

    static logError(error: unknown, context?: string): void {
        const errorInfo = this.getErrorInfo(error);

        console.error('🔴 Error:', {
            context,
            title: errorInfo.title,
            message: errorInfo.message,
            code: errorInfo.code,
            timestamp: new Date().toISOString(),
        });

        if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
        }
    }

    static getUserFriendlyMessage(error: unknown): string {
        const errorInfo = this.getErrorInfo(error);
        return errorInfo.message;
    }
}

export const handleError = (error: unknown, context?: string, onRetry?: () => void): void => {
    ErrorHandler.logError(error, context);
    ErrorHandler.showErrorAlert(error, onRetry);
};

export const getErrorMessage = (error: unknown): string => {
    return ErrorHandler.getUserFriendlyMessage(error);
};
