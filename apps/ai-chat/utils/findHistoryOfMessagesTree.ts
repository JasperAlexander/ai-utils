import { MessageType } from '@/types'

/**
 * Recursive function that searches for the history of a message in a tree structure of messages
 * @param messagesTree The array of messages in a tree structure
 * @param messageId The message of which the history should be searched
 * @param history Optional prefix of the history string
 * @returns The history
 */
export function findHistoryOfMessagesTree(
    messagesTree: MessageType[],
    messageId: string,
    history: string = ''
  ): string {
    for (let i = 0; i < messagesTree.length; i++) {
      if (messagesTree[i]._id === messageId) {
        return history.trim()
      } else if (messagesTree[i].children.length !== 0) {
        let result = findHistoryOfMessagesTree(
          messagesTree[i].children,
          messageId,
          `${history} ${messagesTree[i].content}`
        )
        if (result !== null) {
          return result
        }
      }
    }
    return ''
}