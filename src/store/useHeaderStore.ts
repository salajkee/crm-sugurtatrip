import { create } from 'zustand';
import { type ReactNode } from 'react';

interface HeaderStore {
	title: string;
	actions: ReactNode | null;
	setTitle: (title: string) => void;
	setActions: (actions: ReactNode | null) => void;
	reset: () => void;
}

export const useHeaderStore = create<HeaderStore>(set => ({
	title: '',
	actions: null,
	setTitle: title => set({ title }),
	setActions: actions => set({ actions }),
	reset: () =>
		set({
			title: '',
			actions: null,
		}),
}));
