'use client';

import {ChevronsUpDown, LogOut, Shield, User} from 'lucide-react';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from '@/components/ui/sidebar';
import {getInitials} from '@/lib/string';
import {Skeleton} from '@/components/ui/skeleton';
import Link from 'next/link';


interface NavUserPending {
    isPending: true;
}

interface NavUserLoaded {
    isPending: false;
    username: string;
    email: string;
    avatar?: string;
    logout: () => void;
}

type NavUserProps = NavUserPending | NavUserLoaded;


const NavUserSkeleton = () => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg"
                                   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <Skeleton className="h-8 w-full" />
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export const NavUser = (props: NavUserProps) => {
    const {isMobile} = useSidebar();

    if (props.isPending) return <NavUserSkeleton />;

    const {username, email, avatar, logout} = props;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatar} alt={username} />
                                <AvatarFallback className="rounded-lg">{getInitials(username)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{username}</span>
                                <span className="truncate text-xs">{email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={avatar} alt={username} />
                                    <AvatarFallback className="rounded-lg">{getInitials(username)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{username}</span>
                                    <span className="truncate text-xs">{email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <Link href="/settings/profile">
                                <DropdownMenuItem>
                                    <User />
                                    Mon compte
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <Shield />
                                Administration
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            logout();
                        }}>
                            <LogOut />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
