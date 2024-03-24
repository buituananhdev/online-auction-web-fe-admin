import { Bid } from '../pages/bids/types'
import axiosApiInstance from '../plugins/api'
export const deleteBid = async (id: string) => {
    return await axiosApiInstance.delete(`/bids/${id}`)
}

export const getAllBids = async (page = 1, key_word = '', pageSize = 200) => {
    let url = `/bids?page=${page}&pageSize=${pageSize}`
    if (key_word) {
        url += `&key_word=${key_word}`
    }
    return await axiosApiInstance.get(url)
}

export const getSingleBid = async (id: string) => {
    return await axiosApiInstance.get(`/bids/${id}`)
}

export const updateBid = async (id: string, newBid: Bid) => {
    return await axiosApiInstance.put(`/bids/${id}`, newBid)
}
