import { DateTimeFormatResult } from 'vue-i18n'

export type Bid = {
    id: number
    bidderId: number
    productId: number
    bidAmount: number
    bidTime: DateTimeFormatResult
}
