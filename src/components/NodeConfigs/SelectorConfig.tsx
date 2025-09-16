import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateConfig } from "@/store/nodeSlice";
import { updateNode } from "@/store/workspaceSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectorConfigProps {
  nodeId: string;
}

export function SelectorConfig({ nodeId }: SelectorConfigProps) {
  const dispatch = useAppDispatch();

  const config = useAppSelector((s) => s.node.byId[nodeId]?.config.data) as
    | {
        name: string;
        elementTypeId?: string;
        strategy: "INPUT_PRIORITY" | "ORDER";
        priorityInputs: string[];
      }
    | undefined;

  const ioInputs = useAppSelector((s) => s.node.byId[nodeId]?.io.inputs) ?? [];

  if (!config) return null;

  const currentOrder = Array.isArray(config.priorityInputs)
    ? config.priorityInputs
    : [];

  const normalizedOrder = (() => {
    const existing = new Set(ioInputs);
    const filtered = currentOrder.filter((id) => existing.has(id));
    const missing = ioInputs.filter((id) => !currentOrder.includes(id));
    return [...filtered, ...missing];
  })();

  // Si cambió (por nuevas conexiones), sincroniza una vez por render
  if (JSON.stringify(currentOrder) !== JSON.stringify(normalizedOrder)) {
    dispatch(
      updateConfig({ id: nodeId, patch: { priorityInputs: normalizedOrder } })
    );
    dispatch(
      updateNode({ id: nodeId, data: { priorityInputs: normalizedOrder } })
    );
  }

  const setPatch = (patch: Record<string, unknown>) => {
    dispatch(updateConfig({ id: nodeId, patch }));
    dispatch(updateNode({ id: nodeId, data: patch }));
  };

  return (
    <div className="mt-3 space-y-3">
      {/* Estrategia */}
      <Label>Estrategia de selección</Label>
      <Select
        value={config.strategy ?? "INPUT_PRIORITY"}
        onValueChange={(val: "INPUT_PRIORITY" | "ORDER") =>
          setPatch({ strategy: val })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una estrategia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="INPUT_PRIORITY">
            Prioridad de entrada (1ª, luego 2ª, …)
          </SelectItem>
          <SelectItem value="ORDER">
            Por orden cíclico (1 → 2 → 3 → 1 …)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
