import { useContext, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { lootLineClear } from "../game/loot";
import type { LevelDefinition } from "../game/types";
import type { SurfaceQuality } from "../motion";
import type { SceneTravelSnapshot } from "../ui/game/useSceneTravel";
import { playRewardArrival, type SoundHandle } from "../sound";
import { advanceRewardToken, makeRewardTokens, startRewardAppearance, REWARD_CAP, rewardProjection, rewardSpaceOpen, type RewardEmission, type RewardToken } from "./rewardPhysics";
import { REWARD_COLORS, rewardGlyph } from "./rewardGlyphs";
import { lootPose, type LootView } from "./useLootCollection";
import { StageFitContext } from "../ui/ResponsiveStage";
import { drawRewardNumber, rewardNumbers } from "./rewardNumbers";

export interface RewardPort { emit(event: RewardEmission): void; cancel(): void; wake(): void }
export const EMPTY_REWARD_PORT: RewardPort = { emit() {}, cancel() {}, wake() {} };

export function RewardLayer({ port, level, scene, active, quality, muted, loot }: {
  port: RefObject<RewardPort>; level: LevelDefinition; scene: RefObject<SceneTravelSnapshot>;
  active: boolean; quality: SurfaceQuality; muted: boolean;
  loot: RefObject<LootView>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scale: stageScale } = useContext(StageFitContext);
  const [fallback, setFallback] = useState(false);
  const [, repaintFallback] = useState(0);
  const mutedRef = useRef(muted); mutedRef.current = muted;
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) { port.current = EMPTY_REWARD_PORT; return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      loot.current.canvasAvailable=false; setFallback(true);
      const wake=()=>repaintFallback(n=>n+1);
      port.current={emit(){},cancel(){},wake};
      return ()=>{port.current=EMPTY_REWARD_PORT;};
    }
    loot.current.canvasAvailable=true;
    const glyphs = { gold: rewardGlyph("gold"), science: rewardGlyph("science"), power: rewardGlyph("power") };
    const numbers = rewardNumbers();
    let tokens: RewardToken[] = [], frame: number | undefined, previous = 0, lastArrival = -Infinity, pitch = 0;
    const firstPaint = new WeakSet<RewardToken>();
    let width = 0, height = 0, scale = 1, voice: SoundHandle | undefined;
    let peak = 0, bounces = 0, arrivals = 0;
    let lastCredit = loot.current.game.goldStarsCollected + loot.current.game.sciencePointsCollected;
    const cap = quality === "lite" ? 12 : 24;
    const physical = () => loot.current.game.loot.sources.flatMap(source => source.drops.map(drop => ({ source, drop })))
      .filter(({drop}) => loot.current.represented.has(drop.id)).slice(0,cap-4);
    const allocate = () => {
      const size = scene.current.contentSize;
      if (size.width <= 0 || size.height <= 0) return false;
      if (width !== size.width || height !== size.height || canvas.width === 1) {
        ({ width, height } = size);
        // The stage already owns its physical scale. Reading a Canvas DOM box
        // here forces the just-updated scene to lay out inside the first draw.
        scale = Math.max(.1, Math.min((devicePixelRatio || 1) * stageScale, 1.5, 1536 / width, 1536 / height));
        canvas.width = Math.max(1, Math.floor(width * scale)); canvas.height = Math.max(1, Math.floor(height * scale));
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      }
      return true;
    };
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
      if (!allocate()) return;
      const board = canvas.parentElement!;
      const anchors = board.querySelectorAll<HTMLElement>('[data-reward-anchor="ame"]');
      if (anchors.length !== 1) { cancel(); return; }
      // Read before Canvas writes. This includes the current battle lunge and
      // travel translate, not the hidden ordinary actor or logical next tile.
      let target = { x: visual.position.x+.5, y: visual.position.y+.5 };
      if (tokens.length) {
        const rect = anchors[0]!.getBoundingClientRect(), bounds = canvas.getBoundingClientRect();
        target = { x: visual.camera.left + (rect.left + rect.width*.5-bounds.left)/bounds.width*visual.camera.width,
          y: visual.camera.top + (rect.top + rect.height*.5-bounds.top)/bounds.height*visual.camera.height };
      }
      if (!Number.isFinite(target.x + target.y) || !rewardSpaceOpen(level.terrain, target.x, target.y)) tokens = [];
      const credit = loot.current.game.goldStarsCollected + loot.current.game.sciencePointsCollected;
      let collected = Math.max(0,credit-lastCredit); lastCredit = credit;
      ctx.clearRect(0, 0, width, height);
      const cell = Math.min(width / visual.camera.width, height / visual.camera.height);
      const drops = physical();
      tokens = tokens.slice(0, cap-drops.length);
      peak = Math.max(peak, drops.length+tokens.length);
      let movingLoot = false;
      for (const { source, drop } of drops) {
        const motion = loot.current.motions.get(drop.id);
        if (!motion) continue;
        const pose = lootPose(motion, drop.at, visual.position, now, loot.current.animate);
        movingLoot ||= pose.moving;
        const at = rewardProjection(pose, visual.camera, visual.contentSize);
        // Rotation fits the90%-tile visible envelope at every angle.
        const size = cell*.9/(57/64)*pose.scale;
        if (pose.moving && quality === "full") {
          const prior=lootPose(motion,drop.at,visual.position,now-45,true);
          if(lootLineClear(level,loot.current.game,{x:pose.x-.5,y:pose.y-.5},{x:prior.x-.5,y:prior.y-.5})) {
            const tail=rewardProjection(prior,visual.camera,visual.contentSize);
            ctx.globalAlpha=.65;ctx.strokeStyle=REWARD_COLORS[source.currency];ctx.lineWidth=cell*.08;ctx.lineCap="round";
            ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(at.x,at.y);ctx.stroke();
          }
        }
        ctx.globalAlpha = .22; ctx.fillStyle = "#332340";
        ctx.beginPath(); ctx.ellipse(at.x,at.y+cell*.27,cell*.3,cell*.08,0,0,Math.PI*2); ctx.fill();
        ctx.save(); ctx.translate(at.x,at.y-pose.lift*cell); ctx.rotate(pose.angle);
        ctx.globalAlpha = 1; ctx.drawImage(glyphs[source.currency],-size/2,-size/2,size,size); ctx.restore();
        if (drop.amount > 1) {
          ctx.globalAlpha = 1;
          drawRewardNumber(ctx,numbers,drop.amount,at.x,at.y+cell*.09,Math.max(11,cell*.26));
        }
        if (pose.moving && quality === "full") {
          ctx.globalAlpha=1; ctx.strokeStyle="#fff2ae"; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(at.x-cell*.35,at.y-5);ctx.lineTo(at.x-cell*.35,at.y+5);
          ctx.moveTo(at.x-cell*.35-5,at.y);ctx.lineTo(at.x-cell*.35+5,at.y);ctx.stroke();
        }
      }
      for (const token of tokens) {
        const starting = firstPaint.delete(token);
        if (starting) startRewardAppearance(token,now);
        if (now < token.born) continue;
        const bounced = token.bounced;
        advanceRewardToken(token, level.terrain, target, starting ? now : Math.max(token.born, previous), now);
        if (!bounced && token.bounced) bounces++;
        if (token.arrived) { collected++; continue; }
        if (token.expired) continue;
        const at = rewardProjection(token, visual.camera, visual.contentSize);
        const distance = Math.hypot(target.x - token.x, target.y - token.y);
        const alpha = Math.min(1, Math.max(0, (token.due - now) / 90));
        const size = cell * .9 / (57 / 64) * token.scale
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
      canvas.dataset.tokens = String(tokens.length+drops.length); canvas.dataset.loot = String(drops.length); canvas.dataset.bounces = String(bounces);
      canvas.dataset.arrivals = String(arrivals); canvas.dataset.peak = String(peak);
      previous = now;
      const movingCamera = Math.hypot(visual.position.x-loot.current.game.position.x,visual.position.y-loot.current.game.position.y) > .001;
      if (tokens.length || movingLoot || (drops.length && movingCamera)) frame = requestAnimationFrame(tick);
      else {
        // Release the backing surface but let the final tiny cue finish. It is
        // still cancelled by this owner's navigation/visibility cleanup.
        if (!drops.length) canvas.width = canvas.height = 1;
        canvas.dataset.running = "false";
      }
    };
    const wake = () => {
      if (!document.hidden && frame === undefined && (tokens.length || loot.current.motions.size || canvas.width>1)) {
        canvas.dataset.running = "true"; frame = requestAnimationFrame(tick);
      }
    };
    port.current = { cancel, wake, emit(event) {
      if (quality === "static" || !loot.current.animate) return;
      if (document.hidden || !document.hasFocus() || !canvas.isConnected) return;
      const now = performance.now();
      if (!tokens.length) {
        ({ width, height } = scene.current.contentSize);
        if (width <= 0 || height <= 0) return;
        scale = Math.max(.1, Math.min((devicePixelRatio || 1) * stageScale, 1.5, 1536 / width, 1536 / height));
        canvas.width = Math.max(1, Math.floor(width * scale)); canvas.height = Math.max(1, Math.floor(height * scale));
        ctx.setTransform(scale, 0, 0, scale, 0, 0); previous = now; pitch = 0;
      }
      const incoming = makeRewardTokens(event, event.bornAt ?? now, Math.min(quality === "lite" ? 4 : 8, REWARD_CAP[quality] - physical().length - tokens.length));
      if (event.bornAt === undefined) for (const token of incoming) firstPaint.add(token);
      tokens.push(...incoming);
      peak = Math.max(peak, tokens.length); canvas.dataset.running = tokens.length ? "true" : "false";
      if (tokens.length && frame === undefined) frame = requestAnimationFrame(tick);
    } };
    const visibility = () => { if (document.hidden) cancel(); else wake(); };
    const resize = () => { cancel(); wake(); };
    // Window resize fires before layout/scene measurements settle. Redraw the
    // resting loot after the board's size notification, with the shared scene
    // snapshot updated by its owner before our next animation frame.
    const observer = new ResizeObserver(([entry]) => {
      if (entry && (Math.abs(entry.contentRect.width-width)>.5 || Math.abs(entry.contentRect.height-height)>.5)) resize();
    });
    observer.observe(canvas.parentElement!);
    wake();
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", cancel);
    window.addEventListener("focus", wake);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect(); cancel(); port.current = EMPTY_REWARD_PORT;
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("focus", wake); window.removeEventListener("resize", resize);
    };
  }, [active, level, port, quality, scene, loot, stageScale]);
  const world=canvasRef.current?.parentElement?.querySelector(".camera-world");
  return <><canvas ref={canvasRef} width={1} height={1} className="vfx-rewards" data-vfx-kind="committed-rewards" aria-hidden="true" />
    {fallback && world && createPortal(loot.current.game.loot.sources.flatMap(s=>s.drops.map(d=>({s,d})))
      .filter(({d})=>loot.current.represented.has(d.id)).map(({s,d})=><svg key={d.id} data-loot-fallback={s.currency} aria-hidden="true" viewBox="-.5 -.5 1 1"
        style={{position:"absolute",pointerEvents:"none",zIndex:23,left:`calc((${d.at.x} - var(--world-left)) * var(--world-tile-x))`,
          top:`calc((${d.at.y} - var(--world-top)) * var(--world-tile-y))`,width:"var(--world-tile-x)",height:"var(--world-tile-y)"}}>
        {s.currency==="gold" ? <path d="M0,-.4 .1,-.13 .38,-.12 .17,.07 .23,.35 0,.2 -.23,.35 -.17,.07 -.38,-.12 -.1,-.13Z" fill="#ffc842" stroke="#785032" strokeWidth=".035" />
          : <g fill="none" stroke="#458a94" strokeWidth=".065">{[0,60,-60].map(angle=><ellipse key={angle} rx=".39" ry=".15" transform={`rotate(${angle})`} />)}<circle r=".12" fill="#a8efce" /></g>}
        {d.amount>1 && <text fontSize=".23" textAnchor="middle" y=".09" fill="#38205e" stroke="#fff9e9" strokeWidth=".025" paintOrder="stroke">{d.amount}</text>}
      </svg>),world)}</>;
}
