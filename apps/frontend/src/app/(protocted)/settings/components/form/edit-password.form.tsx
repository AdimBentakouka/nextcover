import {Button} from '@/components/ui/button';
import * as React from 'react';
import {PasswordInput} from '@/components/ui/passwordInput';

interface EditProfilFormProps {
    cancel: () => void,
}

export const EditPasswordForm = ({cancel}: EditProfilFormProps) => {
    return (
        <>
            <div>
                <p className="font-bold pb-2">Mot de passe actuel</p>
                <PasswordInput />
            </div>
            <div>
                <p className="font-bold pb-2">Nouveau mot de passe</p>
                <PasswordInput />
            </div>
            <div>
                <p className="font-bold pb-2">Confirmer le nouveau mot de passe</p>
                <PasswordInput />
            </div>
            <Button variant="destructive" type="button" onClick={cancel}>Annuler</Button>
            <Button type="button">Sauvegarder</Button>
        </>
    );
};