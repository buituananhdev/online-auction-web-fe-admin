import { sleep } from '../../services/utils'
import { User } from './../../pages/users/types'
// import usersDb from './users-db.json'
// import projectsDb from './projects-db.json'
// import { Project } from '../../pages/projects/types'
import { getAllUsers, apiAddUser } from '../../services/user.service'

// export const users = usersDb as User[]

// const getUserProjects = (userId: number | string) => {
//     return projectsDb
//         .filter((project) => project.team.includes(Number(userId)))
//         .map((project) => ({
//             ...project,
//             project_owner: users.find((user) => user.id === project.project_owner)!,
//             team: project.team.map((userId) => users.find((user) => user.id === userId)!),
//             status: project.status as Project['status'],
//         }))
// }

// Simulate API calls

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof User | undefined
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

// const getSortItem = (obj: any, sortBy: string) => {
//     if (sortBy === 'projects') {
//         return obj.projects.map((project: any) => project.project_name).join(', ')
//     }

//     return obj[sortBy]
// }

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
    const res = await getAllUsers(filters)
    const { status } = filters
    let filteredUsers = res.data.data
    console.log('1111111111111111', filteredUsers)

    filteredUsers = filteredUsers.filter((user: any) => user.status === status)
    // console.log('222222222222222',filteredUsers);

    // if (search) {
    //     filteredUsers = filteredUsers.filter((user: any) => user.fullName.toLowerCase().includes(search.toLowerCase()))
    // }

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
        data: filteredUsers.slice((page - 1) * perPage, page * perPage),
        pagination: {
            page,
            perPage,
            total: filteredUsers.length,
        },
    }
}

export const addUser = async (user: User) => {
    await apiAddUser(user)
    // users.unshift(user)
}

export const updateUser = async (user: User) => {
    await sleep(1000)
    const index = users.findIndex((u) => u.id === user.id)
    users[index] = user
}
