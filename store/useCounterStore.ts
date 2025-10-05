import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter } from './storage';

interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

export const useCounterStore = create<CounterState>()(
    persist(
        (set) => ({
            count: 0,
            increment: () => set((state) => ({ count: state.count + 1 })),
            decrement: () => set((state) => ({ count: state.count - 1 })),
            reset: () => set({ count: 0 }),
        }),
        {
            name: 'counter-storage',
            storage: createJSONStorage(() => asyncStorageAdapter),
        }
    )
);
