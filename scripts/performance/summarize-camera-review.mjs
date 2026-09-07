// Compact reproducible view of paired reports. Never pools trace and frame runs.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const median = values => [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
for (const path of process.argv.slice(2)) {
  const bytes = await readFile(path), report = JSON.parse(bytes);
  const cohorts = [...new Set(report.rows.map(row=>JSON.stringify([row.viewport,row.dpr])))];
  const summary = {path,sha256:createHash('sha256').update(bytes).digest('hex'),head:report.head,
    fixture:report.fixture,cpu:report.cpuRate,trace:report.captureTrace,layers:report.captureLayers,pilot:report.pilot,cycles:report.cycles,rows:[]};
  for (const cohort of cohorts) {
    const pair = {};
    for (const mode of ['baseline','candidate']) {
      const rows = report.rows.filter(r=>!r.warmup&&r.mode===mode&&JSON.stringify([r.viewport,r.dpr])===cohort);
      if(!rows.length) continue;
      const traceMedian = name => rows[0].trace[name].totalMs===null?null:median(rows.map(r=>r.trace[name].totalMs));
      pair[mode]={n:rows.length,p95Median:median(rows.map(r=>r.p95)),p95Worst:Math.max(...rows.map(r=>r.p95)),
        max:Math.max(...rows.map(r=>r.max)),maxMedian:median(rows.map(r=>r.max)),over20:rows.reduce((s,r)=>s+r.over20,0),over34:rows.reduce((s,r)=>s+r.over34,0),
        frames:rows.reduce((s,r)=>s+r.deltas.length,0),paint:traceMedian('Paint'),raster:traceMedian('RasterTask'),
        maxRebaseDelta:Math.max(0,...rows.flatMap(r=>r.rebaseAdjacentDeltas??[])),
        errors:rows.flatMap(r=>r.errors),maxNodes:Math.max(...rows.map(r=>r.resourcesAfter?.nodes??0)),
        layout:traceMedian('Layout'),styles:traceMedian('UpdateLayoutTree')};
      if(rows.every(r=>r.mount)) {
        const mounts=rows.map(r=>{
          const f=r.mount.frames,d=f.slice(1).map((v,i)=>v-f[i]);
          return{pair:r.pair,terrainAt:r.mount.terrainAt,max:Math.max(...d),over20:d.filter(v=>v>20).length,
            over34:d.filter(v=>v>34).length,openMax:r.max,openOver20:r.over20,openOver34:r.over34};
        });
        pair[mode].mount={terrainMedian:median(mounts.map(r=>r.terrainAt)),max:Math.max(...mounts.map(r=>r.max)),
          maxMedian:median(mounts.map(r=>r.max)),over20:mounts.reduce((n,r)=>n+r.over20,0),over34:mounts.reduce((n,r)=>n+r.over34,0),rows:mounts};
        pair[mode].combined={over20:mounts.reduce((n,r)=>n+r.over20+r.openOver20,0),over34:mounts.reduce((n,r)=>n+r.over34+r.openOver34,0),
          max:Math.max(...mounts.flatMap(r=>[r.max,r.openMax]))};
      }
    }
    summary.rows.push({cohort:JSON.parse(cohort),...pair,rasterChangePercent:pair.baseline?.raster&&pair.candidate?.raster?(pair.candidate.raster/pair.baseline.raster-1)*100:null});
  }
  console.log(JSON.stringify(summary,null,2));
}
