import {type Metadata} from 'next';
import {EditProfil} from '@/app/(protocted)/settings/components/edit-profil';

export const metadata: Metadata = {
    title: 'NextCover | Mon compte',
};

const SettingsPage = () => {

    return (
        <>
            <h1 className="text-3xl font-bold">Mon compte</h1>
            <EditProfil />
            <h1 className="text-3xl font-bold">Historique</h1>
            <div className="max-h-[300px] flex-1 rounded-xl bg-muted/50 md:min-h-min" />

        </>
    );
};

export default SettingsPage;
