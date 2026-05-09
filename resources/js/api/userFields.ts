import { api } from './client';

export type FieldType = 'text' | 'password' | 'number' | 'datetime';

export interface UserFieldDef {
    field: string;
    fieldType: FieldType;
}

export interface UserFieldsResponse {
    id: string;
    columns: UserFieldDef[];
    hidden: string[];
    softDelete: boolean;
}

export const fetchUserFields = async (): Promise<UserFieldsResponse> => {
    const { data } = await api.get<UserFieldsResponse>(
        '/get_user_fillable_data',
    );
    return data;
};
