import { MessageType } from '@/types'

/**
 * Recursive function that adds a message to the end of messages in a tree structure
 * @param messagesTree The array of messages in a tree structure
 * @param newMessage The message to add
 * @returns Nothing
 */
export function addMessageToMessagesTree(messagesTree: MessageType[], newMessage: MessageType) {
  if(messagesTree.length === 0) {
    messagesTree.push(newMessage)
  } else {
    for (let i = 0; i < messagesTree.length; i++) {
      if (messagesTree[i].children.length === 0) {
        messagesTree[i].children.push(newMessage)
      } else {
        addMessageToMessagesTree(messagesTree[i].children, newMessage)
      }
    }
  }
}