<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Category, CategoryStatus } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/categories'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
    { label: 'STT', key: 'id', sortable: true },
    { label: 'Category Name', key: 'categoryName', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
    categories: {
        type: Array as PropType<Category[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
    (event: 'edit-user', user: Category): void
    (event: 'change-status', user: Category): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const categories = toRef(props, 'categories')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onCatagoryUpdateStatus = async (user: Category) => {
    const agreed = await confirm({
        title: 'Change status',
        message: `Are you sure you want to change status ?`,
        okText: 'OK',
        cancelText: 'Cancel',
        size: 'small',
        maxWidth: '380px',
    })

    if (agreed) {
        emit('change-status', user)
    }
}

const statusSelectOptions: { text: string; value: CategoryStatus }[] = [
    { text: 'Active', value: 1 },
    { text: 'Inactive', value: 2 },
]
</script>

<template>
    <VaDataTable
        v-model:sort-by="sortByVModel"
        v-model:sorting-order="sortingOrderVModel"
        :columns="columns"
        :items="categories"
        :loading="$props.loading"
    >
        <template #cell(categoryName)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                <!-- <UserAvatar :user="rowData as User" size="small" /> -->
                {{ rowData.categoryName }}
            </div>
        </template>

        <template #cell(status)="{ rowData }">
            <div class="max-w-[120px] ellipsis">
                <!-- {{ StatusNames[rowData.status] }} -->
                <VaSelect
                    v-model="rowData.status"
                    class="max-w-[120px] ellipsis"
                    :options="statusSelectOptions"
                    name="status"
                    value-by="value"
                    @close="onCatagoryUpdateStatus(rowData as Category)"
                />
            </div>
        </template>

        <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-edit"
                    aria-label="Edit category"
                    @click="$emit('edit-user', rowData as Category)"
                />
            </div>
        </template>
    </VaDataTable>

    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
        <div>
            <b>{{ $props.pagination.total }} results.</b>
            Results per page
            <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100, 200]" />
        </div>

        <div v-if="totalPages > 1" class="flex">
            <VaButton
                preset="secondary"
                icon="va-arrow-left"
                aria-label="Previous page"
                :disabled="$props.pagination.page === 1"
                @click="$props.pagination.page--"
            />
            <VaButton
                class="mr-2"
                preset="secondary"
                icon="va-arrow-right"
                aria-label="Next page"
                :disabled="$props.pagination.page === totalPages"
                @click="$props.pagination.page++"
            />
            <VaPagination
                v-model="$props.pagination.page"
                buttons-preset="secondary"
                :pages="totalPages"
                :visible-pages="5"
                :boundary-links="false"
                :direction-links="false"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.va-data-table {
    ::v-deep(.va-data-table__table-tr) {
        border-bottom: 1px solid var(--va-background-border);
    }
}
</style>
