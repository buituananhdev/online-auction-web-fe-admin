import { Bid } from '../pages/bids/types'
import axiosApiInstance from '../plugins/api'
export const deleteBid = async (id: string) => {
    return await axiosApiInstance.delete(`/bids/${id}`)
}

export const getAllBids = async ({ page = 1, search = '', perPage = 10 }) => {
    let url = `/bids?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&key_word=${search}`
    }
    return await axiosApiInstance.get(url)
}

export const getSingleBid = async (id: string) => {
    return await axiosApiInstance.get(`/bids/${id}`)
}

export const updateBid = async (id: string, newBid: Bid) => {
    return await axiosApiInstance.put(`/bids/${id}`, newBid)
}
