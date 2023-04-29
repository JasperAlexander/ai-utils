export interface FolderType {
    _id?: string
    title: string
    created_by?: string
    updated_at?: string
    created_at?: string
}

export interface ChatType {
    _id?: string
    title: string
    folder_id?: string
    created_by?: string
    updated_at?: string
    created_at?: string
}

export interface MessageType {
    _id?: string
    chat_id: string
    role: string
    content: string
    parent?: MessageType | string | null
    children?: MessageType[]
    updated_at?: string
    created_at?: string
}

export interface UserType {
    _id?: string
    email: string
    name: string
    username: string
    image: string
    updated_at?: string
    created_at?: string
}