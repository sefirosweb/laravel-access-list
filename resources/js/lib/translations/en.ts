export const en = {
    nav: {
        appName: 'ACL',
        users: 'Users',
        groups: 'Groups',
        accesses: 'Accesses',
        backToApp: 'Back to app',
    },
    footer: {
        builtBy: 'Built by',
        viewSource: 'View source on GitHub',
    },
    common: {
        save: 'Save changes',
        cancel: 'Cancel',
        confirm: 'Confirm',
        delete: 'Delete',
        close: 'Close',
        done: 'Done',
        search: 'Search...',
        noItems: 'No items.',
        sortByName: 'Name',
        sortBySelected: 'Assigned',
    },
    table: {
        showing: 'Showing',
        result: 'result',
        results: 'results',
        perPage: 'Per page',
        of: 'of',
    },
    users: {
        title: 'Users',
        subtitle: 'Manage user accounts and their group memberships.',
        new: 'New user',
        searchPlaceholder: 'Search by name or email...',
        col: {
            user: 'User',
            email: 'Email',
            groups: 'Groups',
            actions: 'Actions',
        },
        empty: {
            title: 'No users',
            description: 'Create your first user to get started.',
        },
        emptyFiltered: {
            title: 'No results',
            description: 'Try a different search term.',
        },
        noGroups: 'No groups',
        status: {
            active: 'Active',
            all: 'All',
            deleted: 'Deleted',
        },
        deletedBadge: 'Deleted',
        actions: {
            manageGroups: 'Manage groups',
            edit: 'Edit',
            delete: 'Delete',
            restore: 'Restore',
        },
        restoreConfirm: {
            title: 'Restore user?',
            description: '"{{name}}" will be restored and become active again.',
        },
        form: {
            createTitle: 'New user',
            createSubtitle: 'Create a new user account.',
            editTitle: 'Edit user',
            editSubtitlePrefix: 'Editing',
            passwordPlaceholderCreate: 'Enter a password',
            passwordPlaceholderEdit: '••••••••',
            passwordHelpCreate: '8 characters minimum recommended.',
            passwordHelpEdit: 'Leave blank to keep the current password.',
            createBtn: 'Create user',
            // Translations for the columns the package itself ships
            // (name/email/password). Custom columns added by the host are
            // not translated here — they fall back to the humanized field
            // name. The host can extend i18next at runtime if it needs
            // translated labels for its own columns.
            fields: {
                name: {
                    label: 'Name',
                    placeholder: 'e.g. Jane Doe',
                },
                email: {
                    label: 'Email',
                    placeholder: 'user@domain.com',
                },
                password: {
                    label: 'Password',
                },
            },
        },
        groupsDrawer: {
            titlePrefix: 'Groups for',
            subtitle: 'Select the groups this user belongs to.',
            empty: 'No groups created.',
        },
        deleteConfirm: {
            title: 'Delete user?',
            description:
                '"{{name}}" will be removed from all groups. This action cannot be undone.',
        },
        toast: {
            created: 'User "{{name}}" created.',
            updated: 'User updated.',
            deleted: 'User "{{name}}" deleted.',
            restored: 'User "{{name}}" restored.',
        },
    },
    groups: {
        title: 'Groups',
        subtitle: 'Sets of permissions assignable to one or more users.',
        new: 'New group',
        searchPlaceholder: 'Search groups...',
        col: {
            name: 'Name',
            description: 'Description',
            users: 'Users',
            accesses: 'Accesses',
            actions: 'Actions',
        },
        empty: {
            title: 'No groups',
            description: 'Create groups to bundle permissions.',
        },
        emptyFiltered: {
            title: 'No results',
            description: 'Try a different search term.',
        },
        actions: {
            edit: 'Edit',
            delete: 'Delete',
        },
        form: {
            createTitle: 'New group',
            createSubtitle: 'Create a new permission group.',
            editTitle: 'Edit group',
            editSubtitlePrefix: 'Editing',
            name: 'Name',
            namePlaceholder: 'e.g. admin',
            description: 'Description',
            descriptionPlaceholder: 'e.g. Group of administrators',
            descriptionHelp: 'Briefly describe what it does.',
            createBtn: 'Create group',
        },
        usersDrawer: {
            titlePrefix: 'Users in',
            subtitle: 'Mark the users that belong to this group.',
            empty: 'No users created.',
        },
        accessesDrawer: {
            titlePrefix: 'Accesses for',
            subtitle: 'Select the permissions this group grants.',
            empty: 'No accesses created.',
        },
        deleteConfirm: {
            title: 'Delete group?',
            description:
                '"{{name}}" will be removed and its users will lose its permissions.',
        },
        toast: {
            created: 'Group "{{name}}" created.',
            updated: 'Group updated.',
            deleted: 'Group "{{name}}" deleted.',
        },
    },
    accesses: {
        title: 'Accesses',
        subtitle: 'Atomic permissions assigned to one or more groups.',
        new: 'New access',
        searchPlaceholder: 'Search accesses...',
        col: {
            name: 'Permission',
            description: 'Description',
            groups: 'Groups',
            actions: 'Actions',
        },
        empty: {
            title: 'No accesses',
            description: 'Define atomic permissions for your system.',
        },
        emptyFiltered: {
            title: 'No results',
            description: 'Try a different search term.',
        },
        noGroups: 'No groups',
        assign: '+ Assign',
        actions: {
            edit: 'Edit',
            delete: 'Delete',
        },
        form: {
            createTitle: 'New access',
            createSubtitle: 'Define a new atomic permission.',
            editTitle: 'Edit access',
            editSubtitlePrefix: 'Editing',
            name: 'Name',
            namePlaceholder: 'e.g. acl_edit',
            nameHelp: 'Snake_case identifier, e.g. acl_edit.',
            description: 'Description',
            descriptionPlaceholder:
                'e.g. Manage who can edit the access list and users',
            descriptionHelp: 'Briefly describe what it does.',
            createBtn: 'Create access',
        },
        groupsDrawer: {
            titlePrefix: 'Groups with',
            subtitle: 'Mark which groups grant this access.',
            empty: 'No groups created.',
        },
        deleteConfirm: {
            title: 'Delete access?',
            description:
                '"{{name}}" will be removed from all groups that have it assigned.',
        },
        toast: {
            created: 'Access "{{name}}" created.',
            updated: 'Access updated.',
            deleted: 'Access "{{name}}" deleted.',
        },
    },
} as const;
