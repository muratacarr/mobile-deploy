import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
} from 'react-native';
import { Button, Input, Modal, Card } from '../components/ui';

export default function ComponentDemoScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleButtonPress = (variant: string) => {
        Alert.alert('Button Pressed', `${variant} button was pressed!`);
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.title}>🧩 Component Library</Text>
                <Text style={styles.subtitle}>Reusable UI Components Demo</Text>
            </View>

            {/* Buttons Section */}
            <Card variant="elevated" padding="lg" margin="md">
                <Text style={styles.sectionTitle}>🔘 Buttons</Text>

                <View style={styles.buttonGroup}>
                    <Button
                        title="Primary"
                        onPress={() => handleButtonPress('Primary')}
                        variant="primary"
                        size="md"
                    />
                    <Button
                        title="Secondary"
                        onPress={() => handleButtonPress('Secondary')}
                        variant="secondary"
                        size="md"
                    />
                    <Button
                        title="Outline"
                        onPress={() => handleButtonPress('Outline')}
                        variant="outline"
                        size="md"
                    />
                </View>

                <View style={styles.buttonGroup}>
                    <Button
                        title="Ghost"
                        onPress={() => handleButtonPress('Ghost')}
                        variant="ghost"
                        size="sm"
                    />
                    <Button
                        title="Danger"
                        onPress={() => handleButtonPress('Danger')}
                        variant="danger"
                        size="lg"
                    />
                    <Button
                        title="Loading"
                        onPress={() => handleButtonPress('Loading')}
                        variant="primary"
                        loading
                    />
                </View>

                <View style={styles.buttonGroup}>
                    <Button
                        title="Full Width"
                        onPress={() => handleButtonPress('Full Width')}
                        variant="primary"
                        fullWidth
                    />
                </View>
            </Card>

            {/* Inputs Section */}
            <Card variant="elevated" padding="lg" margin="md">
                <Text style={styles.sectionTitle}>📝 Inputs</Text>

                <Input
                    label="Default Input"
                    placeholder="Enter text here..."
                    value={inputValue}
                    onChangeText={setInputValue}
                    variant="outlined"
                    size="md"
                />

                <Input
                    label="Filled Input"
                    placeholder="Filled variant"
                    variant="filled"
                    size="md"
                />

                <Input
                    label="With Error"
                    placeholder="This has an error"
                    error="This field is required"
                    variant="outlined"
                    size="md"
                />

                <Input
                    label="Disabled Input"
                    placeholder="This is disabled"
                    disabled
                    variant="outlined"
                    size="md"
                />

                <Input
                    label="Required Field"
                    placeholder="This field is required"
                    required
                    variant="outlined"
                    size="md"
                />
            </Card>

            {/* Cards Section */}
            <Card variant="elevated" padding="lg" margin="md">
                <Text style={styles.sectionTitle}>🃏 Cards</Text>

                <View style={styles.cardGroup}>
                    <Card variant="default" padding="md" margin="sm">
                        <Text style={styles.cardText}>Default Card</Text>
                    </Card>

                    <Card variant="elevated" padding="md" margin="sm">
                        <Text style={styles.cardText}>Elevated Card</Text>
                    </Card>

                    <Card variant="outlined" padding="md" margin="sm">
                        <Text style={styles.cardText}>Outlined Card</Text>
                    </Card>

                    <Card variant="filled" padding="md" margin="sm">
                        <Text style={styles.cardText}>Filled Card</Text>
                    </Card>
                </View>

                <Card
                    variant="elevated"
                    padding="lg"
                    margin="sm"
                    onPress={() => Alert.alert('Card Pressed', 'This card is pressable!')}
                >
                    <Text style={styles.cardText}>Pressable Card</Text>
                    <Text style={styles.cardSubtext}>Tap me!</Text>
                </Card>
            </Card>

            {/* Modal Demo */}
            <Card variant="elevated" padding="lg" margin="md">
                <Text style={styles.sectionTitle}>🪟 Modal</Text>

                <View style={styles.buttonGroup}>
                    <Button
                        title="Open Modal"
                        onPress={() => setModalVisible(true)}
                        variant="primary"
                        size="md"
                    />
                </View>
            </Card>

            {/* Form Example */}
            <Card variant="elevated" padding="lg" margin="md">
                <Text style={styles.sectionTitle}>📋 Form Example</Text>

                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    variant="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    variant="outlined"
                    secureTextEntry
                />

                <View style={styles.buttonGroup}>
                    <Button
                        title="Login"
                        onPress={() => Alert.alert('Login', `Email: ${email}`)}
                        variant="primary"
                        size="lg"
                        fullWidth
                    />
                </View>
            </Card>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="Component Demo Modal"
                variant="default"
                size="md"
            >
                <Text style={styles.modalText}>
                    This is a modal component from the UI library!
                </Text>
                <Text style={styles.modalSubtext}>
                    You can put any content here.
                </Text>
                <View style={styles.modalButtons}>
                    <Button
                        title="Close"
                        onPress={() => setModalVisible(false)}
                        variant="outline"
                        size="md"
                    />
                    <Button
                        title="Action"
                        onPress={() => {
                            Alert.alert('Action', 'Modal action performed!');
                            setModalVisible(false);
                        }}
                        variant="primary"
                        size="md"
                    />
                </View>
            </Modal>
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
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    cardGroup: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    cardSubtext: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    modalText: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtext: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
});
