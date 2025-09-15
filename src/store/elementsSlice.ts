import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ElementAttributes { name: string; type: "categorico" | "numerico" | "booleano" }
interface Element { id: string; name: string; attributes: ElementAttributes[] }

interface ElementsState { items: Record<string, Element> }
const initialState: ElementsState = { items: {} }

const elementsSlice = createSlice({
  name: 'elements',
  initialState,
  reducers: {
    addElement(state, action: PayloadAction<Element>) {
      state.items[action.payload.id] = action.payload
    },
    updateElement(state, action: PayloadAction<{id: string; changes: Partial<Element>}>) {
      const { id, changes } = action.payload
      state.items[id] = { ...state.items[id], ...changes }
    },
    removeElement(state, action: PayloadAction<string>) {
      delete state.items[action.payload]
    },
  },
})

export const { addElement, updateElement, removeElement } = elementsSlice.actions
export default elementsSlice.reducer
