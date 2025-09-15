import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addElement as addElementAction,
  updateElement as updateElementAction,
  removeElement as removeElementAction,
} from "@/store/elementsSlice";

export interface ElementAttributes {
  name: string;
  type: "categorico" | "numerico" | "booleano";
}

export interface Element {
  id: string;
  name: string;
  attributes: ElementAttributes[];
}

export function useElements() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.elements.items);

  const elements = useMemo(() => Object.values(items), [items]);

  const addElement = useCallback((element: Omit<Element, "id">) => {
    const newElement: Element = {
      ...element,
      id: element.name.toLowerCase().replace(/\s+/g, "_"),
    };
    dispatch(addElementAction(newElement));
    return newElement;
  }, [dispatch]);

  const removeElement = useCallback((id: string) => {
    dispatch(removeElementAction(id));
  }, [dispatch]);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    dispatch(updateElementAction({ id, changes: updates }));
  }, [dispatch]);

  const getElementById = useCallback(
    (id: string) => {
      return items[id];
    },
    [items]
  );

  return {
    elements,
    addElement,
    removeElement,
    updateElement,
    getElementById,
  };
}
