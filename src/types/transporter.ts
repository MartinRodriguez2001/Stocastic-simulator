
import type { Distribution } from "@/types/generator"

export interface TransporterConfig {
  mode: "CONTINUOUS" | "MOBILE";
  travelTime: Distribution;
  minInterval?: number;  
  capacity?: number;     
  maxWait?: number;    
  elementTypeId: string | undefined;
  name: string;
}
