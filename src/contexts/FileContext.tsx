import { TimImage } from "@zombrodo/tim-parser";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export interface TimFile {
  file: File;
  data: TimImage;
}

interface FileState {
  selected: number;
  files: TimFile[];
}

interface FileStateContext {
  state: FileState;
  dispatch(action: Action): void;
}

const initialState: FileState = {
  files: [],
  selected: 0,
};

export const FileContext = createContext<FileStateContext>({
  state: initialState,
  dispatch: () =>
    console.warn("A call was made to the FileContext outside of the provider"),
});

export enum FileAction {
  Add,
  Select,
}

type Action =
  | { type: FileAction.Add; payload: TimFile[] }
  | { type: FileAction.Select; payload: number };

function reducer(state: FileState, action: Action) {
  switch (action.type) {
    case FileAction.Add:
      return { ...state, files: [...state.files, ...action.payload] };
    case FileAction.Select:
      return { ...state, selected: action.payload };
  }
}

export function useFileState() {
  const context = useContext(FileContext);
  return context;
}

export default function FileContextProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}
