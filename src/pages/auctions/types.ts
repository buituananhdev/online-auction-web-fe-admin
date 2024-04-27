import { Category } from '../categories/types'
import { UserRole, UserStatus } from '../users/types'
export type ProductStatus = 1 | 2 | 3 | 4 | 5
export type ProductCondition = 1 | 2 | 3

export const ConditionNames: Record<ProductCondition, string> = {
    1: 'New',
    2: 'Open Box',
    3: 'Used',
}

export interface Seller {
    fullName: string
    email: string
    phone: string
    address: string
    password: string
    role: UserRole
    status: UserStatus
    id: number
    dateCreated: Date
    lastModifiedDate: Date
    lastModifiedBy: string
}

export type Auction = {
    id: number
    productName: string
    productStatus: ProductStatus
    condition: ProductCondition
    endTime: Date
    startingPrice: number
    user: Seller
    currentPrice: number
    bidCount: number
    category: Category
}
