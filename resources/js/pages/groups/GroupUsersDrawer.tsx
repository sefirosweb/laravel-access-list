import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { RelationPicker } from '@/ui/RelationPicker';
import { useGroupUsers, useToggleGroupUser } from '@/hooks/useGroups';
import { useTrackedToggle } from '@/hooks/useTrackedToggle';
import { Group, User } from '@/types/store';

interface Props {
    group: Group | null;
    onClose: () => void;
    users: User[];
}

export const GroupUsersDrawer = ({ group, onClose, users }: Props) => {
    const { t } = useTranslation();
    const { data: assigned = [] } = useGroupUsers(group?.id ?? null);
    const toggleMut = useToggleGroupUser();
    const { pendingIds, trigger } = useTrackedToggle(toggleMut.mutateAsync);
    const selectedIds = assigned.map((u) => u.id);

    return (
        <Drawer
            open={!!group}
            onClose={onClose}
            title={
                group
                    ? `${t('groups.usersDrawer.titlePrefix')} ${group.name}`
                    : ''
            }
            subtitle={t('groups.usersDrawer.subtitle')}
            footer={
                <Button variant="primary" onClick={onClose}>
                    {t('common.done')}
                </Button>
            }
        >
            {group && (
                <RelationPicker
                    items={users}
                    selectedIds={selectedIds}
                    pendingIds={pendingIds}
                    onToggle={(userId) =>
                        void trigger(userId, {
                            groupId: group.id,
                            userId,
                            attach: !selectedIds.includes(userId),
                        })
                    }
                    getLabel={(u) => u.name}
                    getDescription={(u) => u.email}
                    getInitials={(u) => u.name}
                    emptyText={t('groups.usersDrawer.empty')}
                />
            )}
        </Drawer>
    );
};
