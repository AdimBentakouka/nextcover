'use client';

import {
    SidebarHeader as SidebarHeaderWrapper,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';

export function SidebarHeader() {
    return (
        <SidebarHeaderWrapper>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div
                            className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                            <Image src="/images/icons/nextcover.svg" alt="NextCover" width={24} height={24} />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          NextCover
                        </span>
                            <span className="truncate text-xs">1.0.0</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeaderWrapper>

    );
}
