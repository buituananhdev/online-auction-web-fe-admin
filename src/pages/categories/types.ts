export type CategoryStatus = 1 | 2

export const StatusNames: Record<CategoryStatus, string> = {
    1: 'Active',
    2: 'Inactive',
}

export type Category = {
    id: number
    categoryName: string
    status: CategoryStatus
}
