import { api } from './client';
import { Access, Group, GroupPayload, Id, User } from '@/types/store';

interface ListResponse<T> {
    success: boolean;
    data: T[];
}

interface SelectorItem extends User {
    value: Id;
}

interface SelectorAccessItem extends Access {
    value: Id;
}

// "Groups" in UI = "Roles" in backend.
// Hits /roles* endpoints and maps {groupId} <-> {role_id}.

export const fetchGroups = async (): Promise<Group[]> => {
    const { data } = await api.get<ListResponse<Group>>('/roles');
    return data.data;
};

export const createGroup = async (payload: GroupPayload): Promise<void> => {
    await api.post('/roles', payload);
};

export const updateGroup = async (
    id: Id,
    payload: GroupPayload,
): Promise<void> => {
    await api.put('/roles', { role_id: id, ...payload });
};

export const deleteGroup = async (id: Id): Promise<void> => {
    await api.delete('/roles', { data: { role_id: id } });
};

// Users <-> Group
export const fetchGroupUsers = async (groupId: Id): Promise<User[]> => {
    const { data } = await api.get<ListResponse<User>>('/role/users', {
        params: { role_id: groupId },
    });
    return data.data;
};

export const fetchAllUsersForSelector = async (): Promise<SelectorItem[]> => {
    const { data } = await api.get<{ data: SelectorItem[] }>(
        '/role/users/get_array',
    );
    return data.data;
};

export const attachUserToGroup = async (
    groupId: Id,
    userId: Id,
): Promise<void> => {
    await api.post('/role/users', { role_id: groupId, user_id: userId });
};

export const detachUserFromGroup = async (
    groupId: Id,
    userId: Id,
): Promise<void> => {
    await api.delete('/role/users', {
        data: { role_id: groupId, user_id: userId },
    });
};

// Accesses <-> Group
export const fetchGroupAccesses = async (groupId: Id): Promise<Access[]> => {
    const { data } = await api.get<ListResponse<Access>>('/role/access_lists', {
        params: { role_id: groupId },
    });
    return data.data;
};

export const fetchAllAccessesForSelector = async (): Promise<
    SelectorAccessItem[]
> => {
    const { data } = await api.get<{ data: SelectorAccessItem[] }>(
        '/role/access_lists/get_array',
    );
    return data.data;
};

export const attachAccessToGroup = async (
    groupId: Id,
    accessId: Id,
): Promise<void> => {
    await api.post('/role/access_lists', {
        role_id: groupId,
        access_list_id: accessId,
    });
};

export const detachAccessFromGroup = async (
    groupId: Id,
    accessId: Id,
): Promise<void> => {
    await api.delete('/role/access_lists', {
        data: { role_id: groupId, access_list_id: accessId },
    });
};
