export type Id = number;

export interface User {
    id: Id;
    name: string;
    email: string;
    // Eager-loaded by GET /acl/users to avoid N+1 when rendering badges.
    roles?: Group[];
    // Present when the host's User uses SoftDeletes and the listing is
    // requested with status=all or status=deleted.
    deleted_at?: string | null;
}

export type UserStatus = 'active' | 'all' | 'deleted';

export interface Group {
    id: Id;
    name: string;
    description: string | null;
    // Eager-loaded counters from GET /acl/roles (withCount).
    users_count?: number;
    access_lists_count?: number;
}

export interface Access {
    id: Id;
    name: string;
    description: string | null;
    // Eager-loaded by GET /acl/access_list to render group badges.
    roles?: Pick<Group, 'id' | 'name'>[];
}

// User payload is dynamic: the package reads $fillable from the configured
// User model at runtime and builds the form accordingly. Required fields
// (name/email) and password handling are enforced by the form itself.
export type UserPayload = Record<string, string>;

export interface GroupPayload {
    name: string;
    description: string;
}

export interface AccessPayload {
    name: string;
    description: string;
}

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}
