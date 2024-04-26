import { defineStore } from 'pinia'
import type {Subject} from "@prisma/client";

interface SubjectState {
    subjects: Subject[]
    message: string | null
}

export const useSubjectStore = defineStore('subject', {
    persist: true,
    state: (): SubjectState => ({
        subjects: [],
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
        async getSubjectsByForumId(id: number) {
            try {
                const response = await fetch('/api/subject/getAllByForumId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id})
                })
                if (!response.ok ) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.subjects = data
            } catch (error) {
                console.error(error)
            }
        },
        async addSubject(subject: { title: string; forumId: number; } ) {
            try {
                const response = await fetch('/api/subject/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subject)
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.subjects.push(data)
                this.message = 'Subject added successfully'
            } catch (error) {
                console.error(error)
            }
        },
        async deleteSubject(id: number) {
            try {
                const response = await fetch('/api/subject/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id})
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.subjects = this.subjects.filter(subject => subject.id !== data.id)
                this.message = 'Subject deleted successfully'
            } catch (error) {
                console.error(error)
            }
        }
    }
})