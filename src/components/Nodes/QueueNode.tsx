import { Handle, Position, type NodeProps } from "reactflow";
import { List, Database } from "lucide-react"; // 👈 íconos de cola y elementos
import { useAppSelector } from "@/store/hooks";
import { shallowEqual } from "react-redux";

export function QueueNode(props: NodeProps) {
  // Lee configuración desde Redux (nodeSlice) y datos del elemento (elementsSlice)
  const { name, strategy, capacityCfg, elementName } = useAppSelector((s) => {
    const ns = s.node.byId[props.id];
    const cfg = (ns?.config as any)?.data ?? {};
    const el = cfg.elementTypeId ? s.elements.items[cfg.elementTypeId] : undefined;
    return {
      name: (cfg.name as string) ?? undefined,
      strategy: (cfg.strategy as string) ?? undefined,
      capacityCfg: (cfg.capacity as number | undefined),
      elementName: el?.name as string | undefined,
    };
  }, shallowEqual);

  // Compatibilidad: usa label de ReactFlow si existe; si no, usa name de config
  const label = (props.data as any)?.label ?? name ?? "Cola";

  // UI data adicional desde props (si existiera runtime de tamaño)
  const { queueSize } = (props.data as any) as { queueSize?: number };

  // Mostrar disciplina y capacidad desde Redux si está disponible, si no desde props
  const discipline = strategy ?? (props.data as any)?.discipline ?? "FIFO";
  const capacity =
    capacityCfg != null
      ? (Number.isFinite(capacityCfg) ? capacityCfg : "∞")
      : (props.data as any)?.capacity ?? "∞";

  return (
    <div className="rounded-xl bg-blue-600 text-white shadow-lg border-2 border-blue-700 w-52">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <List size={16} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs opacity-80">Queue</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-xs space-y-1">
        {elementName && (
          <div className="flex justify-between">
            <span className="opacity-90">Elemento:</span>
            <span className="font-semibold">{elementName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="opacity-90">Discipline:</span>
          <span className="font-semibold">{discipline}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Current size:</span>
          <span className="font-semibold flex items-center gap-1">
            <Database size={12} />
            {queueSize ?? 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Capacity:</span>
          <span className="font-semibold">{capacity}</span>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-blue-300" />
      <Handle type="source" position={Position.Right} className="!bg-blue-300" />
    </div>
  );
}
