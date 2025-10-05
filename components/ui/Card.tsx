import React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';

export interface CardProps extends TouchableOpacityProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'filled';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    onPress?: () => void;
    style?: ViewStyle;
}

export default function Card({
    children,
    variant = 'default',
    padding = 'lg',
    margin = 'none',
    borderRadius = 'md',
    onPress,
    style,
    ...props
}: CardProps) {
    const cardStyle = [
        styles.base,
        styles[variant],
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
        styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}`],
        styles[`borderRadius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}`],
        onPress && styles.pressable,
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.95}
                {...props}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#1e293b',
    },

    // Variants
    default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    outlined: {
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    filled: {
        backgroundColor: '#334155',
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    // Padding
    paddingNone: {
        padding: 0,
    },
    paddingSm: {
        padding: 8,
    },
    paddingMd: {
        padding: 12,
    },
    paddingLg: {
        padding: 16,
    },
    paddingXl: {
        padding: 20,
    },

    // Margin
    marginNone: {
        margin: 0,
    },
    marginSm: {
        margin: 8,
    },
    marginMd: {
        margin: 12,
    },
    marginLg: {
        margin: 16,
    },
    marginXl: {
        margin: 20,
    },

    // Border radius
    borderRadiusNone: {
        borderRadius: 0,
    },
    borderRadiusSm: {
        borderRadius: 4,
    },
    borderRadiusMd: {
        borderRadius: 8,
    },
    borderRadiusLg: {
        borderRadius: 12,
    },
    borderRadiusXl: {
        borderRadius: 16,
    },

    // States
    pressable: {
        // Additional styles for pressable cards
    },
});
