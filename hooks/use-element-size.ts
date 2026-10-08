import { useEffect, useState } from "react";

/** Tracks an element's content size. */
export const useElementSize = (element: HTMLElement | null) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev?.width === width && prev?.height === height ? prev : { width, height }
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return size;
};
