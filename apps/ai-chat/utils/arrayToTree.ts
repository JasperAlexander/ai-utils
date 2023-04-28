import { MessageType } from '@/types'

/**
 * Converts an array of messages to a tree structure of messages
 * @param messages The array of messages
 * @returns An array of messages in a tree structure
 */
export function arrayToTree(messages: MessageType[]) {
    const tree: MessageType[] = []
    const lookup: { [_id: string]: MessageType } = {}

    messages.forEach((item: MessageType) => {
      lookup[item._id!] = { ...item, children: [] }
    })

    messages.forEach((item: MessageType) => {
      if (item.parent === null) {
        tree.push(lookup[item._id!])
      } else {
        // @ts-ignore
        lookup[item.parent]?.children?.push(lookup[item._id!])
      }
    })

    return tree
}