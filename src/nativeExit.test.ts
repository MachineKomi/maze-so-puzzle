import { describe, expect, it, vi } from "vitest";
import { createNativeExitController } from "./nativeExit";

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("createNativeExitController", () => {
  it("requests a normal close through the documented public Tauri window API", async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const getCurrentWindow = vi.fn(() => ({ close }));
    const controller = createNativeExitController({ __TAURI__: { window: { getCurrentWindow } } });

    await expect(controller.request()).resolves.toBe("requested");
    expect(getCurrentWindow).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("coalesces repeated activation while one native close is pending", async () => {
    const closing = deferred<void>();
    const close = vi.fn(() => closing.promise);
    const controller = createNativeExitController({
      __TAURI__: { window: { getCurrentWindow: () => ({ close }) } },
    });

    const first = controller.request();
    const second = controller.request();
    expect(second).toBe(first);
    expect(close).toHaveBeenCalledTimes(1);
    closing.resolve();
    await expect(first).resolves.toBe("requested");
  });

  it("reports rejection without falling through to a browser close and permits a retry", async () => {
    const browserClose = vi.fn();
    const close = vi.fn().mockRejectedValue(new Error("denied"));
    const controller = createNativeExitController({
      close: browserClose,
      __TAURI__: { window: { getCurrentWindow: () => ({ close }) } },
    });

    await expect(controller.request()).resolves.toBe("failed");
    await expect(controller.request()).resolves.toBe("failed");
    expect(close).toHaveBeenCalledTimes(2);
    expect(browserClose).not.toHaveBeenCalled();
  });

  it.each([
    ["absent", {}],
    ["missing window namespace", { __TAURI__: {} }],
    ["missing current-window accessor", { __TAURI__: { window: {} } }],
    ["missing close method", { __TAURI__: { window: { getCurrentWindow: () => ({}) } } }],
  ])("reports an %s bridge as unavailable", async (_name, host) => {
    await expect(createNativeExitController(host).request()).resolves.toBe("unavailable");
  });

  it("contains a throwing bridge as a failed request", async () => {
    const controller = createNativeExitController({
      __TAURI__: { window: { getCurrentWindow: () => { throw new Error("bridge failed"); } } },
    });
    await expect(controller.request()).resolves.toBe("failed");
  });
});
