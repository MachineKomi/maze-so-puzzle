export type NativeExitOutcome = "requested" | "unavailable" | "failed";

export interface NativeExitController {
  request(): Promise<NativeExitOutcome>;
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return value !== null && typeof value === "object";
}

/**
 * Use only Tauri's documented public global window API. Browser `window.close`
 * is deliberately not a fallback: it can blank web content without closing a
 * native host, and ordinary tabs should remain usable when native close is not
 * available.
 */
export function createNativeExitController(host: unknown): NativeExitController {
  let pending: Promise<NativeExitOutcome> | null = null;

  return {
    request() {
      if (pending) return pending;
      const task = (async (): Promise<NativeExitOutcome> => {
        try {
          if (!isRecord(host)) return "unavailable";
          const tauri = host.__TAURI__;
          if (!isRecord(tauri) || !isRecord(tauri.window)) return "unavailable";
          const getCurrentWindow = tauri.window.getCurrentWindow;
          if (typeof getCurrentWindow !== "function") return "unavailable";
          const currentWindow = getCurrentWindow.call(tauri.window);
          if (!isRecord(currentWindow) || typeof currentWindow.close !== "function") return "unavailable";
          await currentWindow.close.call(currentWindow);
          return "requested";
        } catch {
          return "failed";
        }
      })();
      pending = task;
      void task.then(() => {
        if (pending === task) pending = null;
      });
      return task;
    },
  };
}
