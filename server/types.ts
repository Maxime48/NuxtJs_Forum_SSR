import {Forum, Message, User} from '@prisma/client'

export type MessageWithUser = Message & { user: User }

export type ForumWithSubjectCount = Forum & { _count: { subjects: number } }