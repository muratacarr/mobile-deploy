import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCounterStore } from '../store/useCounterStore';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import { ENV, isDevelopment } from '../config/env';

export default function ProfileScreen() {
    const { count, reset: resetCounter } = useCounterStore();
    const { tasks, clearCompleted } = useTaskStore();
    const { isAuthenticated, user } = useAuthStore();

    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = tasks.length - completedTasks;

    const handleResetAll = () => {
        Alert.alert(
            'Reset All Data',
            'Are you sure you want to reset all data? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        resetCounter();
                        clearCompleted();
                        Alert.alert('Success', 'All data has been reset');
                    }
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.emoji}>👤</Text>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.subtitle}>Your app statistics</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>📊 Statistics</Text>

                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{count}</Text>
                        <Text style={styles.statLabel}>Counter Value</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{tasks.length}</Text>
                        <Text style={styles.statLabel}>Total Tasks</Text>
                    </View>
                </View>

                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#10b981' }]}>{activeTasks}</Text>
                        <Text style={styles.statLabel}>Active Tasks</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#64748b' }]}>{completedTasks}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🔐 Authentication</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Status</Text>
                    <View style={[styles.badge, isAuthenticated ? styles.authenticatedBadge : styles.unauthenticatedBadge]}>
                        <Text style={styles.badgeText}>
                            {isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}
                        </Text>
                    </View>
                </View>

                {isAuthenticated && user && (
                    <>
                        <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>User Email</Text>
                            <Text style={styles.settingValue}>{user.email}</Text>
                        </View>

                        <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>User ID</Text>
                            <Text style={[styles.settingValue, styles.smallText]} numberOfLines={1}>
                                {user.id}
                            </Text>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>⚙️ Settings</Text>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>📱 App Name</Text>
                    <Text style={styles.settingValue}>{ENV.APP_NAME}</Text>
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>🔢 Version</Text>
                    <Text style={styles.settingValue}>{ENV.APP_VERSION}</Text>
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>🌐 API URL</Text>
                    <Text style={[styles.settingValue, styles.smallText]} numberOfLines={1}>
                        {ENV.API_URL}
                    </Text>
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>🔧 Environment</Text>
                    <Text style={[styles.settingValue, isDevelopment ? styles.devBadge : styles.prodBadge]}>
                        {isDevelopment ? 'Development' : 'Production'}
                    </Text>
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>🎨 Theme</Text>
                    <Text style={styles.settingValue}>Dark</Text>
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>💾 Storage</Text>
                    <Text style={styles.settingValue}>AsyncStorage</Text>
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>📊 State Manager</Text>
                    <Text style={styles.settingValue}>Zustand</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🚀 Tech Stack</Text>
                <Text style={styles.techText}>• React Native 0.81.4</Text>
                <Text style={styles.techText}>• React 19.1.0</Text>
                <Text style={styles.techText}>• Expo 54</Text>
                <Text style={styles.techText}>• TypeScript 5.9.2</Text>
                <Text style={styles.techText}>• Zustand (State Management)</Text>
                <Text style={styles.techText}>• TanStack Query (Server State)</Text>
                <Text style={styles.techText}>• React Navigation</Text>
                <Text style={styles.techText}>• AsyncStorage & SecureStore</Text>
                <Text style={styles.techText}>• Environment Variables (.env)</Text>
            </View>

            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetAll}
            >
                <Text style={styles.resetButtonText}>🔄 Reset All Data</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with ❤️ using Expo</Text>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
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
    statRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#334155',
        marginHorizontal: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    settingLabel: {
        fontSize: 16,
        color: '#ffffff',
        flex: 1,
    },
    settingValue: {
        fontSize: 14,
        color: '#94a3b8',
        flex: 1,
        textAlign: 'right',
    },
    smallText: {
        fontSize: 11,
    },
    devBadge: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '600',
        overflow: 'hidden',
    },
    prodBadge: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '600',
        overflow: 'hidden',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authenticatedBadge: {
        backgroundColor: '#10b98120',
        borderWidth: 1,
        borderColor: '#10b981',
    },
    unauthenticatedBadge: {
        backgroundColor: '#64748b20',
        borderWidth: 1,
        borderColor: '#64748b',
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    techText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 8,
        lineHeight: 20,
    },
    resetButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    resetButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 4,
    },
    versionText: {
        fontSize: 12,
        color: '#64748b',
    },
});
