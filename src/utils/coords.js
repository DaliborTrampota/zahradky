/**
 * Convert a pixel click position to percent (0-100) relative to a container element.
 * The SVG overlay uses viewBox="0 0 100 100" so these values map directly to SVG coords.
 */
export function toPercent(pixelX, pixelY, containerRect) {
  return {
    x: ((pixelX - containerRect.left) / containerRect.width) * 100,
    y: ((pixelY - containerRect.top) / containerRect.height) * 100,
  }
}
