import { configureStore } from '@reduxjs/toolkit'
import workspace from './workspaceSlice'
import elements from './elementsSlice'
import node from "./nodeSlice"

export const store = configureStore({
  reducer: {
    workspace,
    elements,
    node

  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
