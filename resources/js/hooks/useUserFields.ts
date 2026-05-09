import { useQuery } from '@tanstack/react-query';
import { fetchUserFields } from '@/api/userFields';

export const useUserFields = () =>
    useQuery({
        queryKey: ['user-fields'],
        queryFn: fetchUserFields,
        staleTime: Infinity, // schema doesn't change at runtime
    });
