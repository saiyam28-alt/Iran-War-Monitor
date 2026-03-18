import React, { useState, useEffect, useRef } from "react";

const OPENROUTER_API_KEY = "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"; // paste your OpenRouter key here sk-or-...

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&display=swap');`;

const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --bg:#080b0f; --bg2:#0d1117; --bg3:#111820; --panel:#0f1923;
  --border:#1e2d3d; --border2:#243447;
  --amber:#f5a623; --amber2:#ffc453;
  --red:#e63946; --red2:#ff6b6b;
  --green:#39d353; --cyan:#00b4d8; --cyan2:#48cae4;
  --purple:#b388ff; --purple2:#ce9fff;
  --orange:#ff8c42; --orange2:#ffab6e;
  --text:#c9d6e3; --text2:#8899aa; --text3:#556677; --white:#eef4ff;
  --mono:'Share Tech Mono',monospace;
  --head:'Barlow Condensed',sans-serif;
  --body:'Barlow',sans-serif;
}
html,body,#root{height:100%;}
body{background:var(--bg);color:var(--text);font-family:var(--body);overflow:hidden;}
.scanline{position:fixed;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px);pointer-events:none;z-index:1000;}
.app{display:flex;flex-direction:column;height:100vh;}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 14px;height:50px;background:var(--bg2);border-bottom:1px solid var(--border);flex-shrink:0;gap:8px;}
.tl{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.logo{font-family:var(--head);font-weight:900;font-size:17px;letter-spacing:3px;color:var(--amber);text-transform:uppercase;}
.logo span{color:var(--red);}
.dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.live{font-family:var(--mono);font-size:9px;color:var(--green);letter-spacing:2px;padding:2px 5px;border:1px solid var(--green);border-radius:2px;}
.tc{font-family:var(--mono);font-size:10px;color:var(--text2);letter-spacing:1px;flex:1;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tr{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.escal{font-family:var(--head);font-weight:700;font-size:12px;letter-spacing:1px;padding:3px 9px;background:rgba(230,57,70,0.15);border:1px solid var(--red);color:var(--red2);border-radius:2px;white-space:nowrap;}
.clock{font-family:var(--mono);font-size:11px;color:var(--amber);letter-spacing:2px;white-space:nowrap;}
.ticker{background:rgba(230,57,70,0.07);border-bottom:1px solid rgba(230,57,70,0.18);padding:5px 0;overflow:hidden;flex-shrink:0;display:flex;align-items:center;}
.tlabel{font-family:var(--head);font-weight:900;font-size:10px;letter-spacing:2px;color:var(--red);padding:0 12px;white-space:nowrap;flex-shrink:0;animation:blink 1.5s step-end infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
.twrap{flex:1;overflow:hidden;}
.ttrack{display:inline-flex;gap:40px;animation:tscroll 50s linear infinite;white-space:nowrap;}
@keyframes tscroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.titem{font-family:var(--mono);font-size:10px;color:var(--red2);letter-spacing:0.5px;}
.tsep{color:var(--text3);margin:0 8px;}
.nav{display:flex;align-items:center;background:var(--bg3);border-bottom:1px solid var(--border);padding:0 4px;flex-shrink:0;overflow-x:auto;-webkit-overflow-scrolling:touch;}
.nav::-webkit-scrollbar{display:none;}
.ntab{font-family:var(--head);font-weight:600;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;padding:9px 12px;color:var(--text3);border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;white-space:nowrap;}
.ntab:hover{color:var(--text2);}
.ntab.on{color:var(--amber);border-bottom-color:var(--amber);}
.ntab.threat.on{color:var(--red2);border-bottom-color:var(--red);}
.nbadge{font-family:var(--mono);font-size:9px;margin-left:4px;background:rgba(245,166,35,0.12);padding:1px 4px;border-radius:2px;color:var(--amber);}
.nbadge.r{background:rgba(230,57,70,0.12);color:var(--red2);}
.main{display:flex;flex:1;overflow:hidden;}
.lp{flex:1;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--border);min-width:0;}
.ph{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;border-bottom:1px solid var(--border);background:var(--panel);flex-shrink:0;}
.pt{font-family:var(--head);font-weight:700;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--text2);}
.pm{font-family:var(--mono);font-size:9px;color:var(--text3);}
.frow{display:flex;gap:5px;padding:7px 10px;border-bottom:1px solid var(--border);flex-shrink:0;flex-wrap:wrap;background:var(--bg2);}
.fb{font-family:var(--mono);font-size:9px;letter-spacing:1px;padding:3px 7px;border-radius:2px;cursor:pointer;border:1px solid var(--border2);background:transparent;color:var(--text2);transition:all 0.15s;}
.fb:hover,.fb.on{background:rgba(245,166,35,0.1);border-color:var(--amber);color:var(--amber);}
.fb.fc.on{background:rgba(179,136,255,0.1);border-color:var(--purple);color:var(--purple2);}
.fb.fi.on{background:rgba(255,140,66,0.1);border-color:var(--orange);color:var(--orange2);}
.fb.fm.on{background:rgba(230,57,70,0.1);border-color:var(--red);color:var(--red2);}
.fb.fn.on{background:rgba(0,180,216,0.1);border-color:var(--cyan);color:var(--cyan2);}
.fb.fd.on{background:rgba(57,211,83,0.1);border-color:var(--green);color:#7fff7f;}
.fl{flex:1;overflow-y:auto;padding:6px;-webkit-overflow-scrolling:touch;}
.fl::-webkit-scrollbar{width:3px;}
.fl::-webkit-scrollbar-thumb{background:var(--border2);}
.fi{padding:10px 12px;margin-bottom:5px;background:var(--panel);border:1px solid var(--border);border-left:3px solid var(--border2);border-radius:2px;cursor:pointer;transition:all 0.15s;animation:sin 0.3s ease-out;}
@keyframes sin{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
.fi:hover{background:var(--bg3);}
.fi.strike{border-left-color:var(--red);}
.fi.naval{border-left-color:var(--cyan);}
.fi.diplomatic{border-left-color:var(--green);}
.fi.cyber{border-left-color:var(--purple);}
.fi.sanctions{border-left-color:var(--amber);}
.fi.corp-threat{border-left-color:var(--purple);background:rgba(179,136,255,0.03);}
.fi.infra-threat{border-left-color:var(--orange);background:rgba(255,140,66,0.03);}
.fi.missile{border-left-color:var(--red);background:rgba(230,57,70,0.04);}
.fi.priority{border-top:1px solid rgba(230,57,70,0.22);}
.fit{display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap;}
.sb{font-family:var(--mono);font-size:9px;letter-spacing:1px;padding:2px 5px;border-radius:1px;text-transform:uppercase;font-weight:bold;}
.t1{background:rgba(57,211,83,0.1);color:var(--green);border:1px solid rgba(57,211,83,0.2);}
.t2{background:rgba(245,166,35,0.1);color:var(--amber);border:1px solid rgba(245,166,35,0.2);}
.t3{background:rgba(0,180,216,0.1);color:var(--cyan);border:1px solid rgba(0,180,216,0.2);}
.ct{font-family:var(--mono);font-size:9px;letter-spacing:1px;padding:2px 5px;border-radius:1px;text-transform:uppercase;background:rgba(255,255,255,0.03);border:1px solid var(--border2);color:var(--text3);}
.ct.strike{color:var(--red2);border-color:rgba(230,57,70,0.3);background:rgba(230,57,70,0.06);}
.ct.naval{color:var(--cyan2);border-color:rgba(0,180,216,0.3);background:rgba(0,180,216,0.06);}
.ct.diplomatic{color:#7fff7f;border-color:rgba(57,211,83,0.3);background:rgba(57,211,83,0.06);}
.ct.cyber{color:var(--purple);border-color:rgba(179,136,255,0.3);background:rgba(179,136,255,0.06);}
.ct.sanctions{color:var(--amber2);border-color:rgba(245,166,35,0.3);background:rgba(245,166,35,0.06);}
.ct.corp-threat{color:var(--purple2);border-color:rgba(179,136,255,0.35);background:rgba(179,136,255,0.08);}
.ct.infra-threat{color:var(--orange2);border-color:rgba(255,140,66,0.35);background:rgba(255,140,66,0.08);}
.ct.missile{color:var(--red2);border-color:rgba(230,57,70,0.35);background:rgba(230,57,70,0.08);}
.btag{font-family:var(--head);font-weight:900;font-size:9px;letter-spacing:2px;color:var(--red);animation:blink 1s step-end infinite;}
.ttag{font-family:var(--head);font-weight:900;font-size:9px;letter-spacing:2px;color:var(--red2);background:rgba(230,57,70,0.12);padding:2px 6px;border:1px solid rgba(230,57,70,0.3);border-radius:2px;animation:blink 1.5s step-end infinite;}
.kh{background:rgba(245,166,35,0.2);color:var(--amber2);border-radius:2px;padding:0 2px;}
.fh{font-family:var(--head);font-weight:600;font-size:14px;line-height:1.3;color:var(--white);margin-bottom:4px;}
.fs{font-size:11px;color:var(--text2);line-height:1.45;margin-bottom:5px;}
.ftime{font-family:var(--mono);font-size:10px;color:var(--text3);}
.sp{flex:1;overflow-y:auto;padding:12px;-webkit-overflow-scrolling:touch;}
.sp::-webkit-scrollbar{width:3px;}
.sp::-webkit-scrollbar-thumb{background:var(--border2);}
.sl{font-family:var(--head);font-weight:700;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--border);}
.tsh{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;}
.tsi{font-size:16px;}
.tst{font-family:var(--head);font-weight:700;font-size:15px;letter-spacing:1px;color:var(--white);}
.tsc{font-family:var(--mono);font-size:10px;padding:2px 6px;border-radius:2px;}
.tsc.c{background:rgba(179,136,255,0.1);color:var(--purple2);border:1px solid rgba(179,136,255,0.25);}
.tsc.i{background:rgba(255,140,66,0.1);color:var(--orange2);border:1px solid rgba(255,140,66,0.25);}
.tsc.m{background:rgba(230,57,70,0.1);color:var(--red2);border:1px solid rgba(230,57,70,0.25);}
.cc{padding:10px 12px;margin-bottom:6px;background:rgba(179,136,255,0.03);border:1px solid rgba(179,136,255,0.18);border-left:3px solid var(--purple);border-radius:2px;}
.cct{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px;gap:6px;flex-wrap:wrap;}
.ccn{font-family:var(--head);font-weight:700;font-size:13px;color:var(--purple2);letter-spacing:0.5px;}
.ccb{display:flex;gap:5px;align-items:center;flex-wrap:wrap;}
.ccc{font-family:var(--mono);font-size:9px;color:var(--text3);padding:2px 5px;border:1px solid var(--border2);border-radius:2px;}
.lv{font-family:var(--mono);font-size:9px;padding:2px 5px;border-radius:2px;}
.lv.high{background:rgba(230,57,70,0.12);color:var(--red2);border:1px solid rgba(230,57,70,0.25);}
.lv.medium{background:rgba(245,166,35,0.12);color:var(--amber);border:1px solid rgba(245,166,35,0.25);}
.lv.low{background:rgba(57,211,83,0.08);color:var(--green);border:1px solid rgba(57,211,83,0.15);}
.ccd{font-size:12px;color:var(--text);line-height:1.45;margin-bottom:5px;}
.ccm{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.ccs{font-family:var(--mono);font-size:9px;color:var(--cyan);}
.cct2{font-family:var(--mono);font-size:9px;color:var(--text3);}
.ic{padding:10px 12px;margin-bottom:6px;background:rgba(255,140,66,0.03);border:1px solid rgba(255,140,66,0.18);border-left:3px solid var(--orange);border-radius:2px;}
.ict{display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;}
.ici{font-size:14px;}
.icn{font-family:var(--head);font-weight:700;font-size:13px;color:var(--orange2);}
.icty{font-family:var(--mono);font-size:9px;color:var(--text3);padding:2px 5px;border:1px solid var(--border2);border-radius:2px;}
.ico{font-family:var(--mono);font-size:9px;color:var(--text3);}
.ics{font-family:var(--mono);font-size:9px;padding:2px 5px;border-radius:2px;}
.ics.active-threat{background:rgba(230,57,70,0.12);color:var(--red2);border:1px solid rgba(230,57,70,0.25);animation:blink 2s step-end infinite;}
.ics.monitoring{background:rgba(245,166,35,0.1);color:var(--amber);border:1px solid rgba(245,166,35,0.2);}
.ics.clear{background:rgba(57,211,83,0.07);color:var(--green);border:1px solid rgba(57,211,83,0.12);}
.icd{font-size:11px;color:var(--text2);line-height:1.4;margin-bottom:4px;}
.icm{font-family:var(--mono);font-size:9px;color:var(--text3);}
.amb{margin-top:10px;padding:12px;background:var(--bg2);border:1px dashed var(--border2);border-radius:2px;}
.ambt{font-family:var(--head);font-weight:700;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.ambh{font-family:var(--mono);font-size:10px;color:var(--text3);margin-bottom:8px;line-height:1.5;}
.ambi{flex:1;min-width:120px;background:var(--panel);border:1px solid var(--border2);color:var(--white);font-family:var(--mono);font-size:11px;padding:7px 9px;border-radius:2px;outline:none;transition:border-color 0.2s;}
.ambi:focus{border-color:var(--amber);}
.ambb{background:rgba(245,166,35,0.1);border:1px solid var(--amber);color:var(--amber);font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:1px;padding:7px 14px;border-radius:2px;cursor:pointer;transition:all 0.15s;text-transform:uppercase;white-space:nowrap;}
.ambb:hover{background:rgba(245,166,35,0.2);}
.amr{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;}
.xbtn{background:rgba(230,57,70,0.07);border:1px solid rgba(230,57,70,0.2);color:var(--red2);font-size:11px;width:22px;height:22px;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.xbtn:hover{background:rgba(230,57,70,0.15);}
.mst{width:100%;border-collapse:collapse;font-size:11px;}
.mst th{font-family:var(--head);font-weight:700;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);padding:5px 8px;border-bottom:1px solid var(--border);text-align:left;background:var(--bg2);white-space:nowrap;}
.mst td{padding:7px 8px;border-bottom:1px solid rgba(30,45,61,0.5);color:var(--text2);vertical-align:middle;}
.mst tr:hover td{background:rgba(255,255,255,0.015);}
.mty{font-family:var(--mono);font-size:9px;padding:2px 5px;border-radius:2px;white-space:nowrap;}
.mty.ballistic{background:rgba(230,57,70,0.1);color:var(--red2);border:1px solid rgba(230,57,70,0.2);}
.mty.cruise{background:rgba(255,140,66,0.1);color:var(--orange2);border:1px solid rgba(255,140,66,0.2);}
.mty.drone{background:rgba(179,136,255,0.1);color:var(--purple2);border:1px solid rgba(179,136,255,0.2);}
.mou{font-family:var(--mono);font-size:9px;padding:2px 5px;border-radius:2px;white-space:nowrap;}
.mou.intercepted{background:rgba(57,211,83,0.08);color:var(--green);border:1px solid rgba(57,211,83,0.15);}
.mou.hit{background:rgba(230,57,70,0.1);color:var(--red2);border:1px solid rgba(230,57,70,0.2);}
.mou.unknown{background:rgba(85,102,119,0.12);color:var(--text3);border:1px solid var(--border2);}
.rs{width:320px;display:flex;flex-direction:column;overflow:hidden;flex-shrink:0;}
.aic{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.cms{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch;}
.cms::-webkit-scrollbar{width:3px;}
.cms::-webkit-scrollbar-thumb{background:var(--border2);}
.msg{display:flex;flex-direction:column;gap:2px;animation:fup 0.2s ease-out;}
@keyframes fup{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.ml{font-family:var(--mono);font-size:9px;letter-spacing:2px;color:var(--text3);}
.mb{padding:9px 11px;border-radius:2px;font-size:12px;line-height:1.55;max-width:95%;white-space:pre-wrap;word-break:break-word;}
.msg.user .mb{background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.2);color:var(--amber2);align-self:flex-end;}
.msg.ai .mb{background:var(--panel);border:1px solid var(--border);color:var(--text);align-self:flex-start;}
.msg.system .mb{background:rgba(230,57,70,0.06);border:1px solid rgba(230,57,70,0.15);color:var(--red2);font-size:10px;font-family:var(--mono);}
.ti{display:flex;gap:4px;align-items:center;padding:2px 0;}
.td{width:5px;height:5px;border-radius:50%;background:var(--amber);animation:tp 1.2s ease-in-out infinite;}
.td:nth-child(2){animation-delay:0.2s}.td:nth-child(3){animation-delay:0.4s}
@keyframes tp{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}}
.cia{padding:8px 10px;border-top:1px solid var(--border);background:var(--panel);flex-shrink:0;}
.qq{display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap;}
.qb{font-family:var(--mono);font-size:9px;padding:3px 6px;background:transparent;border:1px solid var(--border2);color:var(--text3);border-radius:2px;cursor:pointer;transition:all 0.15s;}
.qb:hover{border-color:var(--amber);color:var(--amber);}
.cir{display:flex;gap:6px;align-items:flex-end;}
.ci{flex:1;background:var(--bg2);border:1px solid var(--border2);color:var(--white);font-family:var(--body);font-size:12px;padding:8px 10px;border-radius:2px;resize:none;outline:none;transition:border-color 0.2s;line-height:1.4;max-height:90px;-webkit-appearance:none;}
.ci:focus{border-color:var(--amber);}
.ci::placeholder{color:var(--text3);}
.sb2{background:var(--amber);border:none;color:var(--bg);font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:1px;padding:8px 12px;border-radius:2px;cursor:pointer;transition:all 0.15s;text-transform:uppercase;}
.sb2:hover{background:var(--amber2);}
.sb2:disabled{opacity:0.4;cursor:not-allowed;}
.thrp{border-top:1px solid var(--border);flex-shrink:0;max-height:195px;display:flex;flex-direction:column;}
.thrl{overflow-y:auto;padding:6px;-webkit-overflow-scrolling:touch;}
.thrl::-webkit-scrollbar{width:3px;}
.thrl::-webkit-scrollbar-thumb{background:var(--border2);}
.thri{padding:7px 9px;margin-bottom:4px;background:var(--bg2);border:1px solid var(--border);border-radius:2px;cursor:pointer;transition:all 0.15s;}
.thri:hover{border-color:var(--border2);}
.thrt{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;}
.thrn{font-family:var(--head);font-weight:600;font-size:11px;color:var(--text);}
.thrc{font-family:var(--mono);font-size:10px;color:var(--amber);}
.thrl2{font-size:10px;color:var(--text3);line-height:1.3;}
.thrb{height:2px;background:var(--border);margin-top:5px;border-radius:1px;overflow:hidden;}
.thrf{height:100%;background:var(--amber);border-radius:1px;}
.ar{display:flex;gap:8px;padding:8px 11px;margin-bottom:5px;background:var(--panel);border:1px solid var(--border);border-radius:2px;align-items:flex-start;}
.af{font-size:18px;flex-shrink:0;}
.an{font-family:var(--head);font-weight:700;font-size:12px;color:var(--white);}
.al{font-size:11px;color:var(--text2);margin-top:2px;line-height:1.35;}
.at{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px;}
.bp{display:flex;gap:9px;padding:8px 11px;margin-bottom:5px;background:var(--panel);border:1px solid var(--border);border-radius:2px;}
.bpn{font-family:var(--mono);font-size:10px;color:var(--amber);width:16px;flex-shrink:0;}
.bpt{font-size:12px;color:var(--text);line-height:1.5;}
.gbb{width:100%;padding:11px;background:rgba(245,166,35,0.07);border:1px solid var(--amber);color:var(--amber);font-family:var(--head);font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;border-radius:2px;cursor:pointer;transition:all 0.2s;margin-bottom:14px;}
.gbb:hover{background:rgba(245,166,35,0.15);}
.gbb:disabled{opacity:0.4;cursor:not-allowed;}
.eb{display:flex;align-items:center;gap:10px;margin:12px 0;padding:11px;background:rgba(230,57,70,0.06);border:1px solid rgba(230,57,70,0.15);border-radius:2px;}
.en{font-family:var(--head);font-weight:900;font-size:42px;color:var(--red);line-height:1;}
.ei{flex:1;}
.ela{font-family:var(--head);font-weight:700;font-size:12px;letter-spacing:2px;color:var(--red2);text-transform:uppercase;}
.eld{font-size:11px;color:var(--text2);margin-top:2px;line-height:1.35;}
.elb{height:3px;background:var(--border);border-radius:2px;margin-top:7px;overflow:hidden;}
.elf{height:100%;background:linear-gradient(90deg,var(--amber),var(--red));border-radius:2px;}
.thlg{padding:11px 13px;margin-bottom:7px;background:var(--bg2);border:1px solid var(--border);border-radius:2px;cursor:pointer;}
.kwg{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.kwp{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;letter-spacing:1px;padding:4px 9px;border-radius:2px;background:rgba(245,166,35,0.07);border:1px solid rgba(245,166,35,0.2);color:var(--amber2);}
.kwx{cursor:pointer;opacity:0.5;transition:opacity 0.15s;}
.kwx:hover{opacity:1;color:var(--red2);}
.khi{padding:7px 9px;margin-bottom:4px;background:rgba(245,166,35,0.03);border:1px solid rgba(245,166,35,0.1);border-radius:2px;}
.khw{font-family:var(--mono);font-size:9px;color:var(--amber);margin-bottom:2px;}
.kht{font-size:11px;color:var(--text2);line-height:1.35;}
.khm{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px;}
.tgc{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;margin-bottom:5px;background:var(--panel);border:1px solid var(--border);border-radius:2px;}
.tgi{display:flex;align-items:center;gap:9px;}
.tgic{width:28px;height:28px;border-radius:50%;background:rgba(0,180,216,0.1);border:1px solid var(--cyan);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.tgn{font-family:var(--head);font-weight:600;font-size:12px;color:var(--text);}
.tgh{font-family:var(--mono);font-size:9px;color:var(--text3);}
.tga{display:flex;gap:5px;align-items:center;}
.tgt{width:34px;height:19px;border-radius:10px;border:none;cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0;}
.tgt.on{background:var(--green);}
.tgt.off{background:var(--border2);}
.tgk{position:absolute;top:2px;width:15px;height:15px;border-radius:50%;background:white;transition:left 0.2s;}
.tgt.on .tgk{left:17px;}
.tgt.off .tgk{left:2px;}
.tgd{background:rgba(230,57,70,0.07);border:1px solid rgba(230,57,70,0.2);color:var(--red2);font-size:13px;width:26px;height:26px;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.tgd:hover{background:rgba(230,57,70,0.15);}
.ab{margin-top:10px;padding:10px;background:var(--bg2);border:1px dashed var(--border2);border-radius:2px;}
.ai2{flex:1;background:var(--panel);border:1px solid var(--border2);color:var(--white);font-family:var(--mono);font-size:11px;padding:7px 9px;border-radius:2px;outline:none;transition:border-color 0.2s;}
.ai2:focus{border-color:var(--cyan);}
.ai2::placeholder{color:var(--text3);}
.abb{background:rgba(0,180,216,0.1);border:1px solid var(--cyan);color:var(--cyan2);font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:1px;padding:7px 12px;border-radius:2px;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
.abb:hover{background:rgba(0,180,216,0.2);}
.ar2{display:flex;gap:6px;margin-top:7px;}
`;

const FEED = [
  {id:1,priority:true,headline:"IRGC-Affiliated Channel Threatens AWS and Google Cloud Gulf Infrastructure",snippet:"Telegram channel linked to IRGC media arm posted coordinates of AWS Bahrain and Google Cloud Dubai data centers.",source:"Iran OSINT",tier:3,cat:"corp-threat",time:"6m ago"},
  {id:2,breaking:true,headline:"IRGC Confirms Naval Exercises in Strait of Hormuz",snippet:"Iran IRGC Navy initiated unannounced drills involving fast-attack boats and submarine units near the strategic waterway.",source:"Reuters",tier:1,cat:"naval",time:"14m ago"},
  {id:3,priority:true,headline:"Threat Posted Against Jebel Ali Port Dubai via OSINT Telegram",snippet:"Pro-IRGC channel published aerial imagery of Jebel Ali with threat language citing economic warfare.",source:"WarMonitor",tier:3,cat:"infra-threat",time:"31m ago"},
  {id:4,headline:"IDF Intercepts Ballistic Missile Launched from Yemen",snippet:"IDF air defenses activated over southern Israel. Third interception this week. Arrow-3 system confirmed.",source:"AP News",tier:1,cat:"missile",time:"44m ago"},
  {id:5,headline:"US Treasury Sanctions Iranian Petrochemical Entities",snippet:"14 entities and 3 individuals targeted for facilitating Iranian oil exports.",source:"Bloomberg",tier:1,cat:"sanctions",time:"1h ago"},
  {id:6,headline:"IAEA Denied Natanz Access for Third Consecutive Week",snippet:"Vienna-based agency officials confirm ongoing standoff with Tehran over access to underground enrichment hall.",source:"BBC",tier:1,cat:"diplomatic",time:"1h 20m ago"},
  {id:7,priority:true,headline:"Microsoft Azure UAE North Named in IRGC Threat Communique",snippet:"Semi-official Iranian media cited Azure UAE North as a legitimate military target in escalation scenario.",source:"Intel Slava",tier:3,cat:"corp-threat",time:"2h ago"},
  {id:8,headline:"Drone Swarm Intercepted Over Saudi Aramco Abqaiq Facility",snippet:"Saudi air defenses report interception of 4 drones approaching the Abqaiq processing facility.",source:"Gulf Dispatch",tier:2,cat:"missile",time:"2h 15m ago"},
  {id:9,priority:true,headline:"King Khalid Airport Riyadh Listed in IRGC Threat Matrix",snippet:"Unverified document on Telegram lists King Khalid Airport as Tier-2 strike priority.",source:"Aurora Intel",tier:3,cat:"infra-threat",time:"3h ago"},
  {id:10,headline:"EU Calls Emergency JCPOA Session After Three-Week Freeze",snippet:"Kaja Kallas urges immediate diplomatic session following continued enrichment activity at Fordow.",source:"Al Jazeera",tier:2,cat:"diplomatic",time:"3h 30m ago"},
  {id:11,priority:true,headline:"Bahrain Manama Financial Harbour Flagged as Target in IRGC Media",snippet:"Pro-IRGC Telegram channel posted aerial imagery of Manama financial district with threat caption.",source:"Iran OSINT",tier:3,cat:"infra-threat",time:"5h ago"},
  {id:12,headline:"CENTCOM Two Additional Carrier Strike Groups Enter Persian Gulf",snippet:"Pentagon confirms repositioning of naval assets as part of deterrence posture review.",source:"Reuters",tier:1,cat:"naval",time:"4h 30m ago"},
];

const INIT_CORP = [
  {id:1,name:"AWS Bahrain ME-South-1",country:"Bahrain",text:"IRGC-affiliated Telegram channel posted data center coordinates with explicit threat language.",source:"@iran_cyber_watch",time:"6m ago",level:"high"},
  {id:2,name:"Google Cloud Dubai",country:"UAE",text:"Same channel posted Google Cloud Dubai region infrastructure map.",source:"@iran_cyber_watch",time:"6m ago",level:"high"},
  {id:3,name:"Microsoft Azure UAE North",country:"UAE",text:"Semi-official Iranian media cited Azure UAE North as legitimate military target.",source:"@intelslava",time:"2h ago",level:"medium"},
  {id:4,name:"Meta MENA Hub Dubai",country:"UAE",text:"Threat referencing Meta Dubai office as target for information warfare.",source:"@osintdefender",time:"8h ago",level:"low"},
];

const INIT_INFRA = [
  {id:1,name:"Jebel Ali Port",country:"UAE",type:"PORT",status:"active-threat",desc:"Pro-IRGC channel published aerial imagery with threat caption. Handles 7M+ TEUs annually.",time:"31m ago"},
  {id:2,name:"King Khalid Intl Airport",country:"Saudi Arabia",type:"AIRPORT",status:"active-threat",desc:"Listed in IRGC threat matrix as Tier-2 strike priority. Unverified, medium confidence.",time:"3h ago"},
  {id:3,name:"Aramco Abqaiq",country:"Saudi Arabia",type:"OIL FACILITY",status:"monitoring",desc:"Drone swarm intercepted. Precautionary measures active.",time:"2h ago"},
  {id:4,name:"Manama Financial Harbour",country:"Bahrain",type:"FINANCIAL PORT",status:"active-threat",desc:"Aerial imagery posted with threat caption. US 5th Fleet HQ proximity noted.",time:"5h ago"},
  {id:5,name:"UAE Power Grid DEWA",country:"UAE",type:"POWER",status:"monitoring",desc:"Increased IRGC cyber chatter referencing grid infrastructure.",time:"12h ago"},
  {id:6,name:"Kuwait Oil Company Terminals",country:"Kuwait",type:"OIL FACILITY",status:"clear",desc:"No active threat detected. Routine monitoring.",time:"24h ago"},
];

const MISSILES = [
  {id:1,date:"Today 03:12",type:"ballistic",origin:"Yemen Houthi",target:"S. Israel",tc:"il",outcome:"intercepted",sys:"Arrow-3"},
  {id:2,date:"Today 01:44",type:"drone",origin:"Yemen Houthi",target:"Abqaiq SA",tc:"sa",outcome:"intercepted",sys:"Patriot"},
  {id:3,date:"Yest. 22:30",type:"cruise",origin:"Iraq PMF",target:"Erbil US Base",tc:"iq",outcome:"hit",sys:"none"},
  {id:4,date:"Yest. 18:05",type:"ballistic",origin:"Yemen Houthi",target:"Tel Aviv area",tc:"il",outcome:"intercepted",sys:"Iron Dome"},
  {id:5,date:"Yest. 11:20",type:"drone",origin:"Iran direct",target:"Nevatim AFB",tc:"il",outcome:"intercepted",sys:"Arrow-3"},
  {id:6,date:"2d ago 07:15",type:"cruise",origin:"Yemen Houthi",target:"Eilat Israel",tc:"il",outcome:"hit",sys:"none"},
  {id:7,date:"2d ago 14:00",type:"drone",origin:"Iraq PMF",target:"Kuwait City",tc:"kw",outcome:"unknown",sys:"none"},
  {id:8,date:"3d ago 09:50",type:"ballistic",origin:"Yemen Houthi",target:"Abu Dhabi",tc:"ae",outcome:"intercepted",sys:"Patriot"},
];

const INIT_CH = [
  {id:1,name:"Intel Slava Z",handle:"@intelslava",tier:"T3",active:true,icon:"S"},
  {id:2,name:"War Monitor",handle:"@war_monitor",tier:"T3",active:true,icon:"W"},
  {id:3,name:"Iran OSINT",handle:"@iranosaur",tier:"T3",active:true,icon:"I"},
  {id:4,name:"Middle East Observer",handle:"@mideastobs",tier:"T2",active:true,icon:"M"},
  {id:5,name:"OSINTdefender",handle:"@osintdefender",tier:"T3",active:true,icon:"O"},
  {id:6,name:"Aurora Intel",handle:"@auroraosint",tier:"T3",active:true,icon:"A"},
  {id:7,name:"Iran Cyber Watch",handle:"@iran_cyber_watch",tier:"T3",active:true,icon:"C"},
  {id:8,name:"Gulf Dispatch",handle:"@gulfdispatch",tier:"T2",active:false,icon:"G"},
  {id:9,name:"Ragip Soylu",handle:"@ragipsoylu",tier:"T2",active:true,icon:"R"},
];

const THREADS = [
  {id:1,name:"Natanz Nuclear Standoff",count:14,latest:"IAEA access denied 3rd week",heat:88},
  {id:2,name:"Strait of Hormuz Tensions",count:22,latest:"IRGC naval drills active",heat:95},
  {id:3,name:"US Tech Infrastructure Threats",count:8,latest:"AWS and Google Cloud targeted",heat:91},
  {id:4,name:"Houthi Missile Campaign",count:31,latest:"Ballistic intercepted over Israel",heat:80},
  {id:5,name:"Gulf Port Security",count:11,latest:"Jebel Ali threat posted",heat:76},
];

const INIT_BRIEF = [
  "IRGC-affiliated Telegram channels posted explicit threats against AWS Bahrain and Google Cloud Dubai. Credibility HIGH.",
  "Jebel Ali Port UAE and Manama Financial Harbour Bahrain flagged in IRGC threat communications.",
  "IDF intercepted third Houthi ballistic missile this week over southern Israel. Arrow-3 engaged.",
  "IAEA denied Natanz access for third consecutive week. Fordow enrichment reportedly accelerated.",
  "US CENTCOM repositioning two additional carrier strike groups to Persian Gulf.",
];

const ACTORS = [
  {flag:"IR",name:"IRGC and Iran Armed Forces",latest:"Naval drills in Hormuz. Natanz denied. Cyber units active.",time:"14m ago"},
  {flag:"IL",name:"Israel Defense Forces",latest:"Intercepted Houthi ballistic missile. Air defenses elevated.",time:"44m ago"},
  {flag:"US",name:"US CENTCOM",latest:"Two additional carrier strike groups repositioning to Gulf.",time:"4h ago"},
  {flag:"YE",name:"Houthis Ansar Allah",latest:"Ballistic missile toward Israel intercepted.",time:"44m ago"},
  {flag:"LB",name:"Hezbollah",latest:"Rocket units in south Lebanon reactivated.",time:"4h ago"},
];

const TICKER = [
  "THREAT: AWS Bahrain and Google Cloud Dubai named as IRGC targets",
  "Jebel Ali Port threat posted on IRGC-affiliated Telegram",
  "Ballistic missile intercepted over S. Israel - Arrow-3 engaged",
  "King Khalid Airport listed in IRGC strike matrix",
  "Microsoft Azure UAE North cited as legitimate military target",
  "Aramco Abqaiq: drone swarm intercepted by Patriot PAC-3",
  "Manama Financial Harbour flagged in IRGC media",
];

const FLAGS = {il:"IL",ae:"AE",sa:"SA",bh:"BH",kw:"KW",iq:"IQ"};

function hl(text, kws) {
  if (!kws || !kws.length) return text;
  var escaped = kws.map(function(k){return k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");});
  var parts = text.split(new RegExp("("+escaped.join("|")+")","gi"));
  return parts.map(function(p,i){
    return kws.some(function(k){return k.toLowerCase()===p.toLowerCase();})
      ? React.createElement("span",{key:i,className:"kh"},p) : p;
  });
}

function Clock(){
  var t=useState(new Date());
  var time=t[0]; var setTime=t[1];
  useEffect(function(){
    var id=setInterval(function(){setTime(new Date());},1000);
    return function(){clearInterval(id);};
  },[]);
  return React.createElement("span",{className:"clock"},time.toUTCString().slice(17,25)+" UTC");
}

export default function App(){
  var s1=useState("feed"); var tab=s1[0]; var setTab=s1[1];
  var s2=useState("all"); var cf=s2[0]; var setCf=s2[1];
  var s3=useState(INIT_CORP); var corp=s3[0]; var setCorp=s3[1];
  var s4=useState(INIT_INFRA); var infra=s4[0]; var setInfra=s4[1];
  var s5=useState(INIT_CH); var chs=s5[0]; var setChs=s5[1];
  var s6=useState(["IRGC","Natanz","Hormuz","Houthi","JCPOA","AWS","Azure","Google Cloud"]); var kws=s6[0]; var setKws=s6[1];
  var s7=useState(""); var newKw=s7[0]; var setNewKw=s7[1];
  var s8=useState(""); var newCh=s8[0]; var setNewCh=s8[1];
  var s9=useState(""); var newCN=s9[0]; var setNewCN=s9[1];
  var s10=useState("UAE"); var newCC=s10[0]; var setNewCC=s10[1];
  var s11=useState("medium"); var newCL=s11[0]; var setNewCL=s11[1];
  var s12=useState(""); var newIN=s12[0]; var setNewIN=s12[1];
  var s13=useState("PORT"); var newIT=s13[0]; var setNewIT=s13[1];
  var s14=useState("UAE"); var newIC=s14[0]; var setNewIC=s14[1];
  var s15=useState("monitoring"); var newIS=s15[0]; var setNewIS=s15[1];
  var s16=useState([
    {role:"system",text:"IRAN INTEL - THREAT MONITORING ACTIVE - Powered by Claude Sonnet via OpenRouter with live web search."},
    {role:"ai",text:"Analyst online. Escalation: 7.4/10.\n\nACTIVE ALERTS:\n- AWS Bahrain and Google Cloud Dubai are IRGC targets\n- Jebel Ali Port threat posted\n- King Khalid Airport in IRGC strike matrix\n- Azure UAE North cited as military target\n\nI will search the web thoroughly for any query. Ask me about any company, port, airport, oil facility, threat, or incident."},
  ]); var msgs=s16[0]; var setMsgs=s16[1];
  var s17=useState(""); var inp=s17[0]; var setInp=s17[1];
  var s18=useState(false); var aiL=s18[0]; var setAiL=s18[1];
  var s19=useState(false); var briefL=s19[0]; var setBriefL=s19[1];
  var s20=useState(INIT_BRIEF); var brief=s20[0]; var setBrief=s20[1];
  var chatRef=useRef(null);

  useEffect(function(){
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[msgs]);

  var allNames=corp.map(function(c){return c.name.split(" (")[0];})
    .concat(infra.map(function(i){return i.name;}))
    .concat(kws);

  var prio=FEED.filter(function(i){return i.priority;}).length;

  var feedFiltered=FEED;
  if(cf==="threats") feedFiltered=FEED.filter(function(i){return ["corp-threat","infra-threat","missile"].includes(i.cat);});
  else if(cf!=="all") feedFiltered=FEED.filter(function(i){return i.cat===cf;});
  var feed=feedFiltered.slice().sort(function(a,b){return (b.priority?1:0)-(a.priority?1:0);});

  var SYS="You are an elite intelligence analyst for Iran conflict and threat monitoring with full web search access.\n\nYour job is to provide THOROUGH, DEEPLY RESEARCHED answers. For every query:\n1. Search the web extensively using multiple searches\n2. Cross-reference multiple sources\n3. Provide structured intelligence-grade analysis\n4. Include timeline of events where relevant\n5. Cite confidence level: HIGH MEDIUM or LOW\n6. Cite source tier: T1 major news, T2 regional outlets, T3 OSINT Telegram\n\nMONITORING SCOPE:\n- CORPORATE THREATS: Any tech company with Gulf or Israel presence - AWS, Google Cloud, Azure, Oracle, IBM, Meta, X, TikTok, Equinix, Cisco, SAP, PayPal, Stripe, Visa, submarine cables, CDN nodes, any company mentioned\n- INFRASTRUCTURE: Any named port, oil facility, airport, power grid, water, financial hub in UAE, Bahrain, Saudi, Kuwait, Israel\n- MISSILE AND DRONE: All events targeting Israel, UAE, Bahrain, Saudi, Kuwait\n- GENERAL: IRGC, Houthis, IDF, JCPOA, Hormuz, Natanz, Fordow, sanctions\n\nAlways search before answering. Never guess. If something is unverified say so clearly.\nCurrent date: "+new Date().toUTCString();

  function callAI(messages, onSuccess, onError){
  if(!OPENROUTER_API_KEY){
    onError("No API key set. Add your OpenRouter key on line 3.");
    return;
  }
  var bodyMessages = messages.map(function(m){
    return {role: m.role, content: m.content || m.text || ""};
  });
  fetch("https://openrouter.ai/api/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+OPENROUTER_API_KEY,
      "HTTP-Referer":"https://iranwarmonitor.vercel.app",
      "X-Title":"Iran Intel Dashboard"
    },
    body:JSON.stringify({
      model:"anthropic/claude-sonnet-4-5",
      max_tokens:2000,
      plugins:[{"id":"web","max_results":5}],
      messages:bodyMessages
    })
  }).then(function(r){
    if(!r.ok){
      return r.json().then(function(e){
        onError("API Error "+r.status+": "+(e.error&&e.error.message?e.error.message:JSON.stringify(e)));
      });
    }
    return r.json().then(function(d){
      var reply = d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content;
      if(!reply) onError("Empty response from API.");
      else onSuccess(reply);
    });
  }).catch(function(e){
    onError("Network error: "+e.message+". Check internet connection.");
  });
}


  function send(text){
    var q=(text||inp).trim();
    if(!q||aiL) return;
    setInp("");
    var newMsgs=msgs.concat([{role:"user",text:q}]);
    setMsgs(newMsgs);
    setAiL(true);
    var apiMessages=[{role:"system",content:SYS}].concat(
      newMsgs.filter(function(m){return m.role==="user"||m.role==="ai";}).map(function(m){
        return {role:m.role==="ai"?"assistant":"user",content:m.text};
      })
    );
    callAI(apiMessages,
      function(reply){
        setMsgs(function(m){return m.concat([{role:"ai",text:reply}]);});
        setAiL(false);
      },
      function(err){
        setMsgs(function(m){return m.concat([{role:"ai",text:err}]);});
        setAiL(false);
      }
    );
  }

  function genBrief(){
    setBriefL(true);
    var briefMessages=[
      {role:"system",content:SYS},
      {role:"user",content:"Search the web thoroughly for the latest news on: Iran conflict today, IRGC operations, threats to US tech companies in Gulf and Israel, missile and drone attacks in Middle East today, critical infrastructure threats Gulf region, Strait of Hormuz latest, Natanz nuclear situation. After searching, generate exactly 5 intelligence brief bullets covering the most critical developments in the last 24 hours. Each bullet should be 2-3 sentences, factual, intelligence-style with confidence level. Return ONLY a JSON array of 5 strings. No preamble, no markdown fences."}
    ];
    callAI(briefMessages,
      function(reply){
        try{
          var clean=reply.replace(/```json|```/g,"").trim();
          var arr=JSON.parse(clean);
          if(Array.isArray(arr)&&arr.length) setBrief(arr);
        }catch(e){}
        setBriefL(false);
      },
      function(){setBriefL(false);}
    );
  }

  function addCorp(){
    if(!newCN.trim()) return;
    setCorp(function(m){return m.concat([{id:Date.now(),name:newCN.trim(),country:newCC,text:"Added for monitoring. Ask Claude AI for latest threat intelligence on this entity.",source:"User-added",time:"just now",level:newCL}]);});
    setNewCN("");
  }

  function addInfra(){
    if(!newIN.trim()) return;
    setInfra(function(m){return m.concat([{id:Date.now(),name:newIN.trim(),country:newIC,type:newIT,status:newIS,desc:"Added for monitoring. Ask Claude AI for latest threat intelligence on this site.",time:"just now"}]);});
    setNewIN("");
  }

  function upInfraStatus(id,s){
    setInfra(function(m){return m.map(function(i){return i.id===id?Object.assign({},i,{status:s}):i;});});
  }

  function togCh(id){setChs(function(c){return c.map(function(ch){return ch.id===id?Object.assign({},ch,{active:!ch.active}):ch;});});}
  function delCh(id){setChs(function(c){return c.filter(function(ch){return ch.id!==id;});});}
  function addCh(){
    var h=newCh.trim().replace(/^@/,"");
    if(!h) return;
    setChs(function(c){return c.concat([{id:Date.now(),name:h,handle:"@"+h,tier:"T3",active:true,icon:"N"}]);});
    setNewCh("");
  }
  function addKw(){
    var k=newKw.trim();
    if(k&&!kws.includes(k)) setKws(function(w){return w.concat([k]);});
    setNewKw("");
  }
  function rmKw(k){setKws(function(w){return w.filter(function(x){return x!==k;});});}

  var kwHits=FEED.filter(function(item){
    return allNames.some(function(k){return item.headline.toLowerCase().includes(k.toLowerCase());});
  });

  var ss={background:"var(--panel)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--mono)",fontSize:11,padding:"7px 9px",borderRadius:2,outline:"none",cursor:"pointer"};

  var E=React.createElement;

  var tabList=[
    {id:"feed",label:"Live Feed",count:FEED.length},
    {id:"threats",label:"Threat Monitor",count:prio,threat:true},
    {id:"brief",label:"AI Brief"},
    {id:"threads",label:"Threads",count:THREADS.length},
    {id:"actors",label:"Actors"},
    {id:"keywords",label:"Keywords",count:kws.length},
    {id:"channels",label:"Channels",count:chs.filter(function(c){return c.active;}).length},
  ];

  var filterList=[
    ["all","ALL"],["threats","THREATS"],["corp-threat","CORP THREAT"],
    ["infra-threat","INFRA"],["missile","MISSILE"],["strike","STRIKE"],
    ["naval","NAVAL"],["diplomatic","DIPLO"],["cyber","CYBER"],["sanctions","SANCTIONS"]
  ];

  return E(React.Fragment,null,
    E("style",null,FONTS+CSS),
    E("div",{className:"scanline"}),
    E("div",{className:"app"},

      E("div",{className:"topbar"},
        E("div",{className:"tl"},
          E("div",{className:"dot"}),
          E("div",{className:"logo"},"IRAN",E("span",null,"."),"INTEL"),
          E("div",{className:"live"},"LIVE")
        ),
        E("div",{className:"tc"},"CONFLICT AND THREAT MONITORING // GULF + ISRAEL THEATER"),
        E("div",{className:"tr"},
          E("div",{className:"escal"},"ESCALATION 7.4 / 10"),
          E(Clock,null)
        )
      ),

      E("div",{className:"ticker"},
        E("div",{className:"tlabel"},"ALERT"),
        E("div",{className:"twrap"},
          E("div",{className:"ttrack"},
            TICKER.concat(TICKER).map(function(item,i){
              return E("span",{key:i,className:"titem"},item,E("span",{className:"tsep"}," * "));
            })
          )
        )
      ),

      E("div",{className:"nav"},
        tabList.map(function(t){
          return E("button",{
            key:t.id,
            className:"ntab"+(t.threat?" threat":"")+(tab===t.id?" on":""),
            onClick:function(){setTab(t.id);}
          },
            t.label,
            t.count!==undefined?E("span",{className:"nbadge"+(t.threat?" r":"")},t.count):null
          );
        })
      ),

      E("div",{className:"main"},

        E("div",{className:"lp"},

          tab==="feed"&&E(React.Fragment,null,
            E("div",{className:"ph"},
              E("span",{className:"pt"},"Intelligence Feed"),
              E("span",{className:"pm"},chs.filter(function(c){return c.active;}).length+" SOURCES - "+prio+" ALERTS")
            ),
            E("div",{className:"frow"},
              filterList.map(function(arr){
                var v=arr[0]; var l=arr[1];
                var cls="fb";
                if(v==="corp-threat") cls+=" fc";
                else if(v==="infra-threat") cls+=" fi";
                else if(v==="missile") cls+=" fm";
                else if(v==="naval") cls+=" fn";
                else if(v==="diplomatic") cls+=" fd";
                if(cf===v) cls+=" on";
                return E("button",{key:v,className:cls,onClick:function(){setCf(v);}},l);
              })
            ),
            E("div",{className:"fl"},
              feed.map(function(item){
                return E("div",{key:item.id,className:"fi "+item.cat+(item.priority?" priority":"")},
                  E("div",{className:"fit"},
                    E("span",{className:"sb t"+item.tier},"T"+item.tier),
                    E("span",{style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}},item.source),
                    E("span",{className:"ct "+item.cat},item.cat.replace("-"," ").toUpperCase()),
                    item.breaking?E("span",{className:"btag"},"BREAKING"):null,
                    item.priority?E("span",{className:"ttag"},"THREAT ALERT"):null
                  ),
                  E("div",{className:"fh"},hl(item.headline,allNames)),
                  E("div",{className:"fs"},item.snippet),
                  E("div",{className:"ftime"},item.time)
                );
              })
            )
          ),

          tab==="threats"&&E("div",{className:"sp"},

            E("div",{style:{marginBottom:20}},
              E("div",{className:"tsh"},
                E("span",{className:"tsi"},"CORP"),
                E("span",{className:"tst"},"Tech and Corporate Threat Monitor"),
                E("span",{className:"tsc c"},corp.length+" MONITORED")
              ),
              E("div",{className:"sl"},"ANY TECH COMPANY OR CORPORATION - UAE - BAHRAIN - SAUDI - KUWAIT - ISRAEL"),
              corp.map(function(c){
                return E("div",{key:c.id,className:"cc"},
                  E("div",{className:"cct"},
                    E("span",{className:"ccn"},c.name),
                    E("div",{className:"ccb"},
                      E("span",{className:"ccc"},c.country),
                      E("span",{className:"lv "+c.level},c.level.toUpperCase()),
                      E("button",{className:"xbtn",onClick:function(){setCorp(function(m){return m.filter(function(x){return x.id!==c.id;});});}}, "X")
                    )
                  ),
                  E("div",{className:"ccd"},c.text),
                  E("div",{className:"ccm"},
                    E("span",{className:"ccs"},c.source),
                    E("span",{className:"cct2"},c.time)
                  )
                );
              }),
              E("div",{className:"amb"},
                E("div",{className:"ambt"},"Add Company or Infrastructure to Monitor"),
                E("div",{className:"ambh"},"Add any tech company, data center, financial institution, or corporate entity."),
                E("input",{className:"ambi",style:{display:"block",width:"100%",marginBottom:6},placeholder:"e.g. Oracle Cloud UAE, Equinix Dubai, Cisco Gulf HQ",value:newCN,onChange:function(e){setNewCN(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addCorp();}}),
                E("div",{className:"amr"},
                  E("select",{style:ss,value:newCC,onChange:function(e){setNewCC(e.target.value);}},
                    E("option",null,"UAE"),E("option",null,"Bahrain"),E("option",null,"Saudi Arabia"),E("option",null,"Kuwait"),E("option",null,"Israel"),E("option",null,"Multiple")
                  ),
                  E("select",{style:ss,value:newCL,onChange:function(e){setNewCL(e.target.value);}},
                    E("option",{value:"high"},"HIGH"),E("option",{value:"medium"},"MEDIUM"),E("option",{value:"low"},"LOW")
                  ),
                  E("button",{className:"ambb",onClick:addCorp},"ADD")
                )
              )
            ),

            E("div",{style:{marginBottom:20}},
              E("div",{className:"tsh"},
                E("span",{className:"tsi"},"INFRA"),
                E("span",{className:"tst"},"Critical Infrastructure Monitor"),
                E("span",{className:"tsc i"},infra.filter(function(i){return i.status==="active-threat";}).length+" ACTIVE THREATS")
              ),
              E("div",{className:"sl"},"PORTS - OIL - AIRPORTS - POWER - WATER - UAE - BAHRAIN - SAUDI - KUWAIT - ISRAEL"),
              infra.map(function(ic){
                return E("div",{key:ic.id,className:"ic"},
                  E("div",{className:"ict"},
                    E("span",{className:"icn"},ic.name),
                    E("span",{className:"icty"},ic.type),
                    E("span",{className:"ico"},ic.country),
                    E("span",{className:"ics "+ic.status},ic.status.replace("-"," ").toUpperCase()),
                    E("select",{value:ic.status,onChange:function(e){upInfraStatus(ic.id,e.target.value);},style:Object.assign({},ss,{marginLeft:"auto",fontSize:9,padding:"2px 5px"})},
                      E("option",{value:"active-threat"},"ACTIVE THREAT"),
                      E("option",{value:"monitoring"},"MONITORING"),
                      E("option",{value:"clear"},"CLEAR")
                    ),
                    E("button",{className:"xbtn",onClick:function(){setInfra(function(m){return m.filter(function(x){return x.id!==ic.id;});});}}, "X")
                  ),
                  E("div",{className:"icd"},ic.desc),
                  E("div",{className:"icm"},ic.time)
                );
              }),
              E("div",{className:"amb"},
                E("div",{className:"ambt"},"Add Infrastructure Site to Monitor"),
                E("div",{className:"ambh"},"Add any port, oil terminal, airport, power station, water plant, or financial hub."),
                E("input",{className:"ambi",style:{display:"block",width:"100%",marginBottom:6},placeholder:"e.g. Ras Tanura Terminal, Ben Gurion Airport, ADNOC Ruwais",value:newIN,onChange:function(e){setNewIN(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addInfra();}}),
                E("div",{className:"amr"},
                  E("select",{style:ss,value:newIT,onChange:function(e){setNewIT(e.target.value);}},
                    E("option",null,"PORT"),E("option",null,"OIL FACILITY"),E("option",null,"AIRPORT"),E("option",null,"POWER"),E("option",null,"WATER"),E("option",null,"FINANCIAL PORT"),E("option",null,"TELECOM"),E("option",null,"OTHER")
                  ),
                  E("select",{style:ss,value:newIC,onChange:function(e){setNewIC(e.target.value);}},
                    E("option",null,"UAE"),E("option",null,"Bahrain"),E("option",null,"Saudi Arabia"),E("option",null,"Kuwait"),E("option",null,"Israel")
                  ),
                  E("select",{style:ss,value:newIS,onChange:function(e){setNewIS(e.target.value);}},
                    E("option",{value:"active-threat"},"ACTIVE THREAT"),E("option",{value:"monitoring"},"MONITORING"),E("option",{value:"clear"},"CLEAR")
                  ),
                  E("button",{className:"ambb",onClick:addInfra},"ADD")
                )
              )
            ),

            E("div",null,
              E("div",{className:"tsh"},
                E("span",{className:"tsi"},"MSL"),
                E("span",{className:"tst"},"Missile and Drone Event Log"),
                E("span",{className:"tsc m"},MISSILES.length+" EVENTS")
              ),
              E("div",{className:"sl"},"ISRAEL - UAE - BAHRAIN - SAUDI - KUWAIT - ALL RECORDED EVENTS"),
              E("div",{style:{overflowX:"auto"}},
                E("table",{className:"mst"},
                  E("thead",null,E("tr",null,E("th",null,"DATE"),E("th",null,"TYPE"),E("th",null,"ORIGIN"),E("th",null,"TARGET"),E("th",null,"OUTCOME"),E("th",null,"SYSTEM"))),
                  E("tbody",null,
                    MISSILES.map(function(m){
                      return E("tr",{key:m.id},
                        E("td",{style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",whiteSpace:"nowrap"}},m.date),
                        E("td",null,E("span",{className:"mty "+m.type},m.type.toUpperCase())),
                        E("td",{style:{fontSize:11}},m.origin),
                        E("td",{style:{fontSize:11}},(FLAGS[m.tc]||"?")+(" "+m.target)),
                        E("td",null,E("span",{className:"mou "+m.outcome},m.outcome.toUpperCase())),
                        E("td",{style:{fontSize:10,color:"var(--text2)"}},m.sys)
                      );
                    })
                  )
                )
              )
            )
          ),

          tab==="brief"&&E("div",{className:"sp"},
            E("div",{style:{marginBottom:14,paddingBottom:11,borderBottom:"1px solid var(--border)"}},
              E("div",{style:{fontFamily:"var(--head)",fontWeight:900,fontSize:20,letterSpacing:2,color:"var(--white)",textTransform:"uppercase"}},"Intel Brief"),
              E("div",{style:{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:3,letterSpacing:1}},"AI-GENERATED // "+new Date().toUTCString().slice(0,16).toUpperCase())
            ),
            E("button",{className:"gbb",onClick:genBrief,disabled:briefL},briefL?"GENERATING LIVE BRIEF...":"GENERATE LIVE BRIEF"),
            E("div",{className:"eb"},
              E("div",{className:"en"},"7.4"),
              E("div",{className:"ei"},
                E("div",{className:"ela"},"HIGH ESCALATION"),
                E("div",{className:"eld"},"Multi-vector: naval, nuclear, missile, corporate and infra threats simultaneously active."),
                E("div",{className:"elb"},E("div",{className:"elf",style:{width:"74%"}}))
              )
            ),
            E("div",{className:"sl",style:{marginTop:12}},"KEY DEVELOPMENTS - LAST 12H"),
            brief.map(function(pt,i){
              return E("div",{key:i,className:"bp"},E("span",{className:"bpn"},"0"+(i+1)),E("span",{className:"bpt"},pt));
            }),
            E("div",{className:"sl",style:{marginTop:14}},"ACTIVE ACTORS"),
            ACTORS.map(function(a,i){
              return E("div",{key:i,className:"ar"},
                E("span",{style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--amber)",flexShrink:0}},"["+a.flag+"]"),
                E("div",null,E("div",{className:"an"},a.name),E("div",{className:"al"},a.latest),E("div",{className:"at"},a.time))
              );
            })
          ),

          tab==="threads"&&E("div",{className:"sp"},
            E("div",{className:"sl"},"ACTIVE STORY THREADS"),
            THREADS.map(function(t){
              return E("div",{key:t.id,className:"thlg"},
                E("div",{className:"thrt"},
                  E("span",{style:{fontFamily:"var(--head)",fontWeight:600,fontSize:13,color:"var(--text)"}},t.name),
                  E("span",{style:{fontFamily:"var(--mono)",fontSize:10,color:"var(--amber)"}},t.count+" ITEMS")
                ),
                E("div",{style:{fontSize:11,color:"var(--text3)",marginTop:3}},t.latest),
                E("div",{className:"thrb",style:{marginTop:8}},E("div",{className:"thrf",style:{width:t.heat+"%"}})),
                E("div",{style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:3}},"ACTIVITY "+t.heat+"%")
              );
            })
          ),

          tab==="actors"&&E("div",{className:"sp"},
            E("div",{className:"sl"},"CONFLICT ACTORS - LATEST ACTIONS"),
            ACTORS.map(function(a,i){
              return E("div",{key:i,className:"ar",style:{marginBottom:8}},
                E("span",{style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--amber)",flexShrink:0}},"["+a.flag+"]"),
                E("div",null,E("div",{className:"an"},a.name),E("div",{className:"al"},a.latest),E("div",{className:"at"},a.time))
              );
            })
          ),

          tab==="keywords"&&E("div",{className:"sp"},
            E("div",{className:"sl"},"TRACKED KEYWORDS - HIGHLIGHTS IN FEED"),
            E("div",{className:"kwg"},
              kws.map(function(k){
                return E("div",{key:k,className:"kwp"},k,E("span",{className:"kwx",onClick:function(){rmKw(k);}},"X"));
              })
            ),
            E("div",{className:"ab"},
              E("div",{className:"sl",style:{border:"none",paddingBottom:0,marginBottom:6}},"ADD KEYWORD"),
              E("div",{className:"ar2"},
                E("input",{className:"ai2",placeholder:"e.g. Fordow, CENTCOM, Abu Dhabi, F-35",value:newKw,onChange:function(e){setNewKw(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addKw();}}),
                E("button",{className:"abb",onClick:addKw},"ADD")
              )
            ),
            E("div",{style:{marginTop:14}},
              E("div",{className:"sl"},kwHits.length+" HITS IN CURRENT FEED"),
              kwHits.map(function(item){
                return E("div",{key:item.id,className:"khi"},
                  E("div",{className:"khw"},allNames.filter(function(k){return item.headline.toLowerCase().includes(k.toLowerCase());}).slice(0,3).join(", ")),
                  E("div",{className:"kht"},item.headline),
                  E("div",{className:"khm"},item.source+" - "+item.time)
                );
              })
            )
          ),

          tab==="channels"&&E("div",{className:"sp"},
            E("div",{className:"sl"},"TELEGRAM OSINT CHANNELS - "+chs.filter(function(c){return c.active;}).length+" ACTIVE"),
            chs.map(function(ch){
              return E("div",{key:ch.id,className:"tgc"},
                E("div",{className:"tgi"},
                  E("div",{className:"tgic"},ch.icon),
                  E("div",null,E("div",{className:"tgn"},ch.name),E("div",{className:"tgh"},ch.handle+" - "+ch.tier))
                ),
                E("div",{className:"tga"},
                  E("button",{className:"tgt "+(ch.active?"on":"off"),onClick:function(){togCh(ch.id);}},E("div",{className:"tgk"})),
                  E("button",{className:"tgd",onClick:function(){delCh(ch.id);}},"X")
                )
              );
            }),
            E("div",{className:"ab"},
              E("div",{className:"sl",style:{border:"none",paddingBottom:0,marginBottom:4}},"ADD CHANNEL"),
              E("div",{style:{fontSize:10,color:"var(--text3)",marginBottom:7}},"Enter any Telegram handle with or without @"),
              E("div",{className:"ar2"},
                E("input",{className:"ai2",placeholder:"@channel_handle",value:newCh,onChange:function(e){setNewCh(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addCh();}}),
                E("button",{className:"abb",onClick:addCh},"ADD")
              )
            )
          )

        ),

        E("div",{className:"rs"},
          E("div",{className:"ph",style:{borderLeft:"1px solid var(--border)"}},
            E("span",{className:"pt"},"AI Analyst"),
            E("span",{style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--green)",letterSpacing:1}},OPENROUTER_API_KEY?"ONLINE":"NO API KEY")
          ),
          E("div",{className:"aic"},
            E("div",{className:"cms",ref:chatRef},
              msgs.map(function(m,i){
                return E("div",{key:i,className:"msg "+m.role},
                  E("div",{className:"ml"},m.role==="user"?"YOU":m.role==="system"?"SYSTEM":"CLAUDE AI"),
                  E("div",{className:"mb"},m.text)
                );
              }),
              aiL?E("div",{className:"msg ai"},
                E("div",{className:"ml"},"CLAUDE AI"),
                E("div",{className:"mb"},E("div",{className:"ti"},E("div",{className:"td"}),E("div",{className:"td"}),E("div",{className:"td"})))
              ):null
            ),
            E("div",{className:"cia"},
              E("div",{className:"qq"},
                ["AWS threats?","Jebel Ali?","Latest missiles?","Azure UAE?","Hormuz now?","Natanz?"].map(function(q){
                  return E("button",{key:q,className:"qb",onClick:function(){send(q);}},q);
                })
              ),
              E("div",{className:"cir"},
                E("textarea",{className:"ci",rows:2,placeholder:"Ask anything - I will search the web thoroughly...",value:inp,onChange:function(e){setInp(e.target.value);},onKeyDown:function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}),
                E("button",{className:"sb2",onClick:function(){send();},disabled:aiL||!inp.trim()},"SEND")
              )
            )
          ),
          E("div",{className:"thrp"},
            E("div",{className:"ph"},E("span",{className:"pt"},"Story Threads"),E("span",{className:"pm"},THREADS.length+" ACTIVE")),
            E("div",{className:"thrl"},
              THREADS.map(function(t){
                return E("div",{key:t.id,className:"thri",onClick:function(){setTab("threads");}},
                  E("div",{className:"thrt"},E("span",{className:"thrn"},t.name),E("span",{className:"thrc"},t.count)),
                  E("div",{className:"thrl2"},t.latest),
                  E("div",{className:"thrb"},E("div",{className:"thrf",style:{width:t.heat+"%"}}))
                );
              })
            )
          )
        )

      )
    )
  );
}
