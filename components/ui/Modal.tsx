import React, { useEffect } from 'react';
import {
    Modal as RNModal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    ViewStyle,
    TextStyle,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    variant?: 'default' | 'bottomSheet' | 'fullScreen';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnBackdrop?: boolean;
    animationType?: 'slide' | 'fade' | 'none';
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    titleStyle?: TextStyle;
}

export default function Modal({
    visible,
    onClose,
    title,
    children,
    variant = 'default',
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    animationType = 'slide',
    containerStyle,
    contentStyle,
    titleStyle,
}: ModalProps) {
    useEffect(() => {
        if (visible) {
            // Prevent body scroll on web
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'hidden';
            }
        } else {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset';
            }
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset';
            }
        };
    }, [visible]);

    const handleBackdropPress = () => {
        if (closeOnBackdrop) {
            onClose();
        }
    };

    const modalContent = (
        <View style={[styles.container, containerStyle]}>
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <View style={[styles.content, styles[variant], styles[size], contentStyle]}>
                {(title || showCloseButton) && (
                    <View style={styles.header}>
                        {title && (
                            <Text style={[styles.title, titleStyle]}>{title}</Text>
                        )}
                        {showCloseButton && (
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <View style={styles.body}>
                    {children}
                </View>
            </View>
        </View>
    );

    return (
        <RNModal
            visible={visible}
            transparent
            animationType={animationType}
            onRequestClose={onClose}
        >
            {modalContent}
        </RNModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    content: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        maxHeight: screenHeight * 0.9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },

    // Variants
    default: {
        margin: 20,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        margin: 0,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 0,
        margin: 0,
        maxHeight: '100%',
    },

    // Sizes
    sm: {
        width: 300,
        maxWidth: '90%',
    },
    md: {
        width: 400,
        maxWidth: '90%',
    },
    lg: {
        width: 500,
        maxWidth: '95%',
    },
    xl: {
        width: 600,
        maxWidth: '95%',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        flex: 1,
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeButtonText: {
        fontSize: 20,
        color: '#94a3b8',
        lineHeight: 20,
    },

    body: {
        padding: 20,
    },
});
