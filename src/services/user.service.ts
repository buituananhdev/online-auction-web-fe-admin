import axiosApiInstance from '../plugins/api'
import { User } from '../pages/users/types'
export const getAllUsers = async ({ page = 1, search = '', perPage = 10 }) => {
    let url = `/users?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&key_word=${search}`
    }
    return await axiosApiInstance.get(url)
}
export const updateUser = async (id: string, newUser: User) => {
    return await axiosApiInstance.put(`/users/${id}`, newUser)
}
export const getSingleUser = async (id: string) => {
    return await axiosApiInstance.get(`/users/${id}`)
}
