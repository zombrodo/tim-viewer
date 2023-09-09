import { PropsWithChildren, DragEvent } from "react";

export interface FileDropZoneProps {
  onFileDrop(files: FileList): void;
  onDragOver(): void;
  onDragEnd(): void;
}

function preventDragDefaults<T extends Function>(fn: T) {
  return (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    fn(event);
  };
}

export default function FileDropZone({
  onFileDrop,
  onDragOver: onDragEnter,
  onDragEnd: onDragExit,
  children,
}: PropsWithChildren<FileDropZoneProps>) {
  const onDrop = (event: DragEvent) => {
    const data = event.dataTransfer?.files;
    if (data) {
      onFileDrop(data);
    }

    onDragExit()
  };

  return (
    <div
      className="w-full h-full"
      onDragOver={preventDragDefaults(onDragEnter)}
      onDragEnd={preventDragDefaults(onDragExit)}
      onDrop={preventDragDefaults(onDrop)}
    >
      {children}
    </div>
  );
}
