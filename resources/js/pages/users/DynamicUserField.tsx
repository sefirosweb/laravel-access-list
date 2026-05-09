import { useTranslation } from 'react-i18next';
import { Field } from '@/ui/Field';
import { TextInput } from '@/ui/TextInput';
import { IconLock, IconMail } from '@/ui/icons';
import { UserFieldDef } from '@/api/userFields';

interface Props {
    def: UserFieldDef;
    value: string;
    onChange: (next: string) => void;
    isEdit: boolean;
    autoFocus?: boolean;
}

const labelKey = (field: string) => `users.form.fields.${field}.label`;
const placeholderKey = (field: string) => `users.form.fields.${field}.placeholder`;

export const DynamicUserField = ({
    def,
    value,
    onChange,
    isEdit,
    autoFocus,
}: Props) => {
    const { t } = useTranslation();

    // Sensible label/placeholder defaults: try translations first, fall back to
    // the raw field name with first letter uppercased.
    const fallbackLabel =
        def.field.charAt(0).toUpperCase() + def.field.slice(1).replace(/_/g, ' ');
    const label = t(labelKey(def.field), { defaultValue: fallbackLabel });
    const placeholder = t(placeholderKey(def.field), { defaultValue: '' });

    // Disable browser autofill across the board: this drawer edits an
    // arbitrary user (admin context), not the currently logged-in one,
    // so the browser pre-filling its own credentials would silently
    // overwrite someone else's data on submit.
    const noFill = {
        autoComplete: 'off',
        // Some browsers (Chrome, Safari) ignore autoComplete="off" on
        // recognized fields; randomising the input name is the most
        // reliable workaround.
        name: `acl-${def.field}-${Math.random().toString(36).slice(2, 8)}`,
        'data-lpignore': 'true', // LastPass
        'data-1p-ignore': 'true', // 1Password
    };

    if (def.fieldType === 'password') {
        return (
            <Field
                label={label}
                help={
                    isEdit
                        ? t('users.form.passwordHelpEdit')
                        : t('users.form.passwordHelpCreate')
                }
            >
                <TextInput
                    type="password"
                    icon={<IconLock size={14} />}
                    placeholder={
                        isEdit
                            ? t('users.form.passwordPlaceholderEdit')
                            : placeholder ||
                              t('users.form.passwordPlaceholderCreate')
                    }
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    {...noFill}
                    autoComplete="new-password"
                />
            </Field>
        );
    }

    if (def.field === 'email') {
        return (
            <Field label={label}>
                <TextInput
                    type="email"
                    icon={<IconMail size={14} />}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoFocus={autoFocus}
                    {...noFill}
                />
            </Field>
        );
    }

    const inputType =
        def.fieldType === 'number'
            ? 'number'
            : def.fieldType === 'datetime'
              ? 'datetime-local'
              : 'text';

    return (
        <Field label={label}>
            <TextInput
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus={autoFocus}
                {...noFill}
            />
        </Field>
    );
};
