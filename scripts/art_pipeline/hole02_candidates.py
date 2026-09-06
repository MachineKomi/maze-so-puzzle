"""Preserve two exact ImageGen originals and build a compact, non-runtime review.

Only native-alpha registration/resizing/encoding is applied to raster art.
Connected geometry is explicitly a code-native preview, not edited bitmap art.
"""
from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

from PIL import Image
from cutout import register_cutout
from model import ROOT, image_facts, json_bytes, sha256_file

BATCH = ROOT / 'docs/source-assets/production/hole02-pits'
PROOF = ROOT / 'artifacts/art-proofs/hole02'
ORIGINALS = {
    'a': ('exec-6e26bcc2-a003-4638-822f-97de868763a2.png', '298aeaee0a963dde76cb7edef3e892ca7de6187d9be344530c69edf09c0f03ca'),
    'b': ('exec-fcac60dc-997d-4f63-aed0-42ecdaf23a97.png', 'fd4242d62e919ac019e084223a95d7792860b24db12e539423f6d0ffb3f175ec'),
}

def fact(path):
    return {'path':path.relative_to(ROOT).as_posix(),'sha256':sha256_file(path),'bytes':path.stat().st_size}

def immutable(path, payload):
    if path.exists():
        if path.read_bytes()!=payload:
            raise FileExistsError(f'Refusing to replace {path}')
    else:
        path.parent.mkdir(parents=True,exist_ok=True)
        with path.open('xb') as stream: stream.write(payload)

def preserve(source_paths):
    for key, (output_id,digest) in ORIGINALS.items():
        target = BATCH / f'pit-{key}-generator-original.png'
        if source_paths[key] is not None:
            original=Path(source_paths[key])
            if sha256_file(original)!=digest: raise ValueError(f'Wrong original: {key}')
            immutable(target,original.read_bytes())
        if sha256_file(target)!=digest: raise ValueError(f'Original changed: {key}')
    decision=fact(ROOT/'docs/source-assets/calibrations/hole02/human-selection.json')
    immutable(BATCH/'human-review.json',json_bytes({'schema':'maze-hole02-human-review/v1','decision':decision,'scope':'Human selects B and delegates technical execution; not a completed runtime playtest'}))
    runs=[]
    for key,(output_id,digest) in ORIGINALS.items():
        original=BATCH/f'pit-{key}-generator-original.png'
        facts=image_facts(original)
        runs.append({'runId':f'hole02-{key}','promptBlockId':f'hole02-{key}','generationMode':'fresh-blank-canvas-no-image-references',
            'orderedReferences':[{'order':1,'referenceId':'house-recipe','role':'written-specification-context-only; NOT an image supplied to ImageGen'}],
            'output':{**fact(original),**{k:facts[k] for k in ('width','height','format','mode','alphaMode','decodedBytesUpperBound')},'outputId':output_id},
            'disposition':{'status':'human-approved-source' if key=='b' else 'art-director-rejected-source','reason':'Human preferred B and delegated technical implementation.' if key=='b' else 'Retained as immutable comparison; B better fits the tile/ditch construction.'},
            'lineage':{'previousBatchOutputUsed':False,'editOfEdit':False,'imageReferencesSent':[]}})
    batch={'schema':'maze-art-generation-batch/v1','batchId':'hole02-pits','revision':1,'status':'reviewed','recordedOn':'2026-09-06',
        'recipeEvidence':fact(ROOT/'docs/source-assets/recipes/mgjrpg-02.json'),'decisionEvidence':decision,
        'promptFile':{**fact(BATCH/'PROMPTS.md'),'fidelity':'exact'},'reviewEvidence':fact(BATCH/'human-review.json'),
        'generator':{'provider':'OpenAI','interface':'Codex built-in ImageGen','model':'not exposed','seed':'not exposed'},
        'referenceRegistry':{'house-recipe':{**fact(ROOT/'docs/source-assets/recipes/mgjrpg-02.json'),'authorityKind':'written style context, not submitted raster reference'}},
        'runs':runs,'nativeCanvasException':'Native 1254x1254 RGBA retained; field registration occurs only in review derivatives.',
        'lineagePolicy':'Independent blank-canvas generation. No historical pixels edited. No image references sent.',
        'counts':{'runCount':2,'rejectedBackgroundInvalidCount':0,'pendingHumanCandidateCount':0,'humanApprovedSourceCount':1,'artDirectorRejectedSourceCount':1,
            'generatorOriginalEncodedBytes':sum(r['output']['bytes'] for r in runs),'generatorOriginalDecodedBytesUpperBound':sum(r['output']['decodedBytesUpperBound'] for r in runs)},
        'reviewProtocol':'B selected by Human; technical qualification still required before publication.',
        'rights':'Original game asset prompts; no named franchise or artist; no external image inputs. Not legal clearance.',
        'runtimeImpact':{'files':0,'bytes':0},'rollback':'No runtime publication in this source/preflight checkpoint.'}
    immutable(BATCH/'run-record.json',json_bytes(batch))

def svg(shape, label, index):
    d=shape['d']
    return f'<figure><svg width="144" height="144" viewBox="-.12 -.12 3.24 3.24" role="img" aria-label="{label}"><defs><clipPath id="c{index}"><path d="{d}" fill-rule="evenodd"/></clipPath></defs><g clip-path="url(#c{index})"><path d="{d}" fill="#21172e" fill-rule="evenodd"/><path d="{d}" fill="none" stroke="#59435d" stroke-width=".44"/><path d="{d}" fill="none" stroke="#956d8d" stroke-width=".26"/><path d="{d}" fill="none" stroke="#cfa5ba" stroke-width=".09"/></g></svg><figcaption>{label}</figcaption></figure>'

def proof():
    PROOF.mkdir(parents=True,exist_ok=True)
    rows=[]
    for key in ORIGINALS:
        source=BATCH/f'pit-{key}-generator-original.png'
        with Image.open(source) as raw:
            if raw.mode!='RGBA' or raw.getchannel('A').getextrema()!=(0,255): raise ValueError('Native transparency missing')
            registered=register_cutout(raw,(256,256),target_box=(.06,.06,.94,.94),align=(.5,.5),alpha_threshold=3)
        target=PROOF/f'pit-{key}-field-review-256.webp'
        registered.save(target,format='WEBP',lossless=True,quality=100,method=6,exact=True)
        rows.append({**fact(target),'width':256,'height':256,'decodedBytesUpperBound':262144,'source':fact(source),'alphaBounds':registered.getchannel('A').getbbox()})
    topology=json.loads(subprocess.check_output(['node','scripts/art_review/hole02_topology.mjs'],cwd=ROOT))
    (PROOF/'topology.json').write_bytes(json_bytes(topology))
    classes=[(0,'Isolated shape'),(1,'End cap'),(5,'Straight strip'),(3,'Elbow'),(7,'T junction'),(15,'Cross junction')]
    joined=''.join(svg(topology['cardinalMasks'][mask],label,mask) for mask,label in classes)
    old='../../..'+ '/public/assets/mgjrpg-02/hazards/ground-hole-v04-ground-overlay-256-r01.webp'
    html=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>HOLE-02 — selected pit and connected construction</title>
<style>body{{margin:0;background:#f4efdc;color:#49324e;font:17px/1.5 system-ui}}main{{max-width:1050px;margin:auto;padding:24px}}h1{{font-size:26px}}.row{{display:flex;gap:18px;flex-wrap:wrap}}figure{{margin:0;padding:18px;border:1px solid #cebbc8;border-radius:16px;background:#e4dfc6;text-align:center}}figure img{{width:96px;height:96px;object-fit:contain}}figcaption{{font-size:15px}}.note{{max-width:850px}}a{{color:#754581}}svg{{display:block;margin:auto}}details{{margin-top:20px}}</style><main>
<h1>A cleaner, deeper pit</h1><p>Candidate B is your selected direction. Original files and old runtime art are preserved.</p>
<div class="row"><figure><img src="{old}" alt="Current rocky hole"><figcaption>Current game</figcaption></figure><figure><img src="pit-b-field-review-256.webp" alt="Selected rounded-square mauve pit"><figcaption>Selected B · registered review</figcaption></figure><figure><img src="pit-a-field-review-256.webp" alt="Alternative round lavender pit"><figcaption>A · comparison only</figcaption></figure></div>
<h2>One continuous ditch, not repeated pits</h2><p class="note">These are explicitly <b>code-native construction previews</b> using the game's existing terrain boundary geometry and B's broad value groups. They are not pieces cut from the generated sprite and are not yet published. Only exposed edges have rims. All 16 cardinal neighbour masks are checked; diagonal-only neighbours remain separate.</p><div class="row">{joined}</div>
<p class="note">Technical follow-up: match isolated/connected rim weight at 48px, preserve neutral lighting, check every floor and camera edge, then integrate into the same terrain owner. Existing one-tile crossing rules do not change.</p>
<details><summary>Originals and technical details</summary><p><a href="../../../docs/source-assets/production/hole02-pits/pit-b-generator-original.png">Native B original</a> · <a href="topology.json">All 16 masks</a> · <a href="report.json">Registration/provenance report</a></p></details></main></html>'''
    (PROOF/'index.html').write_text(html,encoding='utf-8',newline='\n')
    report={'schema':'maze-hole02-source-proof/v1','selected':'b','runtimeChanges':0,'rasterOperation':'native RGBA -> existing premultiplied register_cutout -> lossless WebP; no generated-art edits',
            'derivatives':rows,'topologyMasks':16,'diagonalLoops':topology['diagonal']['loopCount'],'topologyAuthority':fact(ROOT/'src/game/terrainGeometry.ts'),'topologyPreviewScript':fact(ROOT/'scripts/art_review/hole02_topology.mjs'),
            'limits':['Not gameplay integration','Not physical-device validation','Connected render is code-native concept, not a published derivative','B is selected; technical review is still required']}
    (PROOF/'report.json').write_bytes(json_bytes(report))
    print(json.dumps({'ok':True,'gallery':str(PROOF/'index.html'),'registeredReviewBytes':sum(r['bytes'] for r in rows),'runtimeWrites':0},indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-a'); parser.add_argument('--source-b')
    args=parser.parse_args()
    preserve({'a':args.source_a,'b':args.source_b}); proof()
