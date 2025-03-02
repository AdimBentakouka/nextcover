import {PropsWithChildren} from 'react';
import {SessionContextProvider} from '@/hooks/use-session.hook';
import {AppSidebar} from '@/components/sidebar/app-sidebar';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {BreadcrumbHeader} from '@/components/sidebar/breadcrumb';
import {DialogManager} from '@/app/(protocted)/components/dialog-manager';

const LayoutProtected = async ({children}: PropsWithChildren) => {

    return (
        <SessionContextProvider>
            <SidebarProvider>
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <header
                        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <BreadcrumbHeader />
                    </header>
                    <DialogManager />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SessionContextProvider>
    );
};

export default LayoutProtected;