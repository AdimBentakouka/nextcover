'use client';

import {SidebarTrigger} from '@/components/ui/sidebar';
import {Separator} from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {usePathname} from 'next/navigation';
import React, {useEffect} from 'react';
import {useBreadcrumbStore} from '@/stores/breadcrumb.store';
import Link from 'next/link';
import {Skeleton} from '@/components/ui/skeleton';

export const BreadcrumbHeader = () => {

    const pathname = usePathname();
    const {breadcrumbItems, updateBreadcrumbItems} = useBreadcrumbStore();

    useEffect(() => {
        updateBreadcrumbItems(pathname);
    }, [pathname, updateBreadcrumbItems]);

    return (
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <Link href="/">
                            <BreadcrumbPage className="text-muted-foreground">
                                NextCover
                            </BreadcrumbPage>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {
                        breadcrumbItems.length !== 0 ? breadcrumbItems.map((item, index) => (
                                <React.Fragment key={`bi-${item.name}-${index}`}>

                                    <Link href={item.href}>
                                        <BreadcrumbItem className={'hidden md:block'}>
                                            <BreadcrumbPage
                                                className={breadcrumbItems.length - 1 !== index ? 'text-muted-foreground' : ''}>{item.name}</BreadcrumbPage>
                                        </BreadcrumbItem>

                                    </Link>
                                    {breadcrumbItems.length - 1 !== index && <BreadcrumbSeparator />}
                                </React.Fragment>

                            ))
                            : (<SkeletonBreadcrumb />)
                    }
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

const SkeletonBreadcrumb = () => (
    <>
        <Skeleton className="h-4 w-12 rounded-lg" />
        <BreadcrumbSeparator className="hidden md:block" />
        <Skeleton className="h-4 w-12 rounded-lg" />
    </>
);