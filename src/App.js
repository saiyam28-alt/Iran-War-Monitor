import { useState, useEffect, useRef } from "react";

const CLAUDE_API_KEY = "";

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
.ambs{background:var(--panel);border:1px solid var(--border2);color:var(--text2);font-family:var(--mono);font-size:11px;padding:7px 9px;border-radius:2px;outline:none;cursor:pointer;}
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
  {id:1,priority:true,headline:"IRGC-Affiliated Channel Threatens AWS and Google Cloud Gulf Infrastructure",snippet:"Telegram channel linked to IRGC media arm posted coordinates of AWS Bahrain and Google Cloud Dubai data centers. Caption: nodes of enemy digital economy will not be spared.",source:"Iran OSINT",tier:3,cat:"corp-threat",time:"6m ago"},
  {id:2,breaking:true,headline:"IRGC Confirms Naval Exercises in Strait of Hormuz",snippet:"Iran IRGC Navy initiated unannounced drills involving fast-attack boats and submarine units near the strategic waterway.",source:"Reuters",tier:1,cat:"naval",time:"14m ago"},
  {id:3,priority:true,headline:"Threat Posted Against Jebel Ali Port Dubai via OSINT Telegram",snippet:"Pro-IRGC channel published aerial imagery of Jebel Ali with threat language citing economic warfare. Port authority has not issued public statement.",source:"WarMonitor",tier:3,cat:"infra-threat",time:"31m ago"},
  {id:4,headline:"IDF Intercepts Ballistic Missile Launched from Yemen",snippet:"IDF air defenses activated over southern Israel. Third interception this week. Arrow-3 system confirmed deployment.",source:"AP News",tier:1,cat:"missile",time:"44m ago"},
  {id:5,headline:"US Treasury Sanctions Iranian Petrochemical Entities",snippet:"14 entities and 3 individuals targeted for facilitating Iranian oil exports in violation of existing restrictions.",source:"Bloomberg",tier:1,cat:"sanctions",time:"1h ago"},
  {id:6,headline:"IAEA Denied Natanz Access for Third Consecutive Week",snippet:"Vienna-based agency officials confirm ongoing standoff with Tehran over access to underground enrichment hall.",source:"BBC",tier:1,cat:"diplomatic",time:"1h 20m ago"},
  {id:7,priority:true,headline:"Microsoft Azure UAE North Named in IRGC Threat Communique",snippet:"Semi-official Iranian media outlet cited Microsoft Azure UAE North as a legitimate military target in event of escalation. Credibility: MEDIUM.",source:"Intel Slava",tier:3,cat:"corp-threat",time:"2h ago"},
  {id:8,headline:"Drone Swarm Intercepted Over Saudi Aramco Abqaiq Facility",snippet:"Saudi air defenses report interception of 4 drones approaching the Abqaiq processing facility.",source:"Gulf Dispatch",tier:2,cat:"missile",time:"2h 15m ago"},
  {id:9,priority:true,headline:"King Khalid Airport Riyadh Listed in IRGC Threat Matrix",snippet:"Unverified document circulating on Telegram lists King Khalid Airport as Tier-2 strike priority in retaliation scenario.",source:"Aurora Intel",tier:3,cat:"infra-threat",time:"3h ago"},
  {id:10,headline:"EU Calls Emergency JCPOA Session After Three-Week Freeze",snippet:"Kaja Kallas urges immediate diplomatic session following continued enrichment activity at Fordow.",source:"Al Jazeera",tier:2,cat:"diplomatic",time:"3h 30m ago"},
  {id:11,priority:true,headline:"Bahrain Manama Financial Harbour Flagged as Target in IRGC Media",snippet:"Pro-IRGC Telegram channel posted aerial imagery of Manama financial district with threat caption. US 5th Fleet HQ proximity noted.",source:"Iran OSINT",tier:3,cat:"infra-threat",time:"5h ago"},
  {id:12,headline:"CENTCOM Two Additional Carrier Strike Groups Enter Persian Gulf",snippet:"Pentagon confirms repositioning of naval assets as part of deterrence posture review.",source:"Reuters",tier:1,cat:"naval",time:"4h 30m ago"},
];

const INIT_CORP = [
  {id:1,name:"AWS Bahrain ME-South-1",country:"Bahrain",text:"IRGC-affiliated Telegram channel posted data center coordinates with explicit threat language.",source:"@iran_cyber_watch",time:"6m ago",level:"high"},
  {id:2,name:"Google Cloud Dubai",country:"UAE",text:"Same channel posted Google Cloud Dubai region infrastructure map. Threat context: retaliation for Western cyber operations.",source:"@iran_cyber_watch",time:"6m ago",level:"high"},
  {id:3,name:"Microsoft Azure UAE North",country:"UAE",text:"Semi-official Iranian media cited Azure UAE North as legitimate military target in escalation scenario.",source:"@intelslava",time:"2h ago",level:"medium"},
  {id:4,name:"Meta MENA Hub Dubai",country:"UAE",text:"Threat referencing Meta Dubai office as target for information warfare. Non-kinetic, likely influence campaign.",source:"@osintdefender",time:"8h ago",level:"low"},
];

const INIT_INFRA = [
  {id:1,icon:"ship",name:"Jebel Ali Port",country:"UAE",type:"PORT",status:"active-threat",desc:"Pro-IRGC channel published aerial imagery with threat caption. Handles 7M+ TEUs annually.",time:"31m ago"},
  {id:2,icon:"plane",name:"King Khalid Intl Airport",country:"Saudi Arabia",type:"AIRPORT",status:"active-threat",desc:"Listed in IRGC threat matrix as Tier-2 strike priority. Unverified, medium confidence.",time:"3h ago"},
  {id:3,icon:"oil",name:"Aramco Abqaiq",country:"Saudi Arabia",type:"OIL FACILITY",status:"monitoring",desc:"Drone swarm intercepted. Precautionary measures active. 2019 attack precedent.",time:"2h ago"},
  {id:4,icon:"port",name:"Manama Financial Harbour",country:"Bahrain",type:"FINANCIAL PORT",status:"active-threat",desc:"Aerial imagery posted with threat caption. US 5th Fleet HQ proximity adds strategic value.",time:"5h ago"},
  {id:5,icon:"power",name:"UAE Power Grid DEWA",country:"UAE",type:"POWER",status:"monitoring",desc:"Increased IRGC cyber chatter referencing grid infrastructure. No confirmed public threat.",time:"12h ago"},
  {id:6,icon:"oil",name:"Kuwait Oil Company Terminals",country:"Kuwait",type:"OIL FACILITY",status:"clear",desc:"No active threat detected. Routine monitoring.",time:"24h ago"},
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
  "IRGC-affiliated Telegram channels posted explicit threats against AWS Bahrain and Google Cloud Dubai. First named US tech infrastructure threats. Credibility HIGH.",
  "Jebel Ali Port UAE and Manama Financial Harbour Bahrain flagged in IRGC threat communications. Jebel Ali closure would disrupt 7M TEU annually.",
  "IDF intercepted third Houthi ballistic missile this week over southern Israel. Arrow-3 engaged. Iran-Houthi coordination appears active.",
  "IAEA denied Natanz access for third consecutive week. Fordow enrichment reportedly accelerated per monitoring data.",
  "US CENTCOM repositioning two additional carrier strike groups to Persian Gulf. Significant deterrence escalation signal.",
];

const ACTORS = [
  {flag:"IR",name:"IRGC and Iran Armed Forces",latest:"Naval drills in Hormuz. Natanz denied. Cyber units active.",time:"14m ago"},
  {flag:"IL",name:"Israel Defense Forces",latest:"Intercepted Houthi ballistic missile. Air defenses elevated.",time:"44m ago"},
  {flag:"US",name:"US CENTCOM",latest:"Two additional carrier strike groups repositioning to Gulf.",time:"4h ago"},
  {flag:"YE",name:"Houthis Ansar Allah",latest:"Ballistic missile toward Israel intercepted. Campaign continues.",time:"44m ago"},
  {flag:"LB",name:"Hezbollah",latest:"Rocket units in south Lebanon reactivated after Beirut meeting.",time:"4h ago"},
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
  const escaped = kws.map(function(k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
  const parts = text.split(new RegExp("(" + escaped.join("|") + ")", "gi"));
  return parts.map(function(p, i) {
    return kws.some(function(k) { return k.toLowerCase() === p.toLowerCase(); })
      ? React.createElement("span", {key: i, className: "kh"}, p)
      : p;
  });
}

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(function() {
    var id = setInterval(function() { setT(new Date()); }, 1000);
    return function() { clearInterval(id); };
  }, []);
  return React.createElement("span", {className: "clock"}, t.toUTCString().slice(17, 25) + " UTC");
}

import React from "react";

export default function App() {
  const [tab, setTab] = useState("feed");
  const [cf, setCf] = useState("all");
  const [corp, setCorp] = useState(INIT_CORP);
  const [infra, setInfra] = useState(INIT_INFRA);
  const [chs, setChs] = useState(INIT_CH);
  const [kws, setKws] = useState(["IRGC","Natanz","Hormuz","Houthi","JCPOA","AWS","Azure","Google Cloud"]);
  const [newKw, setNewKw] = useState("");
  const [newCh, setNewCh] = useState("");
  const [newCN, setNewCN] = useState("");
  const [newCC, setNewCC] = useState("UAE");
  const [newCL, setNewCL] = useState("medium");
  const [newIN, setNewIN] = useState("");
  const [newIT, setNewIT] = useState("PORT");
  const [newIC, setNewIC] = useState("UAE");
  const [newIS, setNewIS] = useState("monitoring");
  const [msgs, setMsgs] = useState([
    {role:"system",text:"IRAN INTEL - THREAT MONITORING ACTIVE - Add any company, port, airport, or infrastructure to monitor."},
    {role:"ai",text:"Analyst online. Escalation: 7.4/10.\n\nACTIVE ALERTS:\n- AWS Bahrain and Google Cloud Dubai are IRGC targets\n- Jebel Ali Port threat posted\n- King Khalid Airport in IRGC strike matrix\n- Azure UAE North cited as military target\n\nAsk me about ANY company, port, airport, oil facility, data center, or infrastructure."},
  ]);
  const [inp, setInp] = useState("");
  const [aiL, setAiL] = useState(false);
  const [briefL, setBriefL] = useState(false);
  const [brief, setBrief] = useState(INIT_BRIEF);
  const chatRef = useRef(null);

  useEffect(function() {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  const allNames = corp.map(function(c) { return c.name.split(" (")[0]; })
    .concat(infra.map(function(i) { return i.name; }))
    .concat(kws);

  const prio = FEED.filter(function(i) { return i.priority; }).length;

  var feedFiltered = FEED;
  if (cf === "threats") feedFiltered = FEED.filter(function(i) { return ["corp-threat","infra-threat","missile"].includes(i.cat); });
  else if (cf !== "all") feedFiltered = FEED.filter(function(i) { return i.cat === cf; });
  const feed = feedFiltered.slice().sort(function(a, b) { return (b.priority ? 1 : 0) - (a.priority ? 1 : 0); });

  const SYS = "You are an elite intelligence analyst for Iran conflict, IRGC operations, and threat monitoring. You have web search access.\n\nMONITORING covers ANYTHING the user asks:\n1. CORPORATE: Any tech company with Gulf or Israel presence - AWS, Google Cloud, Azure, Oracle, IBM, Meta, X, TikTok, Equinix, Cisco, SAP, PayPal, Stripe, Visa, submarine cables, CDN nodes, ANY company mentioned\n2. INFRASTRUCTURE: Any named port, oil facility, airport, power grid, water, financial hub in UAE, Bahrain, Saudi, Kuwait, Israel\n3. MISSILE AND DRONE: All events targeting Israel, UAE, Bahrain, Saudi, Kuwait - type, origin, outcome, system\n4. GENERAL: IRGC, Houthis, IDF, JCPOA, Hormuz, Natanz, Fordow, sanctions\n\nAlways cite confidence HIGH MEDIUM or LOW and source tier T1 T2 or T3. Flag unverified claims. Date: " + new Date().toUTCString();

  function send(text) {
    const q = (text || inp).trim();
    if (!q || aiL) return;
    setInp("");
    setMsgs(function(m) { return m.concat([{role:"user",text:q}]); });
    setAiL(true);
    const headers = {"Content-Type":"application/json"};
    if (CLAUDE_API_KEY) headers["x-api-key"] = CLAUDE_API_KEY;
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYS,
        tools: [{type:"web_search_20250305",name:"web_search"}],
        messages: [{role:"user",content:q}]
      })
    }).then(function(r) { return r.json(); }).then(function(d) {
      const reply = (d.content || []).filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n") || "No response.";
      setMsgs(function(m) { return m.concat([{role:"ai",text:reply}]); });
      setAiL(false);
    }).catch(function() {
      setMsgs(function(m) { return m.concat([{role:"ai",text:"Connection error. Check API key in config."}]); });
      setAiL(false);
    });
  }

  function genBrief() {
    setBriefL(true);
    const headers = {"Content-Type":"application/json"};
    if (CLAUDE_API_KEY) headers["x-api-key"] = CLAUDE_API_KEY;
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{type:"web_search_20250305",name:"web_search"}],
        messages: [{role:"user",content:"Search for latest news on Iran conflict, IRGC, threats to US tech in Gulf and Israel, missile and drone attacks, critical infrastructure threats Gulf region, Strait of Hormuz, Natanz. Generate exactly 5 intelligence brief bullets on critical 24h developments. Return ONLY a JSON array of 5 strings. No preamble, no markdown."}]
      })
    }).then(function(r) { return r.json(); }).then(function(d) {
      const txt = (d.content || []).filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n") || "[]";
      try {
        const a = JSON.parse(txt.replace(/```json|```/g,"").trim());
        if (Array.isArray(a) && a.length) setBrief(a);
      } catch(e) {}
      setBriefL(false);
    }).catch(function() { setBriefL(false); });
  }

  function addCorp() {
    if (!newCN.trim()) return;
    setCorp(function(m) { return m.concat([{id:Date.now(),name:newCN.trim(),country:newCC,text:"Added for monitoring. Ask Claude AI for latest threat intelligence on this entity.",source:"User-added",time:"just now",level:newCL}]); });
    setNewCN("");
  }

  function addInfra() {
    if (!newIN.trim()) return;
    setInfra(function(m) { return m.concat([{id:Date.now(),icon:"other",name:newIN.trim(),country:newIC,type:newIT,status:newIS,desc:"Added for monitoring. Ask Claude AI for latest threat intelligence on this site.",time:"just now"}]); });
    setNewIN("");
  }

  function upInfraStatus(id, s) {
    setInfra(function(m) { return m.map(function(i) { return i.id === id ? Object.assign({},i,{status:s}) : i; }); });
  }

  function togCh(id) { setChs(function(c) { return c.map(function(ch) { return ch.id === id ? Object.assign({},ch,{active:!ch.active}) : ch; }); }); }
  function delCh(id) { setChs(function(c) { return c.filter(function(ch) { return ch.id !== id; }); }); }
  function addCh() {
    const h = newCh.trim().replace(/^@/,"");
    if (!h) return;
    setChs(function(c) { return c.concat([{id:Date.now(),name:h,handle:"@"+h,tier:"T3",active:true,icon:"N"}]); });
    setNewCh("");
  }
  function addKw() {
    const k = newKw.trim();
    if (k && !kws.includes(k)) setKws(function(w) { return w.concat([k]); });
    setNewKw("");
  }
  function rmKw(k) { setKws(function(w) { return w.filter(function(x) { return x !== k; }); }); }

  const kwHits = FEED.filter(function(item) {
    return allNames.some(function(k) { return item.headline.toLowerCase().includes(k.toLowerCase()); });
  });

  const ss = {background:"var(--panel)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--mono)",fontSize:11,padding:"7px 9px",borderRadius:2,outline:"none",cursor:"pointer"};

  const tabs = [
    {id:"feed",label:"Live Feed",count:FEED.length},
    {id:"threats",label:"Threat Monitor",count:prio,threat:true},
    {id:"brief",label:"AI Brief"},
    {id:"threads",label:"Threads",count:THREADS.length},
    {id:"actors",label:"Actors"},
    {id:"keywords",label:"Keywords",count:kws.length},
    {id:"channels",label:"Channels",count:chs.filter(function(c){return c.active;}).length},
  ];

  const filters = [
    ["all","ALL"],["threats","THREATS"],["corp-threat","CORP THREAT"],
    ["infra-threat","INFRA"],["missile","MISSILE"],["strike","STRIKE"],
    ["naval","NAVAL"],["diplomatic","DIPLO"],["cyber","CYBER"],["sanctions","SANCTIONS"]
  ];

  return (
    React.createElement(React.Fragment, null,
      React.createElement("style", null, FONTS + CSS),
      React.createElement("div", {className:"scanline"}),
      React.createElement("div", {className:"app"},

        React.createElement("div", {className:"topbar"},
          React.createElement("div", {className:"tl"},
            React.createElement("div", {className:"dot"}),
            React.createElement("div", {className:"logo"}, "IRAN", React.createElement("span", null, "."), "INTEL"),
            React.createElement("div", {className:"live"}, "LIVE")
          ),
          React.createElement("div", {className:"tc"}, "CONFLICT AND THREAT MONITORING // GULF + ISRAEL THEATER"),
          React.createElement("div", {className:"tr"},
            React.createElement("div", {className:"escal"}, "ESCALATION 7.4 / 10"),
            React.createElement(Clock, null)
          )
        ),

        React.createElement("div", {className:"ticker"},
          React.createElement("div", {className:"tlabel"}, "ALERT"),
          React.createElement("div", {className:"twrap"},
            React.createElement("div", {className:"ttrack"},
              TICKER.concat(TICKER).map(function(item, i) {
                return React.createElement("span", {key:i, className:"titem"}, item, React.createElement("span", {className:"tsep"}, " * "));
              })
            )
          )
        ),

        React.createElement("div", {className:"nav"},
          tabs.map(function(t) {
            return React.createElement("button", {
              key: t.id,
              className: "ntab" + (t.threat ? " threat" : "") + (tab === t.id ? " on" : ""),
              onClick: function() { setTab(t.id); }
            },
              t.label,
              t.count !== undefined ? React.createElement("span", {className:"nbadge" + (t.threat ? " r" : "")}, t.count) : null
            );
          })
        ),

        React.createElement("div", {className:"main"},

          React.createElement("div", {className:"lp"},

            tab === "feed" && React.createElement(React.Fragment, null,
              React.createElement("div", {className:"ph"},
                React.createElement("span", {className:"pt"}, "Intelligence Feed"),
                React.createElement("span", {className:"pm"}, chs.filter(function(c){return c.active;}).length + " SOURCES - " + prio + " ALERTS")
              ),
              React.createElement("div", {className:"frow"},
                filters.map(function(arr) {
                  var v = arr[0]; var l = arr[1];
                  var cls = "fb";
                  if (v === "corp-threat") cls += " fc";
                  else if (v === "infra-threat") cls += " fi";
                  else if (v === "missile") cls += " fm";
                  else if (v === "naval") cls += " fn";
                  else if (v === "diplomatic") cls += " fd";
                  if (cf === v) cls += " on";
                  return React.createElement("button", {key:v, className:cls, onClick:function(){setCf(v);}}, l);
                })
              ),
              React.createElement("div", {className:"fl"},
                feed.map(function(item) {
                  return React.createElement("div", {key:item.id, className:"fi " + item.cat + (item.priority ? " priority" : "")},
                    React.createElement("div", {className:"fit"},
                      React.createElement("span", {className:"sb t" + item.tier}, "T" + item.tier),
                      React.createElement("span", {style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}, item.source),
                      React.createElement("span", {className:"ct " + item.cat}, item.cat.replace("-"," ").toUpperCase()),
                      item.breaking ? React.createElement("span", {className:"btag"}, "BREAKING") : null,
                      item.priority ? React.createElement("span", {className:"ttag"}, "THREAT ALERT") : null
                    ),
                    React.createElement("div", {className:"fh"}, hl(item.headline, allNames)),
                    React.createElement("div", {className:"fs"}, item.snippet),
                    React.createElement("div", {className:"ftime"}, item.time)
                  );
                })
              )
            ),

            tab === "threats" && React.createElement("div", {className:"sp"},

              React.createElement("div", {style:{marginBottom:20}},
                React.createElement("div", {className:"tsh"},
                  React.createElement("span", {className:"tsi"}, "CORP"),
                  React.createElement("span", {className:"tst"}, "Tech and Corporate Threat Monitor"),
                  React.createElement("span", {className:"tsc c"}, corp.length + " MONITORED")
                ),
                React.createElement("div", {className:"sl"}, "ANY TECH COMPANY OR CORPORATION - UAE - BAHRAIN - SAUDI - KUWAIT - ISRAEL"),
                corp.map(function(c) {
                  return React.createElement("div", {key:c.id, className:"cc"},
                    React.createElement("div", {className:"cct"},
                      React.createElement("span", {className:"ccn"}, c.name),
                      React.createElement("div", {className:"ccb"},
                        React.createElement("span", {className:"ccc"}, c.country),
                        React.createElement("span", {className:"lv " + c.level}, c.level.toUpperCase()),
                        React.createElement("button", {className:"xbtn", onClick:function(){setCorp(function(m){return m.filter(function(x){return x.id!==c.id;});});}}, "X")
                      )
                    ),
                    React.createElement("div", {className:"ccd"}, c.text),
                    React.createElement("div", {className:"ccm"},
                      React.createElement("span", {className:"ccs"}, c.source),
                      React.createElement("span", {className:"cct2"}, c.time)
                    )
                  );
                }),
                React.createElement("div", {className:"amb"},
                  React.createElement("div", {className:"ambt"}, "Add Company or Infrastructure to Monitor"),
                  React.createElement("div", {className:"ambh"}, "Add any tech company, data center, financial institution, or corporate entity. Use AI chat for live threat intelligence."),
                  React.createElement("input", {className:"ambi", style:{display:"block",width:"100%",marginBottom:6}, placeholder:"e.g. Oracle Cloud UAE, Equinix Dubai, Cisco Gulf HQ, Visa Data Center", value:newCN, onChange:function(e){setNewCN(e.target.value);}, onKeyDown:function(e){if(e.key==="Enter")addCorp();}}),
                  React.createElement("div", {className:"amr"},
                    React.createElement("select", {style:ss, value:newCC, onChange:function(e){setNewCC(e.target.value);}},
                      React.createElement("option", null, "UAE"),
                      React.createElement("option", null, "Bahrain"),
                      React.createElement("option", null, "Saudi Arabia"),
                      React.createElement("option", null, "Kuwait"),
                      React.createElement("option", null, "Israel"),
                      React.createElement("option", null, "Multiple")
                    ),
                    React.createElement("select", {style:ss, value:newCL, onChange:function(e){setNewCL(e.target.value);}},
                      React.createElement("option", {value:"high"}, "HIGH"),
                      React.createElement("option", {value:"medium"}, "MEDIUM"),
                      React.createElement("option", {value:"low"}, "LOW")
                    ),
                    React.createElement("button", {className:"ambb", onClick:addCorp}, "ADD")
                  )
                )
              ),

              React.createElement("div", {style:{marginBottom:20}},
                React.createElement("div", {className:"tsh"},
                  React.createElement("span", {className:"tsi"}, "INFRA"),
                  React.createElement("span", {className:"tst"}, "Critical Infrastructure Monitor"),
                  React.createElement("span", {className:"tsc i"}, infra.filter(function(i){return i.status==="active-threat";}).length + " ACTIVE THREATS")
                ),
                React.createElement("div", {className:"sl"}, "PORTS - OIL - AIRPORTS - POWER - WATER - UAE - BAHRAIN - SAUDI - KUWAIT - ISRAEL"),
                infra.map(function(ic) {
                  return React.createElement("div", {key:ic.id, className:"ic"},
                    React.createElement("div", {className:"ict"},
                      React.createElement("span", {className:"icn"}, ic.name),
                      React.createElement("span", {className:"icty"}, ic.type),
                      React.createElement("span", {className:"ico"}, ic.country),
                      React.createElement("span", {className:"ics " + ic.status}, ic.status.replace("-"," ").toUpperCase()),
                      React.createElement("select", {value:ic.status, onChange:function(e){upInfraStatus(ic.id,e.target.value);}, style:Object.assign({},ss,{marginLeft:"auto",fontSize:9,padding:"2px 5px"})},
                        React.createElement("option", {value:"active-threat"}, "ACTIVE THREAT"),
                        React.createElement("option", {value:"monitoring"}, "MONITORING"),
                        React.createElement("option", {value:"clear"}, "CLEAR")
                      ),
                      React.createElement("button", {className:"xbtn", onClick:function(){setInfra(function(m){return m.filter(function(x){return x.id!==ic.id;});});}}, "X")
                    ),
                    React.createElement("div", {className:"icd"}, ic.desc),
                    React.createElement("div", {className:"icm"}, ic.time)
                  );
                }),
                React.createElement("div", {className:"amb"},
                  React.createElement("div", {className:"ambt"}, "Add Infrastructure Site to Monitor"),
                  React.createElement("div", {className:"ambh"}, "Add any port, oil terminal, airport, power station, water plant, or financial hub."),
                  React.createElement("input", {className:"ambi", style:{display:"block",width:"100%",marginBottom:6}, placeholder:"e.g. Ras Tanura Terminal, Ben Gurion Airport, ADNOC Ruwais, Port of Haifa", value:newIN, onChange:function(e){setNewIN(e.target.value);}, onKeyDown:function(e){if(e.key==="Enter")addInfra();}}),
                  React.createElement("div", {className:"amr"},
                    React.createElement("select", {style:ss, value:newIT, onChange:function(e){setNewIT(e.target.value);}},
                      React.createElement("option", null, "PORT"),
                      React.createElement("option", null, "OIL FACILITY"),
                      React.createElement("option", null, "AIRPORT"),
                      React.createElement("option", null, "POWER"),
                      React.createElement("option", null, "WATER"),
                      React.createElement("option", null, "FINANCIAL PORT"),
                      React.createElement("option", null, "TELECOM"),
                      React.createElement("option", null, "OTHER")
                    ),
                    React.createElement("select", {style:ss, value:newIC, onChange:function(e){setNewIC(e.target.value);}},
                      React.createElement("option", null, "UAE"),
                      React.createElement("option", null, "Bahrain"),
                      React.createElement("option", null, "Saudi Arabia"),
                      React.createElement("option", null, "Kuwait"),
                      React.createElement("option", null, "Israel")
                    ),
                    React.createElement("select", {style:ss, value:newIS, onChange:function(e){setNewIS(e.target.value);}},
                      React.createElement("option", {value:"active-threat"}, "ACTIVE THREAT"),
                      React.createElement("option", {value:"monitoring"}, "MONITORING"),
                      React.createElement("option", {value:"clear"}, "CLEAR")
                    ),
                    React.createElement("button", {className:"ambb", onClick:addInfra}, "ADD")
                  )
                )
              ),

              React.createElement("div", null,
                React.createElement("div", {className:"tsh"},
                  React.createElement("span", {className:"tsi"}, "MSL"),
                  React.createElement("span", {className:"tst"}, "Missile and Drone Event Log"),
                  React.createElement("span", {className:"tsc m"}, MISSILES.length + " EVENTS")
                ),
                React.createElement("div", {className:"sl"}, "ISRAEL - UAE - BAHRAIN - SAUDI - KUWAIT - ALL RECORDED EVENTS"),
                React.createElement("div", {style:{overflowX:"auto"}},
                  React.createElement("table", {className:"mst"},
                    React.createElement("thead", null,
                      React.createElement("tr", null,
                        React.createElement("th", null, "DATE"),
                        React.createElement("th", null, "TYPE"),
                        React.createElement("th", null, "ORIGIN"),
                        React.createElement("th", null, "TARGET"),
                        React.createElement("th", null, "OUTCOME"),
                        React.createElement("th", null, "SYSTEM")
                      )
                    ),
                    React.createElement("tbody", null,
                      MISSILES.map(function(m) {
                        return React.createElement("tr", {key:m.id},
                          React.createElement("td", {style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",whiteSpace:"nowrap"}}, m.date),
                          React.createElement("td", null, React.createElement("span", {className:"mty " + m.type}, m.type.toUpperCase())),
                          React.createElement("td", {style:{fontSize:11}}, m.origin),
                          React.createElement("td", {style:{fontSize:11}}, (FLAGS[m.tc] || "?") + " " + m.target),
                          React.createElement("td", null, React.createElement("span", {className:"mou " + m.outcome}, m.outcome.toUpperCase())),
                          React.createElement("td", {style:{fontSize:10,color:"var(--text2)"}}, m.sys)
                        );
                      })
                    )
                  )
                )
              )
            ),

            tab === "brief" && React.createElement("div", {className:"sp"},
              React.createElement("div", {style:{marginBottom:14,paddingBottom:11,borderBottom:"1px solid var(--border)"}},
                React.createElement("div", {style:{fontFamily:"var(--head)",fontWeight:900,fontSize:20,letterSpacing:2,color:"var(--white)",textTransform:"uppercase"}}, "Intel Brief"),
                React.createElement("div", {style:{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginTop:3,letterSpacing:1}}, "AI-GENERATED // " + new Date().toUTCString().slice(0,16).toUpperCase())
              ),
              React.createElement("button", {className:"gbb", onClick:genBrief, disabled:briefL}, briefL ? "GENERATING LIVE BRIEF..." : "GENERATE LIVE BRIEF"),
              React.createElement("div", {className:"eb"},
                React.createElement("div", {className:"en"}, "7.4"),
                React.createElement("div", {className:"ei"},
                  React.createElement("div", {className:"ela"}, "HIGH ESCALATION"),
                  React.createElement("div", {className:"eld"}, "Multi-vector: naval, nuclear, missile, corporate and infra threats simultaneously active."),
                  React.createElement("div", {className:"elb"}, React.createElement("div", {className:"elf", style:{width:"74%"}}))
                )
              ),
              React.createElement("div", {className:"sl", style:{marginTop:12}}, "KEY DEVELOPMENTS - LAST 12H"),
              brief.map(function(pt, i) {
                return React.createElement("div", {key:i, className:"bp"},
                  React.createElement("span", {className:"bpn"}, "0" + (i+1)),
                  React.createElement("span", {className:"bpt"}, pt)
                );
              }),
              React.createElement("div", {className:"sl", style:{marginTop:14}}, "ACTIVE ACTORS"),
              ACTORS.map(function(a, i) {
                return React.createElement("div", {key:i, className:"ar"},
                  React.createElement("span", {className:"af", style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--amber)"}}, "[" + a.flag + "]"),
                  React.createElement("div", null,
                    React.createElement("div", {className:"an"}, a.name),
                    React.createElement("div", {className:"al"}, a.latest),
                    React.createElement("div", {className:"at"}, a.time)
                  )
                );
              })
            ),

            tab === "threads" && React.createElement("div", {className:"sp"},
              React.createElement("div", {className:"sl"}, "ACTIVE STORY THREADS"),
              THREADS.map(function(t) {
                return React.createElement("div", {key:t.id, className:"thlg"},
                  React.createElement("div", {className:"thrt"},
                    React.createElement("span", {style:{fontFamily:"var(--head)",fontWeight:600,fontSize:13,color:"var(--text)"}}, t.name),
                    React.createElement("span", {style:{fontFamily:"var(--mono)",fontSize:10,color:"var(--amber)"}}, t.count + " ITEMS")
                  ),
                  React.createElement("div", {style:{fontSize:11,color:"var(--text3)",marginTop:3}}, t.latest),
                  React.createElement("div", {className:"thrb", style:{marginTop:8}}, React.createElement("div", {className:"thrf", style:{width:t.heat+"%"}})),
                  React.createElement("div", {style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:3}}, "ACTIVITY " + t.heat + "%")
                );
              })
            ),

            tab === "actors" && React.createElement("div", {className:"sp"},
              React.createElement("div", {className:"sl"}, "CONFLICT ACTORS - LATEST ACTIONS"),
              ACTORS.map(function(a, i) {
                return React.createElement("div", {key:i, className:"ar", style:{marginBottom:8}},
                  React.createElement("span", {style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--amber)",flexShrink:0}}, "[" + a.flag + "]"),
                  React.createElement("div", null,
                    React.createElement("div", {className:"an"}, a.name),
                    React.createElement("div", {className:"al"}, a.latest),
                    React.createElement("div", {className:"at"}, a.time)
                  )
                );
              })
            ),

            tab === "keywords" && React.createElement("div", {className:"sp"},
              React.createElement("div", {className:"sl"}, "TRACKED KEYWORDS - HIGHLIGHTS IN FEED"),
              React.createElement("div", {className:"kwg"},
                kws.map(function(k) {
                  return React.createElement("div", {key:k, className:"kwp"},
                    k,
                    React.createElement("span", {className:"kwx", onClick:function(){rmKw(k);}}, "X")
                  );
                })
              ),
              React.createElement("div", {className:"ab"},
                React.createElement("div", {className:"sl", style:{border:"none",paddingBottom:0,marginBottom:6}}, "ADD KEYWORD"),
                React.createElement("div", {className:"ar2"},
                  React.createElement("input", {className:"ai2", placeholder:"e.g. Fordow, CENTCOM, Abu Dhabi, F-35", value:newKw, onChange:function(e){setNewKw(e.target.value);}, onKeyDown:function(e){if(e.key==="Enter")addKw();}}),
                  React.createElement("button", {className:"abb", onClick:addKw}, "ADD")
                )
              ),
              React.createElement("div", {style:{marginTop:14}},
                React.createElement("div", {className:"sl"}, kwHits.length + " HITS IN CURRENT FEED"),
                kwHits.map(function(item) {
                  return React.createElement("div", {key:item.id, className:"khi"},
                    React.createElement("div", {className:"khw"}, allNames.filter(function(k){return item.headline.toLowerCase().includes(k.toLowerCase());}).slice(0,3).join(", ")),
                    React.createElement("div", {className:"kht"}, item.headline),
                    React.createElement("div", {className:"khm"}, item.source + " - " + item.time)
                  );
                })
              )
            ),

            tab === "channels" && React.createElement("div", {className:"sp"},
              React.createElement("div", {className:"sl"}, "TELEGRAM OSINT CHANNELS - " + chs.filter(function(c){return c.active;}).length + " ACTIVE"),
              chs.map(function(ch) {
                return React.createElement("div", {key:ch.id, className:"tgc"},
                  React.createElement("div", {className:"tgi"},
                    React.createElement("div", {className:"tgic"}, ch.icon),
                    React.createElement("div", null,
                      React.createElement("div", {className:"tgn"}, ch.name),
                      React.createElement("div", {className:"tgh"}, ch.handle + " - " + ch.tier)
                    )
                  ),
                  React.createElement("div", {className:"tga"},
                    React.createElement("button", {className:"tgt " + (ch.active ? "on" : "off"), onClick:function(){togCh(ch.id);}},
                      React.createElement("div", {className:"tgk"})
                    ),
                    React.createElement("button", {className:"tgd", onClick:function(){delCh(ch.id);}}, "X")
                  )
                );
              }),
              React.createElement("div", {className:"ab"},
                React.createElement("div", {className:"sl", style:{border:"none",paddingBottom:0,marginBottom:4}}, "ADD CHANNEL"),
                React.createElement("div", {style:{fontSize:10,color:"var(--text3)",marginBottom:7}}, "Enter any Telegram handle with or without @"),
                React.createElement("div", {className:"ar2"},
                  React.createElement("input", {className:"ai2", placeholder:"@channel_handle", value:newCh, onChange:function(e){setNewCh(e.target.value);}, onKeyDown:function(e){if(e.key==="Enter")addCh();}}),
                  React.createElement("button", {className:"abb", onClick:addCh}, "ADD")
                )
              )
            )

          ),

          React.createElement("div", {className:"rs"},
            React.createElement("div", {className:"ph", style:{borderLeft:"1px solid var(--border)"}},
              React.createElement("span", {className:"pt"}, "AI Analyst"),
              React.createElement("span", {style:{fontFamily:"var(--mono)",fontSize:9,color:"var(--green)",letterSpacing:1}}, "ONLINE")
            ),
            React.createElement("div", {className:"aic"},
              React.createElement("div", {className:"cms", ref:chatRef},
                msgs.map(function(m, i) {
                  return React.createElement("div", {key:i, className:"msg " + m.role},
                    React.createElement("div", {className:"ml"}, m.role === "user" ? "YOU" : m.role === "system" ? "SYSTEM" : "CLAUDE AI"),
                    React.createElement("div", {className:"mb"}, m.text)
                  );
                }),
                aiL ? React.createElement("div", {className:"msg ai"},
                  React.createElement("div", {className:"ml"}, "CLAUDE AI"),
                  React.createElement("div", {className:"mb"},
                    React.createElement("div", {className:"ti"},
                      React.createElement("div", {className:"td"}),
                      React.createElement("div", {className:"td"}),
                      React.createElement("div", {className:"td"})
                    )
                  )
                ) : null
              ),
              React.createElement("div", {className:"cia"},
                React.createElement("div", {className:"qq"},
                  ["AWS threats?","Jebel Ali?","Latest missiles?","Azure UAE?","Hormuz now?","Natanz?"].map(function(q) {
                    return React.createElement("button", {key:q, className:"qb", onClick:function(){send(q);}}, q);
                  })
                ),
                React.createElement("div", {className:"cir"},
                  React.createElement("textarea", {className:"ci", rows:2, placeholder:"Ask about any threat, company, port, airport, infrastructure...", value:inp, onChange:function(e){setInp(e.target.value);}, onKeyDown:function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}),
                  React.createElement("button", {className:"sb2", onClick:function(){send();}, disabled:aiL||!inp.trim()}, "SEND")
                )
              )
            ),
            React.createElement("div", {className:"thrp"},
              React.createElement("div", {className:"ph"},
                React.createElement("span", {className:"pt"}, "Story Threads"),
                React.createElement("span", {className:"pm"}, THREADS.length + " ACTIVE")
              ),
              React.createElement("div", {className:"thrl"},
                THREADS.map(function(t) {
                  return React.createElement("div", {key:t.id, className:"thri", onClick:function(){setTab("threads");}},
                    React.createElement("div", {className:"thrt"},
                      React.createElement("span", {className:"thrn"}, t.name),
                      React.createElement("span", {className:"thrc"}, t.count)
                    ),
                    React.createElement("div", {className:"thrl2"}, t.latest),
                    React.createElement("div", {className:"thrb"}, React.createElement("div", {className:"thrf", style:{width:t.heat+"%"}}))
                  );
                })
              )
            )
          )

        )
      )
    )
  );
}
