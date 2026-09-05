import { Children, isValidElement, useId, useLayoutEffect, useRef, type ReactNode, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type DialogVariant = "standard" | "blocker" | "hint" | "story" | "celebration";
export interface DialogShellProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose?: () => void;
  readonly returnFocus?: HTMLElement | null;
  readonly variant?: DialogVariant;
  readonly footer?: ReactNode;
}
const FOCUSABLE = "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
const stack: HTMLElement[] = [];

export function DialogShell({ title, children, onClose, returnFocus, variant = "standard", footer }: DialogShellProps) {
  const ref = useRef<HTMLElement>(null);
  // Capture before this commit makes the invoker's parent inert (which blurs it).
  const invoker = useRef(returnFocus ?? (typeof document !== "undefined" && document.activeElement instanceof HTMLElement ? document.activeElement : null));
  const titleId = useId();
  const nodes = Children.toArray(children);
  const last = nodes.at(-1);
  const isAction = isValidElement<{ className?: string }>(last) && (last.type === "button" || last.props.className === "modal-actions");
  const actions = footer ?? (isAction ? last : null);
  const body = footer || !isAction ? nodes : nodes.slice(0, -1);
  useLayoutEffect(() => {
    const dialog = ref.current!;
    const previous = invoker.current;
    const lower = stack.at(-1);
    if (lower) lower.inert = true;
    stack.push(dialog);
    const first = dialog.querySelector<HTMLElement>("[data-dialog-initial]")
      ?? dialog.querySelector<HTMLElement>(".dialog-footer .primary-button")
      ?? dialog.querySelector<HTMLElement>(".dialog-body button:not([disabled])");
    (first ?? dialog.querySelector<HTMLElement>("h2") ?? dialog).focus();
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
  const keyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (stack.at(-1) !== ref.current) return;
    if (event.key === "Escape") {
      event.preventDefault(); event.stopPropagation(); onClose?.(); return;
    }
    if (event.key !== "Tab") return;
    const controls = [...ref.current!.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => item.getClientRects().length && !item.closest("[hidden], [inert]"));
    const first = controls[0]; const lastControl = controls.at(-1);
    const active = document.activeElement;
    if (!first || !lastControl) { event.preventDefault(); ref.current?.focus(); }
    else if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) { event.preventDefault(); lastControl.focus(); }
    else if (!event.shiftKey && (active === lastControl || !controls.includes(active as HTMLElement))) { event.preventDefault(); first.focus(); }
  };
  return createPortal(<div className="modal-backdrop" role="presentation">
    <section ref={ref} className={`modal-card dialog-${variant}`} data-focus-group="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={keyDown}>
      <header className="dialog-header"><h2 id={titleId} tabIndex={-1}>{title}</h2>
        {onClose && <button className="modal-close" data-focus-id="dialog-close" onClick={onClose} aria-label={`Close ${title}`}><span aria-hidden="true">×</span></button>}
      </header>
      <div className="dialog-body" data-scroll-region="dialog-body" role="region" aria-label={`${title} content`} tabIndex={0}>{body}</div>
      {actions && <footer className="dialog-footer">{actions}</footer>}
    </section>
  </div>, document.body);
}
