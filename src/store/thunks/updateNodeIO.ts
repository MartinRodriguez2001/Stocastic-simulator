import { type AppDispatch } from "../store"
import { updateNodeIOWorkspace } from "../workspaceSlice";
import { updateNodeIOInNodeSlice } from "../nodeSlice";

export const updateNodeIOThunk =
  (id: string, inputs: string[], outputs: string[]) =>
  (dispatch: AppDispatch) => {
    // actualiza estado lógico
    dispatch(updateNodeIOInNodeSlice({ id, inputs, outputs }));
    // actualiza estado visual
    dispatch(updateNodeIOWorkspace({ id, inputs, outputs }));
  };
