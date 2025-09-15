import { type AppDispatch, type RootState } from '../store'
import { removeNode, setEdges, setNodes } from '../workspaceSlice'
import { removeNodeState } from '../nodeSlice'
import type { Edge, Node } from 'reactflow'

export const deleteNode =
  (nodeId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { nodes, edges } = getState().workspace

    // 1. Filtrar nodos
    const newNodes = nodes.filter((n: Node) => n.id !== nodeId)

    // 2. Filtrar edges conectados al nodo
    const newEdges = edges.filter((e: Edge) => e.source !== nodeId && e.target !== nodeId)

    // 3. Actualizar workspace
    dispatch(setNodes(newNodes))
    dispatch(setEdges(newEdges))

    // 4. Eliminar estado lógico del nodo
    dispatch(removeNodeState({ id: nodeId }))
    dispatch(removeNode(nodeId))
  }
