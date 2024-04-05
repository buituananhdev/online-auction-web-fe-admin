import { Ref, ref, unref, watch } from 'vue'
import {
    getCategories,
    updateUser,
    addUser,
    removeUser,
    updateStatusCategory,
    type Filters,
    Pagination,
    Sorting,
} from '../../../data/pages/categories'
import { Category } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'categoryName', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ status: 1, search: '' })

export const useCategories = (options?: {
    pagination?: Ref<Pagination>
    sorting?: Ref<Sorting>
    filters?: Ref<Partial<Filters>>
}) => {
    const isLoading = ref(false)
    const categories = ref<Category[]>([])

    const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

    const fetch = async () => {
        isLoading.value = true
        const { data, pagination: newPagination } = await getCategories({
            ...unref(filters),
            ...unref(sorting),
            ...unref(pagination),
        })
        categories.value = data

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

        categories,

        fetch,

        async add(user: Category) {
            isLoading.value = true
            await addUser(user)
            await fetch()
            isLoading.value = false
        },

        async update(user: Category) {
            isLoading.value = true
            await updateUser(user)
            await fetch()
            isLoading.value = false
        },

        async changeStatus(user: Category) {
            isLoading.value = true
            await updateStatusCategory(user)
            await fetch()
            isLoading.value = false
        },

        async remove(user: Category) {
            isLoading.value = true
            await removeUser(user)
            await fetch()
            isLoading.value = false
        },
    }
}
