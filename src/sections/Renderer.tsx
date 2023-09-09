import { TimImage } from "@zombrodo/tim-parser";
import { TimFile } from "../contexts/FileContext";
import { useEffect, useRef } from "react";
import { renderClut } from "../utils/render";
import { determineWidth } from "../utils/tim";

interface RendererProps {
  file: TimFile;
}

// function renderPixels(
//   context: CanvasRenderingContext2D,
//   data: TimImage,
//   width: number,
//   height: number
// ) {
//   // NYI
// }

function renderImage(
  context: CanvasRenderingContext2D,
  data: TimImage,
  width: number,
  height: number
) {
  // First, lets clear what we have.
  context.clearRect(0, 0, width, height);
  // Next, we have to work out how we're drawing.
  if (data.flags.cf) {
    renderClut(context, data, width, 2);
  }

  // renderPixels(context, data, width, height);
}

export default function Renderer({ file }: RendererProps) {
  const { data } = file;
  const width = determineWidth(data);
  const height = data.pixels.h;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(0, 0, 1024, 1024);
        renderImage(context, data, width, height);
      }
    }
  }, [canvasRef.current, data]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <canvas width={width * 2} height={height * 2} ref={canvasRef}></canvas>
    </div>
  );
}
