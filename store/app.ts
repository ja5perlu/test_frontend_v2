import { defineStore } from 'pinia'
import { getUsers, createUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '~/utils/api/users'

export interface User {
    id: number
    name: string
    age: number
}

export const useAppStore = defineStore('app', {
    state: () => ({
        users: [] as User[],
    }),

    actions: {
        setUsers(list: User[]) {
            this.users = list
        },

        async fetchUsers() {
            const list = await getUsers()
            this.users = list
            return list
        },

        async createUserAsync(payload: { name: string; age: number }) {
            const created = await createUser(payload)
            this.users.push(created)
            return created
        },

        async updateUserAsync(id: number, patch: Partial<User>) {
            const updated = await apiUpdateUser(id, patch as any)
            const idx = this.users.findIndex(x => x.id === id)
            if (idx >= 0) this.users.splice(idx, 1, updated)
            return updated
        },

        async deleteUserAsync(id: number) {
            await apiDeleteUser(id)
            this.users = this.users.filter(u => u.id !== id)
        },
    },
})
