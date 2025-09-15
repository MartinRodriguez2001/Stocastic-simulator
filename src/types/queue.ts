export interface QueueConfig {
    elementTypeId: string | undefined
    strategy: "FIFO" | "LIFO" | "RANDOM" | "PRIORITY"
    priorityAttribute?: string
    priorityOrder?: "asc" | "desc"
    capacity?: number 
    name: string
}