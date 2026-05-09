import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { RelationPicker } from '@/ui/RelationPicker';
import { useTrackedToggle } from '@/hooks/useTrackedToggle';
import { useToggleUserGroup, useUserGroups } from '@/hooks/useUsers';
import { Group, User } from '@/types/store';

interface Props {
    user: User | null;
    onClose: () => void;
    groups: Group[];
}

export const UserGroupsDrawer = ({ user, onClose, groups }: Props) => {
    const { t } = useTranslation();
    const { data: assigned = [] } = useUserGroups(user?.id ?? null);
    const toggleMut = useToggleUserGroup();
    const { pendingIds, trigger } = useTrackedToggle(toggleMut.mutateAsync);
    const selectedIds = assigned.map((g) => g.id);

    return (
        <Drawer
            open={!!user}
            onClose={onClose}
            title={
                user
                    ? `${t('users.groupsDrawer.titlePrefix')} ${user.name}`
                    : ''
            }
            subtitle={t('users.groupsDrawer.subtitle')}
            footer={
                <Button variant="primary" onClick={onClose}>
                    {t('common.done')}
                </Button>
            }
        >
            {user && (
                <RelationPicker
                    items={groups}
                    selectedIds={selectedIds}
                    pendingIds={pendingIds}
                    onToggle={(groupId) =>
                        void trigger(groupId, {
                            userId: user.id,
                            groupId,
                            attach: !selectedIds.includes(groupId),
                        })
                    }
                    getLabel={(g) => g.name}
                    getDescription={(g) => g.description}
                    emptyText={t('users.groupsDrawer.empty')}
                />
            )}
        </Drawer>
    );
};
