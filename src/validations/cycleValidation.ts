import { type Edge } from "reactflow";

export function hasCycle(edges: Edge[], sourceId: string, targetId: string): boolean {
  if (sourceId === targetId) return true;

  const visited = new Set<string>();
  const stack: string[] = [targetId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (currentId === sourceId) return true;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const outgoingEdges = edges.filter((e) => e.source === currentId);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) stack.push(edge.target);
    }
  }
  return false;
}
