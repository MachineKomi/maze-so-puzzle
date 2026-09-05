/** DEV-only integration rack. main.tsx's compile-time DEV guard excludes this from production. */
import { useState } from "react";
import { CatalogueImage, PresentationArt } from "../CatalogueImage";
import { UI_ART } from "../art";
import { DialogShell, type DialogVariant } from "../dialogs/DialogShell";
import { StoryDialog } from "../dialogs/StoryDialog";
import { usePresentation } from "../PresentationProvider";
import { AdventureHud } from "../game/AdventureHud";
import { buildAdventureHudModel, EQUIPMENT_REGISTRY } from "../game/hudModel";
import { CURATED_LEVELS } from "../../game/levels";
import { createInitialGameState } from "../../game/engine";
import { SoundDialog } from "../SoundDialog";
import { fakeMusicTransport } from "./fakeMusicTransport";
import { STORY_ART } from "../../artCatalog";

export default function UiProofRack() {
  const [dialog,setDialog] = useState<DialogVariant | "turns" | "sound" | null>(null);
  const [count,setCount] = useState(7);
  const [transportCalls,setTransportCalls] = useState<readonly string[]>([]);
  const [transport] = useState(()=>fakeMusicTransport(call=>setTransportCalls(previous=>[...previous,call])));
  const [showCatalogue,setShowCatalogue] = useState(false);
  const [blockerIndex,setBlockerIndex] = useState(0);
  const [extremes,setExtremes] = useState(false);
  const [presentationId,setPresentationId] = useState("");
  const {preferences,update} = usePresentation();
  const level = CURATED_LEVELS[11]!;
  const registry = count <= 7 ? EQUIPMENT_REGISTRY.slice(0,count) : Array.from({length:count},(_,index)=>({...EQUIPMENT_REGISTRY[index%7]!,id:`future-${index}`}));
  const initial = buildAdventureHudModel(level,createInitialGameState(level),registry);
  const model = extremes ? {...initial, objective: "Find the sparkling star after gathering the reusable keys, Splash Boots, Spring Boots and Antidote Leaf. Friends and treasures are optional adventures; you may return for everyone whenever you feel ready. ".repeat(2), friends: Array.from({length:5},(_,index)=>({...initial.friends[index%initial.friends.length]!,id:`proof-friend-${index}`,rescued:index%2===0})), rescueTotal:5, rescued:3, slots:initial.slots.map((slot,index)=>({...slot,found:index%2===0})), bagFound:Math.ceil(initial.slots.length/2)} : initial;
  return <main className="ui-proof-rack" style={{height:"100dvh",overflow:"auto",padding:24,background:"#eaddf0"}}>
    <style>{`
      .ui-proof-layout { display:grid; grid-template-columns:minmax(0,.65fr) minmax(480px,1fr); gap:24px; align-items:start; }
      .ui-proof-controls { min-width:0; }
      .ui-proof-hud-host { width:100%; height:max(672px,calc(100dvh - 48px)); --map-size:192px; }
      .ui-proof-catalogue { grid-column:1/-1; }
      @media(max-width:1050px) {
        .ui-proof-layout { grid-template-columns:minmax(0,1fr); }
        .ui-proof-hud-host { width:min(640px,100%); height:800px; }
      }
    `}</style>
    <div className="ui-proof-layout" inert={dialog !== null || undefined}>
      <section className="ui-proof-controls" aria-label="Component proof controls">
      <h1>Maze interface · styled component and catalogue proof</h1>
      <p>Test-only: real components, current approved identities, explicit fallback when large art is absent.</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBlock:16}}>
        {(["standard","blocker","hint","story","celebration","turns","sound"] as const).map(variant=><button key={variant} onClick={()=>setDialog(variant)}>{variant} proof</button>)}
        <button onClick={()=>setShowCatalogue(!showCatalogue)}>Catalogue rack</button>
        <label><input type="checkbox" checked={extremes} onChange={event=>setExtremes(event.target.checked)} /> Extreme content</label>
        <label>Equipment count <select aria-label="Equipment count" value={count} onChange={event=>setCount(Number(event.target.value))}>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label>
        <label>Quality <select aria-label="Quality" value={preferences.quality} onChange={event=>update({quality:event.target.value as typeof preferences.quality})}>{["full","lite","static"].map(value=><option key={value}>{value}</option>)}</select></label>
        <label>Required item <select aria-label="Required item" value={blockerIndex} onChange={event=>setBlockerIndex(Number(event.target.value))}>{buildAdventureHudModel(level,createInitialGameState(level)).slots.map((slot,index)=><option value={index} key={slot.id}>{slot.label}</option>)}</select></label>
        <label>Presentation identity <select aria-label="Presentation identity" value={presentationId} onChange={event=>setPresentationId(event.target.value)}><option value="">Current required item</option>{UI_ART.filter(art=>art.variants?.some(v=>v.usage==="presentation")).map(art=><option key={art.id} value={art.id}>{art.label}</option>)}</select></label>
      </div>
      <output data-testid="transport-calls">{transportCalls.join(",")}</output>
      <section aria-label="Material and state proof" style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <button className="primary-button">Begin adventure</button><button>Secondary action</button><button aria-pressed>Selected</button><button disabled>Locked</button><button autoFocus>Focus-visible proof</button>
        <p>Aa Bb Cc · 0123456789 · + − × ÷ = &lt; &gt; ≤ ≥ · Power 12 + 4 = 16</p>
      </section>
      </section>
      {/* A primary reference needs a real deck-sized parent and map variable.
          The rack scrolls at small viewports; production compact geometry is
          exercised through PlayShell in the real-maze suite. */}
      <section className="ui-proof-hud-host" aria-label="Primary HUD component reference">
        <AdventureHud model={model} name="Moonlit Friendship Quest" chapter="Synthetic wrapping proof" power={extremes ? 999 : 2} gold={extremes ? 9999 : 81} science={extremes ? 9999 : 40} steps={100} map={<div className="maze-map-card"><strong>My map</strong><div className="maze-minimap" /></div>} actions={[]} onHint={()=>setDialog("hint")} onMore={()=>setDialog("standard")} onDetail={()=>setDialog("blocker")} onMove={()=>{}} startHold={()=>{}} stopHold={()=>{}} tester={false} suggested="left" feedback={null} />
      </section>
      {showCatalogue && <section className="ui-proof-catalogue" aria-label="Complete semantic catalogue" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:24}}>{UI_ART.map((art,index)=><article key={`${art.id}-${index}`} style={{padding:12,border:"1px solid #b49cc2",borderRadius:16,background:"#fff8ed"}}><div style={{display:"flex",alignItems:"end",gap:8}}>{([24,44,96] as const).map(size=><figure key={size} style={{margin:0}}><CatalogueImage art={art} usage={size===44?"field":"optical"} displayPx={size} alt={art.label} style={{width:size,height:size}} /><figcaption style={{fontSize:12}}>{size}px</figcaption></figure>)}</div><strong>{art.label}</strong><p>{art.family} · {art.geometry?.class ?? "legacy fallback"}</p><code>{art.id}</code></article>)}</section>}
    </div>
    {dialog === "sound" ? <SoundDialog transport={transport} onClose={()=>setDialog(null)} returnFocus={null} /> : dialog === "turns" ? <StoryDialog title="Dialogue host · three-turn fixture" turns={[
      {id:"first",speaker:"Ame",portrait:STORY_ART.amePortrait.src,line:"First fixture turn. This does not replace campaign dialogue."},
      {id:"second",speaker:"Professor Poggle",portrait:STORY_ART.professorPoggle.src,line:"Second fixture turn. Advance and Skip remain available."},
      {id:"third",speaker:"Sprig",portrait:STORY_ART.sprig.src,line:"Third fixture turn. Ready to begin?"},
    ]} onBegin={()=>setDialog(null)} /> : dialog && <DialogShell title={`${dialog} · component proof`} variant={dialog} onClose={()=>setDialog(null)} footer={<div className="modal-actions"><button className="primary-button" onClick={()=>setDialog(null)}>Back to proof</button><button onClick={()=>setDialog(null)}>Keep exploring</button></div>}>
      <PresentationArt art={dialog === "story" ? STORY_ART.professorPoggle.src : presentationId || buildAdventureHudModel(level,createInitialGameState(level)).slots[blockerIndex]!.art} label={dialog === "story" ? "Professor Poggle" : UI_ART.find(art=>art.id===presentationId)?.label ?? buildAdventureHudModel(level,createInitialGameState(level)).slots[blockerIndex]!.label} />
      <p>Quiet pearl centre, luminous inner rim and a warm paper edge. Every action remains readable and reachable.</p>
      {Array.from({length:8},(_,index)=><p key={index}>Long-content fixture {index+1}: Full objectives, large text, and explanatory copy wrap inside one bounded scrolling body.</p>)}
    </DialogShell>}
  </main>;
}
