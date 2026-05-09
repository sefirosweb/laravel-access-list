import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import {
    IconKey,
    IconPencil,
    IconShield,
    IconTrash,
    IconUsers,
} from '@/ui/icons';
import { Group } from '@/types/store';

interface Props {
    group: Group;
    onManageUsers: () => void;
    onManageAccesses: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const GroupRow = ({
    group,
    onManageUsers,
    onManageAccesses,
    onEdit,
    onDelete,
}: Props) => {
    const { t } = useTranslation();
    const usersCount = group.users_count ?? 0;
    const accessesCount = group.access_lists_count ?? 0;

    return (
        <tr>
            <td className="t-id">{group.id}</td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="t-name-icon is-group">
                        <IconShield size={12} />
                    </span>
                    <span style={{ fontWeight: 500 }}>{group.name}</span>
                </div>
            </td>
            <td style={{ color: 'var(--fg-muted)', maxWidth: 360 }}>
                {group.description}
            </td>
            <td>
                <button onClick={onManageUsers} className="t-rel-count">
                    <IconUsers size={12} />
                    {usersCount}
                </button>
            </td>
            <td>
                <button onClick={onManageAccesses} className="t-rel-count">
                    <IconKey size={12} />
                    {accessesCount}
                </button>
            </td>
            <td>
                <div className="t-actions">
                    <Button
                        variant="ghost"
                        onClick={onEdit}
                        title={t('groups.actions.edit')}
                    >
                        <IconPencil size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onDelete}
                        title={t('groups.actions.delete')}
                    >
                        <IconTrash size={14} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};
