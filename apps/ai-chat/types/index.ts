export interface FolderType {
    _id?: string
    title: string
    updated_at?: string
    created_at?: string
}

export interface ChatType {
    _id?: string
    folder_id?: string
    title: string
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