import { defineStore } from 'pinia'

interface AuthState {
    token: string | null
    user: {
        id: number
        email: string
        name: string
    } | null
    message: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        user: null,
        message: null
    }),
    actions: {
        async login(credentials: { email: string, password: string }) {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.token = data.token
                this.user = data.user
                console.log(data)
            } catch (error) {
                console.error(error)
            }
        },
        async register(credentials: { email: string, password: string, name: string }) {
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.user = data
            } catch (error) {
                console.error(error)
            }
        },
        logout() {
            this.token = null
            this.user = null
        }
    }
})