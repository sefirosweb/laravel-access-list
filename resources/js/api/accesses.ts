import { api } from './client';
import { Access, AccessPayload, Group, Id } from '@/types/store';

interface ListResponse<T> {
    success: boolean;
    data: T[];
}

// "Accesses" in UI = "AccessList" in backend.
// Hits /access_list* endpoints and maps {accessId} <-> {access_list_id}.

export const fetchAccesses = async (): Promise<Access[]> => {
    const { data } = await api.get<ListResponse<Access>>('/access_list');
    return data.data;
};

export const createAccess = async (payload: AccessPayload): Promise<void> => {
    await api.post('/access_list', payload);
};

export const updateAccess = async (
    id: Id,
    payload: AccessPayload,
): Promise<void> => {
    await api.put('/access_list', { access_list_id: id, ...payload });
};

export const deleteAccess = async (id: Id): Promise<void> => {
    await api.delete('/access_list', { data: { access_list_id: id } });
};

// Groups <-> Access
export const fetchAccessGroups = async (accessId: Id): Promise<Group[]> => {
    const { data } = await api.get<ListResponse<Group>>('/access_list/roles', {
        params: { access_list_id: accessId },
    });
    return data.data;
};

export const attachGroupToAccess = async (
    accessId: Id,
    groupId: Id,
): Promise<void> => {
    await api.post('/access_list/roles', {
        access_list_id: accessId,
        role_id: groupId,
    });
};

export const detachGroupFromAccess = async (
    accessId: Id,
    groupId: Id,
): Promise<void> => {
    await api.delete('/access_list/roles', {
        data: { access_list_id: accessId, role_id: groupId },
    });
};
