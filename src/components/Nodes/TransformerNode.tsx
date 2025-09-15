import { Handle, Position, type NodeProps } from "reactflow";
import { RefreshCcw } from "lucide-react";

export function TransformerNode(props: NodeProps) {
  const { label, mode, capacity, status } = props.data as {
    label: string;
    mode?: string;
    capacity?: string | number;
    status?: string;
  };

  return (
    <div className="rounded-xl bg-purple-700 text-white shadow-lg border-2 border-purple-800 w-52">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-purple-800 rounded-t-xl">
        <div className="flex items-center gap-2">
          <RefreshCcw size={16} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs opacity-80">Transformer</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="opacity-90">Mode:</span>
          <span className="font-semibold">{mode ?? "Auto"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Capacity:</span>
          <span className="font-semibold">{capacity ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Status:</span>
          <span className="font-semibold">{status ?? "Active"}</span>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-purple-300" />
      <Handle type="source" position={Position.Right} className="!bg-purple-300" />
    </div>
  );
}
