import { useLayoutEffect, useRef, useState, useSyncExternalStore, type ImgHTMLAttributes } from "react";
import type { RuntimeArtUsage } from "../artCatalog";
import { resolveUiArt, selectArtRendition, type UiArt } from "./art";

interface CatalogueImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  readonly art?: UiArt | string;
  readonly usage?: RuntimeArtUsage;
  readonly displayPx?: number;
  readonly fallbackSrc?: string;
}
// One observer for all catalogue images, not one per tile. Only size changes
// publish; scrolling/travel never reads layout or changes rendition state.
const sizeListeners = new WeakMap<Element, (size: number) => void>();
let sizeObserver: ResizeObserver | undefined;
function observeImageSize(element: Element, listener: (size: number) => void) {
  sizeObserver ??= new ResizeObserver(entries => {
    for (const entry of entries) {
      const size = Math.max(entry.contentRect.width, entry.contentRect.height);
      if (size > 0) sizeListeners.get(entry.target)?.(Math.ceil(size));
    }
  });
  sizeListeners.set(element, listener); sizeObserver.observe(element);
  return () => { sizeObserver?.unobserve(element); sizeListeners.delete(element); };
}
// Shared native signals cover both CSS resizing and a display-density change
// with unchanged CSS dimensions. No timer, polling or per-image event listeners.
const dprListeners = new Set<() => void>();
let dprQuery: MediaQueryList | undefined;
let dprObserver: ResizeObserver | undefined;
const readDpr = () => typeof window === "undefined" ? 1 : window.devicePixelRatio;
const serverDpr = () => 1;
let observedDpr = readDpr();
function watchDpr() {
  dprQuery?.removeEventListener("change", publishDpr);
  dprQuery = undefined;
  if (dprListeners.size && typeof window !== "undefined" && typeof window.matchMedia === "function") {
    dprQuery = window.matchMedia(`(resolution: ${readDpr()}dppx)`);
    dprQuery.addEventListener("change", publishDpr);
  }
}
function publishDpr() {
  const next = readDpr();
  if (next === observedDpr) return;
  observedDpr = next;
  watchDpr();
  for (const listener of dprListeners) listener();
}
function subscribeDpr(listener: () => void) {
  dprListeners.add(listener);
  if (dprListeners.size === 1) {
    observedDpr = readDpr();
    watchDpr();
    window.addEventListener("resize", publishDpr);
    window.addEventListener("pageshow", publishDpr);
    if (typeof ResizeObserver !== "undefined") {
      dprObserver = new ResizeObserver(publishDpr);
      // A content-box observer alone misses density-only changes. Older
      // engines retain the shared resize + resolution-query fallbacks.
      try { dprObserver.observe(document.documentElement, { box: "device-pixel-content-box" }); }
      catch { dprObserver.observe(document.documentElement); }
    }
  }
  return () => {
    dprListeners.delete(listener);
    if (!dprListeners.size) {
      watchDpr();
      window.removeEventListener("resize", publishDpr);
      window.removeEventListener("pageshow", publishDpr);
      dprObserver?.disconnect(); dprObserver = undefined;
    }
  };
}
/** Single image boundary. Legacy semantic URL projections resolve back to records. */
export function CatalogueImage({ art: identity, src, fallbackSrc, usage = "optical", displayPx = 48, alt = "", onError, ...props }: CatalogueImageProps) {
  const element = useRef<HTMLImageElement>(null);
  const [renderedSize, setRenderedSize] = useState(displayPx);
  const dpr = useSyncExternalStore(subscribeDpr, readDpr, serverDpr);
  const art = resolveUiArt(identity ?? src ?? "");
  const selected = art ? selectArtRendition(art, usage, renderedSize, dpr) : undefined;
  const [failed, setFailed] = useState<readonly string[]>([]);
  const requested = selected?.src ?? src;
  const absolute = (url: string) => typeof document === "undefined" ? url : new URL(url, document.baseURI).href;
  const resolved = [requested, art?.src, fallbackSrc].find(candidate => candidate && !failed.includes(absolute(candidate)));
  // currentSrc can be a compact srcSet candidate rather than the src attribute.
  // After any responsive failure use bounded explicit URLs, never the failed set.
  const responsive = failed.length === 0;
  useLayoutEffect(() => {
    if (!element.current || typeof ResizeObserver === "undefined") return;
    // A capped optical fallback must not shrink its own rendition demand and
    // oscillate back into a large presentation. The authored frame still
    // follows real layout changes; field/optical images observe themselves.
    const target = usage === "presentation"
      ? element.current.closest('[data-art-anchor="presentation"]') ?? element.current
      : element.current;
    return observeImageSize(target, setRenderedSize);
  }, [resolved, usage]);
  const fallback = resolved !== requested || selected?.fallback;
  const geometry = resolved === selected?.src ? selected?.geometry ?? art?.geometry : art?.geometry;
  const opticalFallback = usage === "presentation" && resolved !== requested;
  const shared = { "data-art-id": art?.id ?? "unknown", "data-art-role": opticalFallback ? "optical" : selected?.role ?? "fallback", "data-art-fallback": fallback || undefined,
    "data-art-geometry": geometry?.class, "data-art-resolution-sufficient": !opticalFallback && selected?.sufficientResolution, "data-art-safe-inset": geometry?.safeInset.join(","), "data-art-visible-bounds": geometry?.visibleBounds.join(",") };
  if (!resolved) return <span className={`art-fallback ${props.className ?? ""}`} style={props.style} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={props["aria-hidden"] ?? (!alt || undefined)} {...shared}>{alt || "◇"}</span>;
  return <img {...props} {...shared} srcSet={responsive ? props.srcSet : undefined} sizes={responsive ? props.sizes : undefined} ref={element} width={props.width ?? art?.width} height={props.height ?? art?.height} src={resolved} alt={alt} decoding={props.decoding ?? "async"} draggable={props.draggable ?? false}
    style={{ objectFit: art?.fit ?? (geometry?.class === "background" ? "cover" : "contain"), objectPosition: art?.focalPoint ? `${art.focalPoint[0]*100}% ${art.focalPoint[1]*100}%` : undefined, ...props.style, ...(opticalFallback ? {maxWidth:64,maxHeight:64} : {}) }}
    onError={(event) => {
      const failedUrl = event.currentTarget.currentSrc || event.currentTarget.src;
      setFailed(previous => previous.includes(failedUrl) ? previous : [...previous, failedUrl]);
      onError?.(event);
    }} />;
}

export function PresentationArt({ art, label, compact = false }: { art: string | UiArt; label: string; compact?: boolean }) {
  const record = resolveUiArt(art);
  const available = record?.variants?.some(variant => variant.usage === "presentation") ?? false;
  // Match dialogs.css's initial 128px compact box before the first image request.
  // ResizeObserver remains the measured authority for subsequent size changes.
  const initialSize = compact || (typeof window !== "undefined" && window.matchMedia("(max-height: 450px)").matches) ? 128 : 200;
  return <div className={`presentation-art${compact ? " compact-presentation" : ""}${available ? "" : " presentation-unavailable"}`} data-art-anchor="presentation" data-presentation-available={available}>
    <CatalogueImage art={art} usage={available ? "presentation" : "optical"} displayPx={available ? initialSize : 64} alt={label} />
    {!available && <span className="presentation-fallback-label">{label}</span>}
  </div>;
}
