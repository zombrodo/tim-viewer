import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export enum EditorSettingsAction {
  SetDarkMode,
  SetShowBorder,
}

type Action =
  | { type: EditorSettingsAction.SetDarkMode; payload: boolean }
  | { type: EditorSettingsAction.SetShowBorder; payload: boolean };

interface EditorSettings {
  darkMode: boolean;
  showBorder: boolean;
}

interface EditorSettingsContext {
  state: EditorSettings;
  dispatch(action: Action): void;
}

const initialState = {
  darkMode: true,
  showBorder: false,
};

const defaultState = {
  state: initialState,
  dispatch: () =>
    console.warn(
      "A call was made to the EditorSettingsContext outside of its provider."
    ),
};

export const EditorSettingsContext =
  createContext<EditorSettingsContext>(defaultState);

function reducer(state: EditorSettings, action: Action) {
  switch (action.type) {
    case EditorSettingsAction.SetDarkMode:
      return { ...state, darkMode: action.payload };
    case EditorSettingsAction.SetShowBorder:
      return { ...state, showBorder: action.payload };
  }
}

export function useEditorSettings() {
  return useContext(EditorSettingsContext);
}

export function useEditorSetting(setting: keyof EditorSettings) {
  const { state } = useContext(EditorSettingsContext);
  return state[setting];
}

export default function EditorSettingsProvider({
  children,
}: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorSettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorSettingsContext.Provider>
  );
}
