import { Auction, ProductStatus } from '../pages/auctions/types'
import axiosApiInstance from '../plugins/api'

export const deleteAuction = async (id: string) => {
    return await axiosApiInstance.delete(`/auctions/${id}`)
}

export const getAllAuctions = async ({ page = 1, search = '', perPage = 10 }) => {
    let url = `/auctions?page=${page}&pageSize=${perPage}`
    if (search) {
        url += `&searchQuery=${search}`
    }
    return await axiosApiInstance.get(url)
}

export const getSingleAuction = async (id: number) => {
    return await axiosApiInstance.get(`/auctions/${id}`)
}

export const updateAuction = async (id: number, newAuction: Auction) => {
    return await axiosApiInstance.put(`/auctions/${id}`, newAuction)
}

export const updateCondition = async (id: string) => {
    return await axiosApiInstance.patch(`/auctions/${id}`)
}

export const apiUpdateStatus = async (id: string, status: ProductStatus) => {
    return await axiosApiInstance.patch(`/auctions/${id}/cancel?status=${status}`)
}
