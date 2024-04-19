import { Payment } from '../pages/payment/types'
import axiosApiInstance from '../plugins/api'
export const deletePayment = async (id: string) => {
    return await axiosApiInstance.delete(`/payments/${id}`)
}

export const getAllPayments = async ({ page = 1, search = '', perPage = 10 }) => {
    let url = `/payments?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&searchValue=${search}`
    }
    return await axiosApiInstance.get(url)
}

export const getSinglePayment = async (id: string) => {
    return await axiosApiInstance.get(`/payments/${id}`)
}

export const updatePayment = async (id: string, newPayment: Payment) => {
    return await axiosApiInstance.put(`/payments/${id}`, newPayment)
}
