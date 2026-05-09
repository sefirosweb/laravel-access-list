import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/Button';
import { Drawer } from '@/ui/Drawer';
import { Field } from '@/ui/Field';
import { TextInput } from '@/ui/TextInput';
import { Group, GroupPayload } from '@/types/store';

export type GroupEditState =
    | null
    | { mode: 'create' }
    | { mode: 'edit'; group: Group };

interface Props {
    editing: GroupEditState;
    onClose: () => void;
    onSave: (data: GroupPayload) => void;
    busy?: boolean;
}

export const GroupEditDrawer = ({ editing, onClose, onSave, busy }: Props) => {
    const { t } = useTranslation();
    const [form, setForm] = useState<GroupPayload>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (!editing) return;
        if (editing.mode === 'edit') {
            setForm({
                name: editing.group.name,
                description: editing.group.description ?? '',
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
                    ? t('groups.form.editTitle')
                    : t('groups.form.createTitle')
            }
            subtitle={
                isEdit
                    ? `${t('groups.form.editSubtitlePrefix')} ${editing.group.name}`
                    : t('groups.form.createSubtitle')
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
                            : t('groups.form.createBtn')}
                    </Button>
                </>
            }
        >
            <Field label={t('groups.form.name')}>
                <TextInput
                    placeholder={t('groups.form.namePlaceholder')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                />
            </Field>
            <Field
                label={t('groups.form.description')}
                help={t('groups.form.descriptionHelp')}
            >
                <textarea
                    className="input"
                    placeholder={t('groups.form.descriptionPlaceholder')}
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </Field>
        </Drawer>
    );
};
