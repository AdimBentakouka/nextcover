import {create} from 'zustand';

import mapping from '@/data/mapping-url.json';

type BreadcrumbItem = {
    name: string,
    href: string
}

interface BreadcrumbState {
    breadcrumbItems: BreadcrumbItem[],
    updateBreadcrumbItems: (url: string) => void
}


const initialBreadcrumbState: BreadcrumbItem[] = [
    {
        name: 'Accueil',
        href: '/',
    },
];

export const useBreadcrumbStore = create<BreadcrumbState>(set => ({
    breadcrumbItems: [],
    updateBreadcrumbItems: (url: string) => {
        // parse URL
        const pathnames = url.split('/').filter((x) => x);

        let currentPathname = '';
        const breadcrumbItems: BreadcrumbItem[] = [];

        for (const pathname of pathnames) {

            currentPathname += `/${pathname}`;

            breadcrumbItems.push({
                name: mapping.find((item) => item.key === pathname)?.name ?? 'unknown',
                href: currentPathname,
            });
        }


        set({
            breadcrumbItems: pathnames.length === 0 ? initialBreadcrumbState : breadcrumbItems,
        });

        // Créer les breadcrump items
    },
}));