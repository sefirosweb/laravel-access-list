import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    attachAccessToGroup,
    attachUserToGroup,
    createGroup,
    deleteGroup,
    detachAccessFromGroup,
    detachUserFromGroup,
    fetchGroupAccesses,
    fetchGroups,
    fetchGroupUsers,
    updateGroup,
} from '@/api/groups';
import { Access, GroupPayload, Id, User } from '@/types/store';

const groupsKey = ['groups'] as const;
const groupUsersKey = (id: Id) => ['groups', id, 'users'] as const;
const groupAccessesKey = (id: Id) => ['groups', id, 'accesses'] as const;

export const useGroups = () =>
    useQuery({ queryKey: groupsKey, queryFn: fetchGroups });

export const useGroupUsers = (groupId: Id | null) =>
    useQuery({
        queryKey: groupUsersKey(groupId ?? 0),
        queryFn: () => fetchGroupUsers(groupId as Id),
        enabled: groupId != null,
    });

export const useGroupAccesses = (groupId: Id | null) =>
    useQuery({
        queryKey: groupAccessesKey(groupId ?? 0),
        queryFn: () => fetchGroupAccesses(groupId as Id),
        enabled: groupId != null,
    });

export const useCreateGroup = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: GroupPayload) => createGroup(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: groupsKey }),
    });
};

export const useUpdateGroup = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: Id; payload: GroupPayload }) =>
            updateGroup(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: groupsKey }),
    });
};

export const useDeleteGroup = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: Id) => deleteGroup(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: groupsKey });
            qc.invalidateQueries({ queryKey: ['users'] });
            qc.invalidateQueries({ queryKey: ['accesses'] });
        },
    });
};

export const useToggleGroupUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            userId,
            attach,
        }: {
            groupId: Id;
            userId: Id;
            attach: boolean;
        }) =>
            attach
                ? attachUserToGroup(groupId, userId)
                : detachUserFromGroup(groupId, userId),

        onMutate: async ({ groupId, userId, attach }) => {
            await qc.cancelQueries({ queryKey: groupUsersKey(groupId) });
            const previous = qc.getQueryData<User[]>(groupUsersKey(groupId));

            qc.setQueryData<User[]>(groupUsersKey(groupId), (prev = []) => {
                if (attach) {
                    if (prev.some((u) => u.id === userId)) return prev;
                    const fromList = (
                        qc.getQueryData<User[]>(['users']) ?? []
                    ).find((u) => u.id === userId);
                    return fromList
                        ? [...prev, fromList]
                        : [
                              ...prev,
                              { id: userId, name: '', email: '' } as User,
                          ];
                }
                return prev.filter((u) => u.id !== userId);
            });

            return { previous };
        },

        onError: (_err, { groupId }, ctx) => {
            if (ctx?.previous) {
                qc.setQueryData(groupUsersKey(groupId), ctx.previous);
            }
        },

        onSettled: (_data, _err, { groupId }) => {
            qc.invalidateQueries({ queryKey: groupUsersKey(groupId) });
            qc.invalidateQueries({ queryKey: groupsKey });
            qc.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useToggleGroupAccess = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            accessId,
            attach,
        }: {
            groupId: Id;
            accessId: Id;
            attach: boolean;
        }) =>
            attach
                ? attachAccessToGroup(groupId, accessId)
                : detachAccessFromGroup(groupId, accessId),

        onMutate: async ({ groupId, accessId, attach }) => {
            await qc.cancelQueries({ queryKey: groupAccessesKey(groupId) });
            const previous = qc.getQueryData<Access[]>(
                groupAccessesKey(groupId),
            );

            qc.setQueryData<Access[]>(groupAccessesKey(groupId), (prev = []) => {
                if (attach) {
                    if (prev.some((a) => a.id === accessId)) return prev;
                    const fromList = (
                        qc.getQueryData<Access[]>(['accesses']) ?? []
                    ).find((a) => a.id === accessId);
                    return fromList
                        ? [...prev, fromList]
                        : [
                              ...prev,
                              {
                                  id: accessId,
                                  name: '',
                                  description: null,
                              } as Access,
                          ];
                }
                return prev.filter((a) => a.id !== accessId);
            });

            return { previous };
        },

        onError: (_err, { groupId }, ctx) => {
            if (ctx?.previous) {
                qc.setQueryData(groupAccessesKey(groupId), ctx.previous);
            }
        },

        onSettled: (_data, _err, { groupId }) => {
            qc.invalidateQueries({ queryKey: groupAccessesKey(groupId) });
            qc.invalidateQueries({ queryKey: groupsKey });
            qc.invalidateQueries({ queryKey: ['accesses'] });
        },
    });
};
