import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { useUserFields } from '@/hooks/useUserFields';
import { User } from '@/types/store';
import { DynamicUserField } from './DynamicUserField';

export type UserEditState =
    | null
    | { mode: 'create' }
    | { mode: 'edit'; user: User };

type FormState = Record<string, string>;

interface Props {
    editing: UserEditState;
    onClose: () => void;
    onSave: (data: Record<string, string>) => void;
    busy?: boolean;
}

export const UserEditDrawer = ({ editing, onClose, onSave, busy }: Props) => {
    const { t } = useTranslation();
    const { data: schema } = useUserFields();
    const columns = schema?.columns ?? [];

    const [form, setForm] = useState<FormState>({});

    useEffect(() => {
        if (!editing || columns.length === 0) return;
        const next: FormState = {};
        columns.forEach((col) => {
            if (editing.mode === 'edit') {
                // Password field is never pre-filled
                if (col.fieldType === 'password') {
                    next[col.field] = '';
                } else {
                    const v = (editing.user as unknown as Record<string, unknown>)[
                        col.field
                    ];
                    next[col.field] = v == null ? '' : String(v);
                }
            } else {
                next[col.field] = '';
            }
        });
        setForm(next);
    }, [editing, columns]);

    const isEdit = editing?.mode === 'edit';

    const isValid = useMemo(() => {
        if (!editing) return false;
        // Required: any non-password field with a value, plus password on create
        for (const col of columns) {
            const v = (form[col.field] ?? '').trim();
            if (col.fieldType === 'password') {
                if (!isEdit && !v) return false;
            } else if (col.field === 'name' || col.field === 'email') {
                if (!v) return false;
            }
        }
        return true;
    }, [columns, form, isEdit, editing]);

    if (!editing) return null;

    const submit = () => {
        const payload: Record<string, string> = {};
        columns.forEach((col) => {
            const v = form[col.field] ?? '';
            // Skip empty password on edit (means "don't change")
            if (col.fieldType === 'password' && isEdit && !v) return;
            payload[col.field] = v;
        });
        onSave(payload);
    };

    return (
        <Drawer
            open
            onClose={onClose}
            title={
                isEdit
                    ? t('users.form.editTitle')
                    : t('users.form.createTitle')
            }
            subtitle={
                isEdit
                    ? `${t('users.form.editSubtitlePrefix')} ${editing.user.name}`
                    : t('users.form.createSubtitle')
            }
            footer={
                <>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={busy}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!isValid || busy}
                        onClick={submit}
                    >
                        {isEdit
                            ? t('common.save')
                            : t('users.form.createBtn')}
                    </Button>
                </>
            }
        >
            {columns.map((col, i) => (
                <DynamicUserField
                    key={col.field}
                    def={col}
                    value={form[col.field] ?? ''}
                    onChange={(v) => setForm({ ...form, [col.field]: v })}
                    isEdit={isEdit}
                    autoFocus={i === 0}
                />
            ))}
        </Drawer>
    );
};
