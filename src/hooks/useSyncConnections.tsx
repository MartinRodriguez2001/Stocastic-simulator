import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateConnections } from "@/store/nodeSlice";

export function useSyncConnections() {
  const dispatch = useAppDispatch();
  const edges = useAppSelector((state) => state.workspace.edges);

  const sync = (nodes: { id: string }[]) => {
    nodes.forEach((n) => {
      const incoming = edges.filter((e) => e.target === n.id).map((e) => e.source);
      const outgoing = edges.filter((e) => e.source === n.id).map((e) => e.target);

      dispatch(updateConnections({ id: n.id, incoming, outgoing }));
    });
  };

  return { sync };
}
