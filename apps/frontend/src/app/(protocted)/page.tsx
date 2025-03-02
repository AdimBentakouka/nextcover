'use client';

import {ChevronRight} from 'lucide-react';
import * as React from 'react';

const Home = () => {

    return (

        <>
            <h1 className="text-3xl font-bold">Accueil</h1>
            <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-4">Reprendre votre
                lecture <ChevronRight className="w-4 h-4" /></h2>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-4">Vos favoris <ChevronRight
                className="w-4 h-4" /></h2>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min " />
            <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-4">Récemment ajouté dans
                Ebook <ChevronRight className="w-4 h-4" /></h2>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-4">Récemment ajouté dans
                Manga <ChevronRight className="w-4 h-4" /></h2>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-4">Récemment ajouté dans
                BD <ChevronRight className="w-4 h-4" /></h2>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </>

    );
};

export default Home;
