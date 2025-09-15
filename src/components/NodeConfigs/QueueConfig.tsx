// components/NodeConfigs/QueueConfig.tsx
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

interface QueueConfigProps {
  nodeId: string;
}

export function QueueConfig({ nodeId }: QueueConfigProps) {
  const dispatch = useAppDispatch();

  const config = useAppSelector(
    (state) => state.node.byId[nodeId]?.config.data
  ) as any;

  const elements = useAppSelector((state) => state.elements.items);
  if (!config) return null;

  const element = config.elementTypeId ? elements[config.elementTypeId] : null;

  const handleAddPriorityValue = (val: string) => {
    if (!val) return;
    if ((config.priorityValues ?? []).includes(val)) return; // evita duplicados
    const updated = [...(config.priorityValues ?? []), val];
    dispatch(updateConfig({ id: nodeId, patch: { priorityValues: updated } }));
    dispatch(updateNode({ id: nodeId, data: { priorityValues: updated } }));
  };

  return (
    <div className="mt-3 space-y-3">
      {/* Estrategia */}
      <Label>Estrategia</Label>
      <Select
        value={config.strategy ?? "FIFO"}
        onValueChange={(val) => {
          dispatch(updateConfig({ id: nodeId, patch: { strategy: val } }));
          dispatch(updateNode({ id: nodeId, data: { strategy: val } }));
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una estrategia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FIFO">FIFO</SelectItem>
          <SelectItem value="LIFO">LIFO</SelectItem>
          <SelectItem value="RANDOM">Aleatoria</SelectItem>
          <SelectItem value="PRIORITY">Prioritaria</SelectItem>
        </SelectContent>
      </Select>

      {/* Configuración de prioridad */}
      {config.strategy === "PRIORITY" && element && (
        <div className="space-y-3 border rounded p-3">
          <Label>Atributo de prioridad</Label>
          <Select
            value={config.priorityAttribute ?? ""}
            onValueChange={(val) => {
              dispatch(updateConfig({ id: nodeId, patch: { priorityAttribute: val, priorityValues: [] } }));
              dispatch(updateNode({ id: nodeId, data: { priorityAttribute: val, priorityValues: [] } }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un atributo" />
            </SelectTrigger>
            <SelectContent>
              {element.attributes.map((attr) => (
                <SelectItem key={attr.name} value={attr.name}>
                  {attr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Lista de valores posibles */}
          {config.priorityAttribute && (
            <>
              <Label>Valores prioritarios</Label>
              <Select onValueChange={handleAddPriorityValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Agregar valor en orden" />
                </SelectTrigger>
                <SelectContent>
                  
                </SelectContent>
              </Select>

              {/* Orden */}
              <Label>Orden</Label>
              <Select
                value={config.priorityOrder ?? "asc"}
                onValueChange={(val) => {
                  dispatch(updateConfig({ id: nodeId, patch: { priorityOrder: val } }));
                  dispatch(updateNode({ id: nodeId, data: { priorityOrder: val } }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>

              {/* Vista previa lista */}
              <div className="mt-2 space-y-1">
                {(config.priorityValues ?? []).map((v: string, i: number) => (
                  <div key={i} className="px-2 py-1 bg-muted rounded">
                    {i + 1}. {v}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
