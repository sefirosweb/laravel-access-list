import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    attachGroupToUser,
    createUser,
    deleteUser,
    detachGroupFromUser,
    fetchUserGroups,
    fetchUsers,
    updateUser,
} from '@/api/users';
import { Group, Id, UserPayload, UserStatus } from '@/types/store';

const usersKey = (status: UserStatus = 'active') =>
    ['users', status] as const;
const userGroupsKey = (id: Id) => ['users', id, 'groups'] as const;

export const useUsers = (status: UserStatus = 'active') =>
    useQuery({
        queryKey: usersKey(status),
        queryFn: () => fetchUsers(status),
    });

export const useUserGroups = (userId: Id | null) =>
    useQuery({
        queryKey: userGroupsKey(userId ?? 0),
        queryFn: () => fetchUserGroups(userId as Id),
        enabled: userId != null,
    });

export const useCreateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserPayload) => createUser(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
};

export const useUpdateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: Id; payload: UserPayload }) =>
            updateUser(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
};

export const useDeleteUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: Id) => deleteUser(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
};

export const useToggleUserGroup = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            userId,
            groupId,
            attach,
        }: {
            userId: Id;
            groupId: Id;
            attach: boolean;
        }) =>
            attach
                ? attachGroupToUser(userId, groupId)
                : detachGroupFromUser(userId, groupId),

        // Optimistic update: flip the user's groups in cache immediately so
        // the UI doesn't flicker between "mutation done" and "refetch done".
        onMutate: async ({ userId, groupId, attach }) => {
            await qc.cancelQueries({ queryKey: userGroupsKey(userId) });
            const previous = qc.getQueryData<Group[]>(userGroupsKey(userId));

            qc.setQueryData<Group[]>(userGroupsKey(userId), (prev = []) => {
                if (attach) {
                    if (prev.some((g) => g.id === groupId)) return prev;
                    const fromList = (
                        qc.getQueryData<Group[]>(['groups']) ?? []
                    ).find((g) => g.id === groupId);
                    return fromList
                        ? [...prev, fromList]
                        : [
                              ...prev,
                              {
                                  id: groupId,
                                  name: '',
                                  description: null,
                              } as Group,
                          ];
                }
                return prev.filter((g) => g.id !== groupId);
            });

            return { previous };
        },

        onError: (_err, { userId }, ctx) => {
            if (ctx?.previous) {
                qc.setQueryData(userGroupsKey(userId), ctx.previous);
            }
        },

        onSettled: (_data, _err, { userId }) => {
            // Sync with server (cache may have used a stub for new entries).
            qc.invalidateQueries({ queryKey: userGroupsKey(userId) });
            qc.invalidateQueries({ queryKey: ['users'] });
            qc.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
