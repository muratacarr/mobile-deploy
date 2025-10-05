import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import SecureStorageService from '../services/secureStorage';

export default function AuthDemoScreen() {
    const { isAuthenticated, user, login, logout, loadAuthState } = useAuthStore();
    const [email, setEmail] = useState('demo@example.com');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter an email');
            return;
        }

        try {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock tokens and user data
            const mockUser = {
                id: Date.now().toString(),
                email: email.trim(),
                name: 'Demo User',
            };

            const mockAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ userId: mockUser.id, email: mockUser.email }))}`;
            const mockRefreshToken = `refresh_${Date.now()}`;

            await login(mockUser, mockAccessToken, mockRefreshToken);

            Alert.alert('Success', 'Logged in successfully!');
        } catch (error) {
            Alert.alert('Error', 'Login failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await logout();
                            Alert.alert('Success', 'Logged out successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Logout failed');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleShowTokens = async () => {
        try {
            const accessToken = await SecureStorageService.getAccessToken();
            const refreshToken = await SecureStorageService.getRefreshToken();

            Alert.alert(
                'Stored Tokens',
                `Access Token: ${accessToken?.substring(0, 50)}...\n\nRefresh Token: ${refreshToken?.substring(0, 50)}...`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to load tokens');
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.emoji}>🔐</Text>
                <Text style={styles.title}>Auth Demo</Text>
                <Text style={styles.subtitle}>Secure Token Storage with SecureStore</Text>
            </View>

            {!isAuthenticated ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Login</Text>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#64748b"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.loginButtonText}>
                            {loading ? 'Logging in...' : '🔑 Login (Demo)'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            This is a demo login. Tokens will be securely stored in SecureStore.
                        </Text>
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>✅ Authenticated</Text>

                        <View style={styles.userInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                </Text>
                            </View>
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                                <Text style={styles.userEmail}>{user?.email}</Text>
                                <Text style={styles.userId}>ID: {user?.id}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>🔑 Token Management</Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleShowTokens}
                        >
                            <Text style={styles.actionButtonText}>👁️ View Stored Tokens</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={loadAuthState}
                        >
                            <Text style={styles.actionButtonText}>🔄 Reload Auth State</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.logoutButton]}
                            onPress={handleLogout}
                            disabled={loading}
                        >
                            <Text style={styles.logoutButtonText}>
                                {loading ? '⏳ Logging out...' : '🚪 Logout'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>🛡️ Security Features</Text>
                <Text style={styles.featureText}>• Tokens stored in SecureStore (Keychain/Keystore)</Text>
                <Text style={styles.featureText}>• Automatic token injection in API calls</Text>
                <Text style={styles.featureText}>• Token refresh on 401 errors</Text>
                <Text style={styles.featureText}>• Secure user info storage</Text>
                <Text style={styles.featureText}>• Zustand state management</Text>
                <Text style={styles.featureText}>• Web fallback to localStorage</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Tokens are encrypted and stored securely on device
                </Text>
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
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#334155',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 16,
    },
    loginButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    disabledButton: {
        opacity: 0.5,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoBox: {
        backgroundColor: '#1e40af20',
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
    },
    infoText: {
        fontSize: 12,
        color: '#94a3b8',
        lineHeight: 18,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 4,
    },
    userId: {
        fontSize: 12,
        color: '#64748b',
        fontFamily: 'monospace',
    },
    actionButton: {
        backgroundColor: '#334155',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    infoCardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 6,
        lineHeight: 20,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
});
