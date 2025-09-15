import { Handle, Position, type NodeProps } from "reactflow";
import { Truck } from "lucide-react";

export function TransporterNode(props: NodeProps) {
  const { label, speed, capacity, distance, transportType } = props.data as {
    label: string;
    speed?: string | number;
    capacity?: string | number;
    distance?: string | number;
    transportType?: string;
  };

  return (
    <div className="rounded-xl bg-orange-600 text-white shadow-lg border-2 border-orange-700 w-56">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-orange-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Truck size={16} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs opacity-80">Transporter</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="opacity-90">Speed:</span>
          <span className="font-semibold">{speed ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Capacity:</span>
          <span className="font-semibold">{capacity ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Distance:</span>
          <span className="font-semibold">{distance ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Type:</span>
          <span className="font-semibold">{transportType ?? "—"}</span>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-orange-300" />
      <Handle type="source" position={Position.Right} className="!bg-orange-300" />
    </div>
  );
}
