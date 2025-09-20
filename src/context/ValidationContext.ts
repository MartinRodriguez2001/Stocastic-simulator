import type { Node, Edge } from "reactflow";
import type { NodeState } from "@/store/nodeSlice";
import { hasCycle } from "@/validations/cycleValidation";
import { getElementTypeId } from "@/utils/getElementTypeId";

export interface ValidationResult { isValid: boolean; message?: string }

export interface ValidationContext {
  source: Node;
  target: Node;
  edges: Edge[];
  nodeById: Record<string, NodeState>;
  options?: { strictElementMatch?: boolean };
}

type ValidationRule = (ctx: ValidationContext) => ValidationResult;

const generatorTargetRule: ValidationRule = ({ target }) => {
  if (target.type === "generator") {
    return { isValid: false, message: "Los generadores no pueden recibir conexiones" };
  }
  return { isValid: true };
};

const cycleRule: ValidationRule = ({ edges, source, target }) =>
  hasCycle(edges, source.id, target.id)
    ? { isValid: false, message: "No se permiten ciclos en el grafo" }
    : { isValid: true };

const sameElementRule: ValidationRule = ({ source, target, nodeById, options }) => {
  const s = nodeById[source.id];
  const t = nodeById[target.id];
  const sEl = getElementTypeId(s);
  const tEl = getElementTypeId(t);
  const strict = options?.strictElementMatch ?? true;

  if (strict) {
    if (!sEl || !tEl) return { isValid: false, message: "Ambos nodos deben tener un elemento seleccionado" };
    if (sEl !== tEl) return { isValid: false, message: "Los nodos deben usar el mismo elemento" };
    return { isValid: true };
  } else {
    if (sEl && tEl && sEl !== tEl) return { isValid: false, message: "Los nodos deben usar el mismo elemento" };
    return { isValid: true };
  }
};

const transporterConsumerRule: ValidationRule = ({ source, target, nodeById }) => {
  const s = nodeById[source.id];
  const t = nodeById[target.id];
  if (s?.kind === "transporter" && t?.kind === "output") {
    return { isValid: false, message: "Un transportador no puede conectarse directamente a un consumidor" };
  }
  return { isValid: true };
};

const rules: ValidationRule[] = [
  generatorTargetRule,
  transporterConsumerRule,
  sameElementRule,
  cycleRule,
];

export function validateConnectionPure(ctx: ValidationContext): ValidationResult {
  for (const rule of rules) {
    const r = rule(ctx);
    if (!r.isValid) return r;
  }
  return { isValid: true };
}
