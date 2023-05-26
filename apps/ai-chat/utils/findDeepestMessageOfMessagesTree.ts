import { MessageType } from '@/types'

/**
 * Recursive function that searches for the deepest message of a tree structure of messages
 * @param messagesTree The array of messages in a tree structure
 * @returns The id of the deepest nested object
 */
export function findDeepestMessageOfMessagesTree({
  messagesTree,
  returnParentOfDeepestMessage
}: {
  messagesTree: MessageType[]
  returnParentOfDeepestMessage?: boolean
}): string | undefined {
    for (let i = messagesTree.length - 1; i >= 0; i--) {
      if (messagesTree[i].children.length !== 0) {
        return findDeepestMessageOfMessagesTree({
          messagesTree: messagesTree[i].children, 
          returnParentOfDeepestMessage
        })
      } else if(returnParentOfDeepestMessage) {
        return messagesTree[i].parent as string | undefined
      } else {
        return messagesTree[i]._id
      }
    }
}