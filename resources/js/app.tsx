import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccesses } from '@/hooks/useAccesses';
import { useGroups } from '@/hooks/useGroups';
import { useUsers } from '@/hooks/useUsers';
import '@/lib/i18n';
import { AccessesView } from '@/pages/accesses/Accesses';
import { GroupsView } from '@/pages/groups/Groups';
import { AppFooter } from '@/pages/layout/AppFooter';
import { TopNav, Tab } from '@/pages/layout/TopNav';
import { UsersView } from '@/pages/users/Users';
import { ToastProvider } from '@/ui/Toast';
import '@styles/app.scss';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 5_000, refetchOnWindowFocus: false },
    },
});

const validTabs: Tab[] = ['users', 'groups', 'accesses'];

const readTabFromHash = (): Tab => {
    const h = window.location.hash.replace('#', '');
    return validTabs.includes(h as Tab) ? (h as Tab) : 'users';
};

const Shell = () => {
    const [tab, setTab] = useState<Tab>(readTabFromHash);

    useEffect(() => {
        window.location.hash = tab;
    }, [tab]);

    useEffect(() => {
        const onHash = () => setTab(readTabFromHash());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    const usersQ = useUsers();
    const groupsQ = useGroups();
    const accessesQ = useAccesses();

    const counts = {
        users: usersQ.data?.length ?? 0,
        groups: groupsQ.data?.length ?? 0,
        accesses: accessesQ.data?.length ?? 0,
    };

    return (
        <ToastProvider>
            <TopNav tab={tab} onTab={setTab} counts={counts} />
            <main className="page">
                {tab === 'users' && <UsersView />}
                {tab === 'groups' && <GroupsView />}
                {tab === 'accesses' && <AccessesView />}
            </main>
            <AppFooter />
        </ToastProvider>
    );
};

const root = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <Shell />
            </QueryClientProvider>
        </StrictMode>,
    );
}
