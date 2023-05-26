import { MessageType } from '@/types'

/**
 * Recursive function that deletes a message of a tree structure of messages
 * @param messagesTree The array of messages in a tree structure
 * @param messageId The message to delete
 * @returns Nothing
 */
export function deleteMessageOfMessageTree(messagesTree: MessageType[], messageId: string) {
    for (let i = 0; i < messagesTree.length; i++) {
        if (messagesTree[i]._id === messageId) {
            const childrenOfDeleted = messagesTree[i].children
            for (let j = 0; j < childrenOfDeleted.length; j++) {
                childrenOfDeleted[j].parent = messagesTree[i].parent
            }
            messagesTree.splice(i, 1, ...childrenOfDeleted)
        } else if (messagesTree[i].children.length !== 0) {
            deleteMessageOfMessageTree(messagesTree[i].children, messageId)
        }
    }
}