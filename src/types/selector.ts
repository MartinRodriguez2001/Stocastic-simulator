// types/selector.ts
export interface SelectorConfig {
  elementTypeId: string | undefined;
  strategy: "INPUT_PRIORITY" | "ORDER";
  priorityInputs: string[];
  name: string;
}
