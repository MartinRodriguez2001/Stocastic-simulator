import {
  type NodeKind,
  type NodeState,
  type AnyConfig,
} from '../nodeSlice'

export function makeInitialNodeState(
  id: string,
  kind: NodeKind,
  initialData: any = {}
): NodeState {
  let config: AnyConfig

  switch (kind) {
    case 'generator':
      config = {
        kind: 'generator',
        data: {
          name: initialData.name ?? "Generador",
          elementTypeId: initialData.elementType ?? undefined,
          generation: initialData.intervalParams ?? { value: 1 },
          limit: initialData.limit ?? undefined,
          onDemand: initialData.onDemand ?? false,
          attributesProbabilities: initialData.attributes ?? {},
        },
      }
      break

    case 'queue':
      config = {
        kind: 'queue',
        data: {
          name: initialData.name ?? "Cola",
          elementTypeId: initialData.elementTypeId ?? undefined,
          strategy: initialData.strategy ?? 'FIFO',
          priorityAttributes: Array.isArray(initialData.priorityAttributes)
            ? initialData.priorityAttributes
            : [],
          capacity: initialData.capacity ?? undefined, // Infinity o undefined = sin límite
        },
      }
      break



    case 'selector':
      config = {
        kind: 'selector',
        data: {
          name: initialData.name ?? "Selector",
          elementTypeId: initialData.elementTypeId ?? undefined,
          strategy: initialData.strategy ?? 'INPUT_PRIORITY', 
          priorityInputs: Array.isArray(initialData.priorityInputs)
            ? initialData.priorityInputs
            : [], 
        },
      }
      break


    case 'transporter':
      config = {
        kind: 'transporter',
        data: {
          name: initialData.name ?? "Transportador",
          elementTypeId: initialData.elementTypeId ?? undefined,
          mode: (initialData.mode === 'MOBILE' || initialData.mode === 'CONTINUOUS')
            ? initialData.mode
            : 'CONTINUOUS', 
          travelTime: initialData.travelTime ?? { kind: 'fijo', params: { value: 1 } },
          minInterval: initialData.minInterval ?? 0, 
          capacity: initialData.capacity ?? 1,      
          maxWait: initialData.maxWait ?? 0,         
        },
      }
      break

    case 'transformer':
      config = {
        kind: 'transformer',
        data: {
          inputRequirements: initialData.inputRequirements ?? {},
          outputMapping: initialData.outputMapping ?? {},
          transformTime: initialData.transformTime ?? { value: 1 },
          attributeChanges: initialData.attributeChanges ?? {},
        },
      }
      break

    case 'output':
      config = {
        kind: 'output',
        data: {
          name: initialData.name ?? "Output",
          elementTypeId: initialData.elementType ?? undefined,
        },
      }
      break

    default:
      throw new Error(`Tipo de nodo no soportado: ${kind}`)
  }

  return {
    id,
    kind,
    config,
    sensors: [],
    failures: [],
    io: { inputs: [], outputs: []}
  }
}
