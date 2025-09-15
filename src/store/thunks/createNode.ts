import { type AppDispatch } from '../store'
import { addNode } from '../workspaceSlice'
import { upsertNodeState, type NodeKind,  } from '../nodeSlice'
import type { Node } from 'reactflow'
import { makeInitialNodeState } from '../utils/makeInitialNodeState'

export const createNode = (node: Node, kind: NodeKind, initialData: any = {}) =>
    (dispatch: AppDispatch) => {
        dispatch(addNode(node))
        const nodeState = makeInitialNodeState(node.id, kind, initialData)
        dispatch(upsertNodeState(nodeState))
  }
