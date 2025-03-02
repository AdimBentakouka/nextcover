'use client';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {ChevronDown, LucideProps} from 'lucide-react';
import {ForwardRefExoticComponent, RefAttributes} from 'react';
import Link from 'next/link';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '../ui/collapsible';

type NavItem = {
    title: string
    url: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

interface NavMainProps {
    nav: {
        menu: NavItem[],
        libraries: NavItem[]
    };
}

export function NavMain({nav}: NavMainProps) {


    return (
        <SidebarGroup>
            <SidebarMenu>
                <SideBarGroupMenu name="Menu" items={nav.menu} />
                <SideBarGroupMenu name="Bibliothèques" items={nav.libraries} />
            </SidebarMenu>
        </SidebarGroup>
    );
}

const SideBarGroupMenu = ({name, items}: {name: string, items: NavItem[]}) => (
    <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
            <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                    {name}
                    <ChevronDown
                        className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <Link href={item.url}>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </CollapsibleContent>
        </SidebarGroup>
    </Collapsible>);
