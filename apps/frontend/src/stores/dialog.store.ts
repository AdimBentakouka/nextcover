import {create} from 'zustand';
import {type ReactNode} from 'react';

interface DialogState {
    dialog: ReactNode | null;
    setDialog: (dialog: ReactNode | null) => void;
}

export const useDialogStore = create<DialogState>(set => ({
    dialog: null,
    setDialog: (dialog) => set({dialog}),
}));