import { Ref, ref, unref, watch } from 'vue'
import { getBids, updateUser, addUser, removeUser, type Filters, Pagination, Sorting } from '../../../data/pages/bids'
import { Bid } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useBids = (options?: {
    pagination?: Ref<Pagination>
    sorting?: Ref<Sorting>
    filters?: Ref<Partial<Filters>>
}) => {
    const isLoading = ref(false)
    const bids = ref<Bid[]>([])

    const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

    const fetch = async () => {
        isLoading.value = true
        const { data, pagination: newPagination } = await getBids({
            ...unref(filters),
            ...unref(sorting),
            ...unref(pagination),
        })
        bids.value = data

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

        bids,

        fetch,

        async add(user: Bid) {
            isLoading.value = true
            await addUser(user)
            await fetch()
            isLoading.value = false
        },

        async update(user: Bid) {
            isLoading.value = true
            await updateUser(user)
            await fetch()
            isLoading.value = false
        },

        async remove(user: Bid) {
            isLoading.value = true
            await removeUser(user)
            await fetch()
            isLoading.value = false
        },
    }
}
