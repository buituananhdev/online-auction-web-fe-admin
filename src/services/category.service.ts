import { Category, CategoryStatus } from '../pages/categories/types'
import axiosApiInstance from '../plugins/api'
export const deleteCategory = async (id: string) => {
    return await axiosApiInstance.delete(`/categories/${id}`)
}

export const getAllCategories = async ({ page = 1, search = '', perPage = 10 }) => {
    let url = `/categories?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&key_word=${search}`
    }
    return await axiosApiInstance.get(url)
}

export const getSingleCategory = async (id: string) => {
    return await axiosApiInstance.get(`/categories/${id}`)
}

export const apiUpdateCategory = async (id: string, newCategory: Category) => {
    return await axiosApiInstance.put(`/categories/${id}`, newCategory)
}

export const apiUpdateStatusCategory = async (id: string, status: CategoryStatus) => {
    return await axiosApiInstance.patch(`/categories/${id}/status?status=${status}`)
}

export const apiAddCategory = async (newCategory: Category) => {
    return await axiosApiInstance.post(`/categories`, newCategory)
}
