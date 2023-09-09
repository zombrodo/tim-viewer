import { TimImage } from "@zombrodo/tim-parser";

export function determineWidth(data: TimImage) {
  if (data.flags.pmode === 0) {
    return data.pixels.w * 4;
  }

  if (data.flags.pmode === 1) {
    return data.pixels.w * 2;
  }

  return data.pixels.w;
}