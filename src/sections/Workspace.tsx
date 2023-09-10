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
      <span className="font-bold">{title}</span>: {children}
    </p>
  );
}

function FileInfo() {
  const selectedFile = useSelectedFile();

  const onDarkModeSwitch = () => {
    const document = window.document;
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
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
    <div className="col-span-1 flex flex-col gap-2 p-2">
      <h2 className="text-orangered-400 font-bold text-xl">
        {selectedFile.file.name}
      </h2>
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
      <div className="flex flex-col gap-2">
        <button
          className="bg-orangered-400 hover:bg-orangered-200 p-2 rounded text-white text-sm"
          onClick={onDarkModeSwitch}
        >
          Toggle Light / Dark Mode
        </button>
        <button
          className="bg-orangered-400 hover:bg-orangered-200 p-2 rounded text-white text-sm"
          onClick={onSave}
        >
          Save as PNG
        </button>
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
        isSelected ? "bg-orangered-200" : "bg-burnt-200"
      } hover:bg-burnt-100 p-1`}
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
    <div className="col-span-2 p-2">
      <div className="flex flex-wrap gap-1">
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
    <div className="w-full h-full grid grid-cols-8 py-2">
      <FileInfo />
      <div className="col-span-5 flex flex-col items-center justify-center gap-4 p-4">
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
