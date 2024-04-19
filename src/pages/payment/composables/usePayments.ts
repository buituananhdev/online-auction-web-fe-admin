import { Ref, ref, unref, watch } from 'vue'
import {
    getPayments,
    updateUser,
    addUser,
    removeUser,
    type Filters,
    Pagination,
    Sorting,
} from '../../../data/pages/payments'
import { Payment } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const usePayments = (options?: {
    pagination?: Ref<Pagination>
    sorting?: Ref<Sorting>
    filters?: Ref<Partial<Filters>>
}) => {
    const isLoading = ref(false)
    const payments = ref<Payment[]>([])

    const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

    const fetch = async () => {
        isLoading.value = true
        const { data, pagination: newPagination } = await getPayments({
            ...unref(filters),
            ...unref(sorting),
            ...unref(pagination),
        })
        payments.value = data

        ignoreUpdates(() => {
            pagination.value = newPagination
        })

        isLoading.value = false
    }

    const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

    watch(
        filters,
        () => {
            // Reset pagination to first page when filters changed
            pagination.value.page = 1
            fetch()
        },
        { deep: true },
    )

    fetch()

    return {
        isLoading,

        filters,
        sorting,
        pagination,

        payments,

        fetch,

        async add(user: Payment) {
            isLoading.value = true
            await addUser(user)
            await fetch()
            isLoading.value = false
        },

        async update(user: Payment) {
            isLoading.value = true
            await updateUser(user)
            await fetch()
            isLoading.value = false
        },

        async remove(user: Payment) {
            isLoading.value = true
            await removeUser(user)
            await fetch()
            isLoading.value = false
        },
    }
}
