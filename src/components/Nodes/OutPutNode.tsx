import { Handle, Position, type NodeProps } from "reactflow";
import { Box } from "lucide-react";

export function OutputNode(props: NodeProps) {
  const { label, processedCount, status } = props.data as {
    label: string;
    processedCount?: number;
    status?: string;
  };

  return (
    <div className="rounded-xl bg-gray-700 text-white shadow-lg border-2 border-gray-800 w-52">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Box size={16} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs opacity-80">Output</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="opacity-90">Processed:</span>
          <span className="font-semibold">{processedCount ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Status:</span>
          <span className="font-semibold">{status ?? "Ready"}</span>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-gray-300" />
    </div>
  );
}
