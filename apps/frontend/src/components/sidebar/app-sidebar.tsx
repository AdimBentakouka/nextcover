'use client';

import * as React from 'react';
import {BookOpen, HeartIcon, Home, LibraryBig, Search} from 'lucide-react';

import {NavMain} from '@/components/sidebar/nav-main';
import {NavUser} from '@/components/sidebar/nav-user';
import {SidebarHeader} from '@/components/sidebar/sidebar-header';
import {Sidebar, SidebarContent, SidebarFooter, SidebarRail} from '@/components/ui/sidebar';
import {useSession} from '@/hooks/use-session.hook';


const nav = {
    menu: [
        {
            title: 'Accueil',
            url: '/',
            icon: Home,
        },
        {
            title: 'Rechercher',
            url: '/',
            icon: Search,
        }, {
            title: 'Favoris',
            url: '/',
            icon: HeartIcon,
        }],
    libraries: [
        {
            title: 'Ebook',
            url: '/',
            icon: BookOpen,
        },
        {
            title: 'Manga',
            url: '/',
            icon: LibraryBig,
        }, {
            title: 'BD',
            url: '#',
            icon: LibraryBig,
        },
    ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {

    const {session: {user, status}, logout} = useSession();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader />
            <SidebarContent>
                <NavMain nav={nav} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser {...user!} isPending={status === 'PENDING'} logout={() => logout()} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
