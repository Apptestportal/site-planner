import { useState, useMemo, useRef, useEffect } from "react";
import * as api from "./api.js";

// ── Persistence helpers ───────────────────────────────────────────────────────
const PERSIST_KEYS = {
  jobs: "siteplanner_jobs_v1",
  nextId: "siteplanner_nextId_v1",
  workers: "siteplanner_workers_v1",
  leave: "siteplanner_leave_v1",
  leaveNextId: "siteplanner_leaveNextId_v1",
};
function loadPersisted(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return typeof fallback === "function" ? fallback() : fallback;
}
function savePersisted(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

// ── User list with access codes ───────────────────────────────────────────────
// Format: { name, email, code, role: "admin" | "user" }
const STORAGE_KEY = "siteplanner_users_v2";

const DEFAULT_USERS = [
  { name: "Craig",        email: "craig@topcon.com",                     code: "1234", role: "admin" },
  { name: "Allan",        email: "allan@velcorp.com",                    code: "5678", role: "admin" },
  { name: "Admin",        email: "apptestportal@outlook.com",            code: "9012", role: "admin" },
  { name: "Sadmin",       email: "sadmin@apptestportal.onmicrosoft.com", code: "3456", role: "admin" },
  { name: "Adam Clarke",  email: "adam.c@topcon.com.au",                 code: "1001", role: "user" },
  { name: "Ben Torres",   email: "ben.t@topcon.com.au",                  code: "1002", role: "user" },
  { name: "Chris Ray",    email: "chris.r@topcon.com.au",                code: "1003", role: "user" },
  { name: "Dan Smith",    email: "dan.s@topcon.com.au",                  code: "1004", role: "user" },
  { name: "Ed Walsh",     email: "ed.w@topcon.com.au",                   code: "1005", role: "user" },
  { name: "Frank Li",     email: "frank.l@topcon.com.au",                code: "1006", role: "user" },
  { name: "Gary Hunt",    email: "gary.h@topcon.com.au",                 code: "2001", role: "user" },
  { name: "Harry Fox",    email: "harry.f@topcon.com.au",                code: "2002", role: "user" },
  { name: "Ivan Marsh",   email: "ivan.m@topcon.com.au",                 code: "2003", role: "user" },
  { name: "Jake Owen",    email: "jake.o@topcon.com.au",                 code: "2004", role: "user" },
  { name: "Kyle Park",    email: "kyle.p@topcon.com.au",                 code: "2005", role: "user" },
  { name: "Leo James",    email: "leo.j@topcon.com.au",                  code: "2006", role: "user" },
];

function loadUsers() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return DEFAULT_USERS;
}

function saveUsers(users) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch(e) {}
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [code, setCode]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await api.login(email.trim(), code.trim());
      setLoading(false);
      if (user && user.email) {
        api.setApiUser(user);
        onLogin(user);
      } else {
        setError("Invalid email or access code. Contact your administrator.");
        setCode("");
      }
    } catch (err) {
      setLoading(false);
      setError("Invalid email or access code. Contact your administrator.");
      setCode("");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#111827",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <div style={{background:"#1F2937",borderRadius:20,padding:"48px 40px",width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><StaticCrane width={80} height={100}/></div>
          <div style={{fontSize:26,fontWeight:800,color:"#F9F7F4",letterSpacing:-0.5}}>Site Planner</div>
          <div style={{fontSize:11,color:"#6B9E7A",letterSpacing:3,marginTop:4}}>CONSTRUCTION SCHEDULER</div>
          <div style={{fontSize:12,color:"#6B7280",marginTop:8}}>Topcon Builders & NQ Stripouts</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:6}}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid #374151",background:"#111827",color:"#F9F7F4",fontSize:14,outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#2563EB"}
              onBlur={e=>e.target.style.borderColor="#374151"}
            />
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:6}}>ACCESS CODE</label>
            <input
              type="password"
              value={code}
              onChange={e=>setCode(e.target.value)}
              placeholder="Enter your code"
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid #374151",background:"#111827",color:"#F9F7F4",fontSize:14,outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#2563EB"}
              onBlur={e=>e.target.style.borderColor="#374151"}
            />
          </div>
          {error && <div style={{background:"#450A0A",border:"1px solid #7F1D1D",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#FCA5A5"}}>{error}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{padding:"13px",border:"none",borderRadius:10,background:"#2563EB",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:4,opacity:loading?0.7:1}}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <div style={{fontSize:11,color:"#4B5563",marginTop:24,textAlign:"center",lineHeight:1.6}}>
          Access restricted to authorised personnel only.<br/>
          Contact your administrator for an access code.
        </div>
      </div>
    </div>
  );
}

const TOPCON_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='36' viewBox='0 0 120 36'%3E%3Crect width='120' height='36' fill='%231B2D5B' rx='4'/%3E%3Ctext x='60' y='24' font-family='Arial' font-size='13' font-weight='bold' fill='white' text-anchor='middle'%3ETOPCON BUILDERS%3C/text%3E%3C/svg%3E";
const NQ_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='36' viewBox='0 0 120 36'%3E%3Crect width='120' height='36' fill='%23C0121C' rx='4'/%3E%3Ctext x='60' y='24' font-family='Arial' font-size='13' font-weight='bold' fill='white' text-anchor='middle'%3ENQ STRIPOUTS%3C/text%3E%3C/svg%3E";

function StaticCrane({ width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 240 300" role="img" aria-label="Site Planner crane">
      <title>Site Planner</title>
      <g transform="translate(8,12) scale(0.9)">
        <rect x="50" y="270" width="80" height="6" fill="#4B5563"/>
        <rect x="55" y="264" width="70" height="6" fill="#6B7280"/>
        <g stroke="#FBBF24" strokeWidth="2.8" fill="none" strokeLinecap="round">
          <line x1="75" y1="60" x2="75" y2="264"/><line x1="105" y1="60" x2="105" y2="264"/>
          <line x1="75" y1="60" x2="105" y2="60"/><line x1="75" y1="84" x2="105" y2="84"/>
          <line x1="75" y1="108" x2="105" y2="108"/><line x1="75" y1="132" x2="105" y2="132"/>
          <line x1="75" y1="156" x2="105" y2="156"/><line x1="75" y1="180" x2="105" y2="180"/>
          <line x1="75" y1="204" x2="105" y2="204"/><line x1="75" y1="228" x2="105" y2="228"/>
          <line x1="75" y1="264" x2="105" y2="264"/>
        </g>
        <g stroke="#FBBF24" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <line x1="75" y1="60" x2="105" y2="84"/><line x1="105" y1="60" x2="75" y2="84"/>
          <line x1="75" y1="84" x2="105" y2="108"/><line x1="105" y1="84" x2="75" y2="108"/>
          <line x1="75" y1="108" x2="105" y2="132"/><line x1="105" y1="108" x2="75" y2="132"/>
          <line x1="75" y1="132" x2="105" y2="156"/><line x1="105" y1="132" x2="75" y2="156"/>
          <line x1="75" y1="156" x2="105" y2="180"/><line x1="105" y1="156" x2="75" y2="180"/>
          <line x1="75" y1="180" x2="105" y2="204"/><line x1="105" y1="180" x2="75" y2="204"/>
          <line x1="75" y1="204" x2="105" y2="228"/><line x1="105" y1="204" x2="75" y2="228"/>
          <line x1="75" y1="228" x2="105" y2="264"/><line x1="105" y1="228" x2="75" y2="264"/>
        </g>
        <rect x="78" y="42" width="24" height="18" fill="#FBBF24" stroke="#92400E" strokeWidth="0.8"/>
        <rect x="82" y="46" width="16" height="8" fill="#86C5F2" stroke="#1E40AF" strokeWidth="0.6"/>
        <g stroke="#FBBF24" strokeWidth="2.8" fill="none" strokeLinecap="round">
          <line x1="50" y1="42" x2="200" y2="42"/><line x1="50" y1="60" x2="200" y2="60"/>
          <line x1="50" y1="42" x2="50" y2="60"/><line x1="200" y1="42" x2="200" y2="60"/>
        </g>
        <g stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round">
          <line x1="100" y1="42" x2="115" y2="60"/><line x1="115" y1="42" x2="100" y2="60"/>
          <line x1="115" y1="42" x2="130" y2="60"/><line x1="130" y1="42" x2="115" y2="60"/>
          <line x1="130" y1="42" x2="145" y2="60"/><line x1="145" y1="42" x2="130" y2="60"/>
          <line x1="145" y1="42" x2="160" y2="60"/><line x1="160" y1="42" x2="145" y2="60"/>
          <line x1="160" y1="42" x2="175" y2="60"/><line x1="175" y1="42" x2="160" y2="60"/>
          <line x1="175" y1="42" x2="190" y2="60"/><line x1="190" y1="42" x2="175" y2="60"/>
          <line x1="190" y1="42" x2="200" y2="60"/>
          <line x1="80" y1="42" x2="65" y2="60"/><line x1="65" y1="42" x2="80" y2="60"/>
          <line x1="65" y1="42" x2="50" y2="60"/><line x1="50" y1="42" x2="65" y2="60"/>
        </g>
        <line x1="90" y1="32" x2="155" y2="42" stroke="#9CA3AF" strokeWidth="1.4"/>
        <line x1="90" y1="32" x2="60" y2="42" stroke="#9CA3AF" strokeWidth="1.4"/>
        <rect x="48" y="34" width="6" height="8" fill="#374151" stroke="#1F2937" strokeWidth="0.6"/>
        <rect x="170" y="60" width="14" height="5" fill="#4B5563" stroke="#1F2937" strokeWidth="0.5"/>
        <line x1="177" y1="65" x2="177" y2="120" stroke="#D1D5DB" strokeWidth="1.6"/>
      </g>
      <g transform="translate(0,126)">
        <path d="M 162 0 L 172 0 L 172 6 L 168 6 L 168 14 Q 168 22 174 22 Q 180 22 180 14 L 180 12 L 176 12 L 176 14 Q 176 18 174 18 Q 172 18 172 14 L 172 6 L 162 6 Z" fill="#374151" stroke="#1F2937" strokeWidth="0.6"/>
        <rect x="140" y="26" width="60" height="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="0.6"/>
        <rect x="140" y="32" width="60" height="3" fill="#7F1D1D"/>
        <rect x="145" y="26" width="50" height="2" fill="#991B1B"/>
        <rect x="128" y="35" width="84" height="44" fill="#0A0A0A" stroke="#FBBF24" strokeWidth="0.8"/>
        <g transform="translate(133,41)">
          <path d="M 0 22 Q 4 4 14 4 L 14 11 Q 8 11 6 22 Z" fill="#A3E635"/>
          <path d="M 0 27 Q 6 14 18 14 L 18 21 Q 11 21 8 27 Z" fill="#9CA3AF"/>
          <path d="M 0 32 Q 8 22 22 22 L 22 30 Q 14 30 11 32 Z" fill="#E5E7EB"/>
        </g>
        <text x="160" y="51" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#FAFAFA" letterSpacing="0.5">TOPCON</text>
        <text x="160" y="62" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="700" fill="#9CA3AF" letterSpacing="1">BUILDERS</text>
        <text x="170" y="73" fontFamily="Arial, sans-serif" fontSize="5" fill="#A3E635" fontStyle="italic" textAnchor="middle">building an evolution</text>
      </g>
    </svg>
  );
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TIME_SLOTS = (() => {
  const out = [];
  for (let h=6; h<=18; h++) {
    for (let m=0; m<60; m+=15) {
      if (h===18 && m>0) break;
      const value = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const ampm = h < 12 ? "AM" : "PM";
      const label = `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
      out.push({ value, label });
    }
  }
  return out;
})();

const CREW_STYLE = {
  "Topcon Builders": { color: "#1B2D5B", light: "#E8ECF5", accent: "#0F1A36", tag: "TOPCON" },
  "NQ Stripouts":    { color: "#C0121C", light: "#FDEAEA", accent: "#7A0009", tag: "NQ" },
};

const initWorkers = {
  "Topcon Builders": [
    { name: "Adam Clarke", phone: "0411 111 111", email: "", role: "Labourer", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Ben Torres",  phone: "0422 222 222", email: "", role: "Foreman",  address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Chris Ray",   phone: "0433 333 333", email: "", role: "Labourer", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Dan Smith",   phone: "",              email: "", role: "",         address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Ed Walsh",    phone: "",              email: "", role: "",         address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Frank Li",    phone: "",              email: "", role: "",         address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
  ],
  "NQ Stripouts": [
    { name: "Gary Hunt",  phone: "0444 444 444", email: "", role: "Operator", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Harry Fox",  phone: "0455 555 555", email: "", role: "Labourer", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Ivan Marsh", phone: "",             email: "", role: "",          address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Jake Owen",  phone: "",             email: "", role: "",          address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Kyle Park",  phone: "",             email: "", role: "",          address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Leo James",  phone: "",             email: "", role: "",          address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
  ],
};

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0,0,0,0);
  return d;
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function fmtDate(date) { const dd=String(date.getDate()).padStart(2,"0"); const mm=String(date.getMonth()+1).padStart(2,"0"); return `${dd}/${mm}`; }
function fmtDateYY(date) { const dd=String(date.getDate()).padStart(2,"0"); const mm=String(date.getMonth()+1).padStart(2,"0"); const yy=String(date.getFullYear()).slice(-2); return `${dd}/${mm}/${yy}`; }
function dateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildInitJobs() {
  const mon = getMonday(new Date());
  const fmt = (d) => d.toISOString().slice(0,10);
  return [
    { id:1, crew:"Topcon Builders", location:"Harbour View – 12 Marina Rd",   startDate:fmt(mon),             endDate:fmt(addDays(mon,1)),  workers:["Adam Clarke","Ben Torres"], notes:"",              invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:2, crew:"NQ Stripouts",    location:"CBD Office – 88 Commerce St",    startDate:fmt(mon),             endDate:fmt(mon),             workers:["Gary Hunt","Jake Owen"],    notes:"Loading dock",  invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:3, crew:"Topcon Builders", location:"Westside Estate – 55 Palm Ave",  startDate:fmt(addDays(mon,2)),  endDate:fmt(addDays(mon,4)),  workers:["Chris Ray","Frank Li"],     notes:"",              invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:4, crew:"NQ Stripouts",    location:"Industrial Park – Unit 7",       startDate:fmt(addDays(mon,3)),  endDate:fmt(addDays(mon,3)),  workers:["Harry Fox","Ivan Marsh"],   notes:"PPE required",  invoiced:true,  poFile:null, poFileName:"", photos:[] },
    { id:5, crew:"Topcon Builders", location:"Riverside Complex – 3 River St", startDate:fmt(addDays(mon,7)),  endDate:fmt(addDays(mon,8)),  workers:["Adam Clarke","Dan Smith"],  notes:"",              invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:6, crew:"NQ Stripouts",    location:"North Mall – Shop 12",           startDate:fmt(addDays(mon,10)), endDate:fmt(addDays(mon,11)), workers:["Kyle Park","Leo James"],    notes:"Early start 6am",invoiced:false, poFile:null, poFileName:"", photos:[] },
  ];
}

function jobDays(job) {
  if (Array.isArray(job.days) && job.days.length > 0) {
    return job.days.map(d => ({ date: d.date, period: d.period || "full" }));
  }
  const out = []; let cur = new Date(job.startDate); const end = new Date(job.endDate);
  while (cur <= end) { out.push({ date: dateKey(cur), period: "full" }); cur = addDays(cur,1); }
  return out;
}
function jobDates(job) {
  return jobDays(job).map(d => d.date);
}
function jobPeriodOnDate(job, dk) {
  const d = jobDays(job).find(x => x.date === dk);
  return d ? d.period : null;
}
function jobOnDate(job, dk) { return jobDates(job).includes(dk); }

const emptyForm = { crew:"Topcon Builders", location:"", startDate:"", endDate:"", days:[], workers:[], notes:"", invoiced:false, poFile:null, poFileName:"", photos:[], documentLinks:[], attendance:{} };


function HistoryTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await api.listHistory();
      setEvents(data || []);
    } catch (e) {
      setError(e.message || "Failed to load history");
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const fmtWhen = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2,"0");
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2,"0");
    const mi = String(d.getMinutes()).padStart(2,"0");
    return `${dd}/${mm}/${yy} ${hh}:${mi}`;
  };

  const typeColor = {
    job: "#1B2D5B",
    worker: "#16A34A",
    leave: "#F59E0B",
    user: "#6366F1"
  };
  const typeLabel = {
    job: "JOB",
    worker: "WORKER",
    leave: "LEAVE",
    user: "USER"
  };

  const filtered = events.filter(ev => {
    if (filter !== "all" && ev.entityType !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!((ev.entityName||"").toLowerCase().includes(q) ||
            (ev.userName||"").toLowerCase().includes(q) ||
            (ev.action||"").toLowerCase().includes(q))) return false;
    }
    return true;
  });

  // Group by entityType + entityId
  const groups = {};
  filtered.forEach(ev => {
    const key = `${ev.entityType}|${ev.entityId}`;
    if (!groups[key]) groups[key] = { entityType: ev.entityType, entityId: ev.entityId, entityName: ev.entityName, events: [] };
    groups[key].events.push(ev);
    if (new Date(ev.timestamp) > new Date(groups[key].lastTs || 0)) {
      groups[key].lastTs = ev.timestamp;
      groups[key].lastUser = ev.userName;
      groups[key].entityName = ev.entityName || groups[key].entityName;
    }
  });
  const groupList = Object.values(groups).sort((a,b) => (b.lastTs||"").localeCompare(a.lastTs||""));

  const toggleExpand = (key) => setExpanded(p => ({...p, [key]: !p[key]}));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:4,background:"#F0EDE8",borderRadius:8,padding:3}}>
          {[["all","All"],["job","Jobs"],["worker","Workers"],["leave","Leave"],["user","Users"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setFilter(id)}
              style={{padding:"6px 12px",border:"none",borderRadius:6,background:filter===id?"#1F2937":"transparent",color:filter===id?"#fff":"#6B7280",fontSize:11,fontWeight:700,cursor:"pointer"}}>
              {lbl}
            </button>
          ))}
        </div>
        <button onClick={load} style={{padding:"6px 14px",border:"1.5px solid #E5E0D8",borderRadius:8,background:"#fff",color:"#6B7280",fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 Refresh</button>
      </div>
      <input placeholder="🔍 Search by site, worker, or user…" value={search} onChange={e=>setSearch(e.target.value)}
        style={{width:"100%",padding:"9px 12px",border:"1.5px solid #E5E0D8",borderRadius:8,fontSize:13,boxSizing:"border-box",marginBottom:12,outline:"none"}}/>

      {loading && <div style={{textAlign:"center",padding:"30px 0",color:"#9CA3AF",fontSize:13}}>Loading…</div>}
      {error && <div style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",color:"#DC2626",padding:10,borderRadius:8,fontSize:12,marginBottom:10}}>{error}</div>}
      {!loading && groupList.length===0 && <div style={{textAlign:"center",padding:"30px 0",color:"#9CA3AF",fontSize:13,fontStyle:"italic"}}>No history events match.</div>}

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {groupList.map(g=>{
          const key = `${g.entityType}|${g.entityId}`;
          const isOpen = !!expanded[key];
          const color = typeColor[g.entityType] || "#6B7280";
          return (
            <div key={key} style={{border:`1px solid ${isOpen?color:"#E5E0D8"}`,borderRadius:10,background:"#fff",overflow:"hidden"}}>
              <div onClick={()=>toggleExpand(key)} style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:isOpen?"#FAFAF8":"#fff"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,fontWeight:800,background:color,color:"#fff",padding:"2px 6px",borderRadius:4,flexShrink:0}}>{typeLabel[g.entityType]||g.entityType.toUpperCase()}</span>
                    <div style={{fontSize:13,fontWeight:800,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.entityName || g.entityId}</div>
                  </div>
                  <div style={{fontSize:11,color:"#6B7280",marginTop:3}}>{g.events.length} change{g.events.length!==1?"s":""} · last {fmtWhen(g.lastTs)} by {g.lastUser}</div>
                </div>
                <div style={{fontSize:14,color:color,transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s",flexShrink:0,marginLeft:8}}>›</div>
              </div>
              {isOpen && (
                <div style={{padding:"4px 14px 12px",borderTop:"1px solid #E5E0D8"}}>
                  {g.events.map(ev=>{
                    const actColor = ev.action==="create"?"#16A34A":ev.action==="delete"?"#DC2626":"#2563EB";
                    return (
                      <div key={ev.id} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px dashed #E5E0D8"}}>
                        <div style={{flex:"0 0 110px",fontSize:11,color:"#9CA3AF",fontWeight:600}}>{fmtWhen(ev.timestamp)}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,color:"#1F2937"}}>
                            <b style={{color:"#2563EB"}}>{ev.userName}</b> <span style={{color:actColor,fontWeight:700}}>{ev.action}d</span> <span style={{color:"#6B7280"}}>{ev.entityType}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function UserManagement({ currentUser }) {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName]   = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCode, setNewCode]   = useState("");
  const [newRole, setNewRole]   = useState("user");
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({name:"",email:"",code:"",role:"user"});

  useEffect(() => {
    api.listUsers().then(u => { setUsers(u||[]); setLoading(false); }).catch(e => { console.error(e); setLoading(false); });
  }, []);

  const refresh = async () => {
    try { const u = await api.listUsers(); setUsers(u||[]); } catch(e) { console.error(e); }
  };

  const addUser = async () => {
    if(!newName.trim()||!newEmail.trim()||!newCode.trim()){alert("Fill in all fields.");return;}
    if(users.find(u=>u.email.toLowerCase()===newEmail.toLowerCase().trim())){alert("Email already exists.");return;}
    try {
      await api.saveUser({name:newName.trim(),email:newEmail.toLowerCase().trim(),code:newCode.trim(),role:newRole});
      setNewName("");setNewEmail("");setNewCode("");setNewRole("user");
      await refresh();
    } catch(e) { alert("Failed to add user: "+e.message); }
  };

  const startEdit = (i) => {
    const u = users[i];
    setEditIdx(i);
    setEditForm({name:u.name,email:u.email,code:u.code,role:u.role,_oldEmail:u.email});
  };
  const cancelEdit = () => { setEditIdx(null); };
  const saveEdit = async () => {
    if(!editForm.name.trim()||!editForm.email.trim()||!editForm.code.trim()){alert("Fill in all fields.");return;}
    try {
      await api.saveUser({
        name: editForm.name.trim(),
        email: editForm.email.toLowerCase().trim(),
        code: editForm.code.trim(),
        role: editForm.role,
        oldEmail: editForm._oldEmail
      });
      setEditIdx(null);
      await refresh();
    } catch(e) { alert("Failed to save: "+e.message); }
  };

  const toggleRole = async (i) => {
    const u = users[i];
    try {
      await api.saveUser({...u, role: u.role==="admin"?"user":"admin"});
      await refresh();
    } catch(e) { alert("Failed: "+e.message); }
  };

  const removeUser = async (i) => {
    if(!window.confirm("Remove "+users[i].name+"?"))return;
    try {
      await api.deleteUserApi(users[i].email);
      await refresh();
    } catch(e) { alert("Failed: "+e.message); }
  };

  return(
    <div style={{background:"#1F2937",borderRadius:14,padding:"18px 20px",marginBottom:20,border:"2px solid #374151"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <span style={{fontSize:18}}>🔐</span>
        <div style={{fontSize:14,fontWeight:800,color:"#F9F7F4"}}>App Access Management</div>
        <span style={{fontSize:10,background:"#374151",color:"#9CA3AF",padding:"2px 8px",borderRadius:6,fontWeight:600}}>ADMIN ONLY</span>
      </div>
      {loading && <div style={{fontSize:12,color:"#9CA3AF",padding:"8px 0"}}>Loading users…</div>}
      {users.map((u,i)=>(
        <div key={u.email} style={{padding:"10px 12px",background:"#111827",borderRadius:10,marginBottom:6}}>
          {editIdx === i ? (
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <input value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} placeholder="Name"
                  style={{border:"1.5px solid #374151",borderRadius:6,padding:"6px 8px",fontSize:12,background:"#1F2937",color:"#F9F7F4",outline:"none"}}/>
                <input value={editForm.email} onChange={e=>setEditForm(p=>({...p,email:e.target.value}))} placeholder="Email"
                  style={{border:"1.5px solid #374151",borderRadius:6,padding:"6px 8px",fontSize:12,background:"#1F2937",color:"#F9F7F4",outline:"none"}}/>
                <input value={editForm.code} onChange={e=>setEditForm(p=>({...p,code:e.target.value}))} placeholder="Code"
                  style={{border:"1.5px solid #374151",borderRadius:6,padding:"6px 8px",fontSize:12,background:"#1F2937",color:"#F9F7F4",outline:"none"}}/>
                <select value={editForm.role} onChange={e=>setEditForm(p=>({...p,role:e.target.value}))}
                  style={{border:"1.5px solid #374151",borderRadius:6,padding:"6px 8px",fontSize:12,background:"#1F2937",color:"#F9F7F4",outline:"none"}}>
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                <button onClick={cancelEdit} style={{padding:"5px 12px",border:"1px solid #374151",borderRadius:6,background:"#1F2937",color:"#9CA3AF",fontSize:11,cursor:"pointer"}}>Cancel</button>
                <button onClick={saveEdit} style={{padding:"5px 12px",border:"none",borderRadius:6,background:"#22C55E",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>Save</button>
              </div>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#F9F7F4"}}>{u.name} <span style={{fontSize:11,color:"#6B7280"}}>— {u.email}</span></div>
                <div style={{fontSize:11,color:u.role==="admin"?"#22C55E":"#6B9E7A",marginTop:2}}>{u.role==="admin"?"👑 Admin":"👤 User"} · Code: {u.code}</div>
              </div>
              <button onClick={()=>startEdit(i)} style={{padding:"4px 10px",border:"1px solid #374151",borderRadius:6,background:"#1F2937",color:"#9CA3AF",fontSize:11,cursor:"pointer"}}>Edit</button>
              <button onClick={()=>toggleRole(i)} style={{padding:"4px 10px",border:"1px solid #374151",borderRadius:6,background:"#1F2937",color:"#9CA3AF",fontSize:11,cursor:"pointer"}}>
                Make {u.role==="admin"?"User":"Admin"}
              </button>
              {u.email!==currentUser.email&&(
                <button onClick={()=>removeUser(i)} style={{padding:"4px 10px",border:"1px solid #7F1D1D",borderRadius:6,background:"#450A0A",color:"#FCA5A5",fontSize:11,cursor:"pointer"}}>Remove</button>
              )}
            </div>
          )}
        </div>
      ))}
      <div style={{borderTop:"1px solid #374151",paddingTop:12,marginTop:4}}>
        <div style={{fontSize:11,fontWeight:700,color:"#6B7280",letterSpacing:1,marginBottom:8}}>ADD NEW USER</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Full name"
            style={{border:"1.5px solid #374151",borderRadius:7,padding:"8px 10px",fontSize:13,background:"#111827",color:"#F9F7F4",outline:"none",boxSizing:"border-box"}}/>
          <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="email@example.com"
            style={{border:"1.5px solid #374151",borderRadius:7,padding:"8px 10px",fontSize:13,background:"#111827",color:"#F9F7F4",outline:"none",boxSizing:"border-box"}}/>
          <input value={newCode} onChange={e=>setNewCode(e.target.value)} placeholder="Access code e.g. 7890"
            style={{border:"1.5px solid #374151",borderRadius:7,padding:"8px 10px",fontSize:13,background:"#111827",color:"#F9F7F4",outline:"none",boxSizing:"border-box"}}/>
          <select value={newRole} onChange={e=>setNewRole(e.target.value)}
            style={{border:"1.5px solid #374151",borderRadius:7,padding:"8px 10px",fontSize:13,background:"#111827",color:"#F9F7F4",outline:"none"}}>
            <option value="user">👤 User</option>
            <option value="admin">👑 Admin</option>
          </select>
        </div>
        <button onClick={addUser} style={{width:"100%",padding:"9px",border:"none",borderRadius:8,background:"#2563EB",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Add User</button>
      </div>
    </div>
  );
}

function SitePlanner({ currentUser, onLogout }) {
  const [jobs, setJobs]     = useState([]);
  const [nextId, setNextId] = useState(9);
  const [workers, setWorkers] = useState({});
  const [usersLookup, setUsersLookup] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [tab, setTab]       = useState("schedule");
  const [weekOffset, setWeekOffset]   = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [showModal, setShowModal]     = useState(false);
  const [editId, setEditId]           = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [crewFilter, setCrewFilter]   = useState("All");
  const [dayPopup, setDayPopup]       = useState(null);
  const [expandedWorker, setExpandedWorker] = useState(null);
  const [monthCrewFilter, setMonthCrewFilter] = useState("All");
  const [leave, setLeave] = useState([]);
  const [leaveNextId, setLeaveNextId] = useState(1);
  const [leaveForm, setLeaveForm] = useState({crew:"Topcon Builders",workerName:"",startDate:"",endDate:"",reason:""});
  const [leaveFilter, setLeaveFilter] = useState("All");
  const [jobListPeriod, setJobListPeriod] = useState("week");
  const [jobListOffset, setJobListOffset] = useState(0);
  const [jobListCrewFilter, setJobListCrewFilter] = useState("All");
  const [threads, setThreads] = useState({});
  const [threadModal, setThreadModal] = useState(null);
  const [threadAuthor, setThreadAuthor] = useState("");
  const [threadText, setThreadText] = useState("");
  const [threadPhoto, setThreadPhoto] = useState(null);
  const [threadCaption, setThreadCaption] = useState("");
  const [reportSub, setReportSub] = useState("hoursWorker");
  const [reportRange, setReportRange] = useState(() => {
    const end = new Date();
    const start = new Date(); start.setDate(start.getDate()-30);
    return { start: dateKey(start), end: dateKey(end) };
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPinEntry, setAdminPinEntry] = useState("");
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [threadNextId, setThreadNextId] = useState(1);
  const ADMIN_PIN = "1234";
  const threadPhotoRef = useRef();
  const poInputRef = useRef();
  const photoInputRef = useRef();

  // ── Initial load from API + one-time migration from localStorage ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setDataLoading(true);
        setDataError("");
        const [apiJobs, apiWorkers, apiLeave, apiThreads, apiUsersForLookup] = await Promise.all([
          api.listJobs(), api.getWorkers(), api.listLeave(), api.getThreads(), api.listUsers().catch(()=>[])
        ]);
        if (cancelled) return;
        setUsersLookup(apiUsersForLookup || []);

        // One-time migration: if API is fully empty AND localStorage has legacy data, push it up.
        const apiEmpty = (apiJobs?.length || 0) === 0
          && Object.keys(apiWorkers || {}).length === 0
          && (apiLeave?.length || 0) === 0;
        let finalJobs = apiJobs || [];
        let finalWorkers = apiWorkers || {};
        let finalLeave = apiLeave || [];
        let finalThreads = apiThreads || {};
        if (apiEmpty) {
          const lsJobs   = loadPersisted(PERSIST_KEYS.jobs, null);
          const lsWorkers= loadPersisted(PERSIST_KEYS.workers, null);
          const lsLeave  = loadPersisted(PERSIST_KEYS.leave, null);
          const lsThreads= loadPersisted("siteplanner_threads_v1", null);
          if (lsJobs && lsJobs.length) {
            await api.bulkUploadJobs(lsJobs);
            finalJobs = lsJobs;
          } else {
            // Seed defaults so the app isn't blank for the first user
            const seed = buildInitJobs();
            await api.bulkUploadJobs(seed);
            finalJobs = seed;
          }
          if (lsWorkers && Object.keys(lsWorkers).length) {
            await api.saveWorkers(lsWorkers);
            finalWorkers = lsWorkers;
          } else {
            await api.saveWorkers(initWorkers);
            finalWorkers = initWorkers;
          }
          if (lsLeave && lsLeave.length) {
            await api.bulkUploadLeave(lsLeave);
            finalLeave = lsLeave;
          }
          if (lsThreads && Object.keys(lsThreads).length) {
            await api.saveThreads(lsThreads);
            finalThreads = lsThreads;
          }
        }

        setJobs(finalJobs);
        setWorkers(finalWorkers);
        setLeave(finalLeave);
        setThreads(finalThreads);
        const maxJobId = finalJobs.reduce((m, j) => Math.max(m, j.id || 0), 0);
        setNextId(maxJobId + 1);
        const maxLeaveId = finalLeave.reduce((m, l) => Math.max(m, l.id || 0), 0);
        setLeaveNextId(maxLeaveId + 1);
        setDataLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("Load failed", err);
        setDataError("Could not load data from server. Check your connection.");
        setDataLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror workers + threads to API on change (whole-blob writes)
  const workersDirty = useRef(false);
  useEffect(() => {
    if (dataLoading) return;
    if (!workersDirty.current) { workersDirty.current = true; return; }
    api.saveWorkers(workers).catch(e => console.error("workers save failed", e));
  }, [workers, dataLoading]);

  const threadsDirty = useRef(false);
  useEffect(() => {
    if (dataLoading) return;
    if (!threadsDirty.current) { threadsDirty.current = true; return; }
    api.saveThreads(threads).catch(e => console.error("threads save failed", e));
  }, [threads, dataLoading]);

  const crewKeys = Object.keys(CREW_STYLE);
  const C = (crew) => CREW_STYLE[crew] || CREW_STYLE["Topcon Builders"];

  const monday    = useMemo(() => addDays(getMonday(new Date()), weekOffset * 7), [weekOffset]);
  const weekDates = useMemo(() => DAYS.map((_,i) => addDays(monday,i)), [monday]);
  const isToday   = (d) => d.toDateString() === new Date().toDateString();
  const visCrews  = crewFilter === "All" ? crewKeys : [crewFilter];

  const monthYear = useMemo(() => {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [monthOffset]);

  const calendarDays = useMemo(() => {
    const { year, month } = monthYear;
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month+1, 0);
    let cur = getMonday(firstDay);
    const days = [];
    while (cur <= lastDay || days.length % 7 !== 0) { days.push(new Date(cur)); cur = addDays(cur,1); if (days.length > 42) break; }
    return days;
  }, [monthYear]);

  const jobsByDate = useMemo(() => {
    const map = {};
    jobs.forEach(job => { jobDates(job).forEach(dk => { if (!map[dk]) map[dk]=[]; if (!map[dk].find(j=>j.id===job.id)) map[dk].push(job); }); });
    return map;
  }, [jobs]);

  const leaveByDate = useMemo(() => {
    const map = {};
    leave.forEach(lv => {
      let cur = new Date(lv.startDate); const end = new Date(lv.endDate);
      while (cur <= end) { const dk = dateKey(cur); if (!map[dk]) map[dk]=[]; map[dk].push(lv); cur = addDays(cur,1); }
    });
    return map;
  }, [leave]);

  const getWorkersForPeriod = (crew, periodDates) => {
    const all = workers[crew] || [];
    return all.filter(w => {
      if (w.active !== false) return true;
      const periodKeys = new Set(periodDates.map(d => dateKey(d)));
      return jobs.some(j => j.crew === crew && j.workers.includes(w.name) && jobDates(j).some(dk => periodKeys.has(dk)));
    });
  };

  const todayStr = () => new Date().toISOString().slice(0,10);
  const openAdd = (prefillDate=null) => {
    const sd = prefillDate ? dateKey(prefillDate) : todayStr();
    setForm({ ...emptyForm, startDate:sd, endDate:sd, days:[{date:sd,period:"full"}] });
    setEditId(null); setShowModal(true); setDayPopup(null);
  };
  const openEdit = (job) => {
    // Migrate legacy single documentLink/documentName to array
    let docLinks = [];
    if (Array.isArray(job.documentLinks)) {
      docLinks = job.documentLinks.map(d => ({ name: d.name||"", url: d.url||"" }));
    } else if (job.documentLink) {
      docLinks = [{ name: job.documentName||"", url: job.documentLink }];
    }
    const days = jobDays(job);
    setForm({ crew:job.crew, location:job.location, startDate:job.startDate, endDate:job.endDate, days, workers:[...job.workers], notes:job.notes, invoiced:job.invoiced||false, poFile:job.poFile||null, poFileName:job.poFileName||"", photos:job.photos||[], documentLinks: docLinks, attendance: job.attendance||{} });
    setEditId(job.id); setShowModal(true);
  };
  const saveJob = () => {
    if (!form.location.trim()) return;
    const days = (form.days||[]).filter(d => d.date).sort((a,b)=>a.date.localeCompare(b.date));
    if (days.length === 0) return;
    const startDate = days[0].date;
    const endDate = days[days.length-1].date;
    const nowIso = new Date().toISOString();
    const { _attExpanded, ...cleanForm } = form;
    if (editId !== null) {
      const updated = jobs.find(j => j.id === editId);
      const merged = {
        ...updated, ...cleanForm, days, startDate, endDate,
        createdBy: updated?.createdBy || currentUser.name,
        createdAt: updated?.createdAt || nowIso,
        lastEditedBy: currentUser.name,
        lastEditedAt: nowIso
      };
      setJobs(p => p.map(j => j.id===editId ? merged : j));
      api.saveJob(merged).catch(e => console.error("saveJob failed", e));
    } else {
      const newJob = {
        id: nextId, ...cleanForm, days, startDate, endDate,
        createdBy: currentUser.name,
        createdAt: nowIso,
        lastEditedBy: currentUser.name,
        lastEditedAt: nowIso
      };
      setJobs(p => [...p, newJob]);
      setNextId(n=>n+1);
      api.saveJob(newJob).catch(e => console.error("saveJob failed", e));
    }
    setShowModal(false);
  };
  const deleteJob = (id) => {
    setJobs(p=>p.filter(j=>j.id!==id));
    setShowModal(false); setDayPopup(null);
    api.deleteJobApi(id).catch(e => console.error("deleteJob failed", e));
  };
  const toggleWorker = (w) => setForm(p => ({ ...p, workers: p.workers.includes(w) ? p.workers.filter(x=>x!==w) : [...p.workers,w] }));
  const toggleInvoiced = (id) => {
    setJobs(p => {
      const next = p.map(j => j.id===id ? {...j, invoiced:!j.invoiced} : j);
      const updated = next.find(j => j.id===id);
      if (updated) api.saveJob(updated).catch(e => console.error("toggleInvoiced failed", e));
      return next;
    });
  };
  const toggleWorkerActive = (crew, idx) => {
    setWorkers(p => {
      const w = p[crew][idx];
      const updated = w.active === false ? {...w, active:true} : {...w, active:false};
      return {...p, [crew]: p[crew].map((x,i) => i===idx ? updated : x)};
    });
  };
  const updateWorker = (crew, idx, field, val) => {
    setWorkers(p => { const arr = p[crew].map((w,i) => i===idx ? {...w,[field]:val} : w); return {...p,[crew]:arr}; });
  };
  const addWorker = (crew) => {
    setWorkers(p => ({ ...p, [crew]: [...(p[crew]||[]), { name:"New Worker", phone:"", email:"", role:"", address:"", emergency:"", emergencyPhone:"", license:"", notes:"", active:true }] }));
  };
  const addLeave = () => {
    if (!leaveForm.workerName || !leaveForm.startDate || !leaveForm.endDate) { alert("Fill in worker, start and end date."); return; }
    const entry = { id:leaveNextId, ...leaveForm };
    setLeave(p => [...p, entry]);
    setLeaveNextId(p => p+1);
    setLeaveForm(p => ({...p, workerName:"", startDate:"", endDate:"", reason:""}));
    api.saveLeaveEntry(entry).catch(e => console.error("addLeave failed", e));
  };

  const spanLabel = (job) => { const sd=new Date(job.startDate),ed=new Date(job.endDate); return job.startDate===job.endDate ? fmtDate(sd) : `${fmtDate(sd)} – ${fmtDate(ed)}`; };
  const numDays = (job) => Math.round((new Date(job.endDate)-new Date(job.startDate))/86400000)+1;
  const workerKey = (crew,idx) => `${crew}|${idx}`;

  const getWorkerJobOnDate = (crew, workerName, date) => {
    const dk = dateKey(date);
    return jobs.find(j => j.crew === crew && j.workers.includes(workerName) && jobOnDate(j,dk));
  };

  const addThreadEntry = (jobId, type) => {
    if (!threadAuthor.trim()) { alert("Select your name first."); return; }
    if (type==="note" && !threadText.trim()) { alert("Write a note first."); return; }
    const entry = { id:threadNextId, type, author:threadAuthor.trim(), text:threadText.trim(), photoData:type==="photo"&&threadPhoto?threadPhoto.data:null, photoName:"", photoCaption:threadCaption.trim(), ts:new Date().toISOString() };
    setThreads(p => ({ ...p, [jobId]: [...(p[jobId]||[]), entry] }));
    setThreadNextId(n=>n+1);
    setThreadText(""); setThreadCaption(""); setThreadPhoto(null);
  };

  const fmtTs = (isoStr) => {
    const d = new Date(isoStr);
    const dd = String(d.getDate()).padStart(2,"0");
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2,"0");
    const mi = String(d.getMinutes()).padStart(2,"0");
    return `${dd}/${mm}/${yy} ${hh}:${mi}`;
  };

  const s_hdr = {background:"#111827",color:"#F9F7F4"};

  if (dataLoading) {
    return (
      <div style={{minHeight:"100vh",background:"#111827",display:"flex",alignItems:"center",justifyContent:"center",color:"#F9F7F4",fontFamily:"system-ui,sans-serif",flexDirection:"column",gap:18}}>
        <svg width="240" height="300" viewBox="0 0 240 300" role="img" aria-label="Loading">
          <title>Construction crane lifting an I-beam with Topcon Builders banner</title>
          <g transform="translate(8,12) scale(0.9)">
            <g>
              <rect x="50" y="270" width="80" height="6" fill="#4B5563"/>
              <rect x="55" y="264" width="70" height="6" fill="#6B7280"/>
            </g>
            <g stroke="#FBBF24" strokeWidth="2.8" fill="none" strokeLinecap="round">
              <line x1="75" y1="60" x2="75" y2="264"/>
              <line x1="105" y1="60" x2="105" y2="264"/>
              <line x1="75" y1="60" x2="105" y2="60"/>
              <line x1="75" y1="84" x2="105" y2="84"/>
              <line x1="75" y1="108" x2="105" y2="108"/>
              <line x1="75" y1="132" x2="105" y2="132"/>
              <line x1="75" y1="156" x2="105" y2="156"/>
              <line x1="75" y1="180" x2="105" y2="180"/>
              <line x1="75" y1="204" x2="105" y2="204"/>
              <line x1="75" y1="228" x2="105" y2="228"/>
              <line x1="75" y1="264" x2="105" y2="264"/>
            </g>
            <g stroke="#FBBF24" strokeWidth="2.2" fill="none" strokeLinecap="round">
              <line x1="75" y1="60" x2="105" y2="84"/>
              <line x1="105" y1="60" x2="75" y2="84"/>
              <line x1="75" y1="84" x2="105" y2="108"/>
              <line x1="105" y1="84" x2="75" y2="108"/>
              <line x1="75" y1="108" x2="105" y2="132"/>
              <line x1="105" y1="108" x2="75" y2="132"/>
              <line x1="75" y1="132" x2="105" y2="156"/>
              <line x1="105" y1="132" x2="75" y2="156"/>
              <line x1="75" y1="156" x2="105" y2="180"/>
              <line x1="105" y1="156" x2="75" y2="180"/>
              <line x1="75" y1="180" x2="105" y2="204"/>
              <line x1="105" y1="180" x2="75" y2="204"/>
              <line x1="75" y1="204" x2="105" y2="228"/>
              <line x1="105" y1="204" x2="75" y2="228"/>
              <line x1="75" y1="228" x2="105" y2="264"/>
              <line x1="105" y1="228" x2="75" y2="264"/>
            </g>
            <g stroke="#92400E" strokeWidth="0.8">
              <rect x="78" y="42" width="24" height="18" fill="#FBBF24"/>
              <rect x="82" y="46" width="16" height="8" fill="#86C5F2" stroke="#1E40AF" strokeWidth="0.6"/>
            </g>
            <g stroke="#FBBF24" strokeWidth="2.8" fill="none" strokeLinecap="round">
              <line x1="50" y1="42" x2="200" y2="42"/>
              <line x1="50" y1="60" x2="200" y2="60"/>
              <line x1="50" y1="42" x2="50" y2="60"/>
              <line x1="200" y1="42" x2="200" y2="60"/>
            </g>
            <g stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round">
              <line x1="100" y1="42" x2="115" y2="60"/>
              <line x1="115" y1="42" x2="100" y2="60"/>
              <line x1="115" y1="42" x2="130" y2="60"/>
              <line x1="130" y1="42" x2="115" y2="60"/>
              <line x1="130" y1="42" x2="145" y2="60"/>
              <line x1="145" y1="42" x2="130" y2="60"/>
              <line x1="145" y1="42" x2="160" y2="60"/>
              <line x1="160" y1="42" x2="145" y2="60"/>
              <line x1="160" y1="42" x2="175" y2="60"/>
              <line x1="175" y1="42" x2="160" y2="60"/>
              <line x1="175" y1="42" x2="190" y2="60"/>
              <line x1="190" y1="42" x2="175" y2="60"/>
              <line x1="190" y1="42" x2="200" y2="60"/>
              <line x1="80" y1="42" x2="65" y2="60"/>
              <line x1="65" y1="42" x2="80" y2="60"/>
              <line x1="65" y1="42" x2="50" y2="60"/>
              <line x1="50" y1="42" x2="65" y2="60"/>
            </g>
            <line x1="90" y1="32" x2="155" y2="42" stroke="#9CA3AF" strokeWidth="1.4"/>
            <line x1="90" y1="32" x2="60" y2="42" stroke="#9CA3AF" strokeWidth="1.4"/>
            <rect x="48" y="34" width="6" height="8" fill="#374151" stroke="#1F2937" strokeWidth="0.6"/>
            <rect x="170" y="60" width="14" height="5" fill="#4B5563" stroke="#1F2937" strokeWidth="0.5"/>
            <line x1="177" y1="65" x2="177" y2="65" stroke="#D1D5DB" strokeWidth="1.6">
              <animate attributeName="y2" values="140;195;140" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
            </line>
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,126;0,176;0,126" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
            <path d="M 162 0 L 172 0 L 172 6 L 168 6 L 168 14 Q 168 22 174 22 Q 180 22 180 14 L 180 12 L 176 12 L 176 14 Q 176 18 174 18 Q 172 18 172 14 L 172 6 L 162 6 Z" fill="#374151" stroke="#1F2937" strokeWidth="0.6"/>
            <rect x="140" y="26" width="60" height="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="0.6"/>
            <rect x="140" y="32" width="60" height="3" fill="#7F1D1D"/>
            <rect x="145" y="26" width="50" height="2" fill="#991B1B"/>
            <rect x="128" y="35" width="84" height="44" fill="#0A0A0A" stroke="#FBBF24" strokeWidth="0.8"/>
            <g transform="translate(133,41)">
              <path d="M 0 22 Q 4 4 14 4 L 14 11 Q 8 11 6 22 Z" fill="#A3E635"/>
              <path d="M 0 27 Q 6 14 18 14 L 18 21 Q 11 21 8 27 Z" fill="#9CA3AF"/>
              <path d="M 0 32 Q 8 22 22 22 L 22 30 Q 14 30 11 32 Z" fill="#E5E7EB"/>
            </g>
            <text x="160" y="51" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#FAFAFA" letterSpacing="0.5">TOPCON</text>
            <text x="160" y="62" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="700" fill="#9CA3AF" letterSpacing="1">BUILDERS</text>
            <text x="170" y="73" fontFamily="Arial, sans-serif" fontSize="5" fill="#A3E635" fontStyle="italic" textAnchor="middle">building an evolution</text>
          </g>
        </svg>
        <div style={{fontSize:14,color:"#9CA3AF",letterSpacing:2}}>LOADING SITE PLANNER…</div>
        {dataError && <div style={{fontSize:13,color:"#FCA5A5",maxWidth:400,textAlign:"center"}}>{dataError}</div>}
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#F0EDE8",fontFamily:"system-ui,sans-serif"}}>

      {/* HEADER */}
      <div style={s_hdr}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <StaticCrane width={50} height={62}/>
              <div>
                <div style={{fontSize:24,fontWeight:800,letterSpacing:-0.5}}>Site Planner</div>
                <div style={{fontSize:11,color:"#6B9E7A",letterSpacing:2,marginTop:2}}>CONSTRUCTION SCHEDULER</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>openAdd()} style={{background:"#22C55E",color:"#fff",border:"none",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>+ New Job</button>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10,marginTop:8}}>
            <span style={{fontSize:13,fontWeight:700,color:"#FFFFFF",background:"rgba(255,255,255,0.12)",padding:"5px 12px",borderRadius:14,border:"1px solid rgba(255,255,255,0.25)"}}>{currentUser.role==="admin"?"👑":"👤"} {currentUser.name}</span>
            <button onClick={onLogout} style={{background:"#fff",color:"#DC2626",border:"1.5px solid #FCA5A5",padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer"}}>Log out</button>
          </div>
          <div style={{display:"flex",gap:2,marginTop:16,flexWrap:"wrap"}}>
            {[["schedule","📅  Weekly"],["month","🗓️  Month"],["jobs","📊  Job List"],["contacts","📋  Contacts"],["leave","🏖️  Leave"],
              ...(currentUser.role==="admin"?[["reports","📈  Reports"],["history","🕘  History"]]:[])].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{background:tab===id?"#F0EDE8":"transparent",color:tab===id?"#111827":"#9CA3AF",border:"none",padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",borderRadius:"8px 8px 0 0"}}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:20}}>

        {/* ── WEEKLY SCHEDULE ── */}
        {tab==="schedule" && (<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setWeekOffset(w=>w-1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18}}>‹</button>
              <div style={{textAlign:"center",minWidth:200}}>
                <div style={{fontSize:15,fontWeight:800,color:"#111827"}}>{fmtDate(monday)} – {fmtDate(addDays(monday,6))}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{weekOffset===0?"This week":weekOffset===1?"Next week":weekOffset===-1?"Last week":`Week ${weekOffset>0?"+":""}${weekOffset}`}</div>
              </div>
              <button onClick={()=>setWeekOffset(w=>w+1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18}}>›</button>
              {weekOffset!==0 && <button onClick={()=>setWeekOffset(0)} style={{background:"#111827",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>Today</button>}
            </div>
            <div style={{display:"flex",gap:4,background:"#1F2937",borderRadius:10,padding:4}}>
              <button onClick={()=>setCrewFilter("All")} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:crewFilter==="All"?"#fff":"transparent",color:crewFilter==="All"?"#111827":"#9CA3AF",fontWeight:700,fontSize:13}}>Both</button>
              {crewKeys.map(crew=>{
                const cs=C(crew);
                const sel=crewFilter===crew;
                return (
                  <button key={crew} onClick={()=>setCrewFilter(crew)} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:cs.color,color:"#fff",fontWeight:700,fontSize:13,letterSpacing:0,opacity:sel||crewFilter==="All"?1:0.55,boxShadow:sel?"0 0 0 2px #fff inset":"none"}}>
                    {crew}
                  </button>
                );
              })}
            </div>
          </div>

          {weekOffset<0&&(
            <div style={{background:"#1E293B",border:"1.5px solid #334155",borderRadius:10,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <span>📋</span>
              <div style={{fontSize:12,color:"#94A3B8"}}>Viewing historical record — workers who had jobs this week shown even if now inactive.</div>
            </div>
          )}

          <div style={{background:"#fff",borderRadius:12,overflow:"auto",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <div style={{display:"grid",gridTemplateColumns:"150px repeat(7,minmax(130px,1fr))",background:"#1a2235",position:"sticky",top:0,zIndex:10,minWidth:1060}}>
              <div style={{padding:"12px 14px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1.5}}>WORKER</div>
              {DAYS.map((d,i)=>{
                const fullDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
                const isT=isToday(weekDates[i]);
                const isWeekend=i>=5;
                return (
                  <div key={d} style={{padding:"10px 10px 8px",borderLeft:"1px solid rgba(255,255,255,0.08)",background:isT?"rgba(34,197,94,0.18)":isWeekend?"rgba(255,255,255,0.05)":"transparent"}}>
                    <div style={{fontSize:13,fontWeight:900,color:isT?"#22C55E":"#fff"}}>{fullDays[i]}</div>
                    <div style={{fontSize:11,color:isT?"#86efac":"rgba(255,255,255,0.45)",marginTop:3}}>{fmtDate(weekDates[i])}</div>
                  </div>
                );
              })}
            </div>

            {visCrews.map((crew,crewIdx)=>{
              const s=C(crew);
              const activeWorkers = getWorkersForPeriod(crew, weekDates);
              if(activeWorkers.length===0) return null;
              return (
                <div key={crew} style={{minWidth:1060}}>
                  <div style={{display:"grid",gridTemplateColumns:"150px 1fr",background:"#1a2235"}}>
                    <div style={{padding:"6px 14px",display:"flex",alignItems:"center",gridColumn:"1/-1"}}>
                      <span style={{background:s.color,color:"#fff",borderRadius:6,padding:"5px 14px",fontSize:13,fontWeight:700,letterSpacing:0}}>{crew}</span>
                    </div>
                  </div>
                  {activeWorkers.map((worker,wi)=>{
                    const isEven=wi%2===0;
                    return (
                      <div key={worker.name} style={{display:"grid",gridTemplateColumns:"150px repeat(7,minmax(130px,1fr))",borderTop:"1px solid #EDEBE8",background:isEven?"#fff":"#F8F8F7",minHeight:80}}>
                        <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:8,borderRight:`3px solid ${s.color}`}}>
                          <div style={{width:32,height:32,borderRadius:"50%",background:worker.active===false?"#F3F4F6":s.light,border:`2px solid ${worker.active===false?"#9CA3AF":s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:worker.active===false?"#9CA3AF":s.accent,flexShrink:0}}>
                            {worker.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:worker.active===false?"#6B7280":"#111827"}}>{worker.name}</div>
                            {worker.active===false ? <div style={{fontSize:9,color:"#9CA3AF",fontWeight:700}}>FORMER</div> : worker.role&&<div style={{fontSize:10,color:"#9CA3AF"}}>{worker.role}</div>}
                          </div>
                        </div>
                        {weekDates.map((wd,di)=>{
                          const dk=dateKey(wd);
                          const job=getWorkerJobOnDate(crew,worker.name,wd);
                          const isFirst=job&&(dateKey(new Date(job.startDate))===dk||(di===0&&jobOnDate(job,dk)));
                          const isLast=job&&dateKey(new Date(job.endDate))===dk;
                          const isTodayCol=isToday(wd);
                          const isWeekendCol=di>=5;
                          const workerLeave=(leaveByDate[dk]||[]).find(lv=>lv.workerName===worker.name);
                          return (
                            <div key={di} style={{borderLeft:"1px solid #EDEBE8",padding:"4px",background:isTodayCol?"rgba(34,197,94,0.04)":isWeekendCol?"#F5F3F0":"transparent"}}>
                              {workerLeave&&!job&&(
                                <div style={{background:"#FFFBEB",border:"2px solid #F59E0B",borderRadius:8,padding:"6px 8px",height:"calc(100% - 8px)",boxSizing:"border-box"}}>
                                  <div style={{fontSize:12,fontWeight:800,color:"#92400E"}}>🏖️ Leave</div>
                                  {workerLeave.reason&&<div style={{fontSize:10,color:"#B45309"}}>{workerLeave.reason}</div>}
                                </div>
                              )}
                              {job&&(() => {
                                const period = jobPeriodOnDate(job, dk) || "full";
                                const isHalf = period === "am" || period === "pm";
                                const halfColor = s.color;
                                const halfAccent = s.accent;
                                if (isHalf) {
                                  return (
                                    <div onClick={()=>openEdit(job)} style={{position:"relative",border:`2px solid ${halfColor}`,borderRadius:8,height:"calc(100% - 8px)",boxSizing:"border-box",cursor:"pointer",minHeight:56,overflow:"hidden",background:"#fff"}}>
                                      <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" style={{position:"absolute",inset:0,display:"block"}}>
                                        {period==="am"
                                          ? <polygon points="0,0 100,0 0,60" fill={halfColor}/>
                                          : <polygon points="0,60 100,60 100,0" fill={halfColor}/>}
                                      </svg>
                                      {period==="am" ? (
                                        <>
                                          <div style={{position:"absolute",top:4,left:6,fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.2,maxWidth:"70%"}}>{job.location}</div>
                                          <div style={{position:"absolute",top:30,left:6,fontSize:10,fontWeight:800,color:"#fff",opacity:0.85}}>AM</div>
                                        </>
                                      ) : (
                                        <>
                                          <div style={{position:"absolute",bottom:20,right:8,fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.2,maxWidth:"65%",textAlign:"right"}}>{job.location}</div>
                                          <div style={{position:"absolute",bottom:4,right:8,fontSize:10,fontWeight:800,color:"#fff",opacity:0.85}}>PM</div>
                                        </>
                                      )}
                                      {isFirst&&(
                                        <div style={{position:"absolute",bottom:4,left:6,display:"flex",gap:3}}>
                                          {job.poFileName&&<span style={{fontSize:9,fontWeight:700,background:"#F59E0B",color:"#fff",borderRadius:4,padding:"0 4px"}}>PO</span>}
                                          {job.crew==="NQ Stripouts"&&job.invoiced&&<span style={{fontSize:9,fontWeight:700,background:"#16A34A",color:"#fff",borderRadius:4,padding:"0 4px"}}>✓</span>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                                return (
                                  <div onClick={()=>openEdit(job)} style={{background:isFirst?s.color:`${s.color}18`,border:`2px solid ${s.color}`,borderLeft:isFirst?`2px solid ${s.color}`:"none",borderRight:isLast?`2px solid ${s.color}`:"none",borderRadius:isFirst&&isLast?8:isFirst?"8px 0 0 8px":isLast?"0 8px 8px 0":0,padding:"6px 8px",height:"calc(100% - 8px)",boxSizing:"border-box",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,minHeight:56}}>
                                    {isFirst&&<div style={{fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.3}}>{job.location}</div>}
                                    {isFirst&&(
                                      <div style={{display:"flex",gap:3,marginTop:"auto"}}>
                                        {job.poFileName&&<span style={{fontSize:9,fontWeight:700,background:"#F59E0B",color:"#fff",borderRadius:4,padding:"0 4px"}}>PO</span>}
                                        {job.crew==="NQ Stripouts"&&job.invoiced&&<span style={{fontSize:9,fontWeight:700,background:"#16A34A",color:"#fff",borderRadius:4,padding:"0 4px"}}>✓</span>}
                                      </div>
                                    )}
                                    {!isFirst&&<div style={{fontSize:10,fontWeight:700,color:s.accent,opacity:0.6}}>{job.location.split("–")[0].trim()}</div>}
                                  </div>
                                );
                              })()}
                              {!job&&!workerLeave&&(
                                <button onClick={()=>{setForm({...emptyForm,crew,startDate:dk,endDate:dk,days:[{date:dk,period:"full"}],workers:[worker.name]});setEditId(null);setShowModal(true);}}
                                  style={{width:"100%",height:"100%",minHeight:56,background:"transparent",border:"2px dashed #DEDADA",borderRadius:8,cursor:"pointer",color:"#C4B8AC",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}
                                  onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background=s.light;}}
                                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#DEDADA";e.currentTarget.style.background="transparent";}}>
                                  +
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {crewIdx<visCrews.length-1&&<div style={{height:6,background:"#EDEBE8"}}/>}
                </div>
              );
            })}
          </div>
        </>)}

        {/* ── MONTH TAB ── */}
        {tab==="month" && (<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setMonthOffset(m=>m-1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18}}>‹</button>
              <div style={{fontSize:18,fontWeight:800,color:"#111827",minWidth:180,textAlign:"center"}}>{MONTH_NAMES[monthYear.month]} {monthYear.year}</div>
              <button onClick={()=>setMonthOffset(m=>m+1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18}}>›</button>
              {monthOffset!==0&&<button onClick={()=>setMonthOffset(0)} style={{background:"#111827",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>This Month</button>}
            </div>
            <div style={{display:"flex",gap:4,background:"#1F2937",borderRadius:10,padding:4}}>
              <button onClick={()=>setMonthCrewFilter("All")} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:monthCrewFilter==="All"?"#fff":"transparent",color:monthCrewFilter==="All"?"#111827":"#9CA3AF",fontWeight:700,fontSize:13}}>Both</button>
              {crewKeys.map(crew=>{
                const cs=C(crew);
                const sel=monthCrewFilter===crew;
                return (
                  <button key={crew} onClick={()=>setMonthCrewFilter(crew)} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:cs.color,color:"#fff",fontWeight:700,fontSize:13,letterSpacing:0,opacity:sel||monthCrewFilter==="All"?1:0.55,boxShadow:sel?"0 0 0 2px #fff inset":"none"}}>
                    {crew}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {calendarDays.map((day,idx)=>{
              const dk=dateKey(day);
              const allDayJobs=jobsByDate[dk]||[];
              const dayJobs=monthCrewFilter==="All"?allDayJobs:allDayJobs.filter(j=>j.crew===monthCrewFilter);
              const dayLeave=(leaveByDate[dk]||[]).filter(lv=>monthCrewFilter==="All"||lv.crew===monthCrewFilter);
              const isThisMonth=day.getMonth()===monthYear.month;
              const todayCell=day.toDateString()===new Date().toDateString();
              const isWeekendDay=day.getDay()===0||day.getDay()===6;
              return (
                <div key={idx} onClick={()=>(dayJobs.length>0||dayLeave.length>0)&&setDayPopup({date:day,jobs:dayJobs,leave:dayLeave})}
                  style={{background:todayCell?"#111827":isWeekendDay&&isThisMonth?"#F5F3F0":isThisMonth?"#fff":"#EDECEA",borderRadius:8,minHeight:120,padding:"7px 7px 5px",border:todayCell?"2px solid #22C55E":isThisMonth?"1px solid #E5E2DD":"1px solid #EDEBE8",display:"flex",flexDirection:"column",gap:3,cursor:(dayJobs.length>0||dayLeave.length>0)?"pointer":"default"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <div style={{fontSize:18,fontWeight:900,color:todayCell?"#22C55E":isThisMonth?"#111827":"#C4B8AC"}}>{day.getDate()}</div>
                    {todayCell&&<span style={{fontSize:8,fontWeight:700,color:"#22C55E",background:"rgba(34,197,94,0.15)",borderRadius:4,padding:"1px 5px"}}>TODAY</span>}
                  </div>
                  {dayJobs.map(job=>{
                    const s=C(job.crew);
                    const isStart=dateKey(new Date(job.startDate))===dk;
                    const period = jobPeriodOnDate(job, dk) || "full";
                    const isHalf = period !== "full";
                    const bg = isHalf ? s.color : (isStart?s.color:s.light);
                    const border = s.color;
                    const textColor = isHalf ? "#fff" : (isStart?"#fff":s.accent);
                    return (
                      <div key={job.id} style={{background:bg,border:`1px solid ${border}`,borderRadius:5,padding:"3px 5px",opacity:isHalf||isStart?1:0.7,display:"flex",justifyContent:"space-between",alignItems:"center",gap:4}}>
                        <div style={{fontSize:10,fontWeight:800,color:textColor,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.location.split("–")[0].trim()}</div>
                        {isHalf&&<span style={{fontSize:8,fontWeight:900,color:textColor,flexShrink:0}}>{period.toUpperCase()}</span>}
                      </div>
                    );
                  })}
                  {dayLeave.map(lv=>(
                    <div key={lv.id} style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:5,padding:"3px 5px"}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#92400E"}}>🏖 {lv.workerName}</div>
                    </div>
                  ))}
                  <div style={{marginTop:"auto",paddingTop:3,fontSize:9,fontWeight:700,color:todayCell?"#22C55E":isThisMonth?"#9CA3AF":"#C4B8AC",textAlign:"right"}}>
                    {day.toLocaleDateString("en-AU",{weekday:"long"})}
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* ── JOB LIST TAB ── */}
        {tab==="jobs" && (()=>{
          const isWeek = jobListPeriod==="week";
          const periodMonday = isWeek ? addDays(getMonday(new Date()), jobListOffset*7) : null;
          const periodDates  = isWeek ? DAYS.map((_,i)=>addDays(periodMonday,i)) : null;
          const pYear  = isWeek ? null : new Date(new Date().getFullYear(), new Date().getMonth()+jobListOffset, 1).getFullYear();
          const pMonth = isWeek ? null : new Date(new Date().getFullYear(), new Date().getMonth()+jobListOffset, 1).getMonth();
          const periodJobs = isWeek
            ? jobs.filter(j=>{ const wdks=periodDates.map(d=>dateKey(d)); return jobDates(j).some(dk=>wdks.includes(dk)); }).sort((a,b)=>a.startDate.localeCompare(b.startDate))
            : jobs.filter(j=>{ const sd=new Date(j.startDate); return sd.getFullYear()===pYear&&sd.getMonth()===pMonth; }).sort((a,b)=>a.startDate.localeCompare(b.startDate));
          const periodLabel = isWeek ? `${fmtDate(periodMonday)} – ${fmtDate(addDays(periodMonday,6))}` : `${MONTH_NAMES[pMonth]} ${pYear}`;
          return (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",gap:4,background:"#fff",borderRadius:10,padding:4,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
                  {[["week","Weekly"],["month","Monthly"]].map(([val,lbl])=>(
                    <button key={val} onClick={()=>{setJobListPeriod(val);setJobListOffset(0);}}
                      style={{padding:"7px 18px",borderRadius:7,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:jobListPeriod===val?"#111827":"transparent",color:jobListPeriod===val?"#fff":"#6B7280"}}>
                      {lbl}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>setJobListOffset(o=>o-1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18}}>‹</button>
                  <div style={{fontWeight:800,color:"#111827",minWidth:200,textAlign:"center"}}>{periodLabel}</div>
                  <button onClick={()=>setJobListOffset(o=>o+1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18}}>›</button>
                  {jobListOffset!==0&&<button onClick={()=>setJobListOffset(0)} style={{background:"#111827",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>Current</button>}
                </div>
                <div style={{display:"flex",gap:4,background:"#1F2937",borderRadius:10,padding:4}}>
                  <button onClick={()=>setJobListCrewFilter("All")} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:jobListCrewFilter==="All"?"#fff":"transparent",color:jobListCrewFilter==="All"?"#111827":"#9CA3AF",fontWeight:700,fontSize:13}}>Both</button>
                  {crewKeys.map(crew=>{
                    const cs=C(crew);
                    const sel=jobListCrewFilter===crew;
                    return (
                      <button key={crew} onClick={()=>setJobListCrewFilter(crew)} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:cs.color,color:"#fff",fontWeight:700,fontSize:13,letterSpacing:0,opacity:sel||jobListCrewFilter==="All"?1:0.55,boxShadow:sel?"0 0 0 2px #fff inset":"none"}}>
                        {crew}
                      </button>
                    );
                  })}
                </div>
              </div>
              {(jobListCrewFilter==="All"?periodJobs:periodJobs.filter(j=>j.crew===jobListCrewFilter)).length===0?(
                <div style={{textAlign:"center",padding:"50px 20px",color:"#9CA3AF",background:"#fff",borderRadius:12}}>No jobs this {jobListPeriod}.</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {(jobListCrewFilter==="All"?periodJobs:periodJobs.filter(j=>j.crew===jobListCrewFilter)).map(job=>{
                    const s=C(job.crew);
                    const days=numDays(job);
                    return (
                      <div key={job.id} onClick={()=>openEdit(job)} style={{background:"#fff",borderRadius:12,padding:"14px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:`1px solid ${s.color}22`,cursor:"pointer",display:"flex",gap:14,alignItems:"flex-start"}}
                        onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 16px ${s.color}33`}
                        onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"}>
                        <div style={{width:4,borderRadius:4,background:s.color,alignSelf:"stretch",flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                            <img src={job.crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt="" style={{height:14,objectFit:"contain",opacity:0.85}}/>
                            <span style={{fontSize:14,fontWeight:800,color:"#111827"}}>{job.location}</span>
                            {job.poFileName&&<span style={{fontSize:10,fontWeight:700,background:"#F59E0B",color:"#fff",borderRadius:4,padding:"1px 6px"}}>PO</span>}
                            {job.crew==="NQ Stripouts"&&job.invoiced&&<span style={{fontSize:10,fontWeight:700,background:"#16A34A",color:"#fff",borderRadius:4,padding:"1px 6px"}}>✓ Invoiced</span>}
                          </div>
                          <div style={{fontSize:12,color:"#6B7280"}}>📅 {spanLabel(job)}{days>1?` (${days} days)`:""} &nbsp;·&nbsp; 👷 {job.workers.join(", ")}</div>
                          {(job.createdBy||job.lastEditedBy) && (
                            <div style={{fontSize:11,color:"#9CA3AF",fontStyle:"italic",marginTop:3,lineHeight:1.4}}>
                              {job.createdBy && <div>Created by {job.createdBy}{job.createdAt?` on ${fmtDateYY(new Date(job.createdAt))}`:""}</div>}
                              {job.lastEditedBy && <div>Last edited by {job.lastEditedBy}{job.lastEditedAt?` on ${fmtDateYY(new Date(job.lastEditedAt))}`:""}</div>}
                            </div>
                          )}
                        </div>
                        <button onClick={e=>{e.stopPropagation();setThreadModal(job);}}
                          style={{padding:"6px 12px",border:"1.5px solid #6366F1",borderRadius:8,background:"#EEF2FF",color:"#4338CA",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                          💬 Thread
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── CONTACTS TAB ── */}
        {tab==="contacts" && (
          <div>
            {currentUser.role==="admin"&&<UserManagement currentUser={currentUser}/>}

            {currentUser.role==="admin" && (
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                {crewKeys.map(crew=>(
                  <button key={crew} onClick={()=>addWorker(crew)}
                    style={{flex:1,padding:"10px",border:`2px dashed ${C(crew).color}`,borderRadius:10,background:C(crew).light,color:C(crew).accent,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt="" style={{height:16,objectFit:"contain"}}/>
                    + Add Worker
                  </button>
                ))}
              </div>
            )}
            {crewKeys.flatMap(crew=>(workers[crew]||[]).map((worker,idx)=>({crew,worker,idx}))).map(({crew,worker,idx})=>{
              const s=C(crew);
              const key=workerKey(crew,idx);
              const isOpen=expandedWorker===key;
              const jobCount=jobs.filter(j=>j.crew===crew&&j.workers.includes(worker.name)).length;
              // Auto-link email from users table by name match if worker email is blank
              const linkedUser = usersLookup.find(u => u.name && u.name.toLowerCase() === (worker.name||"").toLowerCase());
              const displayEmail = worker.email || (linkedUser && linkedUser.email) || "";
              const isAdmin = currentUser.role==="admin";
              return (
                <div key={`${crew}-${idx}`} style={{border:`1.5px solid ${isOpen?s.color:"#EDE9E4"}`,borderRadius:12,overflow:"hidden",marginBottom:8}}>
                  <div onClick={()=>setExpandedWorker(isOpen?null:key)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",background:isOpen?s.light:"#fff"}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:isOpen?s.color:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:isOpen?"#fff":s.accent,flexShrink:0}}>
                      {worker.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#1F2937"}}>{worker.name}</div>
                        <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt="" style={{height:14,objectFit:"contain",opacity:0.8}}/>
                      </div>
                      <div style={{fontSize:11,color:"#9CA3AF"}}>
                        {[worker.active===false?"⚫ Inactive":null,worker.role,worker.phone&&`📱 ${worker.phone}`,`${jobCount} job${jobCount!==1?"s":""}`].filter(Boolean).join("  ·  ")}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div onClick={e=>{e.stopPropagation();if(isAdmin)toggleWorkerActive(crew,idx);}} title={!isAdmin?"Admin only":""} style={{display:"flex",alignItems:"center",gap:6,cursor:isAdmin?"pointer":"not-allowed",opacity:isAdmin?1:0.6}}>
                        <div style={{width:42,height:22,borderRadius:11,background:worker.active===false?"#D1D5DB":"#22C55E",position:"relative",border:`2px solid ${worker.active===false?"#9CA3AF":"#16A34A"}`}}>
                          <div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:worker.active===false?2:20,transition:"left 0.2s"}}/>
                        </div>
                        <span style={{fontSize:11,fontWeight:700,color:worker.active===false?"#9CA3AF":"#16A34A"}}>{worker.active===false?"Inactive":"Active"}</span>
                      </div>
                      <div style={{fontSize:16,color:s.color,transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>›</div>
                    </div>
                  </div>
                  {isOpen&&(
                    isAdmin ? (
                      <div style={{padding:"14px 18px",borderTop:`1px solid ${s.color}22`,background:"#FAFAF8",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {[{label:"Name",field:"name"},{label:"Role",field:"role"},{label:"Phone",field:"phone"},{label:"Email",field:"email"}].map(({label,field})=>(
                          <div key={field}>
                            <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:4}}>{label.toUpperCase()}</label>
                            <input value={worker[field]||""} onChange={e=>updateWorker(crew,idx,field,e.target.value)}
                              style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"8px 10px",fontSize:13,color:"#1F2937",outline:"none",boxSizing:"border-box",background:"#fff"}}
                              onFocus={e=>e.target.style.borderColor=s.color} onBlur={e=>e.target.style.borderColor="#EDE9E4"}/>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{padding:"14px 18px",borderTop:`1px solid ${s.color}22`,background:"#FAFAF8",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <div>
                          <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:4}}>NAME</label>
                          <div style={{fontSize:13,color:"#1F2937",padding:"8px 0"}}>{worker.name||"—"}</div>
                        </div>
                        <div>
                          <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:4}}>ROLE</label>
                          <div style={{fontSize:13,color:"#1F2937",padding:"8px 0"}}>{worker.role||"—"}</div>
                        </div>
                        <div>
                          <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:4}}>PHONE</label>
                          <div style={{fontSize:13,padding:"8px 0"}}>
                            {worker.phone ? <a href={`tel:${worker.phone.replace(/\s+/g,"")}`} style={{color:s.color,textDecoration:"none",fontWeight:600}}>📱 {worker.phone}</a> : <span style={{color:"#9CA3AF"}}>—</span>}
                          </div>
                        </div>
                        <div>
                          <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:4}}>EMAIL</label>
                          <div style={{fontSize:13,padding:"8px 0"}}>
                            {displayEmail ? <a href={`mailto:${displayEmail}`} style={{color:s.color,textDecoration:"none",fontWeight:600,wordBreak:"break-all"}}>✉️ {displayEmail}</a> : <span style={{color:"#9CA3AF"}}>—</span>}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── LEAVE TAB ── */}
        {tab==="leave" && (
          <div>
            <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",marginBottom:18}}>
              <div style={{fontSize:15,fontWeight:800,color:"#111827",marginBottom:14}}>📝 Add Leave / Day Off</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>CREW</label>
                  <div style={{display:"flex",gap:4,background:"#1F2937",borderRadius:8,padding:3}}>
                    {crewKeys.map(cr=>{
                      const sel=leaveForm.crew===cr;
                      return (
                        <button key={cr} onClick={()=>setLeaveForm(p=>({...p,crew:cr,workerName:""}))}
                          style={{flex:1,padding:"6px 10px",border:"none",borderRadius:6,cursor:"pointer",background:CREW_STYLE[cr].color,color:"#fff",fontSize:12,fontWeight:700,opacity:sel?1:0.55,boxShadow:sel?"0 0 0 2px #fff inset":"none"}}>
                          {cr}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>WORKER</label>
                  <select value={leaveForm.workerName} onChange={e=>setLeaveForm(p=>({...p,workerName:e.target.value}))}
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"8px 10px",fontSize:13,color:"#1F2937",outline:"none",background:"#fff"}}>
                    <option value="">Select worker…</option>
                    {(workers[leaveForm.crew]||[]).filter(w=>w.active!==false).map(w=>(<option key={w.name} value={w.name}>{w.name}</option>))}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>START DATE</label>
                  <input type="date" value={leaveForm.startDate} onChange={e=>setLeaveForm(p=>({...p,startDate:e.target.value,endDate:p.endDate||e.target.value}))}
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"8px 10px",fontSize:13,color:"#1F2937",outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>END DATE</label>
                  <input type="date" value={leaveForm.endDate} min={leaveForm.startDate} onChange={e=>setLeaveForm(p=>({...p,endDate:e.target.value}))}
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"8px 10px",fontSize:13,color:"#1F2937",outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>REASON (optional)</label>
                  <input value={leaveForm.reason} onChange={e=>setLeaveForm(p=>({...p,reason:e.target.value}))} placeholder="e.g. Annual leave, Sick day..."
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"8px 10px",fontSize:13,color:"#1F2937",outline:"none",boxSizing:"border-box"}}/>
                </div>
              </div>
              <button onClick={addLeave} style={{marginTop:12,width:"100%",padding:"10px",border:"none",borderRadius:9,background:"#F59E0B",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Add Leave</button>
            </div>
            <div style={{display:"flex",gap:4,background:"#1F2937",borderRadius:10,padding:4,marginBottom:14}}>
              <button onClick={()=>setLeaveFilter("All")} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:leaveFilter==="All"?"#fff":"transparent",color:leaveFilter==="All"?"#111827":"#9CA3AF",fontWeight:700,fontSize:13}}>Both</button>
              {crewKeys.map(crew=>{
                const cs=C(crew);
                const sel=leaveFilter===crew;
                return (
                  <button key={crew} onClick={()=>setLeaveFilter(crew)} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",background:cs.color,color:"#fff",fontWeight:700,fontSize:13,letterSpacing:0,opacity:sel||leaveFilter==="All"?1:0.55,boxShadow:sel?"0 0 0 2px #fff inset":"none"}}>
                    {crew}
                  </button>
                );
              })}
            </div>
            {leave.filter(lv=>leaveFilter==="All"||lv.crew===leaveFilter).length===0?(
              <div style={{textAlign:"center",padding:"40px",color:"#9CA3AF"}}>No leave recorded yet.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {leave.filter(lv=>leaveFilter==="All"||lv.crew===leaveFilter).sort((a,b)=>a.startDate.localeCompare(b.startDate)).map(lv=>{
                  const sd=new Date(lv.startDate),ed=new Date(lv.endDate);
                  const days=Math.round((ed-sd)/86400000)+1;
                  return (
                    <div key={lv.id} style={{background:"#fff",borderRadius:12,padding:"12px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{fontSize:22}}>🏖️</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,color:"#1F2937"}}>{lv.workerName}</div>
                        <div style={{fontSize:12,color:"#6B7280"}}>{lv.startDate===lv.endDate?fmtDate(sd):`${fmtDate(sd)} – ${fmtDate(ed)}`} · {days} day{days!==1?"s":""}{lv.reason?` · ${lv.reason}`:""}</div>
                      </div>
                      <button onClick={()=>{setLeave(p=>p.filter(l=>l.id!==lv.id));api.deleteLeaveEntry(lv.id).catch(e=>console.error(e));}}
                        style={{padding:"4px 10px",border:"1.5px solid #FCA5A5",borderRadius:7,background:"#FEF2F2",color:"#DC2626",fontSize:11,fontWeight:600,cursor:"pointer"}}>Remove</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab==="reports" && currentUser.role==="admin" && (() => {
          const range = reportRange;
          const setRange = setReportRange;
          const sub = reportSub;
          const setSub = setReportSub;
          const rangeStart = new Date(range.start+"T00:00:00");
          const rangeEnd = new Date(range.end+"T23:59:59");
          const jobsInRange = jobs.filter(j => {
            const days = jobDays(j);
            return days.some(d => {
              const dt = new Date(d.date+"T12:00:00");
              return dt >= rangeStart && dt <= rangeEnd;
            });
          });
          const parseT = (t) => { if(!t) return null; const [h,m]=t.split(":").map(Number); return h*60+(m||0); };
          const calcHours = (start,end) => { const s=parseT(start),e=parseT(end); if(s==null||e==null||e<=s) return 0; return (e-s)/60; };
          // Hours by Worker
          const hoursByWorker = {};
          jobsInRange.forEach(j => {
            Object.entries(j.attendance||{}).forEach(([wn, dates]) => {
              Object.entries(dates).forEach(([dk, rec]) => {
                const dt = new Date(dk+"T12:00:00");
                if (dt >= rangeStart && dt <= rangeEnd) {
                  hoursByWorker[wn] = (hoursByWorker[wn]||0) + calcHours(rec.start, rec.end);
                }
              });
            });
          });
          // Hours by Job
          const hoursByJob = jobsInRange.map(j => {
            let total = 0;
            Object.values(j.attendance||{}).forEach(dates => {
              Object.entries(dates).forEach(([dk, rec]) => {
                const dt = new Date(dk+"T12:00:00");
                if (dt >= rangeStart && dt <= rangeEnd) total += calcHours(rec.start, rec.end);
              });
            });
            return { job: j, hours: total };
          }).sort((a,b)=>b.hours-a.hours);
          // Weekly/Monthly summaries reuse the same jobsInRange, just grouped by crew
          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
                <div style={{fontSize:18,fontWeight:800,color:"#111827"}}>📈 Reports <span style={{fontSize:12,fontWeight:500,color:"#9CA3AF"}}>(admin only)</span></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <label style={{fontSize:11,color:"#6B7280",fontWeight:600}}>From</label>
                  <input type="date" value={range.start} onChange={e=>setRange(p=>({...p,start:e.target.value}))} style={{border:"1.5px solid #E5E0D8",borderRadius:8,padding:"6px 10px",fontSize:12}}/>
                  <label style={{fontSize:11,color:"#6B7280",fontWeight:600}}>To</label>
                  <input type="date" value={range.end} onChange={e=>setRange(p=>({...p,end:e.target.value}))} style={{border:"1.5px solid #E5E0D8",borderRadius:8,padding:"6px 10px",fontSize:12}}/>
                </div>
              </div>

              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {[["hoursWorker","⏱️ Hours by Worker"],["hoursJob","🏗️ Hours by Job"],["weekly","📆 Weekly Summary"],["monthly","🗓️ Monthly Summary"]].map(([id,lbl])=>(
                  <button key={id} onClick={()=>setSub(id)}
                    style={{padding:"8px 14px",border:`1.5px solid ${sub===id?"#1B2D5B":"#E5E0D8"}`,borderRadius:8,background:sub===id?"#1B2D5B":"#fff",color:sub===id?"#fff":"#6B7280",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    {lbl}
                  </button>
                ))}
              </div>

              <div style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                {sub==="hoursWorker" && (
                  <div>
                    {Object.entries(hoursByWorker).sort((a,b)=>b[1]-a[1]).map(([wn,hrs])=>(
                      <div key={wn} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #F0EDE8"}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#1F2937"}}>{wn}</div>
                        <div style={{fontSize:13,fontWeight:800,color:"#16A34A"}}>{hrs.toFixed(1)} hrs</div>
                      </div>
                    ))}
                    {Object.keys(hoursByWorker).length===0 && <div style={{fontSize:13,color:"#9CA3AF",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No attendance data in this range.</div>}
                  </div>
                )}
                {sub==="hoursJob" && (
                  <div>
                    {hoursByJob.filter(x=>x.hours>0).map(({job,hours})=>(
                      <div key={job.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #F0EDE8",cursor:"pointer"}} onClick={()=>openEdit(job)}>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#1F2937"}}>{job.location}</div>
                          <div style={{fontSize:11,color:"#9CA3AF"}}>{job.crew} · {jobDays(job).length} day{jobDays(job).length!==1?"s":""}</div>
                        </div>
                        <div style={{fontSize:13,fontWeight:800,color:"#16A34A"}}>{hours.toFixed(1)} hrs</div>
                      </div>
                    ))}
                    {hoursByJob.filter(x=>x.hours>0).length===0 && <div style={{fontSize:13,color:"#9CA3AF",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No attendance data in this range.</div>}
                  </div>
                )}
                {(sub==="weekly"||sub==="monthly") && (
                  <div>
                    {jobsInRange.sort((a,b)=>a.startDate.localeCompare(b.startDate)).map(j=>{
                      const s=C(j.crew);
                      const d=jobDays(j);
                      return (
                        <div key={j.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid #F0EDE8",cursor:"pointer"}} onClick={()=>openEdit(j)}>
                          <div style={{width:4,borderRadius:2,background:s.color,flexShrink:0}}/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:700,color:"#1F2937"}}>{j.location}</div>
                            <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{j.crew} · {fmtDateYY(new Date(j.startDate))} – {fmtDateYY(new Date(j.endDate))} · {d.length} day{d.length!==1?"s":""} · 👷 {j.workers.join(", ")}</div>
                          </div>
                        </div>
                      );
                    })}
                    {jobsInRange.length===0 && <div style={{fontSize:13,color:"#9CA3AF",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No jobs in this range.</div>}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {tab==="history" && currentUser.role==="admin" && (
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#111827",marginBottom:14}}>🕘 History <span style={{fontSize:12,fontWeight:500,color:"#9CA3AF"}}>(admin only · last 60 days)</span></div>
            <HistoryTab/>
          </div>
        )}

      </div>

      {/* ── DAY POPUP ── */}
      {dayPopup&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setDayPopup(null);}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:480,boxShadow:"0 24px 64px rgba(0,0,0,0.25)",overflow:"hidden",maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
            <div style={{background:"#111827",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayPopup.date.getDay()]} {fmtDateYY(dayPopup.date)}</div>
                <div style={{fontSize:11,color:"#6B9E7A",marginTop:2}}>{dayPopup.jobs.length} job{dayPopup.jobs.length!==1?"s":""}</div>
              </div>
              <button onClick={()=>setDayPopup(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15}}>✕</button>
            </div>
            <div style={{overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
              {dayPopup.jobs.map(job=>{
                const s=C(job.crew);
                return (
                  <div key={job.id} style={{border:`1.5px solid ${s.color}`,borderRadius:10,overflow:"hidden"}}>
                    <div style={{background:s.color,padding:"8px 12px"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{job.location}</div>
                    </div>
                    <div style={{padding:"8px 12px",background:s.light}}>
                      <div style={{fontSize:11,color:s.accent,marginBottom:4}}>📅 {spanLabel(job)}{numDays(job)>1?` (${numDays(job)} days)`:""}</div>
                      {job.notes&&<div style={{fontSize:11,color:s.accent,fontStyle:"italic",marginBottom:4}}>📝 {job.notes}</div>}
                      <div style={{fontSize:11,color:s.accent}}>👷 {job.workers.join(", ")}</div>
                    </div>
                    <div style={{padding:"8px 12px",background:"#fff",display:"flex",gap:8}}>
                      <button onClick={()=>{setThreadModal(job);setDayPopup(null);}} style={{flex:1,padding:"7px",border:"1.5px solid #6366F1",borderRadius:8,background:"#EEF2FF",color:"#4338CA",fontSize:12,fontWeight:700,cursor:"pointer"}}>💬 Thread</button>
                      <button onClick={()=>{openEdit(job);setDayPopup(null);}} style={{flex:1,padding:"7px",border:"1.5px solid #D1C9BE",borderRadius:8,background:"#fff",color:"#374151",fontSize:12,fontWeight:600,cursor:"pointer"}}>Edit</button>
                      {currentUser.role==="admin"&&<button onClick={()=>deleteJob(job.id)} style={{padding:"7px 12px",border:"1.5px solid #FCA5A5",borderRadius:8,background:"#FEF2F2",color:"#DC2626",fontSize:12,cursor:"pointer"}}>Delete</button>}
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>openAdd(dayPopup.date)} style={{padding:"10px",border:"2px dashed #D1C9BE",borderRadius:8,background:"transparent",color:"#9CA3AF",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add job on this day</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT JOB MODAL ── */}
      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setShowModal(false);}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:500,boxShadow:"0 24px 64px rgba(0,0,0,0.25)",overflow:"hidden",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
            <div style={{background:C(form.crew).color,padding:"14px 18px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{editId?"Edit Job":"New Job"}</div>
              <button onClick={()=>setShowModal(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:26,height:26,borderRadius:"50%",cursor:"pointer",fontSize:13}}>✕</button>
            </div>
            <div style={{overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:7}}>CREW</label>
                <div style={{display:"flex",gap:8}}>
                  {crewKeys.map(crew=>(
                    <button key={crew} onClick={()=>setForm(p=>({...p,crew,workers:[]}))}
                      style={{flex:1,padding:"8px",border:`2px solid ${form.crew===crew?C(crew).color:"#E5E0D8"}`,borderRadius:8,background:form.crew===crew?C(crew).light:"#fff",color:form.crew===crew?C(crew).accent:"#9CA3AF",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {crew}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:7}}>SCHEDULE</label>
                {(() => {
                  const days = form.days||[];
                  const updateDay = (i,field,val) => setForm(p=>({...p,days:p.days.map((d,j)=>j===i?{...d,[field]:val}:d)}));
                  const addDay = () => {
                    const last = days[days.length-1];
                    const nextDate = last ? dateKey(addDays(new Date(last.date),1)) : todayStr();
                    setForm(p=>({...p,days:[...(p.days||[]),{date:nextDate,period:"full"}]}));
                  };
                  const removeDay = (i) => setForm(p=>({...p,days:p.days.filter((_,j)=>j!==i)}));
                  const periodColor = (p) => p==="am" ? "#38BDF8" : p==="pm" ? "#0A0A0A" : "#1B2D5B";
                  return (
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {days.map((d,i)=>(
                        <div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
                          <input type="date" value={d.date} onChange={e=>updateDay(i,"date",e.target.value)}
                            style={{flex:1,border:`1.5px solid ${C(form.crew).color}`,borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",color:"#1F2937",background:C(form.crew).light,boxSizing:"border-box"}}/>
                          <div style={{display:"flex",background:"#F0EDE8",borderRadius:7,padding:3,gap:2,flexShrink:0}}>
                            {["full","am","pm"].map(p=>{
                              const sel=d.period===p;
                              return (
                                <button key={p} onClick={()=>updateDay(i,"period",p)}
                                  style={{padding:"5px 10px",border:"none",borderRadius:5,background:sel?periodColor(p):"transparent",color:sel?"#fff":"#9CA3AF",fontSize:11,fontWeight:700,cursor:"pointer",textTransform:p==="full"?"none":"uppercase"}}>
                                  {p==="full"?"Full":p}
                                </button>
                              );
                            })}
                          </div>
                          {i>0 && <button onClick={()=>removeDay(i)} title="Remove" style={{width:28,height:36,border:"1.5px solid #FCA5A5",borderRadius:8,background:"#FEF2F2",color:"#DC2626",fontSize:14,cursor:"pointer",padding:0}}>×</button>}
                        </div>
                      ))}
                      <button onClick={addDay} style={{marginTop:2,padding:"6px 10px",border:"1.5px dashed #D1C9BE",borderRadius:8,background:"transparent",color:"#9CA3AF",fontSize:12,fontWeight:600,cursor:"pointer",alignSelf:"flex-start"}}>+ Add another day</button>
                    </div>
                  );
                })()}
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:7}}>LOCATION</label>
                <input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Site Name – 123 Main St"
                  style={{width:"100%",border:"1.5px solid #E5E0D8",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=C(form.crew).color} onBlur={e=>e.target.style.borderColor="#E5E0D8"}/>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:7}}>WORKERS <span style={{color:C(form.crew).color}}>({form.workers.length} selected)</span></label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {(workers[form.crew]||[]).filter(w=>w.active!==false).map(w=>{
                    const sel=form.workers.includes(w.name); const s=C(form.crew);
                    return (
                      <button key={w.name} onClick={()=>toggleWorker(w.name)}
                        style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",border:`1.5px solid ${sel?s.color:"#E5E0D8"}`,borderRadius:8,background:sel?s.light:"#FAFAF8",cursor:"pointer",textAlign:"left"}}>
                        <div style={{width:14,height:14,borderRadius:4,border:`2px solid ${sel?s.color:"#CCC"}`,background:sel?s.color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {sel&&<span style={{color:"#fff",fontSize:9}}>✓</span>}
                        </div>
                        <span style={{fontSize:12,color:sel?s.accent:"#555",fontWeight:sel?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {form.workers.length>0 && (form.days||[]).length>0 && (() => {
                const attendance = form.attendance || {};
                const isAdmin = currentUser.role==="admin";
                const parseTime = (t) => {
                  if (!t) return null;
                  const [h,m] = t.split(":").map(Number);
                  return h*60 + (m||0);
                };
                const hoursFor = (start, end) => {
                  const s = parseTime(start), e = parseTime(end);
                  if (s==null || e==null || e<=s) return 0;
                  return (e-s)/60;
                };
                const updateTime = (wname, dk, field, val) => {
                  setForm(p => {
                    const a = {...(p.attendance||{})};
                    a[wname] = {...(a[wname]||{})};
                    a[wname][dk] = {...(a[wname][dk]||{}), [field]: val};
                    return {...p, attendance:a};
                  });
                };
                const [expandedW, expandedD] = (form._attExpanded || "").split("|");
                const handleExpand = (wname, dk, period) => {
                  const key = `${wname}|${dk}`;
                  setForm(p => {
                    if (p._attExpanded === key) {
                      return {...p, _attExpanded: ""};
                    }
                    const a = {...(p.attendance||{})};
                    const existing = a[wname]?.[dk] || {};
                    if (!existing.start) {
                      const defaultStart = period === "pm" ? "12:00" : "06:00";
                      a[wname] = {...(a[wname]||{})};
                      a[wname][dk] = {...existing, start: defaultStart};
                    }
                    return {...p, _attExpanded: key, attendance: a};
                  });
                };
                let totalHrs = 0;
                form.workers.forEach(wn => {
                  (form.days||[]).forEach(d => {
                    const rec = attendance[wn]?.[d.date];
                    if (rec) totalHrs += hoursFor(rec.start, rec.end);
                  });
                });
                const dayLabel = (dk) => {
                  const d = new Date(dk+"T12:00:00");
                  const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
                  return `${wd}, ${fmtDate(d)}`;
                };
                const periodLabel = (p) => p==="am"?"AM only":p==="pm"?"PM only":"Full day";
                return (
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1}}>TIME ATTENDANCE</label>
                      {totalHrs>0 && <span style={{fontSize:11,fontWeight:700,color:"#16A34A"}}>{totalHrs.toFixed(1)} hrs total</span>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {(form.days||[]).map((d,di)=>(
                        <div key={di} style={{background:"#FAFAF8",border:"1px solid #E5E0D8",borderRadius:10,padding:10}}>
                          <div style={{fontSize:11,fontWeight:800,color:C(form.crew).accent,marginBottom:6,letterSpacing:0.5}}>📅 {dayLabel(d.date)} · {periodLabel(d.period||"full")}</div>
                          <div style={{display:"flex",flexDirection:"column",gap:4}}>
                            {form.workers.map(wn => {
                              const rec = attendance[wn]?.[d.date] || {};
                              const hrs = hoursFor(rec.start, rec.end);
                              const isSelf = wn === currentUser.name;
                              const canEdit = isAdmin || isSelf;
                              const isExpanded = expandedW===wn && expandedD===d.date;
                              const hasTime = rec.start || rec.end;
                              return (
                                <div key={wn} style={{padding:"9px 11px",background:canEdit&&isExpanded?"#EFF6FF":"#fff",border:`1px solid ${canEdit&&isExpanded?"#60A5FA":"#E5E0D8"}`,borderRadius:8,cursor:canEdit?"pointer":"default"}} onClick={()=>canEdit&&handleExpand(wn,d.date,d.period||"full")}>
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                                    <div style={{fontSize:12,fontWeight:isSelf||hasTime?700:400,color:canEdit?"#1F2937":"#6B7280"}}>
                                      {wn} {isSelf && <span style={{fontSize:10,fontWeight:500,color:"#2563EB"}}>(you)</span>}
                                    </div>
                                    <div style={{fontSize:11,fontWeight:700,color:hasTime?(canEdit&&isExpanded?"#2563EB":"#6B7280"):"#9CA3AF"}}>
                                      {hasTime ? `${rec.start||"—"} – ${rec.end||"—"}${hrs>0?` · ${hrs.toFixed(1)}h`:""}` : canEdit?"Tap to add ›":"— not set —"}
                                    </div>
                                  </div>
                                  {canEdit && isExpanded && (
                                    <div onClick={e=>e.stopPropagation()} style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}>
                                      <select value={rec.start||""} onChange={e=>updateTime(wn,d.date,"start",e.target.value)}
                                        style={{flex:1,border:"1.5px solid #BFDBFE",borderRadius:6,padding:"7px 8px",fontSize:13,color:"#1F2937",fontWeight:600,background:"#fff",outline:"none",cursor:"pointer"}}>
                                        <option value="">Start</option>
                                        {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                      </select>
                                      <span style={{color:"#9CA3AF"}}>→</span>
                                      <select value={rec.end||""} onChange={e=>updateTime(wn,d.date,"end",e.target.value)}
                                        style={{flex:1,border:"1.5px solid #BFDBFE",borderRadius:6,padding:"7px 8px",fontSize:13,color:"#1F2937",fontWeight:600,background:"#fff",outline:"none",cursor:"pointer"}}>
                                        <option value="">End</option>
                                        {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:7}}>DOCUMENT LINKS {currentUser.role!=="admin"&&<span style={{color:"#9CA3AF",fontWeight:500,letterSpacing:0}}>(admin only)</span>}</label>
                {(() => {
                  const linkIcon = (url) => {
                    const u = (url||"").toLowerCase();
                    if (u.includes("sharepoint")||u.includes("office.com")) return "📊";
                    if (u.includes("dropbox")) return "📦";
                    if (u.includes("google")||u.includes("docs.google")||u.includes("drive.google")) return "🟢";
                    return "🔗";
                  };
                  const autoName = (url) => {
                    try {
                      const path = (url||"").split("?")[0].split("#")[0];
                      const last = path.split("/").filter(Boolean).pop() || "Open document";
                      return decodeURIComponent(last).replace(/\.[^.]+$/, "");
                    } catch(e) { return "Open document"; }
                  };
                  if (currentUser.role==="admin") {
                    const links = form.documentLinks||[];
                    const updateLink = (i,field,val) => setForm(p=>({...p,documentLinks:p.documentLinks.map((d,j)=>j===i?{...d,[field]:val}:d)}));
                    const addLink = () => setForm(p=>({...p,documentLinks:[...(p.documentLinks||[]),{name:"",url:""}]}));
                    const removeLink = (i) => setForm(p=>({...p,documentLinks:p.documentLinks.filter((_,j)=>j!==i)}));
                    return (
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {links.length===0 && (
                          <button onClick={addLink} style={{padding:"8px 12px",border:"1.5px dashed #D1C9BE",borderRadius:8,background:"transparent",color:"#9CA3AF",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add document link</button>
                        )}
                        {links.map((d,i)=>(
                          <div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
                            <input value={d.name} onChange={e=>updateLink(i,"name",e.target.value)} placeholder="Document name"
                              style={{flex:"0 0 30%",border:"1.5px solid #E5E0D8",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",outline:"none"}}/>
                            <input value={d.url} onChange={e=>updateLink(i,"url",e.target.value)} placeholder="https://..."
                              style={{flex:1,border:"1.5px solid #E5E0D8",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",outline:"none"}}/>
                            <a href={d.url||"#"} target="_blank" rel="noopener noreferrer" onClick={e=>{if(!d.url)e.preventDefault();}}
                              title="Test link in new tab"
                              style={{flex:"0 0 36px",height:36,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid #E5E0D8",borderRadius:8,background:d.url?"#FAFAF8":"#F3F4F6",color:d.url?"#2563EB":"#9CA3AF",textDecoration:"none",fontSize:14,fontWeight:700}}>↗</a>
                            <button onClick={()=>removeLink(i)} title="Remove" style={{flex:"0 0 28px",height:36,border:"1.5px solid #FCA5A5",borderRadius:8,background:"#FEF2F2",color:"#DC2626",fontSize:14,cursor:"pointer",padding:0}}>×</button>
                          </div>
                        ))}
                        {links.length>0 && links.length<3 && (
                          <button onClick={addLink} style={{padding:"6px 10px",border:"1.5px dashed #D1C9BE",borderRadius:8,background:"transparent",color:"#9CA3AF",fontSize:12,fontWeight:600,cursor:"pointer",alignSelf:"flex-start"}}>+ Add another link</button>
                        )}
                      </div>
                    );
                  }
                  // User view
                  const links = (form.documentLinks||[]).filter(d=>d.url);
                  if (links.length===0) return <div style={{fontSize:12,color:"#9CA3AF",fontStyle:"italic",padding:"9px 0"}}>No document linked</div>;
                  return (
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {links.map((d,i)=>(
                        <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 12px",border:"1.5px solid #E5E0D8",borderRadius:8,fontSize:13,color:"#2563EB",textDecoration:"none",background:"#FAFAF8"}}>
                          <span>{linkIcon(d.url)}</span>
                          <span style={{fontWeight:600}}>{d.name||autoName(d.url)}</span>
                        </a>
                      ))}
                    </div>
                  );
                })()}
              </div>
              {editId !== null && (() => {
                const j = jobs.find(x => x.id === editId);
                if (!j) return null;
                const fmtMeta = (iso) => {
                  if (!iso) return "";
                  try {
                    const d = new Date(iso);
                    const dd = String(d.getDate()).padStart(2,"0");
                    const mm = String(d.getMonth()+1).padStart(2,"0");
                    const yy = String(d.getFullYear()).slice(-2);
                    return `${dd}/${mm}/${yy}`;
                  } catch(e) { return ""; }
                };
                const createdLine = j.createdBy ? `Created by ${j.createdBy}${j.createdAt?` on ${fmtMeta(j.createdAt)}`:""}` : "";
                const editedLine = j.lastEditedBy ? `Last edited by ${j.lastEditedBy}${j.lastEditedAt?` on ${fmtMeta(j.lastEditedAt)}`:""}` : "";
                if (!createdLine && !editedLine) return null;
                return (
                  <div style={{fontSize:12,color:"#9CA3AF",fontStyle:"italic",lineHeight:1.5}}>
                    {createdLine && <div>{createdLine}</div>}
                    {editedLine && <div>{editedLine}</div>}
                  </div>
                );
              })()}
              <div>
                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:7}}>NOTES</label>
                <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="e.g. PPE required, early start..."
                  style={{width:"100%",border:"1.5px solid #E5E0D8",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=C(form.crew).color} onBlur={e=>e.target.style.borderColor="#E5E0D8"}/>
              </div>
              {form.crew==="NQ Stripouts"&&(
                <div>
                  <button onClick={()=>setForm(p=>({...p,invoiced:!p.invoiced}))}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:`2px solid ${form.invoiced?"#16A34A":"#E5E0D8"}`,borderRadius:10,background:form.invoiced?"#F0FDF4":"#FAFAF8",cursor:"pointer",width:"100%"}}>
                    <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${form.invoiced?"#16A34A":"#D1C9BE"}`,background:form.invoiced?"#16A34A":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {form.invoiced&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:form.invoiced?"#15803D":"#374151"}}>Job Invoiced</div>
                  </button>
                </div>
              )}
              <div style={{display:"flex",gap:8,paddingTop:4}}>
                <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"10px",border:"1.5px solid #E5E0D8",borderRadius:8,background:"#fff",color:"#9CA3AF",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                {editId&&currentUser.role==="admin"&&<button onClick={()=>deleteJob(editId)} style={{padding:"10px 14px",border:"1.5px solid #FCA5A5",borderRadius:8,background:"#FEF2F2",color:"#DC2626",fontSize:13,fontWeight:600,cursor:"pointer"}}>Delete</button>}
                <button onClick={saveJob} style={{flex:1,padding:"10px",border:"none",borderRadius:8,background:C(form.crew).color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{editId?"Save Changes":"Add Job"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── THREAD MODAL ── */}
      {threadModal&&(()=>{
        const job=threadModal;
        const s=C(job.crew);
        const allWorkers=[...(workers[job.crew]||[]).map(w=>w.name),...crewKeys.filter(c=>c!==job.crew).flatMap(c=>(workers[c]||[]).map(w=>w.name))];
        const entries=[...(threads[job.id]||[])].sort((a,b)=>a.ts.localeCompare(b.ts));
        const grouped=entries.reduce((acc,e)=>{const day=e.ts.slice(0,10);if(!acc[day])acc[day]=[];acc[day].push(e);return acc;},{});
        const sortedDays=Object.keys(grouped).sort();
        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}}
            onClick={e=>{if(e.target===e.currentTarget)setThreadModal(null);}}>
            <div style={{background:"#F4F3F0",borderRadius:16,width:"100%",maxWidth:540,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 28px 80px rgba(0,0,0,0.3)"}}>
              <div style={{background:s.color,padding:"14px 18px",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:900,color:"#fff"}}>{job.location}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:3}}>📅 {spanLabel(job)} · 👷 {job.workers.join(", ")}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <button onClick={()=>setShowAdminPin(p=>!p)} style={{background:isAdmin?"#22C55E":"rgba(255,255,255,0.15)",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}}>
                      {isAdmin?"🔓 Admin":"🔒 Admin"}
                    </button>
                    <button onClick={()=>setThreadModal(null)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14}}>✕</button>
                  </div>
                </div>
                {showAdminPin&&!isAdmin&&(
                  <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}>
                    <input type="password" value={adminPinEntry} onChange={e=>setAdminPinEntry(e.target.value)} placeholder="Enter admin PIN"
                      style={{flex:1,padding:"7px 12px",borderRadius:8,border:"none",fontSize:13}}/>
                    <button onClick={()=>{if(adminPinEntry===ADMIN_PIN){setIsAdmin(true);setShowAdminPin(false);setAdminPinEntry("");}else alert("Incorrect PIN");}}
                      style={{padding:"7px 14px",background:"#22C55E",border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Unlock</button>
                  </div>
                )}
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:4}}>
                {sortedDays.length===0?(
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#9CA3AF",fontSize:13}}>
                    <div style={{fontSize:30,marginBottom:8}}>💬</div>
                    No entries yet — add a note below.
                  </div>
                ):sortedDays.map(day=>{
                  const _d=new Date(day+"T12:00:00");
                  const _wd=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][_d.getDay()];
                  const dayLabel=`${_wd} ${fmtDateYY(_d)}`;
                  return (
                    <div key={day}>
                      <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 0 8px"}}>
                        <div style={{flex:1,height:1,background:"#D1C9BE"}}/>
                        <span style={{fontSize:11,fontWeight:700,color:"#9CA3AF"}}>{dayLabel}</span>
                        <div style={{flex:1,height:1,background:"#D1C9BE"}}/>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {grouped[day].map(entry=>{
                          const isSystem=entry.type==="system";
                          const timeStr=new Date(entry.ts).toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
                          return (
                            <div key={entry.id} style={{background:isSystem?"transparent":"#fff",borderRadius:10,padding:isSystem?"5px 10px":"10px 12px",border:isSystem?"1px dashed #D1C9BE":"1px solid #E5E2DD"}}>
                              {isSystem&&<div style={{fontSize:11,color:"#9CA3AF",textAlign:"center"}}>⚙️ {entry.text} · {timeStr}</div>}
                              {!isSystem&&(
                                <div>
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                                      <div style={{width:28,height:28,borderRadius:"50%",background:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:s.accent,flexShrink:0}}>
                                        {entry.author.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                                      </div>
                                      <div>
                                        <div style={{fontSize:12,fontWeight:700,color:"#111827"}}>{entry.author}</div>
                                        <div style={{fontSize:10,color:"#9CA3AF"}}>{timeStr}</div>
                                      </div>
                                    </div>
                                    {isAdmin&&<button onClick={()=>{if(window.confirm("Delete this entry?"))setThreads(p=>({...p,[job.id]:(p[job.id]||[]).filter(e=>e.id!==entry.id)}));}} style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:5,padding:"2px 8px",fontSize:10,color:"#DC2626",cursor:"pointer"}}>Delete</button>}
                                  </div>
                                  {entry.text&&<div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{entry.text}</div>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"#fff",borderTop:"1px solid #E5E2DD",padding:"12px 14px",flexShrink:0}}>
                <div style={{marginBottom:8}}>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>POSTING AS</label>
                  <select value={threadAuthor} onChange={e=>setThreadAuthor(e.target.value)}
                    style={{width:"100%",border:`1.5px solid ${threadAuthor?s.color:"#E5E2DD"}`,borderRadius:8,padding:"8px 10px",fontSize:13,color:threadAuthor?"#111827":"#9CA3AF",outline:"none",background:"#fff"}}>
                    <option value="">Select your name…</option>
                    {job.workers.length>0&&<optgroup label="On this job">{job.workers.map(n=>(<option key={n} value={n}>{n}</option>))}</optgroup>}
                    {allWorkers.filter(n=>!job.workers.includes(n)).length>0&&<optgroup label="Other workers">{allWorkers.filter(n=>!job.workers.includes(n)).map(n=>(<option key={n} value={n}>{n}</option>))}</optgroup>}
                  </select>
                </div>
                <textarea value={threadText} onChange={e=>setThreadText(e.target.value)} placeholder="Write a note about this job…" rows={2}
                  style={{width:"100%",border:"1.5px solid #E5E2DD",borderRadius:8,padding:"8px 10px",fontSize:13,resize:"none",boxSizing:"border-box",outline:"none",marginBottom:8}}/>
                <button onClick={()=>addThreadEntry(job.id,"note")} style={{width:"100%",padding:"10px",border:"none",borderRadius:8,background:s.color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Post Note</button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}


// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = sessionStorage.getItem("siteplanner_session");
      const u = s ? JSON.parse(s) : null;
      if (u) api.setApiUser(u);
      return u;
    } catch(e) { return null; }
  });

  const handleLogin = (user) => {
    sessionStorage.setItem("siteplanner_session", JSON.stringify(user));
    api.setApiUser(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("siteplanner_session");
    api.clearApiUser();
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  return <SitePlanner currentUser={currentUser} onLogout={handleLogout} />;
}
