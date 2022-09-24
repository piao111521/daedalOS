import matrixConfig from "components/system/Desktop/Wallpapers/Matrix/config";
import { loadFiles } from "utils/functions";

export const libs = ["/System/Matrix/js/regl/main.js"];

declare global {
  interface Window {
    Matrix: (
      canvas: HTMLCanvasElement,
      config: typeof matrixConfig
    ) => Promise<void>;
  }
}

const Matrix = async (el?: HTMLElement | null): Promise<void> => {
  if (!el) return;

  const canvas = document.createElement("canvas");

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  el.appendChild(canvas);

  await loadFiles(libs, undefined, true, true);

  await window.Matrix?.(canvas, matrixConfig);
};

export default Matrix;
