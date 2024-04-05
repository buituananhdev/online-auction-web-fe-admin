export type UserRole = 1 | 2 | 3
export type UserStatus = 1 | 2

export const UserRoleNames: Record<UserRole, string> = {
    1: 'Buyer',
    2: 'Seller',
    3: 'Admin',
}

export const UserStatusNames: Record<UserStatus, string> = {
    1: 'Active',
    2: 'Inactive',
}

export type User = {
    id: string
    fullName: string
    email: string
    role: UserRole
    avatar: string
    // projects: Project[];
    notes: string
    status: UserStatus
    phone: string
    address: string
    password: string
}
