import { useCallback } from "react";
import { type Node, type Connection, type NodeChange, type EdgeChange } from "reactflow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateNode as updateNodeAction,
  onNodesChange as onNodesChangeAction,
  onEdgesChange as onEdgesChangeAction,
  onConnect as onConnectAction,
  setSelectedNode as setSelectedNodeAction,
} from "@/store/workspaceSlice";
import { createNode } from "@/store/thunks/createNode";
import { deleteNode } from "@/store/thunks/deleteNode";
import { type NodeKind } from "@/store/nodeSlice";
import { createNodeVisual } from "@/nodes/registry";

export function useWorkSpace() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workspace.nodes);
  const edges = useAppSelector((state) => state.workspace.edges);
  const selectedNode = useAppSelector((state) => state.workspace.selectedNode);

  // 🔹 ReactFlow callbacks
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      dispatch(onNodesChangeAction(changes));
    },
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      dispatch(onEdgesChangeAction(changes));
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      dispatch(onConnectAction(params));
    },
    [dispatch]
  );

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    dispatch(setSelectedNodeAction(node));
  }, [dispatch]);

  const addNode = useCallback(
  (label: string, position = { x: 250, y: 150 }) => {
    const normalized = label.trim().toLowerCase();
    const kind: NodeKind =
      normalized === "generador" ? "generator" :
      normalized === "fila" ? "queue" :
      normalized === "seleccionador" ? "selector" :
      normalized === "transportador" ? "transporter" :
      normalized === "salida" ? "output" :
      "queue"; // default

    const node = createNodeVisual(kind, position, label);

    dispatch(createNode(node, kind, {}));
  },
  [dispatch]
);


  const removeNode = useCallback(
    (id: string) => {
      dispatch(deleteNode(id));
    },
    [dispatch]
  );

  const updateNode = useCallback(
    (id: string, newData: Partial<Node["data"]>, newType?: string) => {
      dispatch(updateNodeAction({ id, data: newData, type: newType as Node["type"] | undefined }));
    },
    [dispatch]
  );

  const setSelectedNode = useCallback((node: Node | null) => {
    dispatch(setSelectedNodeAction(node));
  }, [dispatch]);

  // 🔹 Conexiones de un nodo
  const getNodeConnections = useCallback(
    (nodeId: string) => {
      const incoming = edges.filter((e) => e.target === nodeId);
      const outgoing = edges.filter((e) => e.source === nodeId);
      const neighbors = Array.from(
        new Set([...incoming.map((e) => e.source), ...outgoing.map((e) => e.target)])
      );
      return { incoming, outgoing, neighbors };
    },
    [edges]
  );

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    addNode,
    removeNode,     // 👈 ahora disponible
    updateNode,
    setSelectedNode,
    getNodeConnections,
  };
}

export type WorkSpaceState = ReturnType<typeof useWorkSpace>;
