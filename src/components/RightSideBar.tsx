// components/NodeConfigSidebar.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import type { Node } from "reactflow";
import { Label } from "@/components/ui/label";

import type { useElements } from "@/hooks/useElements";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateConfig } from "@/store/nodeSlice";

// Importa configuraciones modulares
import { GeneratorConfig } from "./NodeConfigs/GeneratorConfig";
import { QueueConfig } from "./NodeConfigs/QueueConfig";

// UI select de shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateNode } from "@/store/workspaceSlice";
import { SelectorConfig } from "./NodeConfigs/SelectorConfig";
import { TransporterConfig } from "./NodeConfigs/Transporter";

interface NodeConfigSidebarProps {
  node: Node | null;
  onClose: () => void;
  elementsManager: ReturnType<typeof useElements>;
}

export function NodeConfigSidebar({
  node,
  onClose,
  elementsManager,
}: NodeConfigSidebarProps) {
  const dispatch = useAppDispatch();

  // Seleccionamos la config del nodo directamente desde Redux
  const nodeState = useAppSelector((state) =>
    node ? state.node.byId[node.id] : undefined
  );

  if (!node || !nodeState) return null;

  const { config } = nodeState;
  const data = config.data as any;


  return (
    <Sheet open={!!node} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Configurar Nodo</SheetTitle>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Info básica */}
          <div className="grid gap-2 p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Información del nodo</Label>
            <div className="text-sm text-muted-foreground">
              <div>ID: {node.id}</div>
              <div>Tipo actual: {node.type}</div>
              <div>
                Posición: ({Math.round(node.position.x)},{" "}
                {Math.round(node.position.y)})
              </div>
            </div>
          </div>

          {/* Configuración general */}
          <div className="grid gap-2">
            <Label htmlFor="node-name">Nombre del nodo</Label>
            <Input
              value={data.name ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                // Fuente de verdad en Redux para la config del nodo
                dispatch(updateConfig({ id: node.id, patch: { name: value } }));
                // Espejo en ReactFlow para que el nodo visual re-renderice (usa label)
                dispatch(
                  updateNode({
                    id: node.id,
                    data: { name: value, label: value },
                    type: node.type,
                  })
                );
              }}
            />

            {/* Selector de elemento asociado */}
            <Label className="mt-2">Elemento asociado</Label>
            <Select
              value={data.elementTypeId ?? ""}
              onValueChange={(val) => {
                dispatch(
                  updateConfig({ id: node.id, patch: { elementTypeId: val } })
                );
                dispatch(
                  updateNode({
                    id: node.id,
                    data: { elementTypeId: val },
                    type: node.type,
                  })
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un elemento" />
              </SelectTrigger>
              <SelectContent>
                {elementsManager.elements.map((el) => (
                  <SelectItem key={el.id} value={el.id}>
                    {el.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Config específica */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-primary">
              Configuración específica -{" "}
              {node.type
                ? node.type.charAt(0).toUpperCase() + node.type.slice(1)
                : ""}
            </Label>

            {node.type === "generator" && (
              <GeneratorConfig nodeId={node.id} />
            )}
            {node.type === "queue" && (
              <QueueConfig nodeId={node.id} />
            )}

            {node.type === "selector" && (
              <SelectorConfig nodeId={node.id} />
            )}

            {node.type === "transporter" && (
              <TransporterConfig nodeId={node.id} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
