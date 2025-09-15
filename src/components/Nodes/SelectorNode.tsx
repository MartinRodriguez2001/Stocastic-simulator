import { Handle, Position, type NodeProps } from "reactflow";
import { GitMerge } from "lucide-react";

export function SelectorNode(props: NodeProps) {
  const { label, strategy, status } = props.data as {
    label: string;
    strategy?: string;
    status?: string;
  };

  return (
    <div className="rounded-xl bg-red-600 text-white shadow-lg border-2 border-red-700 w-52">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-red-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <GitMerge size={16} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs opacity-80">Selector</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="opacity-90">Strategy:</span>
          <span className="font-semibold">{strategy ?? "Priority"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Status:</span>
          <span className="font-semibold">{status ?? "Active"}</span>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-red-300" />
      <Handle type="source" position={Position.Right} className="!bg-red-300" />
    </div>
  );
}
