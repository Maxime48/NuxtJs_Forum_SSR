import { defineStore } from 'pinia'
import type { User } from '@prisma/client'

interface UserState {
    users: User[],
    message: string | null
}

export const useUserStore = defineStore('user', {
    persist: true,
    state: (): UserState => ({
        users: [],
        message: null
    }),
    getters: {
        getMessage: (state) => {
            setTimeout(() => { state.message = null }, 5000)
            return state.message
        },
    },
    actions: {
        async createAdmin(user: { name: string; email: string; password: string; }) {
            try {
                const response = await fetch('/api/user/createAdmin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.users.push(data)
                this.message = 'Admin created successfully'
            } catch (error) {
                console.error(error)
            }
        },
        async changePassword(user: { email: string | undefined; password: string; newPassword: string; }) {
            try {
                const response = await fetch('/api/user/changePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.message = 'Password changed successfully'
            } catch (error) {
                console.error(error)
            }
        }
    },
})