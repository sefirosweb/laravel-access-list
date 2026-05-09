import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { Field } from '@/ui/Field';
import { TextInput } from '@/ui/TextInput';
import { Access, AccessPayload } from '@/types/store';

export type AccessEditState =
    | null
    | { mode: 'create' }
    | { mode: 'edit'; access: Access };

interface Props {
    editing: AccessEditState;
    onClose: () => void;
    onSave: (data: AccessPayload) => void;
    busy?: boolean;
}

export const AccessEditDrawer = ({ editing, onClose, onSave, busy }: Props) => {
    const { t } = useTranslation();
    const [form, setForm] = useState<AccessPayload>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (!editing) return;
        if (editing.mode === 'edit') {
            setForm({
                name: editing.access.name,
                description: editing.access.description ?? '',
            });
        } else {
            setForm({ name: '', description: '' });
        }
    }, [editing]);

    if (!editing) return null;

    const isEdit = editing.mode === 'edit';
    const isValid = !!form.name.trim();

    return (
        <Drawer
            open
            onClose={onClose}
            title={
                isEdit
                    ? t('accesses.form.editTitle')
                    : t('accesses.form.createTitle')
            }
            subtitle={
                isEdit
                    ? `${t('accesses.form.editSubtitlePrefix')} ${editing.access.name}`
                    : t('accesses.form.createSubtitle')
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
                        onClick={() => onSave(form)}
                    >
                        {isEdit
                            ? t('common.save')
                            : t('accesses.form.createBtn')}
                    </Button>
                </>
            }
        >
            <Field
                label={t('accesses.form.name')}
                help={t('accesses.form.nameHelp')}
            >
                <TextInput
                    placeholder={t('accesses.form.namePlaceholder')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mono"
                    autoFocus
                />
            </Field>
            <Field
                label={t('accesses.form.description')}
                help={t('accesses.form.descriptionHelp')}
            >
                <textarea
                    className="input"
                    placeholder={t('accesses.form.descriptionPlaceholder')}
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </Field>
        </Drawer>
    );
};
