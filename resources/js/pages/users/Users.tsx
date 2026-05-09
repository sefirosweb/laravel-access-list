import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { ConfirmModal } from '@/ui/ConfirmModal';
import { Empty } from '@/ui/Empty';
import { TableFooter } from '@/ui/TableFooter';
import { TextInput } from '@/ui/TextInput';
import { useToast } from '@/ui/Toast';
import {
    IconPlus,
    IconSearch,
    IconUsers,
    IconX,
} from '@/ui/icons';
import { useGroups } from '@/hooks/useGroups';
import { useUserFields } from '@/hooks/useUserFields';
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers,
} from '@/hooks/useUsers';
import { extractError } from '@/lib/extractError';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { User, UserStatus } from '@/types/store';
import { UserEditDrawer, UserEditState } from './UserEditDrawer';
import { UserGroupsDrawer } from './UserGroupsDrawer';
import { UserRow } from './UserRow';

export const UsersView = () => {
    const { t } = useTranslation();
    const toast = useToast();

    const fieldsQ = useUserFields();
    const softDeleteEnabled = fieldsQ.data?.softDelete ?? false;

    const [status, setStatus] = useState<UserStatus>('active');
    const usersQ = useUsers(softDeleteEnabled ? status : 'active');
    const groupsQ = useGroups();
    const createMut = useCreateUser();
    const updateMut = useUpdateUser();
    const deleteMut = useDeleteUser();

    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [editing, setEditing] = useState<UserEditState>(null);
    const [managingGroupsOf, setManagingGroupsOf] = useState<User | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
    const [confirmRestore, setConfirmRestore] = useState<User | null>(null);

    const users = usersQ.data ?? [];
    const groups = groupsQ.data ?? [];

    const debouncedQ = useDebouncedValue(q, 200);
    const filtered = useMemo(() => {
        if (!debouncedQ) return users;
        const lq = debouncedQ.toLowerCase();
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(lq) ||
                u.email.toLowerCase().includes(lq),
        );
    }, [users, debouncedQ]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    return (
        <div>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h1>{t('users.title')}</h1>
                    <p>{t('users.subtitle')}</p>
                </div>
                <Button
                    variant="primary"
                    icon={<IconPlus size={16} stroke={2.4} />}
                    onClick={() => setEditing({ mode: 'create' })}
                >
                    {t('users.new')}
                </Button>
            </div>

            <div className="page-toolbar">
                {softDeleteEnabled && (
                    <div
                        className="sort-toggle"
                        role="tablist"
                        style={{ marginTop: 0, marginRight: 12 }}
                    >
                        {(['active', 'all', 'deleted'] as UserStatus[]).map(
                            (s) => (
                                <button
                                    key={s}
                                    type="button"
                                    role="tab"
                                    className={
                                        'sort-toggle-btn' +
                                        (status === s ? ' is-active' : '')
                                    }
                                    onClick={() => setStatus(s)}
                                >
                                    {t('users.status.' + s)}
                                </button>
                            ),
                        )}
                    </div>
                )}
                <TextInput
                    icon={<IconSearch size={14} />}
                    placeholder={t('users.searchPlaceholder')}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    suffix={
                        q && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setQ('')}
                            >
                                <IconX size={12} />
                            </Button>
                        )
                    }
                />
            </div>

            <div className="card">
                {filtered.length === 0 ? (
                    <Empty
                        icon={<IconUsers size={20} />}
                        title={
                            q
                                ? t('users.emptyFiltered.title')
                                : t('users.empty.title')
                        }
                        description={
                            q
                                ? t('users.emptyFiltered.description')
                                : t('users.empty.description')
                        }
                        action={
                            !q && (
                                <Button
                                    variant="primary"
                                    icon={<IconPlus size={14} />}
                                    onClick={() =>
                                        setEditing({ mode: 'create' })
                                    }
                                >
                                    {t('users.new')}
                                </Button>
                            )
                        }
                    />
                ) : (
                    <table className="t">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>#</th>
                                <th>{t('users.col.user')}</th>
                                <th>{t('users.col.email')}</th>
                                <th>{t('users.col.groups')}</th>
                                <th
                                    style={{ width: 140, textAlign: 'right' }}
                                >
                                    {t('users.col.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((u) => (
                                <UserRow
                                    key={u.id}
                                    user={u}
                                    onEdit={() =>
                                        setEditing({ mode: 'edit', user: u })
                                    }
                                    onManageGroups={() =>
                                        setManagingGroupsOf(u)
                                    }
                                    onDelete={() => setConfirmDelete(u)}
                                    onRestore={
                                        softDeleteEnabled
                                            ? () => setConfirmRestore(u)
                                            : undefined
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                )}
                {filtered.length > 0 && (
                    <TableFooter
                        page={page}
                        totalPages={totalPages}
                        onPage={setPage}
                        perPage={perPage}
                        onPerPage={setPerPage}
                        total={filtered.length}
                    />
                )}
            </div>

            <UserEditDrawer
                editing={editing}
                onClose={() => setEditing(null)}
                busy={createMut.isPending || updateMut.isPending}
                onSave={(data) => {
                    if (!editing) return;
                    if (editing.mode === 'create') {
                        createMut.mutate(data, {
                            onSuccess: () => {
                                toast.success(
                                    t('users.toast.created', {
                                        name: data.name,
                                    }),
                                );
                                setEditing(null);
                            },
                            onError: (err) => toast.error(extractError(err)),
                        });
                    } else {
                        updateMut.mutate(
                            { id: editing.user.id, payload: data },
                            {
                                onSuccess: () => {
                                    toast.success(t('users.toast.updated'));
                                    setEditing(null);
                                },
                                onError: (err) =>
                                    toast.error(extractError(err)),
                            },
                        );
                    }
                }}
            />

            <UserGroupsDrawer
                user={managingGroupsOf}
                onClose={() => setManagingGroupsOf(null)}
                groups={groups}
            />

            <ConfirmModal
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => {
                    if (!confirmDelete) return;
                    deleteMut.mutate(confirmDelete.id, {
                        onSuccess: () => {
                            toast.success(
                                t('users.toast.deleted', {
                                    name: confirmDelete.name,
                                }),
                            );
                            setConfirmDelete(null);
                        },
                        onError: (err) => toast.error(extractError(err)),
                    });
                }}
                title={t('users.deleteConfirm.title')}
                description={
                    confirmDelete &&
                    t('users.deleteConfirm.description', {
                        name: confirmDelete.name,
                    })
                }
                confirmText={t('common.delete')}
                busy={deleteMut.isPending}
            />

            <ConfirmModal
                open={!!confirmRestore}
                onClose={() => setConfirmRestore(null)}
                onConfirm={() => {
                    if (!confirmRestore) return;
                    deleteMut.mutate(confirmRestore.id, {
                        onSuccess: () => {
                            toast.success(
                                t('users.toast.restored', {
                                    name: confirmRestore.name,
                                }),
                            );
                            setConfirmRestore(null);
                        },
                        onError: (err) => toast.error(extractError(err)),
                    });
                }}
                title={t('users.restoreConfirm.title')}
                description={
                    confirmRestore &&
                    t('users.restoreConfirm.description', {
                        name: confirmRestore.name,
                    })
                }
                confirmText={t('users.actions.restore')}
                tone="warning"
                busy={deleteMut.isPending}
            />
        </div>
    );
};
