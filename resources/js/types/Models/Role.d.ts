type Role = {
    id: number;
    name: string;
    description: string;
    created_at: string /* Date */ | null;
    updated_at: string /* Date */ | null;
    users?: User[] | null;
    access_lists?: AccessList[] | null;
}
