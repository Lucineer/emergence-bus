interface Env { BUS_KV: KVNamespace; }

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*; frame-ancestors 'none';";

function json(data: unknown, s = 200) { return new Response(JSON.stringify(data), { status: s, headers: { 'Content-Type': 'application/json', ...CSP } }); }

interface Event { id: string; type: string; source: string; payload: Record<string, unknown>; ts: string; consumedBy: string[]; }

function getLanding(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Emergence Bus — Cocapn</title><style>
body{font-family:system-ui,sans-serif;background:#0a0a0f;color:#e0e0e0;margin:0;min-height:100vh}
.container{max-width:800px;margin:0 auto;padding:40px 20px}
h1{color:#06b6d4;font-size:2.2em}a{color:#06b6d4;text-decoration:none}
.sub{color:#8A93B4;margin-bottom:2em}
.card{background:#16161e;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin:20px 0}
.card h3{color:#06b6d4;margin:0 0 12px 0}
.btn{background:#06b6d4;color:#0a0a0f;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold}
.btn:hover{background:#0891b2}
.btn2{background:#2a2a3a;color:#e0e0e0;border:1px solid #3a3a4a;padding:8px 16px;border-radius:8px;cursor:pointer}
.btn2:hover{background:#3a3a4a}
input,select{background:#0a0a0f;color:#e0e0e0;border:1px solid #2a2a3a;border-radius:8px;padding:10px;width:100%;box-sizing:border-box}
.event{padding:12px;background:#0a1a1a;border-left:3px solid #06b6d4;margin:6px 0;border-radius:0 8px 8px 0;font-size:.9em}
.event .type{font-weight:bold;color:#06b6d4}.event .meta{color:#8A93B4;font-size:.8em}
.flow{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:12px 0}
.flow .node{padding:4px 10px;border-radius:6px;font-size:.75em;font-weight:bold}
.flow .arrow{color:#8A93B4}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}
.stat{text-align:center;padding:16px;background:#16161e;border-radius:8px;border:1px solid #2a2a3a}
.stat .num{font-size:2em;color:#06b6d4;font-weight:bold}.stat .label{color:#8A93B4;font-size:.8em}
</style></head><body><div class="container">
<h1>📡 Emergence Bus</h1><p class="sub">Event bus for the fleet emergence subsystem — decoupled communication between all 11 repos.</p>
<div class="stats"><div class="stat"><div class="num" id="events">0</div><div class="label">Events</div></div>
<div class="stat"><div class="num" id="types">0</div><div class="label">Event Types</div></div>
<div class="stat"><div class="num" id="sources">0</div><div class="label">Sources</div></div></div>
<div class="card"><h3>Publish Event</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
<select id="type"><option value="goal.submitted">goal.submitted</option><option value="goal.decomposed">goal.decomposed</option>
<option value="workflow.created">workflow.created</option><option value="workflow.step.done">workflow.step.done</option>
<option value="workflow.step.failed">workflow.step.failed</option><option value="loop.closed">loop.closed</option>
<option value="loop.retrying">loop.retrying</option><option value="threat.detected">threat.detected</option>
<option value="threat.vaccinated">threat.vaccinated</option><option value="skill.proposed">skill.proposed</option>
<option value="skill.accepted">skill.accepted</option><option value="insight.found">insight.found</option>
<option value="rule.evolved">rule.evolved</option><option value="priority.set">priority.set</option>
<option value="custom">custom...</option></select>
<input id="source" placeholder="Source vessel" value="">
</div>
<input id="customType" placeholder="Custom event type" style="margin-top:8px;display:none">
<input id="payload" placeholder='Payload JSON (e.g. {"goal":"build X"})' style="margin-top:8px">
<div style="margin-top:12px;display:flex;gap:8px">
<button class="btn" onclick="publish()">Publish</button>
<button class="btn2" onclick="flush()">Flush Old</button>
</div></div>
<div id="eventStream" class="card"><h3>Event Stream</h3><p style="color:#8A93B4">Loading...</p></div>
<div class="card"><h3>Event Flow</h3>
<div class="flow">
<span class="node" style="background:#06b6d433;color:#06b6d4">goal.submitted</span><span class="arrow">→</span>
<span class="node" style="background:#a855f733;color:#a855f7">goal.decomposed</span><span class="arrow">→</span>
<span class="node" style="background:#22c55e33;color:#22c55e">workflow.created</span><span class="arrow">→</span>
<span class="node" style="background:#f59e0b33;color:#f59e0b">step.done/failed</span><span class="arrow">→</span>
<span class="node" style="background:#ef444433;color:#ef4444">loop.closed/retrying</span>
</div>
<div class="flow">
<span class="node" style="background:#ef444433;color:#ef4444">threat.detected</span><span class="arrow">→</span>
<span class="node" style="background:#22c55e33;color:#22c55e">threat.vaccinated</span>
<span style="color:#475569;margin:0 8px">|</span>
<span class="node" style="background:#a855f733;color:#a855f7">skill.proposed</span><span class="arrow">→</span>
<span class="node" style="background:#06b6d433;color:#06b6d4">skill.accepted</span>
<span style="color:#475569;margin:0 8px">|</span>
<span class="node" style="background:#c084fc33;color:#c084fc">insight.found</span><span class="arrow">→</span>
<span class="node" style="background:#ef444433;color:#ef4444">rule.evolved</span>
</div></div>
<script>
document.getElementById('type').addEventListener('change',function(){document.getElementById('customType').style.display=this.value==='custom'?'block':'none';});
async function load(){try{const r=await fetch('/api/events');const events=await r.json();
const el=document.getElementById('eventStream');
document.getElementById('events').textContent=events.length;
const types=new Set(events.map(e=>e.type));document.getElementById('types').textContent=types.size;
const sources=new Set(events.map(e=>e.source));document.getElementById('sources').textContent=sources.size;
if(!events.length)el.innerHTML='<h3>Event Stream</h3><p style="color:#8A93B4">No events yet.</p>';
else el.innerHTML='<h3>Event Stream ('+events.length+')</h3>'+events.slice(0,20).map(e=>'<div class="event"><span class="type">'+e.type+'</span> from <strong>'+e.source+'</strong> <span class="meta">'+new Date(e.ts).toLocaleTimeString()+'</span>'+(e.payload?JSON.stringify(e.payload).substring(0,100):'')+'</div>').join('');
}catch(e){}}
async function publish(){let type=document.getElementById('type').value;if(type==='custom')type=document.getElementById('customType').value.trim();
if(!type)return;const source=document.getElementById('source').value.trim()||'manual';
let payload={};try{const p=document.getElementById('payload').value.trim();if(p)payload=JSON.parse(p);}catch{payload={raw:document.getElementById('payload').value};}
await fetch('/api/emit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,source,payload})});
document.getElementById('payload').value='';load();}
async function flush(){await fetch('/api/flush',{method:'POST'});load();}
load();</script>
<div style="text-align:center;padding:24px;color:#475569;font-size:.75rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> · <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>
</div></body></html>`;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === '/health') return json({ status: 'ok', vessel: 'emergence-bus' });
    if (url.pathname === '/vessel.json') return json({ name: 'emergence-bus', type: 'cocapn-vessel', version: '1.0.0', description: 'Event bus for the fleet emergence subsystem — decoupled communication', fleet: 'https://the-fleet.casey-digennaro.workers.dev', capabilities: ['event-bus', 'pub-sub', 'decoupled-communication'] });

    if (url.pathname === '/api/events') {
      const params = url.searchParams;
      const type = params.get('type');
      const since = params.get('since');
      let events = await env.BUS_KV.get('events', 'json') as Event[] || [];
      if (type) events = events.filter(e => e.type === type);
      if (since) events = events.filter(e => e.ts > since);
      return json(events.slice(0, 50));
    }

    if (url.pathname === '/api/types') {
      const events = await env.BUS_KV.get('events', 'json') as Event[] || [];
      const typeCounts: Record<string, number> = {};
      for (const e of events) typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
      return json(typeCounts);
    }

    if (url.pathname === '/api/emit' && req.method === 'POST') {
      const { type, source, payload } = await req.json() as { type: string; source: string; payload: Record<string, unknown> };
      if (!type || !source) return json({ error: 'type and source required' }, 400);
      const events = await env.BUS_KV.get('events', 'json') as Event[] || [];
      const event: Event = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        type: type.substring(0, 100), source: source.substring(0, 50),
        payload: payload || {}, ts: new Date().toISOString(), consumedBy: []
      };
      events.unshift(event);
      if (events.length > 500) events.length = 500;
      await env.BUS_KV.put('events', JSON.stringify(events));
      return json({ emitted: true, id: event.id });
    }

    if (url.pathname === '/api/consume' && req.method === 'POST') {
      const { consumer, types } = await req.json() as { consumer: string; types?: string[] };
      const events = await env.BUS_KV.get('events', 'json') as Event[] || [];
      const matchTypes = types || [];
      const available = events.filter(e =>
        !e.consumedBy.includes(consumer) &&
        (matchTypes.length === 0 || matchTypes.includes(e.type))
      ).slice(0, 20);
      // Mark as consumed
      for (const e of available) { if (!e.consumedBy.includes(consumer)) e.consumedBy.push(consumer); }
      await env.BUS_KV.put('events', JSON.stringify(events));
      return json({ events: available, count: available.length });
    }

    if (url.pathname === '/api/flush' && req.method === 'POST') {
      const events = await env.BUS_KV.get('events', 'json') as Event[] || [];
      if (events.length > 100) {
        events.length = 100;
        await env.BUS_KV.put('events', JSON.stringify(events));
        return json({ flushed: true, kept: 100 });
      }
      return json({ flushed: false, count: events.length });
    }

    return new Response(getLanding(), { headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Content-Security-Policy': CSP } });
    'X-Frame-Options': 'DENY',
  }
};
