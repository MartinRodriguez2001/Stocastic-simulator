// components/NodeConfigs/GeneratorConfig.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateConfig } from "@/store/nodeSlice";
import { updateNode } from "@/store/workspaceSlice";

interface GeneratorConfigProps {
  nodeId: string;
}

export function GeneratorConfig({ nodeId }: GeneratorConfigProps) {
  const dispatch = useAppDispatch();
  const config = useAppSelector(
    (state) => state.node.byId[nodeId]?.config.data
  ) as any;

  if (!config) return null;

  return (
    <div className="mt-3 space-y-2">
      <Label>Distribución</Label>
      <Input
        value={config.distribution ?? ""}
        onChange={(e) =>
          dispatch(
            updateConfig({ id: nodeId, patch: { distribution: e.target.value } })
          )
        }
      />

      <Label>Tasa / λ</Label>
      <Input
        type="number"
        value={config.rate ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          // Actualiza Redux (nodeSlice)
          dispatch(updateConfig({ id: nodeId, patch: { rate: value } }));
          // Espejo visual en ReactFlow (para GeneratorNode que lee props.data)
          dispatch(updateNode({ id: nodeId, data: { rate: value }, type: undefined }));
        }}
      />

      <Label>Capacidad</Label>
      <Input
        value={config.capacity ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          // Actualiza Redux (nodeSlice)
          dispatch(updateConfig({ id: nodeId, patch: { capacity: value } }));
          // Espejo visual en ReactFlow
          dispatch(updateNode({ id: nodeId, data: { capacity: value }, type: undefined }));
        }}
      />
    </div>
  );
}
