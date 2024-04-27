import {Forum, Message, Subject, User} from '@prisma/client'

export type MessageWithUser = Message & { user: User }

export type ForumWithSubjectCount = Forum & { _count: { subjects: number } }

export type SubjectWithFirstAndLastMessage = Subject & { firstMessage: MessageWithUser, lastMessage: MessageWithUser }