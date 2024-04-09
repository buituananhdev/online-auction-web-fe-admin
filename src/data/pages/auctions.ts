import { Auction, ProductStatus, ProductCondition } from '../../pages/auctions/types'
import { getAllAuctions } from '../../services/auction.service'

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof Auction | undefined
    sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
    search: string
    condition: 1 | 2 | 3
}

export const ProductStatusNames: Record<ProductStatus, string> = {
    1: 'Available',
    2: 'Sold',
    3: 'Deleted',
    4: 'Canceled',
    5: 'Pending Publish',
}

export const ConditionNames: Record<ProductCondition, string> = {
    1: 'New',
    2: 'Open Box',
    3: 'Used',
}

export const getAuctions = async (filters: Partial<Filters & Pagination & Sorting>) => {
    const res = await getAllAuctions(filters)
    const filteredAuctions = res.data.data
    console.log(2222222222222222, filteredAuctions)

    // if (search) {
    //     filteredAuctions = filteredAuctions.filter((user: any) =>
    //         user.productName.toLowerCase().includes(search.toLowerCase()),
    //     )
    // }

    const { page = 1, perPage = 10 } = filters || {}
    return {
        data: filteredAuctions.slice((page - 1) * perPage, page * perPage),
        pagination: {
            page,
            perPage,
            total: filteredAuctions.length,
        },
    }
}

export const addUser = async (user: Auction) => {
    await sleep(1000)
    users.unshift(user)
}

export const updateUser = async (user: Auction) => {
    await sleep(1000)
    const index = users.findIndex((u) => u.id === user.id)
    users[index] = user
}
