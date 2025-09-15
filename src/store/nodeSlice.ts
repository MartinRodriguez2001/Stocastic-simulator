import {type  GeneratorConfig } from "@/types/generator"
import { type QueueConfig } from "@/types/queue"
import { type SelectorConfig } from "@/types/selector"
import { type TransporterConfig } from "@/types/transporter"
import { type Output } from "@/types/output"


import { createSlice } from "@reduxjs/toolkit"
import { type PayloadAction } from "@reduxjs/toolkit"

export type NodeKind = "generator" | "queue" | "selector" | "transporter" | "transformer" | "output"

export type AnyConfig = 
    | {kind: "generator"; data: GeneratorConfig}
    | {kind: "queue"; data: QueueConfig}
    | {kind: "selector"; data: SelectorConfig}
    | {kind: "transporter"; data: TransporterConfig}
    | {kind: "transformer"; data: {}}
    | {kind: "output"; data: Output}

export interface NodeState {
    id: string
    kind: NodeKind
    config: AnyConfig
    sensors: any[]
    failures: any[]
    io: {
        inputs: string[]
        outputs: string[]
    }
}

interface NodeStatesSlice {
    byId: Record<string, NodeState>
}

const initialState: NodeStatesSlice = { byId: {}}

const nodeStateSlice = createSlice({
    name: "nodeStates",
    initialState,
    reducers: {
        upsertNodeState(state, action: PayloadAction<NodeState>) {
            state.byId[action.payload.id] = action.payload
        },
        updateConfig(state, action: PayloadAction<{ id: string; patch: any}>) {
            const n = state.byId[action.payload.id]; if (!n) return
            n.config = { ...n.config, data: { ...n.config.data, ...action.payload.patch}} as AnyConfig
        },
        removeNodeState(state, action: PayloadAction<{ id: string }>) {
            delete state.byId[action.payload.id]
        },
        addInput(state, action: PayloadAction<{ id: string; handleId: string }>) {
        const node = state.byId[action.payload.id];
        if (!node) return;
        node.io.inputs.push(action.payload.handleId);
        },

        removeInput(state, action: PayloadAction<{ id: string; handleId: string }>) {
        const node = state.byId[action.payload.id];
        if (!node) return;
        node.io.inputs = node.io.inputs.filter(h => h !== action.payload.handleId);
        },

        addOutput(state, action: PayloadAction<{ id: string; handleId: string }>) {
        const node = state.byId[action.payload.id];
        if (!node) return;
        node.io.outputs.push(action.payload.handleId);
        },

        removeOutput(state, action: PayloadAction<{ id: string; handleId: string }>) {
        const node = state.byId[action.payload.id];
        if (!node) return;
        node.io.outputs = node.io.outputs.filter(h => h !== action.payload.handleId);
        },
        updateNodeIOInNodeSlice(
        state,
        action: PayloadAction<{ id: string; inputs: string[]; outputs: string[] }>
        ) {
        const node = state.byId[action.payload.id];
        if (!node) return;
        node.io.inputs = action.payload.inputs;
        node.io.outputs = action.payload.outputs;
        },
    }
})


export const {
    upsertNodeState,
    updateConfig,
    removeNodeState,
    addInput,
    removeInput,
    addOutput,
    removeOutput,
    updateNodeIOInNodeSlice
} = nodeStateSlice.actions

export default nodeStateSlice.reducer


