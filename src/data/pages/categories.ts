import { Category } from '../../pages/categories/types'
import { getAllCategories } from '../../services/category.service'

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof Category | undefined
    sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
    status: 0 | 1
    search: string
}

export const StatusNames: Record<status, string> = {
    0: 'Inactive',
    1: 'Active',
}

export const getCategories = async (filters: Partial<Filters & Pagination & Sorting>) => {
    const res = await getAllCategories(filters)
    const { status, search } = filters
    let filteredCategories = res.data.data

    filteredCategories = filteredCategories.filter((user: any) => user.status === status)

    if (search) {
        filteredCategories = filteredCategories.filter((user: any) =>
            user.categoryName.toLowerCase().includes(search.toLowerCase()),
        )
    }

    // filteredUsers = filteredUsers.map((user: any) => ({ ...user, projects: getUserProjects(user.id) }))

    // if (sortBy && sortingOrder) {
    //     filteredUsers = filteredUsers.sort((a, b) => {
    //         const first = getSortItem(a, sortBy)
    //         const second = getSortItem(b, sortBy)
    //         if (first > second) {
    //             return sortingOrder === 'asc' ? 1 : -1
    //         }
    //         if (first < second) {
    //             return sortingOrder === 'asc' ? -1 : 1
    //         }
    //         return 0
    //     })
    // }

    const { page = 1, perPage = 10 } = filters || {}
    return {
        data: filteredCategories.slice((page - 1) * perPage, page * perPage),
        pagination: {
            page,
            perPage,
            total: filteredCategories.length,
        },
    }
}

export const addUser = async (user: Category) => {
    await sleep(1000)
    users.unshift(user)
}

export const updateUser = async (user: Category) => {
    await sleep(1000)
    const index = users.findIndex((u) => u.id === user.id)
    users[index] = user
}

export const removeUser = async (user: Category) => {
    await sleep(1000)
    users.splice(
        users.findIndex((u) => u.id === user.id),
        1,
    )
}
