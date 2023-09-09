import FileContextProvider from "./contexts/FileContext";
import Sidebar from "./sections/Sidebar";
import Workspace from "./sections/Workspace";

function App() {
  return (
    <FileContextProvider>
      <div className="w-full h-full grid grid-cols-12">
        <div className="bg-slate-800 col-span-2 p-4 flex flex-col items-center text-white max-h-screen">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl">TIM File Viewer</h1>
          </div>
          <Sidebar />
        </div>
        <div className="col-span-10">
          <Workspace />
        </div>
      </div>
    </FileContextProvider>
  );
}

export default App;
