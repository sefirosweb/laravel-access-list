import { useTranslation } from 'react-i18next';
import { Avatar } from '@/ui/Avatar';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { IconLink, IconPencil, IconRefresh, IconTrash } from '@/ui/icons';
import { User } from '@/types/store';

interface Props {
    user: User;
    onEdit: () => void;
    onManageGroups: () => void;
    onDelete: () => void;
    onRestore?: () => void;
}

export const UserRow = ({
    user,
    onEdit,
    onManageGroups,
    onDelete,
    onRestore,
}: Props) => {
    const { t } = useTranslation();
    const groups = user.roles ?? [];
    const isDeleted = !!user.deleted_at;

    return (
        <tr className={isDeleted ? 'is-trashed' : undefined}>
            <td className="t-id">{user.id}</td>
            <td>
                <div className="t-name-cell">
                    <Avatar name={user.name} />
                    <span className="name">{user.name}</span>
                    {isDeleted && (
                        <Badge variant="danger">
                            {t('users.deletedBadge')}
                        </Badge>
                    )}
                </div>
            </td>
            <td
                className="mono"
                style={{ color: 'var(--fg-muted)', fontSize: 12.5 }}
            >
                {user.email}
            </td>
            <td>
                <div className="t-rel">
                    {groups.length === 0 ? (
                        <span className="t-rel-empty">
                            {t('users.noGroups')}
                        </span>
                    ) : (
                        groups.slice(0, 3).map((g) => (
                            <Badge key={g.id} variant="indigo">
                                {g.name}
                            </Badge>
                        ))
                    )}
                    {groups.length > 3 && <Badge>+{groups.length - 3}</Badge>}
                </div>
            </td>
            <td>
                <div className="t-actions">
                    {!isDeleted && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={onManageGroups}
                                title={t('users.actions.manageGroups')}
                            >
                                <IconLink size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onEdit}
                                title={t('users.actions.edit')}
                            >
                                <IconPencil size={14} />
                            </Button>
                        </>
                    )}
                    {isDeleted && onRestore ? (
                        <Button
                            variant="ghost"
                            onClick={onRestore}
                            title={t('users.actions.restore')}
                        >
                            <IconRefresh size={14} />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={onDelete}
                            title={t('users.actions.delete')}
                        >
                            <IconTrash size={14} />
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
};
