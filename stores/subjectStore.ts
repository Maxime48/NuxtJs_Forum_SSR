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
                return data;
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
                await response.json()
                this.subjects = this.subjects.filter(
                    subject => subject.id !== id
                )
                this.message = 'Subject deleted successfully'
            } catch (error) {
                console.error(error)
            }
        },
        async updateSubject(id: number, title: string) {
            try {
                const response = await fetch('/api/subject/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id, title})
                })
                if (!response.ok) {
                    this.message = (await response.json()).message
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                this.subjects = this.subjects.map(subject => subject.id === data.id ? data : subject)
                this.message = 'Subject updated successfully'
            } catch (error) {
                console.error(error)
            }
        }
    }
})