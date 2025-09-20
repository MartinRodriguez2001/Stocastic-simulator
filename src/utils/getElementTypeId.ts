import type { NodeState } from "@/store/nodeSlice";

export function getElementTypeId(ns?: NodeState): string | undefined {
    return (ns?.config as any).data?.elementTypeId as string | undefined
}