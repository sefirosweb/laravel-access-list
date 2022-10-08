type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    email_verified_at: string /* Date */;
    created_at: string /* Date */ | null;
    updated_at: string /* Date */ | null;
    deleted_at: string /* Date */ | null;
    roles?: Role[] | null;

}
