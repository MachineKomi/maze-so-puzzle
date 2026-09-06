/** One composition on short landscape screens. Layout units are independent of
 * physical pixels; the browser scales the complete stage, including its dialogs. */
export function stageFit(width: number, height: number, phoneMode?: boolean) {
  const w = Number.isFinite(width) ? Math.max(1, width) : 1;
  const h = Number.isFinite(height) ? Math.max(1, height) : 1;
  const phone = phoneMode ?? (w > h && h < 450);
  const scale = phone ? h / 720 : 1;
  return { width: w / scale, height: h / scale, scale, phone };
}

/** Pointer coordinates and DOM rectangles are physical, even in a fitted stage. */
export function physicalContentRect(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const sx = rect.width / Math.max(1, element.offsetWidth);
  const sy = rect.height / Math.max(1, element.offsetHeight);
  return { left: rect.left + element.clientLeft * sx, top: rect.top + element.clientTop * sy,
    width: element.clientWidth * sx, height: element.clientHeight * sy };
}
