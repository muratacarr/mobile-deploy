import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCounterStore } from '../store/useCounterStore';
import { Button, Card } from '../components/ui';

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

            <Card variant="elevated" padding="lg" margin="md">
                <Text style={styles.cardTitle}>{t('home.counterDemo')}</Text>
                <View style={styles.counterContainer}>
                    <Button
                        title="−"
                        onPress={decrement}
                        variant="outline"
                        size="lg"
                        style={styles.counterButton}
                    />

                    <View style={styles.countDisplay}>
                        <Text style={styles.countText}>{count}</Text>
                    </View>

                    <Button
                        title="+"
                        onPress={increment}
                        variant="outline"
                        size="lg"
                        style={styles.counterButton}
                    />
                </View>

                <Button
                    title={t('home.resetCounter')}
                    onPress={reset}
                    variant="secondary"
                    size="md"
                    fullWidth
                />
            </Card>

            <Card variant="outlined" padding="lg" margin="md">
                <Text style={styles.infoTitle}>✨ {t('home.features')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.zustand')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.asyncStorage')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.interactiveCounter')}</Text>
                <Text style={styles.infoText}>• {t('home.featureList.modernUI')}</Text>
            </Card>
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
    counterButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
    // Reset button styles are now handled by the Button component
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
