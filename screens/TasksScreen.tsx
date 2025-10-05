import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Button, Input, Card } from '../components/ui';

export default function TasksScreen() {
    const { tasks, addTask, removeTask, toggleTask, clearCompleted } = useTaskStore();
    const [newTaskText, setNewTaskText] = useState('');

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            addTask(newTaskText.trim());
            setNewTaskText('');
        } else {
            Alert.alert('Error', 'Please enter a task');
        }
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.length - completedCount;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.emoji}>✅</Text>
                <Text style={styles.title}>Task Manager</Text>
                <Text style={styles.subtitle}>
                    {activeCount} active • {completedCount} completed
                </Text>
            </View>

            <Card variant="elevated" padding="lg" margin="md">
                <Input
                    placeholder="Enter new task..."
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    onSubmitEditing={handleAddTask}
                    variant="outlined"
                    size="md"
                />
                <Button
                    title="+ Add Task"
                    onPress={handleAddTask}
                    variant="primary"
                    size="md"
                    fullWidth
                />
            </Card>

            {tasks.length > 0 && completedCount > 0 && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearCompleted}
                >
                    <Text style={styles.clearButtonText}>🗑️ Clear Completed</Text>
                </TouchableOpacity>
            )}

            <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
                {tasks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📝</Text>
                        <Text style={styles.emptyText}>No tasks yet</Text>
                        <Text style={styles.emptySubtext}>Add your first task above!</Text>
                    </View>
                ) : (
                    tasks.map((task) => (
                        <View key={task.id} style={styles.taskItem}>
                            <TouchableOpacity
                                onPress={() => toggleTask(task.id)}
                                style={styles.taskContent}
                            >
                                <View style={[
                                    styles.checkbox,
                                    task.completed && styles.checkboxCompleted
                                ]}>
                                    {task.completed && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={[
                                    styles.taskText,
                                    task.completed && styles.taskTextCompleted
                                ]}>
                                    {task.text}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => removeTask(task.id)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
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
    },
    inputCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#334155',
        color: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    clearButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    taskList: {
        flex: 1,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    taskContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#64748b',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskText: {
        color: '#ffffff',
        fontSize: 16,
        flex: 1,
    },
    taskTextCompleted: {
        color: '#64748b',
        textDecorationLine: 'line-through',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#64748b',
        fontSize: 14,
    },
});
