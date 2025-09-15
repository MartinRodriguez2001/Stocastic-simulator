export interface SelectorConfig {
    strategy: "PRIORITY" | "ROUND_ROBIN"
    priorityInputs?: string[]
    elementTypeId: string | undefined
    name: string
}