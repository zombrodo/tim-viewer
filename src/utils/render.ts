import { TimImage } from "@zombrodo/tim-parser";
import { ColourWithAlpha } from "@zombrodo/tim-parser/dist/types";

function convertColour(n: number) {
  return (n * 255) / 31;
}

/**
 * Determines the alpha per the wild rules defined in the PSX Dev spec.
 * Read section 3-4 of the File Formats guide from 2000.
 */
function determineAlpha(rgb: ColourWithAlpha) {
  const { r, g, b, stp } = rgb;
  if (r === 0 && g === 0 && b === 0) {
    if (stp === 0) {
      return 0;
    }
    return 255;
  }

  if (stp === 0) {
    return 255;
  }

  // PSX defines "semi transparent", we'll guess it's just halfway up.
  return 128;
}

export function renderClut(
  context: CanvasRenderingContext2D,
  data: TimImage,
  width: number,
  scale: number
) {
  context.scale(scale, scale);
  if (data.clut) {
    const clut = data.clut.clut.map((rgb) => ({
      r: convertColour(rgb.r),
      g: convertColour(rgb.g),
      b: convertColour(rgb.b),
      a: determineAlpha(rgb),
    }));
    for (let i = 0; i < data.pixels.data.length; i++) {
      const x = i % width;
      const y = Math.trunc(i / width);
      // TODO: We could fix the types in the library to say if the cf flag is 1
      // then the pixel list will be number.
      const colour = clut[data.pixels.data[i] as number];
      context.fillStyle = `rgba(${colour.r},${colour.g},${colour.b},${colour.a})`;
      context.fillRect(x, y, 1, 1);
    }
  }
  context.resetTransform();
}
