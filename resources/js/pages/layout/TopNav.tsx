import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/hooks/useMe';
import { Avatar } from '@/ui/Avatar';
import { IconKey, IconLogo, IconShield, IconUsers } from '@/ui/icons';
import { LanguageSwitcher } from './LanguageSwitcher';

export type Tab = 'users' | 'groups' | 'accesses';

interface TopNavProps {
    tab: Tab;
    onTab: (tab: Tab) => void;
    counts: { users: number; groups: number; accesses: number };
}

interface TabDef {
    id: Tab;
    label: string;
    icon: ReactNode;
    count: number;
}

export const TopNav = ({ tab, onTab, counts }: TopNavProps) => {
    const { t } = useTranslation();
    const { data: me } = useMe();

    const tabs: TabDef[] = [
        {
            id: 'users',
            label: t('nav.users'),
            icon: <IconUsers size={14} />,
            count: counts.users,
        },
        {
            id: 'groups',
            label: t('nav.groups'),
            icon: <IconShield size={14} />,
            count: counts.groups,
        },
        {
            id: 'accesses',
            label: t('nav.accesses'),
            icon: <IconKey size={14} />,
            count: counts.accesses,
        },
    ];

    return (
        <nav className="top-nav">
            <div className="top-nav-inner">
                <div className="nav-brand">
                    <IconLogo size={22} />
                    <span>{t('nav.appName')}</span>
                </div>
                <div className="nav-tabs">
                    {tabs.map((it) => (
                        <button
                            key={it.id}
                            className={`nav-tab ${tab === it.id ? 'is-active' : ''}`}
                            onClick={() => onTab(it.id)}
                        >
                            {it.icon}
                            {it.label}
                            <span className="nav-tab-count">{it.count}</span>
                        </button>
                    ))}
                </div>
                <div className="nav-right">
                    <LanguageSwitcher />
                    {me && (
                        <button className="nav-user">
                            <span>{me.name ?? me.email ?? '?'}</span>
                            <Avatar
                                name={me.name ?? me.email ?? ''}
                                size={24}
                            />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
