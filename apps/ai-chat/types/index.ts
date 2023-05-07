// users
export interface UserType {
    _id: string
    email: string
    name: string
    username: string
    bio: string
    image: string
    updated_at: string
    created_at: string
}

export interface UpdateUserType {
    email?: string
    name?: string
    username?: string
    bio?: string
    image?: string
    updated_at?: string
}

// projects
export interface ProjectType {
    _id: string
    title: string
    description: string
    visibility: string
    created_by: string
    updated_at: string
    created_at: string
}

export interface UpdateProjectType {
    title?: string
    description?: string
    visibility?: string
    updated_at?: string
}

// folders
export interface FolderType {
    _id: string
    title: string
    created_by: string
    updated_at: string
    created_at: string
}

export interface UpdateFolderType {
    title?: string
    updated_at?: string
}

// chats
export interface ChatType {
    _id: string
    title: string
    folder_id: string
    created_by: string
    updated_at: string
    created_at: string
}

export interface UpdateChatType {
    title?: string
    folder_id?: string
    updated_at?: string
}

// messages
export interface MessageType {
    _id: string
    chat_id: string
    role: string
    content: string
    parent: MessageType | string | null
    children: MessageType[]
    updated_at: string
    created_at: string
}

export interface UpdateMessageType {
    content?: string
    children?: MessageType[]
    updated_at?: string
}
