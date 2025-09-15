import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateConfig } from "@/store/nodeSlice";
import { updateNode } from "@/store/workspaceSlice";

interface QueueConfigProps {
  nodeId: string;
}

export function QueueConfig({ nodeId }: QueueConfigProps) {
  const dispatch = useAppDispatch();
  const config = useAppSelector(
    (state) => state.node.byId[nodeId]?.config.data
  ) as any;

  if (!config) return null;

  const capacityValue =
    config.capacity == null
      ? ""
      : Number.isFinite(config.capacity)
      ? String(config.capacity)
      : "∞";

  return (
    <div className="mt-3 space-y-2">
      <Label>Capacidad</Label>
      <Input
        value={capacityValue}
        onChange={(e) => {
          const raw = e.target.value.trim();
          const cap = raw === "∞" || raw === "" ? undefined : Number(raw);
          const patch = { capacity: Number.isFinite(cap as number) ? cap : undefined } as any;
          dispatch(updateConfig({ id: nodeId, patch }));
          // Espejo visual en ReactFlow para QueueNode legacy props
          dispatch(updateNode({ id: nodeId, data: { capacity: raw || undefined }, type: undefined }));
        }}
      />

      <Label>Disciplina</Label>
      <Input
        value={config.strategy ?? "FIFO"}
        onChange={(e) => {
          const strategy = e.target.value;
          dispatch(updateConfig({ id: nodeId, patch: { strategy } }));
          dispatch(updateNode({ id: nodeId, data: { discipline: strategy }, type: undefined }));
        }}
      />

      <Label>Atributo de prioridad (opcional)</Label>
      <Input
        value={config.priorityAttribute ?? ""}
        onChange={(e) => {
          const value = e.target.value || undefined;
          dispatch(updateConfig({ id: nodeId, patch: { priorityAttribute: value } }));
        }}
      />
    </div>
  );
}
