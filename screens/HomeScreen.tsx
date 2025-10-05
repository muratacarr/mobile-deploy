import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCounterStore } from '../store/useCounterStore';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { count, increment, decrement, reset } = useCounterStore();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.emoji}>🏠</Text>
                <Text style={styles.title}>{t('home.title')}</Text>
                <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('home.counterDemo')}</Text>
                <View style={styles.counterContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={decrement}
                    >
                        <Text style={styles.buttonText}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.countDisplay}>
                        <Text style={styles.countText}>{count}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={increment}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={reset}
                >
                    <Text style={styles.resetButtonText}>{t('home.resetCounter')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>✨ {t('home.features')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.zustand')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.asyncStorage')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.interactiveCounter')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.modernUI')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#3b82f6',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontSize: 32,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    countDisplay: {
        backgroundColor: '#334155',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    countText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    resetButton: {
        backgroundColor: '#475569',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 6,
        lineHeight: 20,
    },
});
