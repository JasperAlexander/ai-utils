import { MessageType } from '@/types'

export function getLastItemInPath(
    tree: MessageType[],
    selectedIndices: { [id: string]: number }
) {
    if (tree.length === 0) return

    let currentItem = tree[0]

    while (currentItem.children && currentItem.children.length > 0) {
      const selectedIndex = selectedIndices[currentItem._id!] || 0
      currentItem = currentItem.children[selectedIndex]
    }

    return currentItem
}