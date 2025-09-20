export interface QueueConfig {
  elementTypeId: string | undefined;
  strategy: "FIFO" | "LIFO" | "RANDOM" | "PRIORITY";
  priorityAttributes?: { attribute: string; order: "asc" | "desc" }[];
  capacity?: number | undefined;
  name: string;
}
