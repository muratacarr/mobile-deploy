import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';

export interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    style,
    textStyle,
}: ButtonProps) {
    const buttonStyle = [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const textStyleCombined = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? '#ffffff' : '#3b82f6'}
                />
            ) : (
                <>
                    {leftIcon && <>{leftIcon}</>}
                    <Text style={textStyleCombined}>{title}</Text>
                    {rightIcon && <>{rightIcon}</>}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },

    // Variants
    primary: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    secondary: {
        backgroundColor: '#64748b',
        borderColor: '#64748b',
    },
    outline: {
        backgroundColor: 'transparent',
        borderColor: '#3b82f6',
    },
    ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    danger: {
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
    },

    // Sizes
    sm: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 32,
    },
    md: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 40,
    },
    lg: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 48,
    },

    // States
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },

    // Text styles
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryText: {
        color: '#ffffff',
    },
    secondaryText: {
        color: '#ffffff',
    },
    outlineText: {
        color: '#3b82f6',
    },
    ghostText: {
        color: '#3b82f6',
    },
    dangerText: {
        color: '#ffffff',
    },

    // Text sizes
    smText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 16,
    },
    lgText: {
        fontSize: 18,
    },

    disabledText: {
        opacity: 0.7,
    },
});
