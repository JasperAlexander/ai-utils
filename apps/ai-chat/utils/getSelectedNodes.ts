import { MessageType } from '@/types'

/**
 * Converts a message and selections to a flat array with the
 * objects occuring in the path (flattens the path)
 * @param node The message
 * @param selectedIndices The selections
 * @returns An array with the objects occuring in the path
 */
export function getSelectedNodes(
    node: MessageType, 
    selectedIndices: { [id: string]: number }
) {
    if(!node) return []

    const result = [node]
    const selectedIndex = selectedIndices[node._id!] || 0

    if (node.children && node.children.length > 0) {
      const selectedChild = node.children[selectedIndex]
      result.push(...getSelectedNodes(selectedChild, selectedIndices))
    }

    return result
}