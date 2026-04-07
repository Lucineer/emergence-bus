# 📡 Emergence Bus

A simple, fork-first event bus for connecting services in the Cocapn Fleet. It routes events between independent repositories over HTTP.

**Live endpoint:** `https://emergence-bus.casey-digennaro.workers.dev`

## Why This Exists

You don't notice internal communication until it breaks. This is a minimal, durable event bus built for systems that grow organically, so you don't have to build your own half-broken version.

## Quick Start

1.  Fork this repository.
2.  Deploy to your Cloudflare account using `wrangler deploy`.
3.  Edit `src/config.ts` to define your own event types and service endpoints.
4.  Your services can now publish and consume events via HTTP POST.

## What It Provides

*   **Modular Events:** Define your own event schema in TypeScript. The included 11 event types are an example.
*   **Immutable Log:** All events are durably appended to a Cloudflare KV store for replay.
*   **Per-Service Tracking:** The bus tracks the last event ID each service has processed.
*   **Live Dashboard:** A built-in, read-only web dashboard to monitor event flow in real time.
*   **HTTP API:** Services interact via three simple endpoints (`/publish`, `/next`, `/ack`). No specialized client libraries are needed.
*   **Zero Dependencies:** The runtime uses only TypeScript and Cloudflare's platform APIs.

## Honest Limitation

Event publishing throughput is limited by Cloudflare KV's write performance (one write per key per second on average). It is designed for orchestration events, not high-volume data streaming.

## License

MIT

---

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>