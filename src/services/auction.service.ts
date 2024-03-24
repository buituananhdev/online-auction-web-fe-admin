import { Auction } from '../pages/auctions/types'
import axiosApiInstance from '../plugins/api'

export const deleteAuction = async (id: string) => {
    return await axiosApiInstance.delete(`/auctions/${id}`)
}

export const getAllAuctions = async ({ page = 1, search = '', perPage = 10 }) => {
    let url = `/auctions?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&key_word=${search}`
    }
    return await axiosApiInstance.get(url)
}

export const getSingleAuction = async (id: string) => {
    return await axiosApiInstance.get(`/auctions/${id}`)
}

export const updateAuction = async (id: string, newAuction: Auction) => {
    return await axiosApiInstance.put(`/auctions/${id}`, newAuction)
}
