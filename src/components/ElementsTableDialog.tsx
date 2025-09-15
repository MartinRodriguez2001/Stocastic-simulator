import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Save, X, Plus, ChevronDown, ChevronRight } from "lucide-react"
import type { useElements, Element, ElementAttributes } from "@/hooks/useElements"
import { useState } from "react"
import { toast } from "sonner"

interface ElementsTableDialogProps {
  open: boolean
  onClose: () => void
  elementsManager: ReturnType<typeof useElements>
}

export function ElementsTableDialog({ 
  open, 
  onClose, 
  elementsManager 
}: ElementsTableDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  
  // Estados para edición
  const [editName, setEditName] = useState("")
  const [editAttributes, setEditAttributes] = useState<ElementAttributes[]>([])
  
  // Estados para crear nuevo elemento
  const [newName, setNewName] = useState("")
  const [newAttributes, setNewAttributes] = useState<ElementAttributes[]>([])

  const toggleRowExpansion = (elementId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(elementId)) {
        newSet.delete(elementId)
      } else {
        newSet.add(elementId)
      }
      return newSet
    })
  }

  const handleStartEdit = (element: Element) => {
    setEditingId(element.id)
    setEditName(element.name)
    setEditAttributes([...element.attributes])
  }

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    // Validar atributos
    const invalidAttributes = editAttributes.filter(attr => !attr.name.trim())
    if (invalidAttributes.length > 0) {
      toast.error("Todos los atributos deben tener un nombre")
      return
    }

    // Verificar nombres únicos de atributos
    const attributeNames = editAttributes.map(attr => attr.name.toLowerCase())
    const duplicates = attributeNames.filter((name, index) => attributeNames.indexOf(name) !== index)
    if (duplicates.length > 0) {
      toast.error("Los nombres de atributos deben ser únicos")
      return
    }

    // Verificar si el nombre ya existe (excepto el elemento actual)
    const existingElement = elementsManager.elements.find(
      el => el.id !== editingId && el.name.toLowerCase() === editName.trim().toLowerCase()
    )

    if (existingElement) {
      toast.error(`Ya existe un elemento con el nombre "${editName}"`)
      return
    }

    elementsManager.updateElement(editingId, {
      name: editName.trim(),
      attributes: editAttributes.map(attr => ({
        name: attr.name.trim(),
        type: attr.type
      }))
    })

    toast.success("Elemento actualizado correctamente")
    setEditingId(null)
    setEditName("")
    setEditAttributes([])
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName("")
    setEditAttributes([])
  }

  const handleCreateNew = () => {
    if (!newName.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    // Validar atributos
    const invalidAttributes = newAttributes.filter(attr => !attr.name.trim())
    if (invalidAttributes.length > 0) {
      toast.error("Todos los atributos deben tener un nombre")
      return
    }

    // Verificar nombres únicos de atributos
    const attributeNames = newAttributes.map(attr => attr.name.toLowerCase())
    const duplicates = attributeNames.filter((name, index) => attributeNames.indexOf(name) !== index)
    if (duplicates.length > 0) {
      toast.error("Los nombres de atributos deben ser únicos")
      return
    }

    // Verificar si el nombre ya existe
    const existingElement = elementsManager.elements.find(
      el => el.name.toLowerCase() === newName.trim().toLowerCase()
    )

    if (existingElement) {
      toast.error(`Ya existe un elemento con el nombre "${newName}"`)
      return
    }

    elementsManager.addElement({
      name: newName.trim(),
      attributes: newAttributes.map(attr => ({
        name: attr.name.trim(),
        type: attr.type
      }))
    })

    toast.success("Elemento creado correctamente")
    setIsCreating(false)
    setNewName("")
    setNewAttributes([])
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewName("")
    setNewAttributes([])
  }

  const handleDelete = () => {
    if (!deleteId) return
    
    elementsManager.removeElement(deleteId)
    toast.success("Elemento eliminado correctamente")
    setDeleteId(null)
  }

  const addAttribute = (isEditing: boolean = false) => {
    const newAttr = { name: "", type: "categorico" as const }
    if (isEditing) {
      setEditAttributes(prev => [...prev, newAttr])
    } else {
      setNewAttributes(prev => [...prev, newAttr])
    }
  }

  const updateAttribute = (index: number, field: keyof ElementAttributes, value: any, isEditing: boolean = false) => {
    if (isEditing) {
      setEditAttributes(prev => prev.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      ))
    } else {
      setNewAttributes(prev => prev.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      ))
    }
  }

  const removeAttribute = (index: number, isEditing: boolean = false) => {
    if (isEditing) {
      if (editAttributes.length > 1) {
        setEditAttributes(prev => prev.filter((_, i) => i !== index))
      }
    } else {
      if (newAttributes.length > 1) {
        setNewAttributes(prev => prev.filter((_, i) => i !== index))
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "string": return "bg-blue-100 text-blue-800 border-blue-200"
      case "number": return "bg-green-100 text-green-800 border-green-200"
      case "boolean": return "bg-purple-100 text-purple-800 border-purple-200"
      case "date": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "string": return "Texto"
      case "number": return "Número"
      case "boolean": return "Booleano"
      case "date": return "Fecha"
      default: return type
    }
  }

  const renderAttributesEditor = (attributes: ElementAttributes[], isEditing: boolean = false) => (
    <div className="space-y-2 pl-4 border-l-2 border-muted">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Atributos</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addAttribute(isEditing)}
          className="h-8 px-2"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      {attributes.map((attr, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="nombre"
            value={attr.name}
            onChange={(e) => updateAttribute(index, "name", e.target.value, isEditing)}
            className="h-8 text-xs"
          />
          <Select
            value={attr.type}
            onValueChange={(value: any) => updateAttribute(index, "type", value, isEditing)}
          >
            <SelectTrigger className="h-8 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="categorico">Categóricos</SelectItem>
              <SelectItem value="numerico">Numérico</SelectItem>
              <SelectItem value="booleano">Booleano</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeAttribute(index, isEditing)}
            disabled={attributes.length <= 1}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Gestión de Elementos</DialogTitle>
            <DialogDescription>
              Administra todos los elementos y sus atributos disponibles en el sistema. 
              Total: {elementsManager.elements.length} elementos
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Nombre</TableHead>
                      <TableHead className="w-[30%]">Atributos</TableHead>
                      <TableHead className="w-[15%]">ID</TableHead>
                      <TableHead className="w-[15%] text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Fila para crear nuevo elemento */}
                    {isCreating && (
                      <>
                        <TableRow className="bg-muted/50">
                          <TableCell>
                            <Input
                              placeholder="Nombre del elemento"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {newAttributes.length} atributos
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {newName ? newName.toLowerCase().replace(/\s+/g, "_") : "auto-generado"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCreateNew}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelCreate}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={4}>
                            {renderAttributesEditor(newAttributes, false)}
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Elementos existentes */}
                    {elementsManager.elements.map((element) => (
                      <>
                        <TableRow key={element.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(element.id)}
                                className="h-6 w-6 p-0"
                              >
                                {expandedRows.has(element.id) ? 
                                  <ChevronDown className="h-3 w-3" /> : 
                                  <ChevronRight className="h-3 w-3" />
                                }
                              </Button>
                              {editingId === element.id ? (
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="h-8"
                                />
                              ) : (
                                <span className="font-medium">{element.name}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {element.attributes.slice(0, 3).map((attr, index) => (
                                <Badge key={index} className={`text-xs ${getTypeColor(attr.type)}`}>
                                  {attr.name}
                                </Badge>
                              ))}
                              {element.attributes.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{element.attributes.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm font-mono">
                            {element.id}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingId === element.id ? (
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleSaveEdit}
                                  className="h-8 w-8 p-0"
                                >
                                  <Save className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleStartEdit(element)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setDeleteId(element.id)}
                                  className="h-8 w-8 p-0"
                                  disabled={element.id === "usuarios" || element.id === "productos" || element.id === "pedidos"}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        {/* Fila expandida con atributos */}
                        {(expandedRows.has(element.id) || editingId === element.id) && (
                          <TableRow className="bg-muted/20">
                            <TableCell colSpan={4}>
                              {editingId === element.id ? 
                                renderAttributesEditor(editAttributes, true) :
                                (
                                  <div className="pl-8 space-y-2">
                                    <Label className="text-sm font-medium">Atributos ({element.attributes.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                      {element.attributes.map((attr, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                                          <span className="text-sm font-medium">{attr.name}</span>
                                          <Badge className={`text-xs ${getTypeColor(attr.type)}`}>
                                            {getTypeLabel(attr.type)}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              }
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}

                    {/* Fila vacía si no hay elementos */}
                    {elementsManager.elements.length === 0 && !isCreating && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No hay elementos creados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Footer con botón para agregar */}
          <div className="flex justify-between items-center pt-4 border-t">
            
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el elemento 
              "{elementsManager.elements.find(el => el.id === deleteId)?.name}" y todos sus atributos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}