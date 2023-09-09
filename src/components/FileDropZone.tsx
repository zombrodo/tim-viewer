import { PropsWithChildren, DragEvent } from "react";

export interface FileDropZoneProps {
  onFileDrop(files: FileList): void;
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
  children,
}: PropsWithChildren<FileDropZoneProps>) {
  const onDrop = (event: DragEvent) => {
    const data = event.dataTransfer?.files;
    if (data) {
      onFileDrop(data);
    }
  };

  return (
    <div
      id="file-drop-zone"
      className="w-full h-full bg-transparent"
      onDragOver={preventDragDefaults(() => null)}
      onDragEnd={preventDragDefaults(() => null)}
      onDrag={preventDragDefaults(() => null)}
      onDrop={preventDragDefaults(onDrop)}
    >
      {children}
    </div>
  );
}
