import { defineStore } from 'pinia'
import type {Forum} from "@prisma/client";



interface ForumState {
    forums: Forum[]
    message: string | null
}

export const useForumStore = defineStore('forum', {
    persist: true,
    state: (): ForumState => ({
        forums: [],
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
        async getForums() {
            try {
                const response = await fetch('/api/forum/getAll', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.forums = data
            } catch (error) {
                console.error(error)
            }
        },
        async addForum(forum: { title: string; description: string; } ) {
            try {
                const response = await fetch('/api/forum/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(forum)
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.forums.push(data)
                this.message = 'Forum added successfully'
            } catch (error) {
                console.error(error)
            }
        },
        async updateForum(forum: Forum) {
            try {
                const response = await fetch(`/api/forum/update/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(forum)
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                const index = this.forums.findIndex(f => f.id === data.id)
                if (index !== -1) {
                    this.forums[index] = data
                }
                this.message = 'Forum updated successfully'
            } catch (error) {
                console.error(error)
            }
        },
        async deleteForum(id: number) {
            try {
                const response = await fetch(`/api/forum/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id })
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const index = this.forums.findIndex(f => f.id === id)
                if (index !== -1) {
                    this.forums.splice(index, 1)
                }
                this.message = 'Forum deleted successfully'
            } catch (error) {
                console.error(error)
            }
        },
    }
})