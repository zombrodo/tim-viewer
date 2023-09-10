import { TimImage, parse } from "@zombrodo/tim-parser";
import { ColourWithAlpha } from "@zombrodo/tim-parser/dist/types";
import { TimFile } from "../contexts/FileContext";

export function determineWidth(data: TimImage) {
  if (data.flags.pmode === 0) {
    return data.pixels.w * 4;
  }

  if (data.flags.pmode === 1) {
    return data.pixels.w * 2;
  }

  return data.pixels.w;
}

async function parseFile(file: File) {
  const buffer = await file.arrayBuffer();
  return parse(buffer);
}

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
  return 255;
}

async function generateClutImageData(image: TimImage) {
  if (image.clut) {
    const clut = image.clut.clut.map((rgb) => ({
      r: convertColour(rgb.r),
      g: convertColour(rgb.g),
      b: convertColour(rgb.b),
      a: determineAlpha(rgb),
    }));

    const d = image.pixels.data.flatMap((pixel) =>
      Object.values(clut[pixel as number])
    );

    return await createImageBitmap(
      new ImageData(
        new Uint8ClampedArray(d),
        determineWidth(image),
        image.pixels.h
      )
    );
  }

  return new ImageBitmap();
}

async function generateBitmap(image: TimImage) {
  if (image.flags.cf) {
    return await generateClutImageData(image);
  }

  return new ImageBitmap();
}

export async function processFile(file: File) {
  const image = await parseFile(file);
  const bitmap = await generateBitmap(image);

  return {
    file,
    data: image,
    bitmap,
  };
}

export function onFileUpload(cb: (files: TimFile[]) => void) {
  return (files: FileList | null) => {
    if (files) {
      Promise.all([...files].map(processFile)).then((data) => {
        cb(data);
      });
    }
  };
}
