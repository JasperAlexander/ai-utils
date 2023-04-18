import { create } from 'zustand'
import { ChatType, FolderType } from '@/types'

interface GlobalState {
    folders: FolderType[]
    setFolders: (newFolders: FolderType[]) => void
    chats: ChatType[]
    setChats: (newChats: ChatType[]) => void
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  folders: [],
  setFolders: (newFolders) => set(() => ({ folders: newFolders })),
  chats: [],
  setChats: (newChats) => set(() => ({ chats: newChats })),
}))