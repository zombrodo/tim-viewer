import { useEditorSetting } from "../contexts/EditorSettingsContext";
import { TimFile } from "../contexts/FileContext";
import { useEffect, useRef } from "react";

interface RendererProps {
  file: TimFile;
}

export default function Renderer({ file }: RendererProps) {
  const darkMode = useEditorSetting("darkMode");
  const showBorder = useEditorSetting("showBorder");
  const { bitmap } = file;
  const scale = 2;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(0, 0, 1024, 1024);
        context.drawImage(
          bitmap,
          0,
          0,
          bitmap.width * scale,
          bitmap.height * scale
        );
      }
    }
  }, [canvasRef.current, bitmap]);

  return (
    <div className={`p-8 ${darkMode ? "bg-transparent" : "bg-burnt-50"} `}>
      <canvas
        className={`${showBorder ? "border-4 border-orangered-400" : ""}`}
        width={bitmap.width * scale}
        height={bitmap.height * scale}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
