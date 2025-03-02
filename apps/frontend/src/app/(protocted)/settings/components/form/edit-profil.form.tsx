import {format} from 'date-fns';
import {fr} from 'date-fns/locale/fr';
import {Button} from '@/components/ui/button';
import * as React from 'react';
import {Input} from '@/components/ui/input';

interface EditProfilFormProps {
    username: string,
    email: string,
    createdAt: string
    cancel: () => void,
}

export const EditProfilForm = ({username, email, createdAt, cancel}: EditProfilFormProps) => {
    return (
        <>
            <div>
                <p className="font-bold pb-2">Nom de compte</p>
                <Input value={username} />
            </div>
            <div>
                <p className="font-bold pb-2">Adresse e-mail</p>
                <Input value={email} />
            </div>
            <div>
                <p className="font-bold pb-2">Membre depuis le</p>
                <p className="text-muted-foreground  h-[36px]">{format(createdAt, 'PPP', {locale: fr})}</p>
            </div>
            <Button variant="destructive" type="button" onClick={cancel}>Annuler</Button>
            <Button type="button">Sauvegarder</Button>
        </>
    );
};