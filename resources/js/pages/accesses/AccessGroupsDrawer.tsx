import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { RelationPicker } from '@/ui/RelationPicker';
import { useAccessGroups, useToggleAccessGroup } from '@/hooks/useAccesses';
import { useTrackedToggle } from '@/hooks/useTrackedToggle';
import { Access, Group } from '@/types/store';

interface Props {
    access: Access | null;
    onClose: () => void;
    groups: Group[];
}

export const AccessGroupsDrawer = ({ access, onClose, groups }: Props) => {
    const { t } = useTranslation();
    const { data: assigned = [] } = useAccessGroups(access?.id ?? null);
    const toggleMut = useToggleAccessGroup();
    const { pendingIds, trigger } = useTrackedToggle(toggleMut.mutateAsync);
    const selectedIds = assigned.map((g) => g.id);

    return (
        <Drawer
            open={!!access}
            onClose={onClose}
            title={
                access
                    ? `${t('accesses.groupsDrawer.titlePrefix')} ${access.name}`
                    : ''
            }
            subtitle={t('accesses.groupsDrawer.subtitle')}
            footer={
                <Button variant="primary" onClick={onClose}>
                    {t('common.done')}
                </Button>
            }
        >
            {access && (
                <RelationPicker
                    items={groups}
                    selectedIds={selectedIds}
                    pendingIds={pendingIds}
                    onToggle={(groupId) =>
                        void trigger(groupId, {
                            accessId: access.id,
                            groupId,
                            attach: !selectedIds.includes(groupId),
                        })
                    }
                    getLabel={(g) => g.name}
                    getDescription={(g) => g.description}
                    emptyText={t('accesses.groupsDrawer.empty')}
                />
            )}
        </Drawer>
    );
};
