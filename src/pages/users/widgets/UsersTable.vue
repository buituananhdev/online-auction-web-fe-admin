<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole, UserRoleNames, UserStatus } from '../types'
// import UserAvatar from './UserAvatar.vue'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
    { label: 'STT', key: 'id', sortable: true },
    { label: 'Full Name', key: 'fullName', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: 'Role', key: 'role', sortable: true },
    { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
    users: {
        type: Array as PropType<User[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
    (event: 'edit-user', user: User): void
    (event: 'detail-user', user: User): void
    (event: 'change-status', user: User): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const users = toRef(props, 'users')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const roleColors: Record<UserRole, string> = {
    1: 'danger',
    2: 'background-element',
    3: 'warning',
}

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserUpdateStatus = async (user: User) => {
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

const viewDetail = (event: any) => {
    emit('detail-user', event.item as User)
}

const statusSelectOptions: { text: string; value: UserStatus }[] = [
    { text: 'Active', value: 1 },
    { text: 'Inactive', value: 2 },
]
</script>

<template>
    <VaDataTable
        v-model:sort-by="sortByVModel"
        v-model:sorting-order="sortingOrderVModel"
        :columns="columns"
        :items="users"
        :loading="$props.loading"
        hoverable
        clickable
        sticky-header
        @row:click="viewDetail"
    >
        <template #cell(id)="{ rowIndex }">
            <div class="max-w-[100px]">
                {{ rowIndex + 1 }}
            </div>
        </template>

        <template #cell(fullName)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                <!-- <UserAvatar :user="rowData as User" size="small" /> -->
                {{ rowData.fullName }}
            </div>
        </template>

        <template #cell(email)="{ rowData }">
            <div class="ellipsis max-w-[230px]">
                {{ rowData.email }}
            </div>
        </template>

        <template #cell(status)="{ rowData }">
            <VaSelect
                v-model="rowData.status"
                class="max-w-[120px] ellipsis"
                :options="statusSelectOptions"
                name="status"
                value-by="value"
                @close="onUserUpdateStatus(rowData as User)"
                @click.stop
            />
        </template>

        <template #cell(role)="{ rowData }">
            <VaBadge :text="UserRoleNames[rowData.role]" :color="roleColors[rowData.role as UserRole]" />
        </template>

        <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-edit"
                    aria-label="Edit user"
                    @click.stop="$emit('edit-user', rowData as User)"
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
