import { Handle, Position, type NodeProps } from "reactflow";
import { Zap, Database } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { shallowEqual } from "react-redux";

export const GeneratorNode = (props: NodeProps) => {
  const { name, rate, capacity, elementName } = useAppSelector((s) => {
    const ns = s.node.byId[props.id];
    const cfg = (ns?.config as any)?.data ?? {};
    const el = cfg.elementTypeId ? s.elements.items[cfg.elementTypeId] : undefined;

    const r =
      cfg.rate ??
      cfg.generation?.params?.lambda ??
      (typeof props.data?.rate === "number" ? props.data.rate : undefined);
    return {
      name: cfg.name as string | undefined,
      rate: r as number | string | undefined,
      capacity: (cfg.capacity ?? props.data?.capacity) as number | string | undefined,
      elementName: el?.name as string | undefined,
    };
  }, shallowEqual);

  const label =
    (props.data as any)?.label ??
    name ??
    "Generador";

  return (
    <div className="rounded-xl bg-green-600 text-white shadow-lg border-2 border-green-700 w-52">
      <div className="flex items-center justify-between px-3 py-2 bg-green-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Zap size={16} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs opacity-80">Generator</span>
      </div>

      <div className="px-3 py-2 text-xs space-y-1">
        {elementName && (
          <div className="flex justify-between">
            <span className="opacity-90">Elemento:</span>
            <span className="font-semibold">{elementName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="opacity-90">Rate:</span>
          <span className="font-semibold">{rate ?? "—"}/u</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Capacity:</span>
          <span className="font-semibold">{capacity ?? "∞"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Generated:</span>
          <span className="font-semibold flex items-center gap-1">
            <Database size={12} />
            {(props.data as any)?.generatedCount ?? 0}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-green-300" />
    </div>
  );
};
