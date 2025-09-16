// components/NodeConfigs/TransporterConfig.tsx
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateConfig } from "@/store/nodeSlice";
import { updateNode } from "@/store/workspaceSlice";

type DistKind = "fijo" | "uniforme" | "exponencial" | "normal";

interface TransporterConfigProps {
  nodeId: string;
}

export function TransporterConfig({ nodeId }: TransporterConfigProps) {
  const dispatch = useAppDispatch();
  const config = useAppSelector((s) => s.node.byId[nodeId]?.config.data) as any;

  if (!config) return null;

  const patch = (p: Record<string, unknown>) => {
    dispatch(updateConfig({ id: nodeId, patch: p }));
    dispatch(updateNode({ id: nodeId, data: p }));
  };

  const createDefaultDist = (kind: DistKind) => {
    switch (kind) {
      case "fijo":
        return { kind, params: { value: 1 } };
      case "uniforme":
        return { kind, params: { min: 0, max: 1 } };
      case "exponencial":
        return { kind, params: { lambda: 1 } };
      case "normal":
        return { kind, params: { mu: 1, sigma: 0.1 } };
    }
  };

  const travel = config.travelTime ?? { kind: "fijo", params: { value: 1 } };

  const setDistKind = (k: DistKind) => {
    patch({ travelTime: createDefaultDist(k) });
  };

  const setParam = (key: string, value: number) => {
    const next = { ...travel, params: { ...travel.params, [key]: value } };
    patch({ travelTime: next });
  };

  // Helpers para number inputs (>= 0)
  const toNum = (raw: string, fallback: number) => {
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const isContinuous = config.mode === "CONTINUOUS";
  const isMobile = config.mode === "MOBILE";

  return (
    <div className="mt-3 space-y-4">
      {/* Modo */}
      <div className="space-y-2">
        <Label>Tipo de transporte</Label>
        <Select
          value={config.mode ?? "CONTINUOUS"}
          onValueChange={(val: "CONTINUOUS" | "MOBILE") => patch({ mode: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el modo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONTINUOUS">Continuo</SelectItem>
            <SelectItem value="MOBILE">Móvil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tiempo de viaje (distribución) */}
      <div className="space-y-2 border rounded p-3">
        <Label>Tiempo de viaje</Label>

        <div className="flex items-center gap-2">
          <Select
            value={travel.kind}
            onValueChange={(k) => setDistKind(k as DistKind)}
          >
            <SelectTrigger className="h-8 w-[160px] px-2 text-xs">
              <SelectValue placeholder="Distribución" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="fijo" className="text-xs">
                Fijo
              </SelectItem>
              <SelectItem value="uniforme" className="text-xs">
                Uniforme
              </SelectItem>
              <SelectItem value="exponencial" className="text-xs">
                Exponencial
              </SelectItem>
              <SelectItem value="normal" className="text-xs">
                Normal
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Parámetros dinámicos */}
          {travel.kind === "fijo" && (
            <div className="flex items-center gap-2">
              <Label className="text-xs">valor</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                className="h-8 w-[110px] text-xs"
                value={String(travel.params.value ?? 1)}
                onChange={(e) =>
                  setParam("value", Math.max(0, toNum(e.target.value, 1)))
                }
              />
            </div>
          )}

          {travel.kind === "uniforme" && (
            <>
              <div className="flex items-center gap-2">
                <Label className="text-xs">min</Label>
                <Input
                  type="number"
                  step={0.01}
                  className="h-8 w-[110px] text-xs"
                  value={String(travel.params.min ?? 0)}
                  onChange={(e) => {
                    const min = toNum(e.target.value, 0);
                    const max = Math.max(min, Number(travel.params.max ?? min));
                    patch({
                      travelTime: { kind: "uniforme", params: { min, max } },
                    });
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">max</Label>
                <Input
                  type="number"
                  step={0.01}
                  className="h-8 w-[110px] text-xs"
                  value={String(travel.params.max ?? 1)}
                  onChange={(e) => {
                    const max = toNum(e.target.value, 1);
                    const min = Math.min(Number(travel.params.min ?? 0), max);
                    patch({
                      travelTime: { kind: "uniforme", params: { min, max } },
                    });
                  }}
                />
              </div>
            </>
          )}

          {travel.kind === "exponencial" && (
            <div className="flex items-center gap-2">
              <Label className="text-xs">λ</Label>
              <Input
                type="number"
                min={0.0001}
                step={0.01}
                className="h-8 w-[110px] text-xs"
                value={String(travel.params.lambda ?? 1)}
                onChange={(e) =>
                  setParam("lambda", Math.max(0.0001, toNum(e.target.value, 1)))
                }
              />
            </div>
          )}

          {travel.kind === "normal" && (
            <>
              <div className="flex items-center gap-2">
                <Label className="text-xs">μ</Label>
                <Input
                  type="number"
                  step={0.01}
                  className="h-8 w-[110px] text-xs"
                  value={String(travel.params.mu ?? 1)}
                  onChange={(e) => setParam("mu", toNum(e.target.value, 1))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">σ</Label>
                <Input
                  type="number"
                  min={0.0001}
                  step={0.01}
                  className="h-8 w-[110px] text-xs"
                  value={String(travel.params.sigma ?? 0.1)}
                  onChange={(e) =>
                    setParam(
                      "sigma",
                      Math.max(0.0001, toNum(e.target.value, 0.1))
                    )
                  }
                />
              </div>
            </>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground mt-1">
          Define la distribución del tiempo de viaje del transporte.
        </p>
      </div>

      {/* Campos específicos por modo */}
      {isContinuous && (
        <div className="space-y-2 border rounded p-3">
          <Label>Parámetros (Continuo)</Label>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Tiempo mínimo entre elementos</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              className="h-8 w-[140px] text-xs"
              value={String(config.minInterval ?? 0)}
              onChange={(e) =>
                patch({ minInterval: Math.max(0, toNum(e.target.value, 0)) })
              }
            />
          </div>
        </div>
      )}

      {isMobile && (
        <div className="space-y-2 border rounded p-3">
          <Label>Parámetros (Móvil)</Label>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Capacidad máxima por viaje</Label>
            <Input
              type="number"
              min={1}
              step={1}
              className="h-8 w-[120px] text-xs"
              value={String(config.capacity ?? 1)}
              onChange={(e) =>
                patch({
                  capacity: Math.max(1, Math.floor(toNum(e.target.value, 1))),
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Tiempo de espera máximo</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              className="h-8 w-[120px] text-xs"
              value={String(config.maxWait ?? 0)}
              onChange={(e) =>
                patch({ maxWait: Math.max(0, toNum(e.target.value, 0)) })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
