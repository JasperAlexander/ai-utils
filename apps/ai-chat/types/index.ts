// Users
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

// Notifications
export interface NotificationType {
    _id: string
    project_created_by: string
    project_name: string
    type: string
    read: boolean
    created_by: string
    updated_at: string
}

export interface UpdateNotificationType {
    user_id?: string
    reference_type?: string
    reference_id?: string
    type?: string
    read?: boolean
    updated_at?: string
}

// Collaborators
export interface CollaboratorType {
    _id: string
    username: string
    role: string
    status: string
    updated_at: string
}

// Projects
export interface ProjectType {
    _id: string
    name: string
    description: string
    visibility: string
    created_by: string
    updated_at: string
    created_at: string
}

export interface UpdateProjectType {
    name?: string
    description?: string
    visibility?: string
    updated_at?: string
}

// Folders
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

// Chats
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

// Messages
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
