import { MessageType } from '@/types'

/**
 * Recursive function that adds a message as child of another message in a tree structure of messages
 * @param messagesTree The array of messages in a tree structure
 * @param messageId The id of the parent of the new message
 * @param newMessage The message to insert
 * @returns Whether the object with messageId was found
 */
export function insertMessageToMessagesTree(
    messagesTree: MessageType[],
    messageId: string,
    newMessage: MessageType
  ) {
    for (let i = 0; i < messagesTree.length; i++) {
      if (messagesTree[i]._id === messageId) {
        messagesTree[i].children.push(newMessage)
        return true
      } else if (messagesTree[i].children.length !== 0) {
        if (insertMessageToMessagesTree(messagesTree[i].children, messageId, newMessage)) {
          return true
        }
      }
    }

    return false
}