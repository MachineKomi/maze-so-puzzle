import { Children, isValidElement, useId, useLayoutEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type DialogVariant = "standard" | "blocker" | "hint" | "story" | "celebration";
export interface DialogShellProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose?: () => void;
  readonly returnFocus?: HTMLElement | null;
  readonly variant?: DialogVariant;
  readonly footer?: ReactNode;
  readonly showClose?: boolean;
  readonly onAdvance?: () => void;
  readonly advanceOnBodyClick?: boolean;
}
const FOCUSABLE = "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
const stack: HTMLElement[] = [];
const initialControl = (dialog: HTMLElement) => dialog.querySelector<HTMLElement>("[data-dialog-initial]")
  ?? dialog.querySelector<HTMLElement>(".dialog-footer .primary-button")
  ?? dialog.querySelector<HTMLElement>(".dialog-body button:not([disabled])")
  ?? dialog.querySelector<HTMLElement>("h2") ?? dialog;

export function DialogShell({ title, children, onClose, returnFocus, variant = "standard", footer, showClose, onAdvance, advanceOnBodyClick = false }: DialogShellProps) {
  const ref = useRef<HTMLElement>(null);
  const [portrait, setPortrait] = useState(() => window.matchMedia("(orientation: portrait)").matches);
  const portraitFocus = useRef<HTMLElement | null>(null);
  // Capture before this commit makes the invoker's parent inert (which blurs it).
  const invoker = useRef(returnFocus ?? (typeof document !== "undefined" && document.activeElement instanceof HTMLElement ? document.activeElement : null));
  const titleId = useId();
  const nodes = Children.toArray(children);
  const last = nodes.at(-1);
  const isAction = isValidElement<{ className?: string }>(last) && (last.type === "button" || last.props.className === "modal-actions");
  const actions = footer ?? (isAction ? last : null);
  const body = footer || !isAction ? nodes : nodes.slice(0, -1);
  useLayoutEffect(() => {
    const query = window.matchMedia("(orientation: portrait)");
    const update = () => {
      if (query.matches && document.activeElement instanceof HTMLElement && ref.current?.contains(document.activeElement)) {
        portraitFocus.current = document.activeElement;
      }
      setPortrait(query.matches);
    };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useLayoutEffect(() => {
    const dialog = ref.current!;
    const previous = invoker.current;
    const lower = stack.at(-1);
    if (lower) lower.inert = true;
    stack.push(dialog);
    if (!dialog.closest("[inert]")) initialControl(dialog).focus();
    return () => {
      stack.splice(stack.indexOf(dialog), 1);
      const remaining = stack.at(-1);
      if (remaining) remaining.inert = false;
      // React removes background inertness in the same commit; restore afterwards.
      queueMicrotask(() => {
        if (stack.length && stack.at(-1) !== remaining) return;
        const target = previous?.isConnected && !previous.closest("[inert]") ? previous
          : remaining ?? document.querySelector<HTMLElement>("[data-focus-id='maze-board'], .title-play-button, .front-door-play");
        target?.focus({ preventScroll: true });
      });
    };
  }, []); // Opening is a focus transaction; renders must not refocus a reader.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (portrait || !dialog || stack.at(-1) !== dialog) return;
    const target = portraitFocus.current;
    if (target?.isConnected && dialog.contains(target)) target.focus({ preventScroll: true });
    else if (!dialog.contains(document.activeElement)) initialControl(dialog).focus({ preventScroll: true });
    portraitFocus.current = null;
  }, [portrait]);
  const keyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (portrait) { event.preventDefault(); event.stopPropagation(); return; }
    if (stack.at(-1) !== ref.current) return;
    // A held confirmation must not activate the newly focused next story or
    // victory action after this dialog changes. Deliberate presses still work.
    if (event.key === "Enter" && event.repeat) {
      event.preventDefault(); event.stopPropagation(); return;
    }
    if (event.key === "Escape") {
      event.preventDefault(); event.stopPropagation(); onClose?.(); return;
    }
    if (event.key === "Enter" && !event.repeat && !(event.target as HTMLElement).closest("button,a,input,select,textarea")) {
      const primary=ref.current?.querySelector<HTMLButtonElement>(".dialog-footer .primary-button:not([disabled])");
      if(onAdvance || primary) { event.preventDefault(); event.stopPropagation(); if(onAdvance) onAdvance(); else primary?.click(); }
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...ref.current!.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => item.getClientRects().length && !item.closest("[hidden], [inert]"));
    const first = controls[0]; const lastControl = controls.at(-1);
    const active = document.activeElement;
    if (!first || !lastControl) { event.preventDefault(); ref.current?.focus(); }
    else if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) { event.preventDefault(); lastControl.focus(); }
    else if (!event.shiftKey && (active === lastControl || !controls.includes(active as HTMLElement))) { event.preventDefault(); first.focus(); }
  };
  return createPortal(<div className="modal-backdrop" role="presentation" inert={portrait || undefined} aria-hidden={portrait || undefined}>
    <section ref={ref} className={`modal-card dialog-${variant}`} data-focus-group="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={keyDown}
      onClick={event => {
        const selection = document.getSelection();
        const selectingText = selection && !selection.isCollapsed && selection.anchorNode && event.currentTarget.contains(selection.anchorNode);
        if (!portrait && advanceOnBodyClick && !selectingText && !(event.target as HTMLElement).closest("button,a,input,select,textarea")) onAdvance?.();
      }}>
      <header className="dialog-header"><h2 id={titleId} tabIndex={-1}>{title}</h2>
        {onClose && (showClose ?? !actions) && <button className="modal-close" data-focus-id="dialog-close" onClick={onClose} aria-label={`Close ${title}`}><span aria-hidden="true" /></button>}
      </header>
      <div className="dialog-body" data-scroll-region="dialog-body" role="region" aria-label={`${title} content`} tabIndex={0}>{body}</div>
      {actions && <footer className="dialog-footer">{actions}</footer>}
    </section>
  </div>, document.body);
}
