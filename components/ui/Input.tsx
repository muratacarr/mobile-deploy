import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
} from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    placeholder?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    variant?: 'default' | 'filled' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    required?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
}

export default function Input({
    label,
    placeholder,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconPress,
    variant = 'outlined',
    size = 'md',
    disabled = false,
    required = false,
    containerStyle,
    inputStyle,
    labelStyle,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyles = [
        styles.container,
        containerStyle,
    ];

    const inputContainerStyles = [
        styles.inputContainer,
        styles[variant],
        styles[size],
        isFocused && styles.focused,
        error && styles.error,
        disabled && styles.disabled,
    ];

    const inputStyles = [
        styles.input,
        styles[`${size}Input`],
        leftIcon && styles.inputWithLeftIcon,
        rightIcon && styles.inputWithRightIcon,
        inputStyle,
    ];

    const labelStyles = [
        styles.label,
        error && styles.errorLabel,
        disabled && styles.disabledLabel,
        labelStyle,
    ];

    return (
        <View style={containerStyles}>
            {label && (
                <Text style={labelStyles}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <View style={inputContainerStyles}>
                {leftIcon && (
                    <View style={styles.leftIcon}>
                        {leftIcon}
                    </View>
                )}

                <TextInput
                    style={inputStyles}
                    placeholder={placeholder}
                    placeholderTextColor="#64748b"
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {(error || helperText) && (
                <Text style={[styles.helperText, error && styles.errorText]}>
                    {error || helperText}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94a3b8',
        marginBottom: 4,
    },

    required: {
        color: '#ef4444',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
    },

    // Variants
    default: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
    },
    filled: {
        backgroundColor: '#334155',
        borderColor: 'transparent',
    },
    outlined: {
        backgroundColor: 'transparent',
        borderColor: '#334155',
    },

    // Sizes
    sm: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 36,
    },
    md: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
    },
    lg: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 52,
    },

    // States
    focused: {
        borderColor: '#3b82f6',
    },
    error: {
        borderColor: '#ef4444',
    },
    disabled: {
        opacity: 0.5,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#ffffff',
        padding: 0,
    },

    // Input sizes
    smInput: {
        fontSize: 14,
    },
    mdInput: {
        fontSize: 16,
    },
    lgInput: {
        fontSize: 18,
    },

    inputWithLeftIcon: {
        marginLeft: 8,
    },
    inputWithRightIcon: {
        marginRight: 8,
    },

    leftIcon: {
        marginRight: 8,
    },
    rightIcon: {
        marginLeft: 8,
    },

    helperText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },

    errorText: {
        color: '#ef4444',
    },

    errorLabel: {
        color: '#ef4444',
    },

    disabledLabel: {
        opacity: 0.5,
    },
});
