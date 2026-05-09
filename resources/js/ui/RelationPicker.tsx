import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from './Avatar';
import { Spinner } from './Spinner';
import { TextInput } from './TextInput';
import { IconCheck, IconSearch } from './icons';
import { Id } from '@/types/store';

type SortMode = 'name' | 'selected';

interface RelationPickerProps<T extends { id: Id }> {
    items: T[];
    selectedIds: Id[];
    onToggle: (id: Id) => void;
    getLabel: (item: T) => string;
    getDescription?: (item: T) => string | null | undefined;
    getInitials?: (item: T) => string;
    emptyText?: string;
    /** Ids whose toggle request is in flight; the row shows a spinner. */
    pendingIds?: Id[];
}

export function RelationPicker<T extends { id: Id }>({
    items,
    selectedIds,
    onToggle,
    getLabel,
    getDescription,
    getInitials,
    emptyText,
    pendingIds,
}: RelationPickerProps<T>) {
    const { t } = useTranslation();
    const [q, setQ] = useState('');
    const [sortBy, setSortBy] = useState<SortMode>('name');

    // Snapshot the "assigned first" order on entry / when the user
    // explicitly resorts. Without this snapshot, toggling a row would make
    // it jump to the other side mid-click — confusing UX.
    const frozenSelectedRef = useRef<Set<Id> | null>(null);
    const setSort = (mode: SortMode) => {
        frozenSelectedRef.current =
            mode === 'selected' ? new Set(selectedIds) : null;
        setSortBy(mode);
    };

    const filtered = items.filter((it) => {
        const text = (
            getLabel(it) +
            ' ' +
            (getDescription?.(it) || '')
        ).toLowerCase();
        return text.includes(q.toLowerCase());
    });

    const visible = useMemo(() => {
        const sorted = [...filtered].sort((a, b) =>
            getLabel(a).localeCompare(getLabel(b)),
        );
        if (sortBy !== 'selected') return sorted;
        const frozen = frozenSelectedRef.current ?? new Set(selectedIds);
        return sorted.sort((a, b) => {
            const aSel = frozen.has(a.id);
            const bSel = frozen.has(b.id);
            if (aSel === bSel) return 0;
            return aSel ? -1 : 1;
        });
    }, [filtered, sortBy, getLabel, selectedIds]);

    return (
        <div>
            <TextInput
                icon={<IconSearch size={14} />}
                placeholder={t('common.search')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
            <div className="sort-toggle" role="tablist" aria-label="Sort">
                <button
                    type="button"
                    role="tab"
                    aria-selected={sortBy === 'name'}
                    className={`sort-toggle-btn ${sortBy === 'name' ? 'is-active' : ''}`}
                    onClick={() => setSort('name')}
                >
                    {t('common.sortByName')}
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={sortBy === 'selected'}
                    className={`sort-toggle-btn ${sortBy === 'selected' ? 'is-active' : ''}`}
                    onClick={() => setSort('selected')}
                >
                    {t('common.sortBySelected')}
                </button>
            </div>
            <div className="check-list">
                {visible.length === 0 ? (
                    <div className="check-list-empty">
                        {emptyText ?? t('common.noItems')}
                    </div>
                ) : (
                    visible.map((it) => {
                        const checked = selectedIds.includes(it.id);
                        const isPending = pendingIds?.includes(it.id) ?? false;
                        return (
                            <div
                                key={it.id}
                                className={`check-row ${checked ? 'is-checked' : ''} ${isPending ? 'is-pending' : ''}`}
                                onClick={() => !isPending && onToggle(it.id)}
                            >
                                <span className="check-box">
                                    {isPending ? (
                                        <Spinner size={12} />
                                    ) : (
                                        checked && (
                                            <IconCheck size={11} stroke={3} />
                                        )
                                    )}
                                </span>
                                {getInitials && (
                                    <Avatar
                                        name={getInitials(it)}
                                        size={26}
                                    />
                                )}
                                <div className="check-row-text">
                                    <div className="check-row-label">
                                        {getLabel(it)}
                                    </div>
                                    {getDescription && (
                                        <div className="check-row-desc">
                                            {getDescription(it)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
