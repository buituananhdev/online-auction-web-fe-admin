import axiosApiInstance from '../plugins/api'
import { User } from '../pages/users/types'
export const getAllUsers = async (page = 1, key_word = '', pageSize = 50) => {
    let url = `/users?page=${page}&pageSize=${pageSize}`
    if (key_word) {
        url += `&key_word=${key_word}`
    }
    return await axiosApiInstance.get(url)
}
export const updateUser = async (id: string, newUser: User) => {
    return await axiosApiInstance.put(`/users/${id}`, newUser)
}
export const getSingleUser = async (id: string) => {
    return await axiosApiInstance.get(`/users/${id}`)
}
