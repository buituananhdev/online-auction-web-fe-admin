export type Payment = {
    id: number
    bidId: number
    responseCode: number
    transactionNumber: number
    bank: string
    paymentAmount: number
    createdAt: Date
}
