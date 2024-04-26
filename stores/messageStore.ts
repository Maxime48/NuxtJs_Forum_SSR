import { defineStore } from 'pinia'
import type {MessageWithUser} from "~/server/types";

interface MessageState {
    messages: MessageWithUser[],
    message: string | null
}

export const useMessageStore = defineStore('message', {
    persist: true,
    state: (): MessageState => ({
        messages: [],
        message: null
    }),
    getters: {
        getMessage: (state) => {
            setTimeout(() => { state.message = null }, 5000)
            return state.message
        },
    },
    actions: {
        async fetchMessages(id: number) {
            try {
                const response = await fetch('/api/message/getAllBySubjectId', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                })
                const data = await response.json()
                this.messages = data
            } catch (error) {
                console.error(error)
                this.message = 'Failed to fetch messages'
            }
        },
        async addMessage(newMessage: { content: string, subjectId: number, userId: number }) {
            try {
                const response = await fetch('/api/message/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMessage),
                })
                const addedMessage = await response.json()
                this.messages.push(addedMessage)
            } catch (error) {
                console.error(error)
                this.message = 'Failed to add message'
            }
        },
        async deleteMessage(id: number) {
            try {
                await fetch(`/api/message/delete`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                })
                this.messages = this.messages.filter(m => m.id !== id)
            } catch (error) {
                console.error(error)
                this.message = 'Failed to delete message'
            }
        },
        async updateMessage(id: number, content: string) {
            try {
                const response = await fetch(`/api/message/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, content }),
                })
                const updated = await response.json()
                const index = this.messages.findIndex(m => m.id === id)
                if(index !== -1) {
                    this.messages[index] = updated
                }
            } catch (error) {
                console.error(error)
                this.message = 'Failed to update message'
            }
        }
    }
})