import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { RelationPicker } from '@/ui/RelationPicker';
import { useGroupAccesses, useToggleGroupAccess } from '@/hooks/useGroups';
import { useTrackedToggle } from '@/hooks/useTrackedToggle';
import { Access, Group } from '@/types/store';

interface Props {
    group: Group | null;
    onClose: () => void;
    accesses: Access[];
}

export const GroupAccessesDrawer = ({ group, onClose, accesses }: Props) => {
    const { t } = useTranslation();
    const { data: assigned = [] } = useGroupAccesses(group?.id ?? null);
    const toggleMut = useToggleGroupAccess();
    const { pendingIds, trigger } = useTrackedToggle(toggleMut.mutateAsync);
    const selectedIds = assigned.map((a) => a.id);

    return (
        <Drawer
            open={!!group}
            onClose={onClose}
            title={
                group
                    ? `${t('groups.accessesDrawer.titlePrefix')} ${group.name}`
                    : ''
            }
            subtitle={t('groups.accessesDrawer.subtitle')}
            footer={
                <Button variant="primary" onClick={onClose}>
                    {t('common.done')}
                </Button>
            }
        >
            {group && (
                <RelationPicker
                    items={accesses}
                    selectedIds={selectedIds}
                    pendingIds={pendingIds}
                    onToggle={(accessId) =>
                        void trigger(accessId, {
                            groupId: group.id,
                            accessId,
                            attach: !selectedIds.includes(accessId),
                        })
                    }
                    getLabel={(a) => a.name}
                    getDescription={(a) => a.description}
                    emptyText={t('groups.accessesDrawer.empty')}
                />
            )}
        </Drawer>
    );
};
