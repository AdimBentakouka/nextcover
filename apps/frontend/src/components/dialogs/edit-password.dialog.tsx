'use client';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {useDialogStore} from '@/stores/dialog.store';
import {PasswordInput} from '@/components/ui/passwordInput';

export const EditPasswordDialog = () => {
    const setDialog = useDialogStore(state => state.setDialog);
    return (
        <Dialog open={true} onOpenChange={() => setDialog(null)}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Modifier son mot de passe</DialogTitle>
                    <DialogDescription>
                        Saisis ton mot de passe actuel et le nouveau mot de passe.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name" className="font-bold mb-2">
                            Mot de passe actuel
                        </Label>
                        <PasswordInput id="name" className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="name" className="font-bold">
                            Nouveau mot de passe
                        </Label>
                        <PasswordInput id="name" className="font-bold" />
                    </div>
                    <div>
                        <Label htmlFor="name" className="font-bold">
                            Confirmer le nouveau mot de passe
                        </Label>
                        <PasswordInput id="name" className="w-full" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="link" onClick={() => setDialog(null)}>Annulé</Button>
                    <Button type="submit">Terminé</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
