import { useTranslation } from 'react-i18next';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { IconKey, IconPencil, IconTrash } from '@/ui/icons';
import { Access } from '@/types/store';

interface Props {
    access: Access;
    onManageGroups: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const AccessRow = ({
    access,
    onManageGroups,
    onEdit,
    onDelete,
}: Props) => {
    const { t } = useTranslation();
    const groups = access.roles ?? [];

    return (
        <tr>
            <td className="t-id">{access.id}</td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="t-name-icon is-access">
                        <IconKey size={12} />
                    </span>
                    <span
                        className="mono"
                        style={{ fontSize: 12.5, fontWeight: 500 }}
                    >
                        {access.name}
                    </span>
                </div>
            </td>
            <td style={{ color: 'var(--fg-muted)', maxWidth: 380 }}>
                {access.description}
            </td>
            <td>
                <div className="t-rel">
                    {groups.length === 0 ? (
                        <span className="t-rel-empty">
                            {t('accesses.noGroups')}
                        </span>
                    ) : (
                        groups
                            .slice(0, 3)
                            .map((g) => <Badge key={g.id}>{g.name}</Badge>)
                    )}
                    {groups.length > 3 && <Badge>+{groups.length - 3}</Badge>}
                    <button
                        onClick={onManageGroups}
                        className="btn btn-ghost btn-sm"
                        style={{ height: 22, padding: '0 8px' }}
                    >
                        {t('accesses.assign')}
                    </button>
                </div>
            </td>
            <td>
                <div className="t-actions">
                    <Button
                        variant="ghost"
                        onClick={onEdit}
                        title={t('accesses.actions.edit')}
                    >
                        <IconPencil size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onDelete}
                        title={t('accesses.actions.delete')}
                    >
                        <IconTrash size={14} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};
