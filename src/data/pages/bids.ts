import { Bid } from '../../pages/bids/types'
import { getAllBids } from '../../services/bid.service'

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof Bid | undefined
    sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
    search: string
}

export const getBids = async (filters: Partial<Filters & Pagination & Sorting>) => {
    const res = await getAllBids()
    const { search } = filters
    let filteredBids = res.data.data

    if (search) {
        filteredBids = filteredBids.filter((user: any) => user.bidderId.toLowerCase().includes(search.toLowerCase()))
    }

    const { page = 1, perPage = 10 } = filters || {}
    return {
        data: filteredBids.slice((page - 1) * perPage, page * perPage),
        pagination: {
            page,
            perPage,
            total: filteredBids.length,
        },
    }
}

export const addUser = async (user: Bid) => {
    await sleep(1000)
    users.unshift(user)
}

export const updateUser = async (user: Bid) => {
    await sleep(1000)
    const index = users.findIndex((u) => u.id === user.id)
    users[index] = user
}

export const removeUser = async (user: Bid) => {
    await sleep(1000)
    users.splice(
        users.findIndex((u) => u.id === user.id),
        1,
    )
}
