import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import type { useElements, ElementAttributes } from "@/hooks/useElements"

interface ElementDialogProps {
  open: boolean
  onClose: () => void
  elementsManager: ReturnType<typeof useElements>
}

export function ElementDialog({ open, onClose, elementsManager }: ElementDialogProps) {
  const [name, setName] = useState("")
  const [attributes, setAttributes] = useState<ElementAttributes[]>([
  ])

  const addAttribute = () => {
    setAttributes(prev => [...prev, { name: "", type: "categorico" }])
  }

  const updateAttribute = (index: number, field: keyof ElementAttributes, value: any) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === index ? { ...attr, [field]: value } : attr
    ))
  }

  const removeAttribute = (index: number) => {
    if (attributes.length > 1) { // Mantener al menos un atributo
      setAttributes(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("El nombre del elemento es requerido")
      return
    }

    // Validar que todos los atributos tengan nombre
    const invalidAttributes = attributes.filter(attr => !attr.name.trim())
    if (invalidAttributes.length > 0) {
      toast.error("Todos los atributos deben tener un nombre")
      return
    }

    // Validar nombres únicos de atributos
    const attributeNames = attributes.map(attr => attr.name.toLowerCase())
    const duplicates = attributeNames.filter((name, index) => attributeNames.indexOf(name) !== index)
    if (duplicates.length > 0) {
      toast.error("Los nombres de atributos deben ser únicos")
      return
    }

    const existingElement = elementsManager.elements.find(
      el => el.name.toLowerCase() === name.trim().toLowerCase()
    )

    if (existingElement) {
      toast.error(`Ya existe un elemento con el nombre "${name}"`)
      return
    }

    const newElement = elementsManager.addElement({
      name: name.trim(),
      attributes: attributes.map(attr => ({
        name: attr.name.trim(),
        type: attr.type
      }))
    })

    toast.success(`Elemento "${newElement.name}" creado con ${attributes.length} atributos`)
    
    // Limpiar formulario
    setName("")
    setAttributes([{ name: "id", type: "categorico" }])
    onClose()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "categorico": return "bg-blue-100 text-blue-800"
      case "numerico": return "bg-green-100 text-green-800"
      case "booleano": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Elemento</DialogTitle>
          <DialogDescription>
            Define el nombre y los atributos del nuevo elemento para la simulación.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6 py-4">
          {/* Nombre del elemento */}
          <div className="space-y-2">
            <Label htmlFor="element-name">Nombre del elemento *</Label>
            <Input
              id="element-name"
              placeholder="Ej: Usuario, Producto, Pedido"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Atributos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Atributos del elemento</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttribute}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar atributo
              </Button>
            </div>

            <div className="space-y-3">
              {attributes.map((attribute, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-sm">Nombre</Label>
                      <Input
                        placeholder="nombre_atributo"
                        value={attribute.name}
                        onChange={(e) => updateAttribute(index, "name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-sm">Tipo</Label>
                      <Select
                        value={attribute.type}
                        onValueChange={(value: any) => updateAttribute(index, "type", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="categorico">Categórico</SelectItem>
                          <SelectItem value="numerico">Numérico</SelectItem>
                          <SelectItem value="booleano">Booleano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttribute(index)}
                      disabled={attributes.length <= 1}
                      className="mt-6 p-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Vista previa */}
            {name && attributes.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Vista previa: {name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {attributes.map((attr, index) => (
                      attr.name && (
                        <Badge key={index} className={getTypeColor(attr.type)}>
                          {attr.name}: {attr.type}
                        </Badge>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Elementos existentes */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Elementos existentes ({elementsManager.elements.length})
            </Label>
            <div className="max-h-32 overflow-y-auto border rounded p-3 bg-muted/30">
              {elementsManager.elements.map(element => (
                <div key={element.id} className="text-sm text-muted-foreground py-1">
                  <div className="font-medium">• {element.name}</div>
                  <div className="ml-4 text-xs">
                    {element.attributes.map(attr => attr.name).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Crear Elemento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}