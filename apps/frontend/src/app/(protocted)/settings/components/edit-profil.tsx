'use client';

import {Button} from '@/components/ui/button';
import * as React from 'react';
import {UploadPictureForm} from '@/app/(protocted)/settings/components/form/upload-picture.form';
import {useSession} from '@/hooks/use-session.hook';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale/fr';
import {Skeleton} from '@/components/ui/skeleton';
import {EditProfilForm} from '@/app/(protocted)/settings/components/form/edit-profil.form';
import {EditPasswordForm} from '@/app/(protocted)/settings/components/form/edit-password.form';

enum Action {
    SHOW_INFO,
    EDIT_PROFIL,
    EDIT_PASSWORD,
}

export const EditProfil = () => {

    const {session} = useSession();
    const [action, setAction] = React.useState<Action>(Action.SHOW_INFO);

    return (
        <div className="flex gap-4 h-[400px]">
            <UploadPictureForm {...session.user!} isPending={session.status === 'PENDING'} />
            <div className="flex flex-col gap-4">
                {session.status === 'PENDING' && <InfoProfilSkeleton />}
                {session.status === 'AUTHENTICATED' && action === Action.SHOW_INFO && (
                    <>
                        <div>
                            <p className="font-bold pb-2">Nom de compte</p>
                            <p className="text-muted-foreground h-[36px]">{session.user?.username}</p>
                        </div>
                        <div>
                            <p className="font-bold pb-2">Adresse e-mail</p>
                            <p className="text-muted-foreground h-[36px]">{session.user?.email}</p>
                        </div>
                        <div>
                            <p className="font-bold pb-2">Membre depuis le</p>
                            <p className="text-muted-foreground  h-[36px]">{session.user?.createdAt ? format(session.user?.createdAt, 'PPP', {locale: fr}) : ''}</p>
                        </div>
                        <Button variant="secondary" onClick={() => setAction(Action.EDIT_PASSWORD)}>Changer le mot de
                            passe</Button>
                        <Button onClick={() => setAction(Action.EDIT_PROFIL)}>Éditer mon profil</Button>
                    </>
                )}
                {session.status === 'AUTHENTICATED' && action === Action.EDIT_PROFIL && (
                    <EditProfilForm {...session.user!} cancel={() => setAction(Action.SHOW_INFO)} />
                )}
                {session.status === 'AUTHENTICATED' && action === Action.EDIT_PASSWORD && (
                    <EditPasswordForm cancel={() => setAction(Action.SHOW_INFO)} />
                )}
            </div>
        </div>
    );
};

const InfoProfilSkeleton = () => (
    <>
        <div>
            <p className="font-bold pb-2">Nom de compte</p>
            <Skeleton className="w-32 h-[36px]" />
        </div>
        <div>
            <p className="font-bold pb-2">Adresse e-mail</p>
            <Skeleton className="h-[36px]" />
        </div>
        <div>
            <p className="font-bold pb-2">Membre depuis le</p>
            <Skeleton className="w-40 h-[36px]" />
        </div>
        <Button variant="secondary">Changer le mot de
            passe</Button>
        <Button>Éditer mon profil</Button>
    </>
);
