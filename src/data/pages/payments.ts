import { Payment } from '../../pages/payment/types'
import { getAllPayments } from '../../services/payment.service'

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof Payment | undefined
    sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
    search: string
}

export const getPayments = async (filters: Partial<Filters & Pagination & Sorting>) => {
    const res = await getAllPayments(filters)
    const { search } = filters
    let filteredPayments = res.data.data

    if (search) {
        filteredPayments = filteredPayments.filter((user: any) => user.id.toLowerCase().includes(search.toLowerCase()))
    }

    const { page = 1, perPage = 10 } = filters || {}
    return {
        data: filteredPayments.slice((page - 1) * perPage, page * perPage),
        pagination: {
            page,
            perPage,
            total: filteredPayments.length,
        },
    }
}

export const addUser = async (user: Payment) => {
    await sleep(1000)
    users.unshift(user)
}

export const updateUser = async (user: Payment) => {
    await sleep(1000)
    const index = users.findIndex((u) => u.id === user.id)
    users[index] = user
}

export const removeUser = async (user: Payment) => {
    await sleep(1000)
    users.splice(
        users.findIndex((u) => u.id === user.id),
        1,
    )
}
