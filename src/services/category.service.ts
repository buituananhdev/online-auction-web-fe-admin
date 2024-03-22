import { Category } from '../pages/categories/types'
import axiosApiInstance from '../plugins/api'
export const deleteCategory = async (id: string) => {
    return await axiosApiInstance.delete(`/categories/${id}`)
}

export const getAllCategories = async (page = 1, key_word = '', pageSize = 50) => {
    let url = `/categories?page=${page}&pageSize=${pageSize}`
    if (key_word) {
        url += `&key_word=${key_word}`
    }
    return await axiosApiInstance.get(url)
}

export const getSingleCategory = async (id: string) => {
    return await axiosApiInstance.get(`/categories/${id}`)
}

export const updateCategory = async (id: string, newCategory: Category) => {
    return await axiosApiInstance.put(`/categories/${id}`, newCategory)
}

// import axiosApiInstance from '../plugins/api';

// export const deleteCategory = async (id: string): Promise<void> => {
//     await axiosApiInstance.delete(`/categories/${id}`);
// }

// export const getAllCategories = async (page: number = 1, key_word: string = '', pageSize: number = 50): Promise<Category[]> => {
//     let url = `/categories?page=${page}&pageSize=${pageSize}`;
//     if (key_word) {
//         url += `&key_word=${key_word}`;
//     }
//     const response = await axiosApiInstance.get<Category[]>(url);
//     return response.data;
// }

// export const getSingleCategory = async (id: string): Promise<Category> => {
//     const response = await axiosApiInstance.get<Category>(`/categories/${id}`);
//     return response.data;
// }

// export const updateCategory = async (id: string, newCategory: Category): Promise<void> => {
//     await axiosApiInstance.put(`/categories/${id}`, newCategory);
// }
