"use client";

import { useState } from "react";

type Role = "customer" | "vendor" | "rider" | "admin";

export default function PlatformPage() {
  const [role, setRole] = useState<Role>("customer");
  const [screen, setScreen] = useState<"home" | "track">("home");

  return (
    <div className="min-h-screen" style={{ background: "#0D1117", color: "#E8F0FE", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        :root {
          --bg: #0D1117;
          --card: #1A2332;
          --card2: #1E2A3E;
          --border: #252F42;
          --border2: #2D3A52;
          --green: #00C47A;
          --green-dim: rgba(0,196,122,0.12);
          --green-text: #00E68A;
          --orange: #FF6B35;
          --orange-dim: rgba(255,107,53,0.12);
          --orange-text: #FF8C5A;
          --blue: #3B82F6;
          --blue-dim: rgba(59,130,246,0.12);
          --amber: #F59E0B;
          --red: #EF4444;
          --text: #E8F0FE;
          --text-2: #8B9DC3;
          --text-3: #4A5A7A;
          --white: #ffffff;
          --mono: 'JetBrains Mono', monospace;
          --sans: 'Inter', sans-serif;
          --display: 'DM Sans', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .shell {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
        }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .page-logo {
          font-family: var(--display);
          font-size: 22px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.5px;
        }
        .page-logo span { color: var(--green); }
        .page-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--green);
          background: var(--green-dim);
          border: 1px solid rgba(0,196,122,0.25);
          padding: 4px 10px;
          border-radius: 20px;
        }
        .role-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          background: var(--card);
          padding: 6px;
          border-radius: 12px;
          border: 1px solid var(--border);
          width: fit-content;
        }
        .role-tab {
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .role-tab:hover { color: var(--text); background: var(--card2); }
        .role-tab.active { background: var(--green); color: #0D1117; font-weight: 700; }
        .role-tab.active.orange { background: var(--orange); }
        .role-tab.active.blue { background: var(--blue); }
        .role-tab.active.purple { background: #8B5CF6; }
        .role-icon { font-size: 14px; }
        .demo-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 32px;
          align-items: start;
        }
        .phone-wrap { position: sticky; top: 24px; }
        .phone-frame {
          width: 360px;
          background: #0D1117;
          border-radius: 40px;
          border: 2px solid var(--border2);
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .phone-notch {
          height: 32px;
          background: #080D14;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .phone-notch-pill {
          width: 80px; height: 10px;
          background: #1A2332;
          border-radius: 10px;
        }
        .phone-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 20px;
          font-size: 10px;
          font-weight: 600;
          color: var(--text-2);
          background: #080D14;
        }
        .screen { display: none; }
        .screen.active { display: block; }
        .app-topbar {
          background: var(--card);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }
        .app-logo { font-family: var(--display); font-size: 18px; font-weight: 800; color: var(--text); }
        .app-logo span { color: var(--green); }
        .app-notif {
          width: 32px; height: 32px;
          background: var(--card2);
          border: 1px solid var(--border2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          position: relative;
        }
        .notif-dot {
          width: 7px; height: 7px;
          background: var(--red);
          border-radius: 50%;
          border: 1.5px solid var(--card);
          position: absolute;
          top: 4px; right: 4px;
        }
        .app-body { padding: 16px; min-height: 520px; background: var(--bg); }
        .greeting { margin-bottom: 14px; }
        .greeting-name { font-family: var(--display); font-size: 17px; font-weight: 700; color: var(--text); }
        .greeting-sub { font-size: 11px; color: var(--text-2); margin-top: 2px; }
        .search-box {
          background: var(--card);
          border: 1px solid var(--border2);
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .search-icon { font-size: 13px; color: var(--text-3); }
        .search-text { font-size: 12px; color: var(--text-3); }
        .quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .quick-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
          overflow: hidden;
        }
        .quick-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }
        .quick-card.g::before { background: var(--green); }
        .quick-card.o::before { background: var(--orange); }
        .quick-card.b::before { background: var(--blue); }
        .quick-card.p::before { background: #8B5CF6; }
        .quick-card:hover { border-color: var(--border2); transform: translateY(-1px); }
        .quick-icon { font-size: 20px; margin-bottom: 6px; }
        .quick-label { font-size: 11px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
        .quick-sub { font-size: 9.5px; color: var(--text-2); }
        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 10px;
        }
        .order-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-icon-wrap {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .order-icon-wrap.green { background: var(--green-dim); }
        .order-icon-wrap.orange { background: var(--orange-dim); }
        .order-name { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
        .order-meta { font-size: 10px; color: var(--text-2); }
        .order-status {
          margin-left: auto;
          font-size: 9.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .order-status.live { background: var(--green-dim); color: var(--green-text); }
        .order-status.done { background: var(--border); color: var(--text-2); }
        .order-status.transit { background: var(--blue-dim); color: #93C5FD; }
        .track-header {
          background: linear-gradient(180deg, #0F1E32 0%, var(--bg) 100%);
          padding: 16px 18px 0;
        }
        .track-back { font-size: 11px; color: var(--text-2); margin-bottom: 10px; cursor: pointer; }
        .track-back:hover { color: var(--text); }
        .track-title { font-family: var(--display); font-size: 16px; font-weight: 700; margin-bottom: 2px; }
        .track-id { font-family: var(--mono); font-size: 10px; color: var(--green); }
        .map-placeholder {
          height: 190px;
          background: #0F1A2A;
          position: relative;
          overflow: hidden;
        }
        .map-grid-h {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
        }
        .map-grid-h::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            linear-gradient(rgba(37,63,100,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,63,100,0.4) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .map-road-h {
          position: absolute;
          background: rgba(40,70,110,0.6);
          border-radius: 2px;
        }
        .map-road-v {
          position: absolute;
          background: rgba(40,70,110,0.6);
          border-radius: 2px;
        }
        .map-pin-start {
          position: absolute;
          width: 10px; height: 10px;
          background: var(--text-2);
          border-radius: 50%;
          border: 2px solid var(--bg);
        }
        .map-pin-end {
          position: absolute;
          width: 12px; height: 12px;
          background: var(--blue);
          border-radius: 50%;
          border: 2px solid var(--bg);
        }
        .rider-dot {
          position: absolute;
          width: 20px; height: 20px;
          background: var(--green);
          border-radius: 50%;
          border: 3px solid var(--bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          animation: pulse-rider 2s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes pulse-rider {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,196,122,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(0,196,122,0); }
        }
        .map-label {
          position: absolute;
          background: rgba(13,17,23,0.85);
          border: 1px solid var(--border2);
          font-size: 9px;
          color: var(--text-2);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .track-body { padding: 14px 16px; }
        .eta-bar {
          background: var(--green-dim);
          border: 1px solid rgba(0,196,122,0.25);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .eta-label { font-size: 10px; color: var(--green-text); font-weight: 600; }
        .eta-time { font-family: var(--display); font-size: 20px; font-weight: 800; color: var(--green-text); }
        .eta-meta { font-size: 9.5px; color: var(--text-2); }
        .progress-steps {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          gap: 0;
        }
        .step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 10px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--border2);
        }
        .step.done:not(:last-child)::after { background: var(--green); }
        .step-dot {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--border2);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          color: var(--text-3);
          z-index: 1;
          margin-bottom: 4px;
        }
        .step.done .step-dot { background: var(--green); color: #0D1117; font-weight: 700; }
        .step.active .step-dot { background: var(--card2); border: 2px solid var(--green); color: var(--green); animation: pulse-step 1.5s ease-in-out infinite; }
        @keyframes pulse-step { 0%,100% { box-shadow: 0 0 0 0 rgba(0,196,122,0.4); } 50% { box-shadow: 0 0 0 6px rgba(0,196,122,0); } }
        .step-label { font-size: 8.5px; color: var(--text-3); text-align: center; }
        .step.done .step-label, .step.active .step-label { color: var(--text-2); }
        .rider-info {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rider-av {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--green-dim);
          border: 1.5px solid var(--green);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: var(--green-text);
          flex-shrink: 0;
        }
        .rider-name { font-size: 12px; font-weight: 700; color: var(--text); }
        .rider-meta { font-size: 10px; color: var(--text-2); margin-top: 1px; }
        .rider-rating { margin-left: auto; font-size: 11px; color: var(--amber); font-weight: 700; }
        .vendor-header {
          background: linear-gradient(135deg, #1A1A2E 0%, #0D1117 100%);
          padding: 16px 18px;
          border-bottom: 1px solid var(--border);
        }
        .vendor-name { font-family: var(--display); font-size: 15px; font-weight: 700; margin-bottom: 2px; }
        .vendor-meta { font-size: 10px; color: var(--text-2); }
        .vendor-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700;
          background: var(--green-dim); color: var(--green-text);
          padding: 3px 8px; border-radius: 6px; margin-top: 6px;
        }
        .vendor-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .vendor-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid var(--border);
        }
        .vstat {
          padding: 12px 10px;
          text-align: center;
          border-right: 1px solid var(--border);
        }
        .vstat:last-child { border-right: none; }
        .vstat-val { font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--text); }
        .vstat-label { font-size: 9px; color: var(--text-2); margin-top: 1px; }
        .order-queue { padding: 12px 16px; }
        .queue-title { font-size: 11px; font-weight: 700; color: var(--text); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
        .queue-badge { background: var(--orange-dim); color: var(--orange-text); font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 10px; }
        .vendor-order {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 8px;
        }
        .vo-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .vo-id { font-family: var(--mono); font-size: 10px; color: var(--text-2); }
        .vo-time { font-family: var(--mono); font-size: 10px; color: var(--orange-text); }
        .vo-items { font-size: 11px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .vo-amount { font-size: 10px; color: var(--text-2); }
        .vo-actions { display: flex; gap: 6px; margin-top: 10px; }
        .btn-accept {
          flex: 1; padding: 7px; border-radius: 7px;
          background: var(--green); color: #0D1117;
          font-size: 11px; font-weight: 700;
          border: none; cursor: pointer;
        }
        .btn-accept:hover { opacity: 0.9; }
        .btn-decline {
          padding: 7px 14px; border-radius: 7px;
          background: var(--card2); color: var(--text-2);
          font-size: 11px; font-weight: 600;
          border: 1px solid var(--border2); cursor: pointer;
        }
        .btn-decline:hover { color: var(--text); }
        .rider-screen-header {
          background: #080D14;
          padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }
        .rider-screen-name { font-size: 13px; font-weight: 700; }
        .rider-online {
          display: flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700; color: var(--green-text);
        }
        .r-online-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink 1.4s ease-in-out infinite; }
        .earnings-strip {
          background: linear-gradient(90deg, #0F2218 0%, #0F1C28 100%);
          padding: 14px 18px;
          display: flex; justify-content: space-around;
          border-bottom: 1px solid var(--border);
        }
        .earn-item { text-align: center; }
        .earn-val { font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--green-text); }
        .earn-label { font-size: 9px; color: var(--text-2); margin-top: 1px; }
        .job-card {
          margin: 14px 16px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .job-card-header {
          background: var(--orange-dim);
          border-bottom: 1px solid rgba(255,107,53,0.2);
          padding: 10px 14px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .job-type { font-size: 10px; font-weight: 700; color: var(--orange-text); text-transform: uppercase; letter-spacing: 0.05em; }
        .job-amount { font-family: var(--display); font-size: 14px; font-weight: 800; color: var(--orange-text); }
        .job-body { padding: 12px 14px; }
        .route-row {
          display: flex; gap: 10px; align-items: flex-start;
          margin-bottom: 8px;
        }
        .route-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 3px; flex-shrink: 0; }
        .route-dot.pickup { background: var(--text-2); }
        .route-dot.drop { background: var(--blue); }
        .route-address { font-size: 11px; color: var(--text); line-height: 1.4; }
        .route-meta { font-size: 9.5px; color: var(--text-2); margin-top: 1px; }
        .job-actions { padding: 0 14px 14px; display: flex; gap: 8px; }
        .btn-full {
          flex: 1; padding: 10px; border-radius: 9px;
          background: var(--orange); color: white;
          font-size: 12px; font-weight: 700;
          border: none; cursor: pointer;
        }
        .btn-full:hover { opacity: 0.9; }
        .btn-skip {
          padding: 10px 14px; border-radius: 9px;
          background: var(--card2); color: var(--text-2);
          font-size: 12px; font-weight: 600;
          border: 1px solid var(--border2); cursor: pointer;
        }
        .btn-skip:hover { color: var(--text); }
        .admin-header {
          background: #060B12;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .admin-title { font-family: var(--display); font-size: 15px; font-weight: 800; }
        .admin-badge {
          font-size: 9.5px; font-weight: 700;
          background: rgba(139,92,246,0.15); color: #C4B5FD;
          padding: 3px 8px; border-radius: 6px;
        }
        .admin-kpis {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--border);
        }
        .akpi {
          padding: 12px 14px;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .akpi:nth-child(2), .akpi:nth-child(4) { border-right: none; }
        .akpi:nth-child(3), .akpi:nth-child(4) { border-bottom: none; }
        .akpi-val { font-family: var(--display); font-size: 18px; font-weight: 800; color: var(--text); }
        .akpi-label { font-size: 9px; color: var(--text-2); margin-top: 1px; }
        .akpi-delta { font-size: 9.5px; margin-top: 3px; }
        .akpi-delta.up { color: var(--green-text); }
        .akpi-delta.warn { color: var(--amber); }
        .admin-section { padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .admin-section-title { font-size: 10px; font-weight: 700; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
        .live-order-row {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
        }
        .live-order-row:last-child { border-bottom: none; }
        .lor-id { font-family: var(--mono); font-size: 9.5px; color: var(--text-2); width: 54px; flex-shrink: 0; }
        .lor-info { flex: 1; }
        .lor-name { font-size: 11px; font-weight: 600; color: var(--text); }
        .lor-type { font-size: 9.5px; color: var(--text-2); }
        .lor-status {
          font-size: 9px; font-weight: 700;
          padding: 2px 7px; border-radius: 5px;
        }
        .lor-status.live { background: var(--green-dim); color: var(--green-text); }
        .lor-status.transit { background: var(--blue-dim); color: #93C5FD; }
        .lor-status.pending { background: var(--orange-dim); color: var(--orange-text); }
        .bottom-nav {
          display: flex;
          background: #080D14;
          border-top: 1px solid var(--border);
          padding: 10px 0 16px;
        }
        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .nav-item .nav-icon { font-size: 18px; opacity: 0.5; }
        .nav-item.active .nav-icon { opacity: 1; }
        .nav-item .nav-label { font-size: 9px; color: var(--text-3); font-weight: 600; }
        .nav-item.active .nav-label { color: var(--green); }
        .nav-item.active.orange .nav-label { color: var(--orange); }
        .right-panel {}
        .panel-title {
          font-family: var(--display);
          font-size: 16px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 4px;
        }
        .panel-sub { font-size: 12px; color: var(--text-2); margin-bottom: 24px; }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .feat-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .feat-card:hover { border-color: var(--border2); }
        .feat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
        }
        .feat-card.g::after { background: var(--green); }
        .feat-card.o::after { background: var(--orange); }
        .feat-card.b::after { background: var(--blue); }
        .feat-card.p::after { background: #8B5CF6; }
        .feat-icon { font-size: 22px; margin-bottom: 8px; }
        .feat-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
        .feat-desc { font-size: 10.5px; color: var(--text-2); line-height: 1.5; }
        .loop-bar {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 20px;
        }
        .loop-title { font-size: 11px; font-weight: 700; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
        .loop-steps {
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
        }
        .loop-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 72px;
          position: relative;
        }
        .loop-step:not(:last-child)::after {
          content: '→';
          position: absolute;
          right: -8px;
          top: 10px;
          font-size: 12px;
          color: var(--green);
          font-weight: 700;
        }
        .loop-dot {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--green-dim);
          border: 1.5px solid rgba(0,196,122,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          margin-bottom: 6px;
        }
        .loop-dot.last { background: rgba(0,230,138,0.2); border-color: var(--green); }
        .loop-label { font-size: 9px; color: var(--text-2); text-align: center; line-height: 1.3; }
        .tech-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .tech-tag {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text-2);
          background: var(--card);
          border: 1px solid var(--border);
          padding: 4px 10px;
          border-radius: 6px;
        }
        .tech-tag.highlight {
          background: var(--green-dim);
          border-color: rgba(0,196,122,0.25);
          color: var(--green-text);
        }
        .info-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .info-card-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .info-card-icon { font-size: 14px; }
        .collab-strip {
          background: linear-gradient(135deg, rgba(0,196,122,0.08) 0%, rgba(37,99,235,0.08) 100%);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .collab-icon { font-size: 28px; flex-shrink: 0; }
        .collab-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
        .collab-desc { font-size: 10.5px; color: var(--text-2); line-height: 1.5; }
        .collab-badge {
          margin-left: auto;
          background: rgba(37,99,235,0.15);
          color: #93C5FD;
          font-size: 9.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>

      <div className="shell">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-logo">task<span>it</span> <span style={{color:"var(--text-3)",fontWeight:400,fontSize:14}}>v2</span></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:11,color:"var(--text-2)"}}>Platform Mockup — Squareroot Inc</span>
            <div className="page-badge">UI Preview</div>
          </div>
        </div>

        {/* ROLE SWITCHER */}
        <div className="role-bar">
          {(["customer","vendor","rider","admin"] as const).map((r) => {
            const icons: Record<Role, string> = { customer: "👤", vendor: "🏪", rider: "🛵", admin: "⚙️" };
            const labels: Record<Role, string> = { customer: "Customer", vendor: "Vendor", rider: "Rider", admin: "Admin" };
            const extras: Record<Role, string> = { customer: "", vendor: "", rider: "orange", admin: "purple" };
            return (
              <div
                key={r}
                className={`role-tab ${role === r ? "active " + extras[r] : ""}`}
                onClick={() => { setRole(r); if (r !== "customer") setScreen("home"); }}
              >
                <span className="role-icon">{icons[r]}</span> {labels[r]}
              </div>
            );
          })}
        </div>

        <div className="demo-grid">
          {/* PHONE */}
          <div className="phone-wrap">
            <div className="phone-frame">
              <div className="phone-notch"><div className="phone-notch-pill"></div></div>
              <div className="phone-status">
                <span>9:41</span>
                <span>📶 ⚡ 87%</span>
              </div>

              {/* CUSTOMER - HOME */}
              <div className={`screen ${role === "customer" && screen === "home" ? "active" : ""}`}>
                <div className="app-topbar">
                  <div className="app-logo">task<span>it</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:"var(--text-2)",fontWeight:500}}>📍 Nairobi CBD</span>
                    <div className="app-notif">🔔<span className="notif-dot"></span></div>
                  </div>
                </div>
                <div className="app-body">
                  <div className="greeting">
                    <div className="greeting-name">Good morning, Wanjiru 👋</div>
                    <div className="greeting-sub">What do you need done today?</div>
                  </div>
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <span className="search-text">Search services, vendors, errands…</span>
                  </div>
                  <div className="quick-grid">
                    <div className="quick-card g" onClick={() => setScreen("track")}>
                      <div className="quick-icon">🏃</div>
                      <div className="quick-label">Run an Errand</div>
                      <div className="quick-sub">From KSh 150 flat rate</div>
                    </div>
                    <div className="quick-card o">
                      <div className="quick-icon">🛒</div>
                      <div className="quick-label">Marketplace</div>
                      <div className="quick-sub">Order & get delivered</div>
                    </div>
                    <div className="quick-card b">
                      <div className="quick-icon">🔧</div>
                      <div className="quick-label">Hire a Pro</div>
                      <div className="quick-sub">Plumber, cleaner, fundi</div>
                    </div>
                    <div className="quick-card p">
                      <div className="quick-icon">🚛</div>
                      <div className="quick-label">Big Delivery</div>
                      <div className="quick-sub">Powered by KaniniOS</div>
                    </div>
                  </div>
                  <div className="section-label">Active Orders</div>
                  <div className="order-card">
                    <div className="order-icon-wrap green">🏃</div>
                    <div>
                      <div className="order-name">Grocery run — Tuskys</div>
                      <div className="order-meta">Rider: Peter M. · 12 min away</div>
                    </div>
                    <div className="order-status live" onClick={() => setScreen("track")} style={{cursor:"pointer"}}>Live ›</div>
                  </div>
                  <div className="order-card">
                    <div className="order-icon-wrap orange">🛒</div>
                    <div>
                      <div className="order-name">Unga Pembe 2kg × 3</div>
                      <div className="order-meta">Kanini Haraka · Est. 45 min</div>
                    </div>
                    <div className="order-status transit">On way</div>
                  </div>
                </div>
                <div className="bottom-nav">
                  <div className="nav-item active"><span className="nav-icon">🏠</span><span className="nav-label">Home</span></div>
                  <div className="nav-item"><span className="nav-icon">🔍</span><span className="nav-label">Explore</span></div>
                  <div className="nav-item"><span className="nav-icon">📋</span><span className="nav-label">Orders</span></div>
                  <div className="nav-item"><span className="nav-icon">👤</span><span className="nav-label">Profile</span></div>
                </div>
              </div>

              {/* CUSTOMER - TRACKING */}
              <div className={`screen ${role === "customer" && screen === "track" ? "active" : ""}`}>
                <div className="track-header">
                  <div className="track-back" onClick={() => setScreen("home")}>← Back to orders</div>
                  <div className="track-title">Grocery Run — Tuskys Westlands</div>
                  <div className="track-id">#TK-2847</div>
                </div>
                <div className="map-placeholder">
                  <div className="map-grid-h"></div>
                  <div className="map-road-h" style={{top:"40%",left:0,right:0,height:12}}></div>
                  <div className="map-road-h" style={{top:"68%",left:0,right:0,height:8}}></div>
                  <div className="map-road-v" style={{left:"30%",top:0,bottom:0,width:10}}></div>
                  <div className="map-road-v" style={{left:"65%",top:0,bottom:0,width:7}}></div>
                  <div className="map-label" style={{top:"22%",left:"8%"}}>Westlands</div>
                  <div className="map-label" style={{top:"70%",right:"8%"}}>CBD</div>
                  <div className="map-pin-start" style={{top:"36%",left:"26%"}}></div>
                  <div className="map-pin-end" style={{bottom:"20%",right:"14%"}}></div>
                  <div className="rider-dot" style={{top:"42%",left:"52%"}}>🛵</div>
                </div>
                <div className="track-body">
                  <div className="eta-bar">
                    <div>
                      <div className="eta-label">Arriving in</div>
                      <div className="eta-meta">Rider 1.2km away</div>
                    </div>
                    <div className="eta-time">12 min</div>
                  </div>
                  <div className="progress-steps">
                    <div className="step done"><div className="step-dot">✓</div><span className="step-label">Placed</span></div>
                    <div className="step done"><div className="step-dot">✓</div><span className="step-label">Accepted</span></div>
                    <div className="step done"><div className="step-dot">✓</div><span className="step-label">Picked up</span></div>
                    <div className="step active"><div className="step-dot">🛵</div><span className="step-label">On way</span></div>
                    <div className="step"><div className="step-dot">📦</div><span className="step-label">Delivered</span></div>
                  </div>
                  <div className="rider-info">
                    <div className="rider-av">PM</div>
                    <div>
                      <div className="rider-name">Peter Mwangi</div>
                      <div className="rider-meta">🛵 Honda Wave · KBZ 441Y</div>
                    </div>
                    <div className="rider-rating">⭐ 4.9</div>
                  </div>
                </div>
                <div className="bottom-nav">
                  <div className="nav-item"><span className="nav-icon">📞</span><span className="nav-label">Call rider</span></div>
                  <div className="nav-item active orange"><span className="nav-icon">🗺️</span><span className="nav-label">Tracking</span></div>
                  <div className="nav-item"><span className="nav-icon">💬</span><span className="nav-label">Chat</span></div>
                  <div className="nav-item"><span className="nav-icon">❌</span><span className="nav-label">Cancel</span></div>
                </div>
              </div>

              {/* VENDOR */}
              <div className={`screen ${role === "vendor" ? "active" : ""}`}>
                <div className="vendor-header">
                  <div className="vendor-name">Mama Njeri's Kitchen</div>
                  <div className="vendor-meta">Westlands · Food & Grocery</div>
                  <div className="vendor-status"><span className="vendor-dot"></span> Open for orders</div>
                </div>
                <div className="vendor-stats">
                  <div className="vstat">
                    <div className="vstat-val" style={{color:"var(--green-text)"}}>KSh 8.4K</div>
                    <div className="vstat-label">Today</div>
                  </div>
                  <div className="vstat">
                    <div className="vstat-val">23</div>
                    <div className="vstat-label">Orders</div>
                  </div>
                  <div className="vstat">
                    <div className="vstat-val" style={{color:"var(--amber)"}}>⭐4.8</div>
                    <div className="vstat-label">Rating</div>
                  </div>
                </div>
                <div className="order-queue">
                  <div className="queue-title">
                    <span>Incoming Orders</span>
                    <span className="queue-badge">3 new</span>
                  </div>
                  <div className="vendor-order">
                    <div className="vo-top">
                      <span className="vo-id">#TK-2851</span>
                      <span className="vo-time">2 min ago</span>
                    </div>
                    <div className="vo-items">Pilau × 2, Kachumbari, Soda</div>
                    <div className="vo-amount">KSh 680 · Cash on delivery</div>
                    <div className="vo-actions">
                      <button className="btn-accept">Accept Order</button>
                      <button className="btn-decline">Decline</button>
                    </div>
                  </div>
                  <div className="vendor-order" style={{opacity:0.7}}>
                    <div className="vo-top">
                      <span className="vo-id">#TK-2849</span>
                      <span className="vo-time">8 min ago</span>
                    </div>
                    <div className="vo-items">Ugali, Sukuma wiki, Beef</div>
                    <div className="vo-amount">KSh 520 · M-Pesa paid ✓</div>
                    <div className="vo-actions">
                      <button className="btn-accept" style={{background:"var(--blue)",color:"white"}}>Preparing</button>
                    </div>
                  </div>
                </div>
                <div className="bottom-nav">
                  <div className="nav-item active"><span className="nav-icon">📋</span><span className="nav-label">Orders</span></div>
                  <div className="nav-item"><span className="nav-icon">🛍️</span><span className="nav-label">Menu</span></div>
                  <div className="nav-item"><span className="nav-icon">📊</span><span className="nav-label">Earnings</span></div>
                  <div className="nav-item"><span className="nav-icon">⚙️</span><span className="nav-label">Settings</span></div>
                </div>
              </div>

              {/* RIDER */}
              <div className={`screen ${role === "rider" ? "active" : ""}`}>
                <div className="rider-screen-header">
                  <div>
                    <div className="rider-screen-name">Grace Kamau</div>
                    <div style={{fontSize:"9.5px",color:"var(--text-2)"}}>Rider ID: #R-0442</div>
                  </div>
                  <div className="rider-online"><span className="r-online-dot"></span> Online</div>
                </div>
                <div className="earnings-strip">
                  <div className="earn-item">
                    <div className="earn-val">KSh 1,840</div>
                    <div className="earn-label">Today's earnings</div>
                  </div>
                  <div className="earn-item">
                    <div className="earn-val">14</div>
                    <div className="earn-label">Trips done</div>
                  </div>
                  <div className="earn-item">
                    <div className="earn-val">⭐ 4.8</div>
                    <div className="earn-label">Rating</div>
                  </div>
                </div>
                <div style={{padding:"14px 16px 0",fontSize:10,fontWeight:700,color:"var(--orange-text)",letterSpacing:"0.06em",textTransform:"uppercase"}}>New Job Request</div>
                <div className="job-card">
                  <div className="job-card-header">
                    <span className="job-type">Errand</span>
                    <span className="job-amount">KSh 180</span>
                  </div>
                  <div className="job-body">
                    <div className="route-row">
                      <div className="route-dot pickup"></div>
                      <div>
                        <div className="route-address">Tuskys Supermarket, Westlands</div>
                        <div className="route-meta">Pickup — 0.4km away</div>
                      </div>
                    </div>
                    <div style={{borderLeft:"1.5px dashed var(--border2)",height:10,marginLeft:4}}></div>
                    <div className="route-row">
                      <div className="route-dot drop"></div>
                      <div>
                        <div className="route-address">Parklands Road, Apt 4B</div>
                        <div className="route-meta">Drop-off · Customer: Wanjiru N.</div>
                      </div>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="btn-full">Accept — KSh 180</button>
                    <button className="btn-skip">Skip</button>
                  </div>
                </div>
                <div className="bottom-nav">
                  <div className="nav-item active orange"><span className="nav-icon">🗺️</span><span className="nav-label">Jobs</span></div>
                  <div className="nav-item"><span className="nav-icon">📊</span><span className="nav-label">Earnings</span></div>
                  <div className="nav-item"><span className="nav-icon">🕐</span><span className="nav-label">History</span></div>
                  <div className="nav-item"><span className="nav-icon">👤</span><span className="nav-label">Profile</span></div>
                </div>
              </div>

              {/* ADMIN */}
              <div className={`screen ${role === "admin" ? "active" : ""}`}>
                <div className="admin-header">
                  <div>
                    <div className="admin-title">Admin Console</div>
                    <div style={{fontSize:"9.5px",color:"var(--text-2)",marginTop:1}}>Nairobi · All Zones</div>
                  </div>
                  <div className="admin-badge">Super Admin</div>
                </div>
                <div className="admin-kpis">
                  <div className="akpi">
                    <div className="akpi-val" style={{color:"var(--green-text)"}}>KSh 42K</div>
                    <div className="akpi-label">Revenue today</div>
                    <div className="akpi-delta up">▲ 18% vs yesterday</div>
                  </div>
                  <div className="akpi">
                    <div className="akpi-val">187</div>
                    <div className="akpi-label">Orders today</div>
                    <div className="akpi-delta up">▲ 23 active live</div>
                  </div>
                  <div className="akpi">
                    <div className="akpi-val">34</div>
                    <div className="akpi-label">Riders online</div>
                    <div className="akpi-delta warn">⚠ 6 zones low</div>
                  </div>
                  <div className="akpi">
                    <div className="akpi-val">96%</div>
                    <div className="akpi-label">Completion rate</div>
                    <div className="akpi-delta up">▲ 2pts this week</div>
                  </div>
                </div>
                <div className="admin-section">
                  <div className="admin-section-title">Live Orders</div>
                  <div className="live-order-row">
                    <span className="lor-id">#TK-2851</span>
                    <div className="lor-info">
                      <div className="lor-name">Errand — Westlands</div>
                      <div className="lor-type">Rider: Peter M.</div>
                    </div>
                    <span className="lor-status live">Live</span>
                  </div>
                  <div className="live-order-row">
                    <span className="lor-id">#TK-2849</span>
                    <div className="lor-info">
                      <div className="lor-name">Marketplace — Mama Njeri's</div>
                      <div className="lor-type">Rider: Grace K.</div>
                    </div>
                    <span className="lor-status transit">Transit</span>
                  </div>
                  <div className="live-order-row">
                    <span className="lor-id">#TK-2847</span>
                    <div className="lor-info">
                      <div className="lor-name">LaaS — KaniniOS Delivery</div>
                      <div className="lor-type">Rider: James O.</div>
                    </div>
                    <span className="lor-status pending">Assigned</span>
                  </div>
                </div>
                <div className="bottom-nav">
                  <div className="nav-item active"><span className="nav-icon">📊</span><span className="nav-label">Dashboard</span></div>
                  <div className="nav-item"><span className="nav-icon">📋</span><span className="nav-label">Orders</span></div>
                  <div className="nav-item"><span className="nav-icon">🛵</span><span className="nav-label">Riders</span></div>
                  <div className="nav-item"><span className="nav-icon">⚙️</span><span className="nav-label">Settings</span></div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            {/* CUSTOMER PANEL */}
            {role === "customer" && (
              <div>
                <div className="panel-title">Customer Experience</div>
                <div className="panel-sub">Mobile-first · M-Pesa payments · Real-time tracking · Four product lines</div>
                <div className="loop-bar">
                  <div className="loop-title">The Core Transaction Loop</div>
                  <div className="loop-steps">
                    <div className="loop-step"><div className="loop-dot">📱</div><span className="loop-label">Customer places order</span></div>
                    <div className="loop-step"><div className="loop-dot">🏪</div><span className="loop-label">Vendor accepts</span></div>
                    <div className="loop-step"><div className="loop-dot">🛵</div><span className="loop-label">Rider assigned</span></div>
                    <div className="loop-step"><div className="loop-dot">📍</div><span className="loop-label">Pickup & deliver</span></div>
                    <div className="loop-step"><div className="loop-dot last">💚</div><span className="loop-label">M-Pesa payment</span></div>
                  </div>
                </div>
                <div className="feature-grid">
                  <div className="feat-card g">
                    <div className="feat-icon">🏃</div>
                    <div className="feat-title">Errands</div>
                    <div className="feat-desc">Zone-based flat pricing, instant dispatch, same-day. From KSh 150.</div>
                  </div>
                  <div className="feat-card o">
                    <div className="feat-icon">🛒</div>
                    <div className="feat-title">Marketplace</div>
                    <div className="feat-desc">Browse vendors, cart, pay via M-Pesa STK Push, track delivery.</div>
                  </div>
                  <div className="feat-card b">
                    <div className="feat-icon">🔧</div>
                    <div className="feat-title">Services</div>
                    <div className="feat-desc">Book verified pros — plumber, electrician, cleaner. Slot-based.</div>
                  </div>
                  <div className="feat-card p">
                    <div className="feat-icon">🚛</div>
                    <div className="feat-title">LaaS API</div>
                    <div className="feat-desc">B2B logistics for enterprise clients. KaniniOS integration live.</div>
                  </div>
                </div>
                <div className="collab-strip">
                  <div className="collab-icon">🔗</div>
                  <div>
                    <div className="collab-title">KaniniOS Integration (LaaS)</div>
                    <div className="collab-desc">Taskit handles small-load deliveries for Kanini Haraka's 10 branches. Jobs arrive via API, riders dispatch in minutes, proof of delivery syncs back automatically.</div>
                  </div>
                  <div className="collab-badge">Live from Day 1</div>
                </div>
              </div>
            )}

            {/* VENDOR PANEL */}
            {role === "vendor" && (
              <div>
                <div className="panel-title">Vendor Dashboard</div>
                <div className="panel-sub">Manage orders, listings, and earnings from one screen</div>
                <div className="feature-grid">
                  <div className="feat-card g"><div className="feat-icon">📋</div><div className="feat-title">Order Queue</div><div className="feat-desc">Accept or decline incoming orders in real time. Timer shows urgency.</div></div>
                  <div className="feat-card o"><div className="feat-icon">🛍️</div><div className="feat-title">Listings</div><div className="feat-desc">Manage products, prices, availability, photos. Update instantly.</div></div>
                  <div className="feat-card b"><div className="feat-icon">📊</div><div className="feat-title">Revenue</div><div className="feat-desc">Daily, weekly, monthly earnings. Breakdown by product and order type.</div></div>
                  <div className="feat-card p"><div className="feat-icon">⭐</div><div className="feat-title">Ratings</div><div className="feat-desc">Customer reviews after every delivery. Build your reputation on the platform.</div></div>
                </div>
                <div className="info-card">
                  <div className="info-card-title"><span className="info-card-icon">💰</span> Vendor Payout</div>
                  <div style={{fontSize:"10.5px",color:"var(--text-2)",lineHeight:1.6}}>Earnings deposited to M-Pesa weekly after platform commission (10–15%). Real-time balance visible in the app at all times.</div>
                </div>
                <div className="info-card">
                  <div className="info-card-title"><span className="info-card-icon">📦</span> Rider Assignment</div>
                  <div style={{fontSize:"10.5px",color:"var(--text-2)",lineHeight:1.6}}>When you accept an order, Taskit auto-assigns the nearest available rider. No calls, no coordination. You prepare; they pick up.</div>
                </div>
              </div>
            )}

            {/* RIDER PANEL */}
            {role === "rider" && (
              <div>
                <div className="panel-title">Rider App</div>
                <div className="panel-sub">Job queue · Earnings · Navigation · Status updates</div>
                <div className="feature-grid">
                  <div className="feat-card o"><div className="feat-icon">📳</div><div className="feat-title">Job Alerts</div><div className="feat-desc">New jobs ping instantly. See distance, pay, and route before accepting.</div></div>
                  <div className="feat-card g"><div className="feat-icon">💸</div><div className="feat-title">Earnings</div><div className="feat-desc">Live daily total. Weekly M-Pesa payout. Full job history.</div></div>
                  <div className="feat-card b"><div className="feat-icon">📍</div><div className="feat-title">Navigation</div><div className="feat-desc">Route shown in-app. Status updates with one tap — no calls needed.</div></div>
                  <div className="feat-card p"><div className="feat-icon">📸</div><div className="feat-title">Proof of Delivery</div><div className="feat-desc">Photo on delivery. Auto-sent to customer and admin. Job complete.</div></div>
                </div>
                <div className="info-card">
                  <div className="info-card-title"><span className="info-card-icon">🚛</span> KaniniOS Jobs</div>
                  <div style={{fontSize:"10.5px",color:"var(--text-2)",lineHeight:1.6}}>Some jobs come from Kanini Haraka's wholesale system via the LaaS API. They look identical to regular jobs — same accept flow, same proof of delivery, same payout.</div>
                </div>
              </div>
            )}

            {/* ADMIN PANEL */}
            {role === "admin" && (
              <div>
                <div className="panel-title">Admin Console</div>
                <div className="panel-sub">Platform-wide control · All roles · All zones · Real-time</div>
                <div className="feature-grid">
                  <div className="feat-card g"><div className="feat-icon">📊</div><div className="feat-title">Live Dashboard</div><div className="feat-desc">Active orders, revenue, riders online, completion rate — all in real time.</div></div>
                  <div className="feat-card o"><div className="feat-icon">⚠️</div><div className="feat-title">Disputes</div><div className="feat-desc">Flag, refund, or escalate any order. Full audit trail for every action.</div></div>
                  <div className="feat-card b"><div className="feat-icon">👥</div><div className="feat-title">User Management</div><div className="feat-desc">Approve vendors, verify riders, manage customer accounts.</div></div>
                  <div className="feat-card p"><div className="feat-icon">🔗</div><div className="feat-title">LaaS Console</div><div className="feat-desc">Monitor KaniniOS API jobs, SLA tracking, monthly reconciliation.</div></div>
                </div>
                <div className="tech-row">
                  <span className="tech-tag highlight">Next.js</span>
                  <span className="tech-tag highlight">M-Pesa Daraja</span>
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">PostgreSQL</span>
                  <span className="tech-tag">Socket.io</span>
                  <span className="tech-tag">Google Maps</span>
                  <span className="tech-tag">Africa's Talking</span>
                  <span className="tech-tag highlight">LaaS API</span>
                </div>
                <div className="collab-strip">
                  <div className="collab-icon">🏢</div>
                  <div>
                    <div className="collab-title">Enterprise LaaS — KaniniOS</div>
                    <div className="collab-desc">Admin sees all KaniniOS-dispatched jobs in the same order feed. SLA breach alerts, monthly invoice generation, and API health monitoring built in.</div>
                  </div>
                  <div className="collab-badge">B2B Anchor</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
