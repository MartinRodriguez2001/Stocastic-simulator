import { Badge } from "@/components/ui/badge"

interface TimeoutIndicatorProps {
  outputMode: "automatico" | "solicitud"
  requestTimeout?: string
  isActive?: boolean
}

export function TimeoutIndicator({ 
  outputMode, 
  requestTimeout = "5.0", 
  isActive = false 
}: TimeoutIndicatorProps) {
  if (outputMode !== "solicitud") return null;

  const timeoutValue = parseFloat(requestTimeout);
  const getTimeoutStatus = () => {
    if (timeoutValue === 0) return { color: "bg-blue-100 text-blue-800", label: "Sin límite" };
    if (timeoutValue < 1) return { color: "bg-red-100 text-red-800", label: "Muy rápido" };
    if (timeoutValue < 5) return { color: "bg-yellow-100 text-yellow-800", label: "Rápido" };
    if (timeoutValue < 10) return { color: "bg-green-100 text-green-800", label: "Normal" };
    return { color: "bg-orange-100 text-orange-800", label: "Lento" };
  };

  const status = getTimeoutStatus();

  return (
    <div className="flex items-center gap-2">
      <Badge className={`text-xs ${status.color}`}>
        ⏱️ {requestTimeout}s
      </Badge>
      <Badge variant="outline" className="text-xs">
        {status.label}
      </Badge>
      {isActive && (
        <Badge className="text-xs bg-pulse bg-blue-100 text-blue-800">
          🔄 Esperando...
        </Badge>
      )}
    </div>
  );
}