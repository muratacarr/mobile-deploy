import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter } from './storage';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface TaskState {
    tasks: Task[];
    addTask: (text: string) => void;
    removeTask: (id: string) => void;
    toggleTask: (id: string) => void;
    clearCompleted: () => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            addTask: (text) =>
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        {
                            id: Date.now().toString(),
                            text,
                            completed: false,
                        },
                    ],
                })),
            removeTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                })),
            toggleTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completed: !task.completed } : task
                    ),
                })),
            clearCompleted: () =>
                set((state) => ({
                    tasks: state.tasks.filter((task) => !task.completed),
                })),
        }),
        {
            name: 'task-storage',
            storage: createJSONStorage(() => asyncStorageAdapter),
        }
    )
);
