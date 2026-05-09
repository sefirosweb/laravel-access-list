import { api } from './client';
import { Group, User, UserPayload, UserStatus, Id } from '@/types/store';

interface ListResponse<T> {
    success: boolean;
    data: T[];
}

export const fetchUsers = async (status: UserStatus = 'active'): Promise<User[]> => {
    const { data } = await api.get<ListResponse<User>>('/users', {
        params: status === 'active' ? undefined : { status },
    });
    return data.data;
};

export const createUser = async (payload: UserPayload): Promise<void> => {
    await api.post('/users', payload);
};

export const updateUser = async (
    id: Id,
    payload: UserPayload,
): Promise<void> => {
    await api.put('/users', { user_id: id, ...payload });
};

export const deleteUser = async (id: Id): Promise<void> => {
    await api.delete('/users', { data: { user_id: id } });
};

export const fetchUserGroups = async (userId: Id): Promise<Group[]> => {
    const { data } = await api.get<ListResponse<Group>>('/user/roles', {
        params: { user_id: userId },
    });
    return data.data;
};

export const attachGroupToUser = async (
    userId: Id,
    groupId: Id,
): Promise<void> => {
    await api.post('/user/roles', { user_id: userId, role_id: groupId });
};

export const detachGroupFromUser = async (
    userId: Id,
    groupId: Id,
): Promise<void> => {
    await api.delete('/user/roles', {
        data: { user_id: userId, role_id: groupId },
    });
};
