import { parse } from "@zombrodo/tim-parser";
import FileContextProvider, {
  FileAction,
  useFileState,
} from "./contexts/FileContext";
import Sidebar from "./sections/Sidebar";
import Workspace from "./sections/Workspace";
import FileDropZone from "./components/FileDropZone";
import { PropsWithChildren } from "react";

async function parseFile(file: File) {
  const buffer = await file.arrayBuffer();
  const data = parse(buffer);
  return {
    file,
    data,
  };
}

function FileUploadContainer({ children }: PropsWithChildren) {
  const { dispatch } = useFileState();
  const onFileUpload = (files: FileList | null) => {
    if (files) {
      Promise.all([...files].map(parseFile)).then((data) =>
        dispatch({
          type: FileAction.Add,
          payload: data,
        })
      );
    }
  };
  return <FileDropZone onFileDrop={onFileUpload}>{children}</FileDropZone>;
}

function App() {
  return (
    <FileContextProvider>
      <FileUploadContainer>
        <div className="w-full h-full grid grid-cols-12">
          <div className="bg-slate-800 col-span-2 p-4 flex flex-col items-center text-white max-h-screen">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl">TIM File Viewer</h1>
              <a
                href="https://github.com/zombrodo"
                className="underline text-slate-400 hover:text-slate-200 font-xs"
              >
                Made by Zombrodo
              </a>
            </div>
            <Sidebar />
          </div>
          <div className="col-span-10">
            <Workspace />
          </div>
        </div>
      </FileUploadContainer>
    </FileContextProvider>
  );
}

export default App;
