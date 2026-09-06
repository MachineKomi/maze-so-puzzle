import { useLayoutEffect, useRef, type RefObject } from "react";
import type { LevelDefinition } from "../game/types";
import type { SurfaceQuality } from "../motion";
import type { SceneTravelSnapshot } from "../ui/game/useSceneTravel";
import { playRewardArrival, type SoundHandle } from "../sound";
import { advanceRewardToken, makeRewardTokens, REWARD_CAP, rewardProjection, rewardSpaceOpen, type RewardEmission, type RewardToken } from "./rewardPhysics";
import { REWARD_COLORS, rewardGlyph } from "./rewardGlyphs";

export interface RewardPort { emit(event: RewardEmission): void; cancel(): void }
export const EMPTY_REWARD_PORT: RewardPort = { emit() {}, cancel() {} };

export function RewardLayer({ port, level, scene, active, quality, muted }: {
  port: RefObject<RewardPort>; level: LevelDefinition; scene: RefObject<SceneTravelSnapshot>;
  active: boolean; quality: SurfaceQuality; muted: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mutedRef = useRef(muted); mutedRef.current = muted;
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active || quality === "static") { port.current = EMPTY_REWARD_PORT; return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const glyphs = { gold: rewardGlyph("gold"), science: rewardGlyph("science"), power: rewardGlyph("power") };
    let tokens: RewardToken[] = [], frame: number | undefined, previous = 0, lastArrival = -Infinity, pitch = 0;
    let width = 0, height = 0, scale = 1, voice: SoundHandle | undefined;
    let peak = 0, bounces = 0, arrivals = 0;
    const cancel = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined; tokens = []; voice?.cancel(); voice = undefined;
      canvas.width = canvas.height = 1;
      canvas.dataset.tokens = "0"; canvas.dataset.running = "false";
    };
    const tick = () => {
      frame = undefined;
      if (document.hidden || !canvas.isConnected) { cancel(); return; }
      const now = performance.now(), visual = scene.current;
      if (visual.contentSize.width !== width || visual.contentSize.height !== height) { cancel(); return; }
      const board = canvas.parentElement!;
      const anchors = board.querySelectorAll<HTMLElement>('[data-reward-anchor="ame"]');
      if (anchors.length !== 1) { cancel(); return; }
      // Read before Canvas writes. This includes the current battle lunge and
      // travel translate, not the hidden ordinary actor or logical next tile.
      const rect = anchors[0]!.getBoundingClientRect(), bounds = canvas.getBoundingClientRect();
      const target = {
        x: visual.camera.left + (rect.left + rect.width * .5 - bounds.left) / width * visual.camera.width,
        y: visual.camera.top + (rect.top + rect.height * .5 - bounds.top) / height * visual.camera.height,
      };
      if (!Number.isFinite(target.x + target.y) || !rewardSpaceOpen(level.terrain, target.x, target.y)) { cancel(); return; }
      let collected = 0;
      ctx.clearRect(0, 0, width, height);
      const cell = Math.min(width / visual.camera.width, height / visual.camera.height);
      for (const token of tokens) {
        if (now < token.born) continue;
        const bounced = token.bounced;
        advanceRewardToken(token, level.terrain, target, Math.max(token.born, previous), now);
        if (!bounced && token.bounced) bounces++;
        if (token.arrived) { collected++; continue; }
        if (token.expired) continue;
        const at = rewardProjection(token, visual.camera, visual.contentSize);
        const distance = Math.hypot(target.x - token.x, target.y - token.y);
        const alpha = Math.min(1, Math.max(0, (token.due - now) / 90));
        const size = Math.min(30, cell * .3) * token.scale
          * (now >= token.homingAt ? Math.max(.45, Math.min(1, distance / .3)) : 1);
        // Short in-plane trails stay in navigable space, not over wall tops.
        if (quality === "full" && token.trail.length > 1) {
          ctx.beginPath();
          token.trail.forEach((point, index) => {
            const p = rewardProjection(point, visual.camera, visual.contentSize);
            if (index) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
          });
          ctx.globalAlpha = alpha * .45; ctx.strokeStyle = REWARD_COLORS[token.kind];
          ctx.lineWidth = Math.max(2, size * .13); ctx.lineCap = "round"; ctx.stroke();
        }
        ctx.globalAlpha = alpha * .15; ctx.fillStyle = "#543e68";
        ctx.beginPath(); ctx.ellipse(at.x, at.y + size * .35, size * .4, size * .13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.translate(at.x, at.y); ctx.rotate(token.angle * .3);
        ctx.globalAlpha = alpha; ctx.drawImage(glyphs[token.kind], -size / 2, -size / 2, size, size); ctx.restore();
        if (token.value > 1) {
          ctx.globalAlpha = alpha; ctx.font = `bold ${Math.max(10, size * .44)}px sans-serif`;
          ctx.textAlign = "center"; ctx.lineWidth = 3; ctx.strokeStyle = "#fff9e9";
          ctx.strokeText(String(token.value), at.x, at.y + size * .62);
          ctx.fillStyle = "#6a4696"; ctx.fillText(String(token.value), at.x, at.y + size * .62);
        }
        if (quality === "full") {
          ctx.globalAlpha = alpha * (.35 + .25 * Math.sin((now - token.born) / 70));
          ctx.strokeStyle = "#fff1c9"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(at.x - size * .6, at.y - 2); ctx.lineTo(at.x - size * .6, at.y - 8);
          ctx.moveTo(at.x - size * .6 - 3, at.y - 5); ctx.lineTo(at.x - size * .6 + 3, at.y - 5); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      arrivals += collected;
      if (collected && now - lastArrival >= 80) {
        voice?.cancel(); voice = playRewardArrival(pitch++ % 5, mutedRef.current); lastArrival = now;
      }
      tokens = tokens.filter(token => !token.arrived && !token.expired);
      canvas.dataset.tokens = String(tokens.length); canvas.dataset.bounces = String(bounces);
      canvas.dataset.arrivals = String(arrivals); canvas.dataset.peak = String(peak);
      previous = now;
      if (tokens.length) frame = requestAnimationFrame(tick);
      else {
        // Release the backing surface but let the final tiny cue finish. It is
        // still cancelled by this owner's navigation/visibility cleanup.
        canvas.width = canvas.height = 1; canvas.dataset.running = "false";
      }
    };
    port.current = { cancel, emit(event) {
      if (document.hidden || !document.hasFocus() || !canvas.isConnected) return;
      const now = performance.now();
      if (!tokens.length) {
        ({ width, height } = scene.current.contentSize);
        if (width <= 0 || height <= 0) return;
        scale = Math.min(devicePixelRatio || 1, 1.5, 1536 / width, 1536 / height);
        canvas.width = Math.max(1, Math.floor(width * scale)); canvas.height = Math.max(1, Math.floor(height * scale));
        ctx.setTransform(scale, 0, 0, scale, 0, 0); previous = now; pitch = 0;
      }
      tokens.push(...makeRewardTokens(event, event.bornAt ?? now, Math.min(quality === "lite" ? 4 : 8, REWARD_CAP[quality] - tokens.length)));
      peak = Math.max(peak, tokens.length); canvas.dataset.running = tokens.length ? "true" : "false";
      if (tokens.length && frame === undefined) frame = requestAnimationFrame(tick);
    } };
    document.addEventListener("visibilitychange", cancel);
    window.addEventListener("blur", cancel);
    window.addEventListener("resize", cancel);
    return () => {
      cancel(); port.current = EMPTY_REWARD_PORT;
      document.removeEventListener("visibilitychange", cancel);
      window.removeEventListener("blur", cancel); window.removeEventListener("resize", cancel);
    };
  }, [active, level, port, quality, scene]);
  return <canvas ref={canvasRef} width={1} height={1} className="vfx-rewards" data-vfx-kind="committed-rewards" aria-hidden="true" />;
}
