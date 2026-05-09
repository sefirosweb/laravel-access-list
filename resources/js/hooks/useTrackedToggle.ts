import { useState } from 'react';
import { Id } from '@/types/store';

/**
 * Wraps a TanStack Query mutateAsync so callers can know which ids are mid-flight.
 * Used by relation drawers to render a spinner in the check-row that's pending,
 * so the user gets immediate feedback even on slow networks.
 */
export function useTrackedToggle<T>(
    mutateAsync: (args: T) => Promise<unknown>,
) {
    const [pendingIds, setPendingIds] = useState<Set<Id>>(new Set());

    const trigger = async (id: Id, args: T): Promise<void> => {
        setPendingIds((prev) => new Set(prev).add(id));
        try {
            await mutateAsync(args);
        } catch {
            // Errors are surfaced by the underlying mutation (toast etc.).
        } finally {
            setPendingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return {
        pendingIds: Array.from(pendingIds),
        trigger,
    };
}
