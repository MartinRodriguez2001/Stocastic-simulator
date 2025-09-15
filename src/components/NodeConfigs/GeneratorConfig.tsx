// components/NodeConfigs/GeneratorConfig.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface GeneratorConfigProps {
  nodeId: string;
}

export function GeneratorConfig({ nodeId }: GeneratorConfigProps) {
  const dispatch = useAppDispatch();
  const config = useAppSelector(
    (state) => state.node.byId[nodeId]?.config.data
  ) as any;

  const elements = useAppSelector((state) => state.elements.items);
  if (!config) return null;

  const generation = config.generation ?? {
    kind: "exponencial",
    params: { lambda: 1 },
  };

  const element = config.elementTypeId ? elements[config.elementTypeId] : null;
  const probabilities = config.attributesProbabilities ?? {};

  // --- Handlers ---
  const handleDistributionChange = (kind: string) => {
    let params: any;
    switch (kind) {
      case "uniforme":
        params = { min: 0, max: 1 };
        break;
      case "normal":
        params = { mu: 0, sigma: 1 };
        break;
      case "fijo":
        params = { value: 1 };
        break;
      default:
        params = { lambda: 1 };
    }

    dispatch(
      updateConfig({ id: nodeId, patch: { generation: { kind, params } } })
    );
    dispatch(
      updateNode({ id: nodeId, data: { generation: { kind, params } } })
    );
  };

  const handleParamsChange = (newParams: Record<string, number>) => {
    const updated = { ...generation, params: { ...generation.params, ...newParams } };
    dispatch(updateConfig({ id: nodeId, patch: { generation: updated } }));
    dispatch(updateNode({ id: nodeId, data: { generation: updated } }));
  };

  const handleProbabilityChange = (attr: string, prob: number) => {
    const updated = { ...probabilities, [attr]: prob };
    dispatch(updateConfig({ id: nodeId, patch: { attributesProbabilities: updated } }));
    dispatch(updateNode({ id: nodeId, data: { attributesProbabilities: updated } }));
  };

  // --- Render ---
  return (
    <div className="mt-3 space-y-4">
      {/* Selección de distribución */}
      <Label>Distribución</Label>
      <Select
        value={generation.kind}
        onValueChange={(val) => handleDistributionChange(val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una distribución" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="exponencial">Exponencial</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="uniforme">Uniforme</SelectItem>
          <SelectItem value="fijo">Fijo</SelectItem>
        </SelectContent>
      </Select>

      {/* Parámetros según la distribución */}
      {generation.kind === "exponencial" && (
        <>
          <Label>λ (Tasa)</Label>
          <Input
            type="number"
            value={generation.params.lambda}
            onChange={(e) =>
              handleParamsChange({ lambda: Number(e.target.value) })
            }
          />
        </>
      )}

      {generation.kind === "normal" && (
        <>
          <Label>μ (Media)</Label>
          <Input
            type="number"
            value={generation.params.mu}
            onChange={(e) => handleParamsChange({ mu: Number(e.target.value) })}
          />
          <Label>σ (Desviación estándar)</Label>
          <Input
            type="number"
            value={generation.params.sigma}
            onChange={(e) =>
              handleParamsChange({ sigma: Number(e.target.value) })
            }
          />
        </>
      )}

      {generation.kind === "uniforme" && (
        <>
          <Label>Mínimo</Label>
          <Input
            type="number"
            value={generation.params.min}
            onChange={(e) => handleParamsChange({ min: Number(e.target.value) })}
          />
          <Label>Máximo</Label>
          <Input
            type="number"
            value={generation.params.max}
            onChange={(e) => handleParamsChange({ max: Number(e.target.value) })}
          />
        </>
      )}

      {generation.kind === "fijo" && (
        <>
          <Label>Valor fijo</Label>
          <Input
            type="number"
            value={generation.params.value}
            onChange={(e) =>
              handleParamsChange({ value: Number(e.target.value) })
            }
          />
        </>
      )}

      {element && (
        <div className="mt-4">
          <Label>Probabilidad de atributos</Label>
          <div className="space-y-3 mt-2">
            {element.attributes.map((attr) => (
              <div key={attr.name} className="p-2 border rounded-md">
                <Label className="font-medium">{attr.name}</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.0 - 1.0"
                  value={probabilities[attr.name] ?? ""}
                  onChange={(e) =>
                    handleProbabilityChange(attr.name, Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
