import { api } from './client';
import { Id } from '@/types/store';

export interface CurrentUser {
    id: Id;
    name: string | null;
    email: string | null;
}

interface MeResponse {
    data: CurrentUser | null;
}

export const fetchMe = async (): Promise<CurrentUser | null> => {
    const { data } = await api.get<MeResponse>('/me');
    return data.data;
};
