import { type NodeKind } from '@/store/nodeSlice';
import type { Node, XYPosition } from 'reactflow'

type NodeDefaults = Partial<Node['data']> & { label: string; nodeType: string }

interface NodeRegistryItem {
  type: NodeKind
  selectValue: string
  defaults: NodeDefaults
}

const REGISTRY: Record<NodeKind, NodeRegistryItem> = {
  generator: {
    type: 'generator',
    selectValue: 'generador',
    defaults: {
      label: 'Generador',
      color: '#4b5563', // gris oscuro
      nodeType: 'generator',
    },
  },
  queue: {
    type: 'queue',
    selectValue: 'fila',
    defaults: {
      label: 'Fila',
      color: '#059669', // verde
      nodeType: 'queue',
    },
  },
  selector: {
    type: 'selector',
    selectValue: 'seleccionador',
    defaults: {
      label: 'Seleccionador',
      color: '#dc2626', // rojo
      nodeType: 'selector',
    },
  },
  transporter: {
    type: 'transporter',
    selectValue: 'transportador',
    defaults: {
      label: 'Transportador',
      color: '#f57c00', // naranjo
      nodeType: 'transportador',
    },
  },
  output: {
    type: 'output',
    selectValue: 'salida',
    defaults: {
      label: 'Salida',
      color: '#64748b', // gris azulado
      nodeType: 'salida',
    },
  },
  transformer: {
    type: 'transformer',
    selectValue: 'c/t',
    defaults: {
      label: 'Transformador',
      color: '#8e44ad', // morado
      nodeType: 'transformer',
    },
  },
};

export function getDefaults(type: NodeKind): NodeDefaults {
  return REGISTRY[type].defaults;
}

export function createNodeVisual(
  type: NodeKind,
  position: XYPosition,
  label?: string,
  overrides?: Partial<Node['data']>
): Node {
  const idPrefix = type === "queue" ? "node" : type;
  const id = `${idPrefix}-${crypto.randomUUID?.() ?? Date.now()}`;
  const defaults = getDefaults(type);

  return {
    id,
    type,
    position,
    data: {
      ...defaults,
      ...(label ? { label } : {}),
      ...(overrides ?? {}),
    },
  };
}

