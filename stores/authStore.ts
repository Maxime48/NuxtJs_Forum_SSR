import { defineStore } from 'pinia'

interface AuthState {
    token: string | null
    user: {
        id: number
        email: string
        name: string
        Admin: boolean
    } | null
    message: string | null
}

export const useAuthStore = defineStore('auth', {
    persist: true,
    state: (): AuthState => ({
        token: null,
        user: null,
        message: null
    }),
    getters: {
        getMessage: (state) =>{
            //set timeout for message 5 seconds
            setTimeout(() => {
                state.message = null
            }, 5000)
            return state.message
        },
    },
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
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.token = data.token
                this.user = data.user
                this.message = data.message
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
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.token = data.token
                this.user = data.user
                this.message = data.message
            } catch (error) {
                console.error(error)
            }
        },
        async countUsers() {
            try {
                const response = await fetch('/api/auth/countUsers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                return data
            }
            catch (error) {
                console.error(error)
            }
        },
        logout() {
            this.token = null
            this.user = null
        }
    }
})