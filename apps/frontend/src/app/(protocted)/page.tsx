'use client';
import {useSession} from '@/hooks/session.hook';
import {Button} from '@/components/ui/button';

const Home = () => {
    const session = useSession();

    return (
        <main>
            <h1>NextCover</h1>
            <Button onClick={() => session.logout()}>Se déconnecter</Button>
            <pre>
                {JSON.stringify(session, null, 2)}
            </pre>
        </main>
    );
};

export default Home;
