import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { ConfirmModal } from '@/ui/ConfirmModal';
import { Empty } from '@/ui/Empty';
import { TableFooter } from '@/ui/TableFooter';
import { TextInput } from '@/ui/TextInput';
import { useToast } from '@/ui/Toast';
import {
    IconKey,
    IconPlus,
    IconSearch,
    IconX,
} from '@/ui/icons';
import {
    useAccesses,
    useCreateAccess,
    useDeleteAccess,
    useUpdateAccess,
} from '@/hooks/useAccesses';
import { useGroups } from '@/hooks/useGroups';
import { extractError } from '@/lib/extractError';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { Access } from '@/types/store';
import { AccessEditDrawer, AccessEditState } from './AccessEditDrawer';
import { AccessGroupsDrawer } from './AccessGroupsDrawer';
import { AccessRow } from './AccessRow';

export const AccessesView = () => {
    const { t } = useTranslation();
    const toast = useToast();

    const accessesQ = useAccesses();
    const groupsQ = useGroups();
    const createMut = useCreateAccess();
    const updateMut = useUpdateAccess();
    const deleteMut = useDeleteAccess();

    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [editing, setEditing] = useState<AccessEditState>(null);
    const [managingGroups, setManagingGroups] = useState<Access | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Access | null>(null);

    const accesses = accessesQ.data ?? [];
    const groups = groupsQ.data ?? [];

    const debouncedQ = useDebouncedValue(q, 200);
    const filtered = useMemo(() => {
        if (!debouncedQ) return accesses;
        const lq = debouncedQ.toLowerCase();
        return accesses.filter(
            (a) =>
                a.name.toLowerCase().includes(lq) ||
                (a.description ?? '').toLowerCase().includes(lq),
        );
    }, [accesses, debouncedQ]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    return (
        <div>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h1>{t('accesses.title')}</h1>
                    <p>{t('accesses.subtitle')}</p>
                </div>
                <Button
                    variant="primary"
                    icon={<IconPlus size={16} stroke={2.4} />}
                    onClick={() => setEditing({ mode: 'create' })}
                >
                    {t('accesses.new')}
                </Button>
            </div>

            <div className="page-toolbar">
                <TextInput
                    icon={<IconSearch size={14} />}
                    placeholder={t('accesses.searchPlaceholder')}
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
                        icon={<IconKey size={20} />}
                        title={
                            q
                                ? t('accesses.emptyFiltered.title')
                                : t('accesses.empty.title')
                        }
                        description={
                            q
                                ? t('accesses.emptyFiltered.description')
                                : t('accesses.empty.description')
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
                                    {t('accesses.new')}
                                </Button>
                            )
                        }
                    />
                ) : (
                    <table className="t">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>#</th>
                                <th>{t('accesses.col.name')}</th>
                                <th>{t('accesses.col.description')}</th>
                                <th>{t('accesses.col.groups')}</th>
                                <th
                                    style={{ width: 100, textAlign: 'right' }}
                                >
                                    {t('accesses.col.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((a) => (
                                <AccessRow
                                    key={a.id}
                                    access={a}
                                    onManageGroups={() =>
                                        setManagingGroups(a)
                                    }
                                    onEdit={() =>
                                        setEditing({ mode: 'edit', access: a })
                                    }
                                    onDelete={() => setConfirmDelete(a)}
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

            <AccessEditDrawer
                editing={editing}
                onClose={() => setEditing(null)}
                busy={createMut.isPending || updateMut.isPending}
                onSave={(data) => {
                    if (!editing) return;
                    if (editing.mode === 'create') {
                        createMut.mutate(data, {
                            onSuccess: () => {
                                toast.success(
                                    t('accesses.toast.created', {
                                        name: data.name,
                                    }),
                                );
                                setEditing(null);
                            },
                            onError: (err) => toast.error(extractError(err)),
                        });
                    } else {
                        updateMut.mutate(
                            { id: editing.access.id, payload: data },
                            {
                                onSuccess: () => {
                                    toast.success(t('accesses.toast.updated'));
                                    setEditing(null);
                                },
                                onError: (err) =>
                                    toast.error(extractError(err)),
                            },
                        );
                    }
                }}
            />

            <AccessGroupsDrawer
                access={managingGroups}
                onClose={() => setManagingGroups(null)}
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
                                t('accesses.toast.deleted', {
                                    name: confirmDelete.name,
                                }),
                            );
                            setConfirmDelete(null);
                        },
                        onError: (err) => toast.error(extractError(err)),
                    });
                }}
                title={t('accesses.deleteConfirm.title')}
                description={
                    confirmDelete &&
                    t('accesses.deleteConfirm.description', {
                        name: confirmDelete.name,
                    })
                }
                confirmText={t('common.delete')}
                busy={deleteMut.isPending}
            />
        </div>
    );
};
