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
import { Input } from "@/components/ui/input";        
import { Switch } from "@/components/ui/switch";       

interface QueueConfigProps {
  nodeId: string;
}

type PriorityAttr = { attribute: string; order: "asc" | "desc" };

export function QueueConfig({ nodeId }: QueueConfigProps) {
  const dispatch = useAppDispatch();
  const config = useAppSelector((s) => s.node.byId[nodeId]?.config.data) as any;
  const elements = useAppSelector((s) => s.elements.items);

  if (!config) return null;

  const element = config.elementTypeId ? elements[config.elementTypeId] : null;

  const priorityAttributes: PriorityAttr[] = Array.isArray(config.priorityAttributes)
    ? config.priorityAttributes
    : [];

  const patchPriorityAttributes = (updated: PriorityAttr[]) => {
    dispatch(updateConfig({ id: nodeId, patch: { priorityAttributes: updated } }));
    dispatch(updateNode({ id: nodeId, data: { priorityAttributes: updated } }));
  };

  const handleAdd = () => {
    patchPriorityAttributes([...priorityAttributes, { attribute: "", order: "asc" }]);
  };

  const handleChangeAttribute = (index: number, val: string) => {
    const updated = priorityAttributes.map((pa, i) => (i === index ? { ...pa, attribute: val } : pa));
    patchPriorityAttributes(updated);
  };

  const handleChangeOrder = (index: number, val: "asc" | "desc") => {
    const updated = priorityAttributes.map((pa, i) => (i === index ? { ...pa, order: val } : pa));
    patchPriorityAttributes(updated);
  };

  const handleRemove = (index: number) => {
    const updated = priorityAttributes.filter((_, i) => i !== index);
    patchPriorityAttributes(updated);
  };

  // Helpers para capacidad
  const setCapacity = (cap: number | undefined) => {
    dispatch(updateConfig({ id: nodeId, patch: { capacity: cap } }));
    dispatch(updateNode({ id: nodeId, data: { capacity: cap } }));
  };
  const isInfinite = config.capacity === undefined || config.capacity === null;

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

      {/* Capacidad */}
      <div className="space-y-2">
        <Label>Capacidad</Label>

        <div className="flex items-center gap-2">
          <Switch
            id={`queue-${nodeId}-cap-infinite`}
            checked={isInfinite}
            onCheckedChange={(checked: any) => {
              if (checked) {
                // Sin límite
                setCapacity(undefined);
              } else {
                // Poner un valor por defecto si veníamos de infinito
                const fallback = typeof config.capacity === "number" ? config.capacity : 1;
                setCapacity(Math.max(0, fallback));
              }
            }}
          />
          <Label htmlFor={`queue-${nodeId}-cap-infinite`} className="text-sm">
            Sin límite
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            step={1}
            placeholder={isInfinite ? "∞" : "0"}
            className="h-8 w-[120px] text-xs"
            value={isInfinite ? "" : String(config.capacity ?? "")}
            disabled={isInfinite}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setCapacity(undefined);
                return;
              }
              const num = Number(raw);
              if (!Number.isNaN(num)) {
                setCapacity(Math.max(0, Math.floor(num)));
              }
            }}
          />
          <span className="text-xs text-muted-foreground">elementos</span>
        </div>
      </div>

      {/* Configuración de prioridad */}
      {config.strategy === "PRIORITY" && element && (
        <div className="space-y-3 border rounded p-3">
          <div className="flex items-center justify-between">
            <Label className="block">Atributos de prioridad</Label>
            <Button variant="outline" type="button" onClick={handleAdd}>
              + Agregar atributo
            </Button>
          </div>

          {priorityAttributes.map((pa, index) => (
            <div key={index} className="flex items-center gap-2 border p-2 rounded">
              {/* Selector de atributo (compacto) */}
              <Select
                value={pa.attribute || ""}
                onValueChange={(val) => handleChangeAttribute(index, val)}
              >
                <SelectTrigger
                  className="h-8 w-[140px] px-2 py-0 text-xs truncate"
                  aria-label="Atributo de prioridad"
                  title={pa.attribute || "Atributo"}
                >
                  <SelectValue placeholder="Atributo" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {element?.attributes?.map((attr: any) => (
                    <SelectItem key={attr.name} value={attr.name} className="text-xs">
                      {attr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selector de orden (compacto) */}
              <Select
                value={pa.order || "asc"}
                onValueChange={(val) => handleChangeOrder(index, val as "asc" | "desc")}
              >
                <SelectTrigger className="h-8 w-[110px] px-2 py-0 text-xs" aria-label="Orden de prioridad">
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="asc" className="text-xs">Ascendente</SelectItem>
                  <SelectItem value="desc" className="text-xs">Descendente</SelectItem>
                </SelectContent>
              </Select>

              {/* Eliminar */}
              <Button
                variant="destructive"
                size="sm"
                type="button"
                aria-label="Eliminar atributo de prioridad"
                onClick={() => handleRemove(index)}
                className="h-8"
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
