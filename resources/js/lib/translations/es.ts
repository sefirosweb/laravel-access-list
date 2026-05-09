export const es = {
    nav: {
        appName: 'ACL',
        users: 'Usuarios',
        groups: 'Grupos',
        accesses: 'Accesos',
    },
    common: {
        save: 'Guardar cambios',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        delete: 'Eliminar',
        close: 'Cerrar',
        done: 'Hecho',
        search: 'Buscar...',
        noItems: 'No hay elementos.',
        sortByName: 'Nombre',
        sortBySelected: 'Asignados',
    },
    table: {
        showing: 'Mostrando',
        result: 'resultado',
        results: 'resultados',
        perPage: 'Por página',
        of: 'de',
    },
    users: {
        title: 'Usuarios',
        subtitle: 'Gestiona las cuentas de usuario y sus pertenencias a grupos.',
        new: 'Nuevo usuario',
        searchPlaceholder: 'Buscar por nombre o email...',
        col: {
            user: 'Usuario',
            email: 'Email',
            groups: 'Grupos',
            actions: 'Acciones',
        },
        empty: {
            title: 'Sin usuarios',
            description: 'Crea tu primer usuario para empezar.',
        },
        emptyFiltered: {
            title: 'Ningún resultado',
            description: 'Prueba con otro término de búsqueda.',
        },
        noGroups: 'Sin grupos',
        status: {
            active: 'Activos',
            all: 'Todos',
            deleted: 'Eliminados',
        },
        deletedBadge: 'Eliminado',
        actions: {
            manageGroups: 'Gestionar grupos',
            edit: 'Editar',
            delete: 'Borrar',
            restore: 'Restaurar',
        },
        restoreConfirm: {
            title: '¿Restaurar usuario?',
            description: 'Se restaurará "{{name}}" y volverá a estar activo.',
        },
        form: {
            createTitle: 'Nuevo usuario',
            createSubtitle: 'Crea una nueva cuenta de usuario.',
            editTitle: 'Editar usuario',
            editSubtitlePrefix: 'Editando',
            passwordPlaceholderCreate: 'Introduce una contraseña',
            passwordPlaceholderEdit: '••••••••',
            passwordHelpCreate: 'Mínimo 8 caracteres recomendado.',
            passwordHelpEdit:
                'Déjalo en blanco para mantener la contraseña actual.',
            createBtn: 'Crear usuario',
            // Translations for the columns the package itself ships
            // (name/email/password). Custom columns added by the host are
            // not translated here — they fall back to the humanized field
            // name. The host can extend i18next at runtime if it needs
            // translated labels for its own columns.
            fields: {
                name: {
                    label: 'Nombre',
                    placeholder: 'ej. Juan Pérez',
                },
                email: {
                    label: 'Email',
                    placeholder: 'usuario@dominio.com',
                },
                password: {
                    label: 'Contraseña',
                },
            },
        },
        groupsDrawer: {
            titlePrefix: 'Grupos de',
            subtitle: 'Selecciona los grupos a los que pertenece este usuario.',
            empty: 'No hay grupos creados.',
        },
        deleteConfirm: {
            title: '¿Eliminar usuario?',
            description:
                'Se eliminará "{{name}}" y se quitará de todos los grupos. Esta acción no se puede deshacer.',
        },
        toast: {
            created: 'Usuario "{{name}}" creado.',
            updated: 'Usuario actualizado.',
            deleted: 'Usuario "{{name}}" eliminado.',
            restored: 'Usuario "{{name}}" restaurado.',
        },
    },
    groups: {
        title: 'Grupos',
        subtitle: 'Conjuntos de permisos asignables a uno o varios usuarios.',
        new: 'Nuevo grupo',
        searchPlaceholder: 'Buscar grupos...',
        col: {
            name: 'Nombre',
            description: 'Descripción',
            users: 'Usuarios',
            accesses: 'Accesos',
            actions: 'Acciones',
        },
        empty: {
            title: 'Sin grupos',
            description: 'Crea grupos para agrupar permisos.',
        },
        emptyFiltered: {
            title: 'Ningún resultado',
            description: 'Prueba con otro término de búsqueda.',
        },
        actions: {
            edit: 'Editar',
            delete: 'Borrar',
        },
        form: {
            createTitle: 'Nuevo grupo',
            createSubtitle: 'Crea un nuevo grupo de permisos.',
            editTitle: 'Editar grupo',
            editSubtitlePrefix: 'Editando',
            name: 'Nombre',
            namePlaceholder: 'ej. admin',
            description: 'Descripción',
            descriptionPlaceholder: 'ej. Group of administrators',
            descriptionHelp: 'Explica brevemente para qué sirve.',
            createBtn: 'Crear grupo',
        },
        usersDrawer: {
            titlePrefix: 'Usuarios en',
            subtitle: 'Marca los usuarios que pertenecen a este grupo.',
            empty: 'No hay usuarios creados.',
        },
        accessesDrawer: {
            titlePrefix: 'Accesos de',
            subtitle: 'Selecciona los permisos que otorga este grupo.',
            empty: 'No hay accesos creados.',
        },
        deleteConfirm: {
            title: '¿Eliminar grupo?',
            description:
                'Se eliminará "{{name}}" y los usuarios perderán los permisos asociados.',
        },
        toast: {
            created: 'Grupo "{{name}}" creado.',
            updated: 'Grupo actualizado.',
            deleted: 'Grupo "{{name}}" eliminado.',
        },
    },
    accesses: {
        title: 'Accesos',
        subtitle: 'Permisos atómicos que se asignan a uno o varios grupos.',
        new: 'Nuevo acceso',
        searchPlaceholder: 'Buscar accesos...',
        col: {
            name: 'Permiso',
            description: 'Descripción',
            groups: 'Grupos',
            actions: 'Acciones',
        },
        empty: {
            title: 'Sin accesos',
            description: 'Define permisos atómicos para tu sistema.',
        },
        emptyFiltered: {
            title: 'Ningún resultado',
            description: 'Prueba con otro término de búsqueda.',
        },
        noGroups: 'Sin grupos',
        assign: '+ Asignar',
        actions: {
            edit: 'Editar',
            delete: 'Borrar',
        },
        form: {
            createTitle: 'Nuevo acceso',
            createSubtitle: 'Define un nuevo permiso atómico.',
            editTitle: 'Editar acceso',
            editSubtitlePrefix: 'Editando',
            name: 'Nombre',
            namePlaceholder: 'ej. acl_edit',
            nameHelp: 'Identificador en formato snake_case, ej. acl_edit.',
            description: 'Descripción',
            descriptionPlaceholder:
                'ej. Manage who can edit the access list and users',
            descriptionHelp: 'Explica brevemente para qué sirve.',
            createBtn: 'Crear acceso',
        },
        groupsDrawer: {
            titlePrefix: 'Grupos con',
            subtitle: 'Marca qué grupos otorgan este acceso.',
            empty: 'No hay grupos creados.',
        },
        deleteConfirm: {
            title: '¿Eliminar acceso?',
            description:
                '"{{name}}" se quitará de todos los grupos que lo tengan asignado.',
        },
        toast: {
            created: 'Acceso "{{name}}" creado.',
            updated: 'Acceso actualizado.',
            deleted: 'Acceso "{{name}}" eliminado.',
        },
    },
} as const;
