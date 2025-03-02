'use client';
import {useDialogStore} from '@/stores/dialog.store';

export const DialogManager = () => {
    const dialog = useDialogStore((state) => state.dialog);

    return dialog ? dialog : null;

};