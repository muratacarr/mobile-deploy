import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const { width, height } = Dimensions.get('window');

const NoNetworkScreen: React.FC = () => {
    const { t } = useTranslation();
    const { isConnected } = useNetworkStatus();

    // Animasyon değerleri
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Giriş animasyonu
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animasyonu (sürekli)
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();

        // Rotate animasyonu (sürekli)
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );
        rotateAnimation.start();

        return () => {
            pulseAnimation.stop();
            rotateAnimation.stop();
        };
    }, []);

    const handleRetry = () => {
        // Retry butonuna basıldığında animasyon
        Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Arka plan gradient efekti */}
            <View style={styles.backgroundGradient} />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                {/* Ana ikon - animasyonlu */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            transform: [
                                { scale: pulseAnim },
                                { rotate: rotateInterpolate }
                            ]
                        }
                    ]}
                >
                    <Text style={styles.icon}>📶</Text>
                </Animated.View>

                {/* Başlık */}
                <Text style={styles.title}>{t('noNetwork.title')}</Text>

                {/* Açıklama metni */}
                <Text style={styles.message}>{t('noNetwork.message')}</Text>

                {/* Retry butonu */}
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity
                        style={[
                            styles.retryButton,
                            !isConnected && styles.retryButtonDisabled
                        ]}
                        onPress={handleRetry}
                        disabled={!isConnected}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.retryButtonText}>{t('noNetwork.retry')}</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Durum göstergesi */}
                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusIndicator,
                        { backgroundColor: isConnected ? '#10B981' : '#EF4444' }
                    ]} />
                    <Text style={styles.status}>
                        {isConnected ? t('noNetwork.connected') : t('noNetwork.disconnected')}
                    </Text>
                </View>

                {/* Alt bilgi */}
                <Text style={styles.tipText}>
                    {t('noNetwork.tip')}
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 0.05,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
        maxWidth: 340,
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    iconContainer: {
        marginBottom: 24,
        padding: 20,
        borderRadius: 50,
        backgroundColor: '#F1F5F9',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    icon: {
        fontSize: 48,
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    retryButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#3B82F6',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        minWidth: 140,
    },
    retryButtonDisabled: {
        backgroundColor: '#94A3B8',
        shadowOpacity: 0,
        elevation: 0,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    status: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    tipText: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 18,
    },
});

export default NoNetworkScreen;
