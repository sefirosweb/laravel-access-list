import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    attachGroupToAccess,
    createAccess,
    deleteAccess,
    detachGroupFromAccess,
    fetchAccessGroups,
    fetchAccesses,
    updateAccess,
} from '@/api/accesses';
import { AccessPayload, Group, Id } from '@/types/store';

const accessesKey = ['accesses'] as const;
const accessGroupsKey = (id: Id) => ['accesses', id, 'groups'] as const;

export const useAccesses = () =>
    useQuery({ queryKey: accessesKey, queryFn: fetchAccesses });

export const useAccessGroups = (accessId: Id | null) =>
    useQuery({
        queryKey: accessGroupsKey(accessId ?? 0),
        queryFn: () => fetchAccessGroups(accessId as Id),
        enabled: accessId != null,
    });

export const useCreateAccess = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: AccessPayload) => createAccess(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: accessesKey }),
    });
};

export const useUpdateAccess = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: Id; payload: AccessPayload }) =>
            updateAccess(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: accessesKey }),
    });
};

export const useDeleteAccess = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: Id) => deleteAccess(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: accessesKey });
            qc.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

export const useToggleAccessGroup = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            accessId,
            groupId,
            attach,
        }: {
            accessId: Id;
            groupId: Id;
            attach: boolean;
        }) =>
            attach
                ? attachGroupToAccess(accessId, groupId)
                : detachGroupFromAccess(accessId, groupId),

        onMutate: async ({ accessId, groupId, attach }) => {
            await qc.cancelQueries({ queryKey: accessGroupsKey(accessId) });
            const previous = qc.getQueryData<Group[]>(
                accessGroupsKey(accessId),
            );

            qc.setQueryData<Group[]>(accessGroupsKey(accessId), (prev = []) => {
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

        onError: (_err, { accessId }, ctx) => {
            if (ctx?.previous) {
                qc.setQueryData(accessGroupsKey(accessId), ctx.previous);
            }
        },

        onSettled: (_data, _err, { accessId }) => {
            qc.invalidateQueries({ queryKey: accessGroupsKey(accessId) });
            qc.invalidateQueries({ queryKey: accessesKey });
            qc.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
