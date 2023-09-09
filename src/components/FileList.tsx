import { PropsWithChildren } from "react";
import { TimFile } from "../contexts/FileContext";
import { filesize } from "filesize";
import { determineWidth } from "../utils/tim";

interface FileListItemProps {
  file: TimFile;
  selected: boolean;
  onSelect(): void;
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

interface FileAttributeProps {
  title: string;
}

function FileAttribute({
  title,
  children,
}: PropsWithChildren<FileAttributeProps>) {
  return (
    <li className="text-sm">
      <span className="text-zinc-300">{title}:</span> {children}
    </li>
  );
}

function FileListItem({ file, onSelect, selected }: FileListItemProps) {
  return (
    <div
      className={`p-2 w-full border-b-2 border-slate-400 cursor-pointer hover:bg-slate-700 ${
        selected ? "bg-slate-600" : ""
      }`}
      onClick={onSelect}
    >
      <h3 className="text-xl leading-relaxed">{file.file.name}</h3>
      <ul>
      <FileAttribute title="Has CLUT?">
          {file.data.flags.cf === 1 ? "Yes" : "No"}
        </FileAttribute>
        <FileAttribute title="Pixel Mode">
          {pmode(file.data.flags.pmode)}
        </FileAttribute>
        <FileAttribute title="Width">
          {`${determineWidth(file.data)}px`}
        </FileAttribute>
        <FileAttribute title="Height">
          {`${file.data.pixels.h}px`}
        </FileAttribute>
        <FileAttribute title="Size">
          {filesize(file.file.size)}
        </FileAttribute>
      </ul>
    </div>
  );
}

interface FileListProps {
  files: TimFile[];
  selected: number;
  onItemSelect(index: number): void;
}

export default function FileList({
  files,
  selected,
  onItemSelect,
}: FileListProps) {
  return (
    <div className="flex flex-col w-full">
      {files.map((f, i) => (
        <FileListItem
          file={f}
          key={f.file.name}
          onSelect={() => onItemSelect(i)}
          selected={selected === i}
        />
      ))}
    </div>
  );
}
