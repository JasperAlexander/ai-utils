import { MessageType } from '@/types'

/**
 * Recursive function that updates a message in a tree structure of messages
 * @param messagesTree The array of messages in a tree structure
 * @param messageId The id of the message to update
 * @param messageContent The new content of the message
 * @returns Nothing
 */
export function updateMessageOfMessagesTree(
    messagesTree: MessageType[],
    messageId: string,
    messageContent: string
  ) {
    for (let i = 0; i < messagesTree.length; i++) {
      if (messagesTree[i]._id === messageId) {
        messagesTree[i].content = messageContent
        messagesTree[i].updated_at = new Date().toString()
      } else if (messagesTree[i].children.length !== 0) {
        updateMessageOfMessagesTree(messagesTree[i].children, messageId, messageContent)
      }
    }
}