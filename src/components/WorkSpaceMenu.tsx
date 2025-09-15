// components/WorkSpaceMenu.tsx
import { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ElementDialog } from "./ElementDialog";
import type { useElements } from "@/hooks/useElements";
import { ElementsTableDialog } from "./ElementsTableDialog";

interface WorkSpaceMenuProps {
  addNode: (label: string) => void;
  elementsManager: ReturnType<typeof useElements>;
}

export function WorkSpaceMenu({
  addNode,
  elementsManager,
}: WorkSpaceMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);

  return (
    <>
      <Menubar className="absolute top-2 left-2 z-50">
        {/* File menu */}
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Generator <MenubarShortcut>⌘G</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Queue <MenubarShortcut>⌘Q</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Selector <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>Close Project</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Edit menu */}
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* View menu */}
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Elements menu */}
        <MenubarMenu>
          <MenubarTrigger>Elements</MenubarTrigger>
          <MenubarContent>
            <MenubarItem inset onClick={() => setIsDialogOpen(true)}>
              Create
            </MenubarItem>
            <MenubarItem inset>Update</MenubarItem>
            <MenubarItem inset onClick={() => setIsTableOpen(true)}>
              View
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Nodes submenu */}
        <MenubarMenu>
          <MenubarTrigger>Nodes</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Add Node</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => addNode("generador")}>
                  Generador
                </MenubarItem>
                <MenubarItem onClick={() => addNode("fila")}>Fila</MenubarItem>
                <MenubarItem onClick={() => addNode("seleccionador")}>
                  Seleccionador
                </MenubarItem>
                <MenubarItem onClick={() => addNode("transportador")}>
                  Transportador
                </MenubarItem>
                <MenubarItem onClick={() => addNode("salida")}>
                  Salida
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Modal de creación */}
      <ElementDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        elementsManager={elementsManager}
      />
      <ElementsTableDialog
        open={isTableOpen}
        onClose={() => setIsTableOpen(false)}
        elementsManager={elementsManager}
      />
    </>
  );
}
