import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'

interface WorkspaceState {
  nodes: Node[]
  edges: Edge[]
  selectedNode: Node | null
}

const initialState: WorkspaceState = {
  nodes: [],
  edges: [],
  selectedNode: null,
}



const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setSelectedNode(state, action: PayloadAction<Node | null>) {
      state.selectedNode = action.payload
    },
    addNode(state, action: PayloadAction<Node>) {
      state.nodes.push(action.payload)
    },
    updateNode(
      state,
      action: PayloadAction<{ id: string; data: Partial<Node['data']>; type?: Node['type'] }>
    ) {
      const { id, data, type } = action.payload
      state.nodes = state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data }, ...(type ? { type } : {}) } : n
      )
      if (state.selectedNode?.id === id) {
        state.selectedNode = {
          ...state.selectedNode,
          data: { ...state.selectedNode.data, ...data },
          ...(type ? { type } : {}),
        }
      }
    },
    removeNode(state, action: PayloadAction<string>) {
      const id = action.payload
      state.nodes = state.nodes.filter(n => n.id !== id)
      state.edges = state.edges.filter(e => e.source !== id && e.target !== id)
      if (state.selectedNode?.id === id) {
        state.selectedNode = null
      }
    },
    onNodesChange(state, action: PayloadAction<NodeChange[]>) {
      state.nodes = applyNodeChanges(action.payload, state.nodes)
    },
    onEdgesChange(state, action: PayloadAction<EdgeChange[]>) {
      state.edges = applyEdgeChanges(action.payload, state.edges)
    },
    onConnect(state, action: PayloadAction<Connection>) {
      state.edges = addEdge(action.payload, state.edges)
    },
    setEdges(state, action: PayloadAction<Edge[]>) {
      state.edges = action.payload
    },
    setNodes(state, action: PayloadAction<Node[]>) {
      state.nodes = action.payload
    },
    updateNodeIOWorkspace(
      state,
      action: PayloadAction<{ id: string; inputs: string[]; outputs: string[] }>
    ) {
      state.nodes = state.nodes.map(n =>
        n.id === action.payload.id
          ? {
              ...n,
              data: {
                ...n.data,
                io: {
                  inputs: action.payload.inputs,
                  outputs: action.payload.outputs,
                },
              },
            }
          : n
      );
    }

  },
})

export const {
  setSelectedNode,
  addNode,
  updateNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setEdges,
  setNodes,
  removeNode,
  updateNodeIOWorkspace
} = workspaceSlice.actions

export default workspaceSlice.reducer
