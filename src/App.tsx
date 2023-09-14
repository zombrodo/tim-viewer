import FileContextProvider, {
  FileAction,
  useFileState,
} from "./contexts/FileContext";
import Workspace from "./sections/Workspace";
import FileDropZone from "./components/FileDropZone";
import { PropsWithChildren } from "react";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import { onFileUpload } from "./utils/tim";
import EditorSettingsProvider from "./contexts/EditorSettingsContext";

function FileUploadContainer({ children }: PropsWithChildren) {
  const { dispatch } = useFileState();
  const onUpload = onFileUpload((files) => {
    dispatch({ type: FileAction.Add, payload: files });
  });

  return <FileDropZone onFileDrop={onUpload}>{children}</FileDropZone>;
}

function App() {
  return (
    <EditorSettingsProvider>
      <FileContextProvider>
        <FileUploadContainer>
          <div className="flex justify-center p-8 w-full h-full">
            <div className="w-2/3 h-full flex flex-col justify-between">
              <Header />
              <Workspace />
              <Footer />
            </div>
          </div>
        </FileUploadContainer>
      </FileContextProvider>
    </EditorSettingsProvider>
  );
}

export default App;
