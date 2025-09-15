export type NodeKind = "generator"

export type Distribution =
  | { kind: 'uniforme'; params: { min: number; max: number } }
  | { kind: 'exponencial'; params: { lambda: number } }
  | { kind: 'normal'; params: { mu: number; sigma: number } }
  | { kind: 'fijo'; params: { value: number } }

export interface GeneratorConfig {
    elementTypeId: string | undefined
    name: string
    onDemand?: boolean
    generation?: Distribution
    serviceTime?: Distribution
    delayOnDemand?: number
    limit?: number
    attributesProbabilities?: Record<string, Record<string, number>>
}

