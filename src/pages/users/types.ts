export type UserRole = 1 | 2 | 3
export type UserStatus = 1 | 2

export const UserRoleNames: Record<UserRole, string> = {
    1: 'Buyer',
    2: 'Seller',
    3: 'Admin',
}

export type User = {
    id: number
    fullName: string
    email: string
    role: UserRole
    avatar: string
    // projects: Project[];
    notes: string
    status: UserStatus
}
