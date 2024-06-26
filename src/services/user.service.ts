import axiosApiInstance from '../plugins/api'
import { User } from '../pages/users/types'
export const getAllUsers = async ({ page = 1, search = '', status = '', perPage = 10 }) => {
    let url = `/users?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&searchQuery=${search}`
    }
    if (status) {
        url += `&status=${status}`
    }
    return await axiosApiInstance.get(url)
}

export const apiUpdateUser = async (id: string, newUser: User) => {
    return await axiosApiInstance.put(`/users/${id}`, newUser)
}

export const apiUpdateStatusUser = async (id: string) => {
    return await axiosApiInstance.patch(`/users/${id}`)
}

export const getSingleUser = async (id: string) => {
    return await axiosApiInstance.get(`/users/${id}`)
}

export const apiAddUser = async (newUser: User) => {
    return await axiosApiInstance.post(`/users`, newUser)
}
