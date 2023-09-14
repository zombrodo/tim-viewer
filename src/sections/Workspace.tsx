import FileUpload from "./FileUpload";
import {
  FileAction,
  TimFile,
  useFileState,
  useSelectedFile,
} from "../contexts/FileContext";
import Renderer from "./Renderer";
import { PropsWithChildren, useEffect, useRef } from "react";
import { determineWidth } from "../utils/tim";
import { filesize } from "filesize";
import {
  EditorSettingsAction,
  useEditorSettings,
} from "../contexts/EditorSettingsContext";

interface FileAttributeProps {
  title: string;
}

function pmode(mode: number) {
  switch (mode) {
    case 0:
      return "4-bit CLUT";
    case 1:
      return "8-bit CLUT";
    case 2:
      return "15-bit Colour";
    case 3:
      return "24-bit Colour";
    case 4:
      return "Mixed";
  }
}

function FileAttribute({
  title,
  children,
}: PropsWithChildren<FileAttributeProps>) {
  return (
    <p className="text-sm">
      <span className="font-bold dark:text-burnt-100">{title}</span>: {children}
    </p>
  );
}

function FileInfo() {
  const selectedFile = useSelectedFile();
  const { state, dispatch } = useEditorSettings();

  const onDarkModeToggle = () => {
    dispatch({
      type: EditorSettingsAction.SetDarkMode,
      payload: !state.darkMode,
    });
  };

  const onBorderToggle = () => {
    dispatch({
      type: EditorSettingsAction.SetShowBorder,
      payload: !state.showBorder,
    });
  };

  const onSave = () => {
    const { file, bitmap } = selectedFile;
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(bitmap, 0, 0);
    }

    const link = document.createElement("a");
    link.download = `${file.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-4 dark:bg-slate-800 bg-burnt-200 rounded gap-2">
      <div className="flex flex-col min-[1920px]:flex-row justify-between items-center gap-2">
        <h2 className="text-orangered-400 font-bold text-xl">
          {selectedFile.file.name}
        </h2>
        <div className="flex gap-2 flex-wrap">
          <FileAttribute title="Has CLUT?">
            {selectedFile.data.flags.cf === 1 ? "Yes" : "No"}
          </FileAttribute>
          <FileAttribute title="Pixel Mode">
            {pmode(selectedFile.data.flags.pmode)}
          </FileAttribute>
          <FileAttribute title="Width">
            {`${determineWidth(selectedFile.data)}px`}
          </FileAttribute>
          <FileAttribute title="Height">
            {`${selectedFile.data.pixels.h}px`}
          </FileAttribute>
          <FileAttribute title="Size">
            {filesize(selectedFile.file.size)}
          </FileAttribute>
          <FileAttribute title="Pixel DX">
            {selectedFile.data.pixels.dx}
          </FileAttribute>
          <FileAttribute title="Pixel DY">
            {selectedFile.data.pixels.dy}
          </FileAttribute>
          <FileAttribute title="CLUT DX">
            {selectedFile.data.clut?.dx}
          </FileAttribute>
          <FileAttribute title="CLUT DY">
            {selectedFile.data.clut?.dy}
          </FileAttribute>
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <button
            className="bg-orangered-400 hover:bg-orangered-200 p-2 rounded text-white text-sm"
            onClick={onSave}
          >
            Save as PNG
          </button>
          <button
            className="bg-orangered-400 hover:bg-orangered-200 p-2 rounded text-white text-sm"
            onClick={onBorderToggle}
          >
            {state.showBorder ? "Hide Border" : "Show Border"}
          </button>
          <button
            className="bg-orangered-400 hover:bg-orangered-200 p-2 rounded text-white text-sm"
            onClick={onDarkModeToggle}
          >
            {state.darkMode ? "Show Light Background" : "Show Dark Background"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FileThumbnailProps {
  file: TimFile;
  onSelect(): void;
  isSelected: boolean;
}

function FileThumbnail({ file, onSelect, isSelected }: FileThumbnailProps) {
  const { bitmap } = file;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(0, 0, 64, 64);
        context.imageSmoothingEnabled = false;
        context.drawImage(bitmap, 0, 0, 64, 64);
      }
    }
  }, [canvasRef.current, file]);

  return (
    <div
      className={`${
        isSelected
          ? "bg-orangered-200 dark:bg-slate-600"
          : "bg-burnt-200 dark:bg-slate-500"
      } hover:bg-burnt-100 dark:hover:bg-slate-100 p-1`}
      onClick={onSelect}
    >
      <canvas width={64} height={64} ref={canvasRef}></canvas>
    </div>
  );
}

function FilesList() {
  const { state, dispatch } = useFileState();
  const files = state.files;
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="p-4 dark:bg-slate-800 rounded flex justify-center items-start">
      <div className="flex flex-wrap gap-1 flex-grow-0">
        {files.map((file, i) => (
          <FileThumbnail
            file={file}
            key={file.file.name}
            onSelect={() => dispatch({ type: FileAction.Select, payload: i })}
            isSelected={state.selected === i}
          />
        ))}
      </div>
    </div>
  );
}

function FileViewer() {
  const currentFile = useSelectedFile();

  return (
    <div className="w-full flex-grow flex flex-col justify-between py-2">
      <FileInfo />
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <Renderer file={currentFile} />
      </div>
      <FilesList />
    </div>
  );
}

export default function Workspace() {
  const { state } = useFileState();
  return state.files.length > 0 ? <FileViewer /> : <FileUpload />;
}
