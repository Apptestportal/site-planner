import { useState, useMemo, useRef } from "react";

// ── User list with access codes ───────────────────────────────────────────────
// Format: { name, email, code, role: "admin" | "user" }
const STORAGE_KEY = "siteplanner_users_v1";

const DEFAULT_USERS = [
  { name: "Craig",        email: "craig@topcon.com",                     code: "1234", role: "admin" },
  { name: "Allan",        email: "allan@velcorp.com",                    code: "5678", role: "admin" },
  { name: "Admin",        email: "apptestportal@outlook.com",            code: "9012", role: "admin" },
  { name: "Sadmin",       email: "sadmin@apptestportal.onmicrosoft.com", code: "3456", role: "admin" },
  { name: "Adam Clarke",  email: "adam.clarke@siteplanner.com",          code: "1001", role: "user" },
  { name: "Ben Torres",   email: "ben.torres@siteplanner.com",           code: "1002", role: "user" },
  { name: "Chris Ray",    email: "chris.ray@siteplanner.com",            code: "1003", role: "user" },
  { name: "Dan Smith",    email: "dan.smith@siteplanner.com",            code: "1004", role: "user" },
  { name: "Ed Walsh",     email: "ed.walsh@siteplanner.com",             code: "1005", role: "user" },
  { name: "Frank Li",     email: "frank.li@siteplanner.com",             code: "1006", role: "user" },
  { name: "Gary Hunt",    email: "gary.hunt@siteplanner.com",            code: "2001", role: "user" },
  { name: "Harry Fox",    email: "harry.fox@siteplanner.com",            code: "2002", role: "user" },
  { name: "Ivan Marsh",   email: "ivan.marsh@siteplanner.com",           code: "2003", role: "user" },
  { name: "Jake Owen",    email: "jake.owen@siteplanner.com",            code: "2004", role: "user" },
  { name: "Kyle Park",    email: "kyle.park@siteplanner.com",            code: "2005", role: "user" },
  { name: "Leo James",    email: "leo.james@siteplanner.com",            code: "2006", role: "user" },
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

  const handleLogin = () => {
    setError("");
    setLoading(true);
    const users = loadUsers();
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.code === code.trim()
    );
    setTimeout(() => {
      setLoading(false);
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or access code. Contact your administrator.");
        setCode("");
      }
    }, 500);
  };

  return (
    <div style={{minHeight:"100vh",background:"#111827",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <div style={{background:"#1F2937",borderRadius:20,padding:"48px 40px",width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12}}>🏗️</div>
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

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
function fmtDate(date) { return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" }); }
function dateKey(date) { return date.toISOString().slice(0,10); }

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

function jobDates(job) {
  const dates = []; let cur = new Date(job.startDate); const end = new Date(job.endDate);
  while (cur <= end) { dates.push(dateKey(cur)); cur = addDays(cur,1); }
  return dates;
}
function jobOnDate(job, dk) { return jobDates(job).includes(dk); }

const emptyForm = { crew:"Topcon Builders", location:"", startDate:"", endDate:"", workers:[], notes:"", invoiced:false, poFile:null, poFileName:"", photos:[] };


function UserManagement({ currentUser }) {
  const [users, setUsers]   = useState(loadUsers);
  const [newName, setNewName]   = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCode, setNewCode]   = useState("");
  const [newRole, setNewRole]   = useState("user");

  const addUser = () => {
    if(!newName.trim()||!newEmail.trim()||!newCode.trim()){alert("Fill in all fields.");return;}
    if(users.find(u=>u.email.toLowerCase()===newEmail.toLowerCase().trim())){alert("Email already exists.");return;}
    const updated=[...users,{name:newName.trim(),email:newEmail.toLowerCase().trim(),code:newCode.trim(),role:newRole}];
    setUsers(updated);saveUsers(updated);
    setNewName("");setNewEmail("");setNewCode("");setNewRole("user");
    alert("User added successfully.");
  };

  const toggleRole = (i) => {
    const updated=users.map((u,j)=>j===i?{...u,role:u.role==="admin"?"user":"admin"}:u);
    setUsers(updated);saveUsers(updated);
  };

  const removeUser = (i) => {
    if(!window.confirm("Remove "+users[i].name+"?"))return;
    const updated=users.filter((_,j)=>j!==i);
    setUsers(updated);saveUsers(updated);
  };

  return(
    <div style={{background:"#1F2937",borderRadius:14,padding:"18px 20px",marginBottom:20,border:"2px solid #374151"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <span style={{fontSize:18}}>🔐</span>
        <div style={{fontSize:14,fontWeight:800,color:"#F9F7F4"}}>App Access Management</div>
        <span style={{fontSize:10,background:"#374151",color:"#9CA3AF",padding:"2px 8px",borderRadius:6,fontWeight:600}}>ADMIN ONLY</span>
      </div>
      {users.map((u,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#111827",borderRadius:10,marginBottom:6}}>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#F9F7F4"}}>{u.name} <span style={{fontSize:11,color:"#6B7280"}}>— {u.email}</span></div>
            <div style={{fontSize:11,color:u.role==="admin"?"#22C55E":"#6B9E7A",marginTop:2}}>{u.role==="admin"?"👑 Admin":"👤 User"} · Code: {u.code}</div>
          </div>
          <button onClick={()=>toggleRole(i)} style={{padding:"4px 10px",border:"1px solid #374151",borderRadius:6,background:"#1F2937",color:"#9CA3AF",fontSize:11,cursor:"pointer"}}>
            Make {u.role==="admin"?"User":"Admin"}
          </button>
          {u.email!==currentUser.email&&(
            <button onClick={()=>removeUser(i)} style={{padding:"4px 10px",border:"1px solid #7F1D1D",borderRadius:6,background:"#450A0A",color:"#FCA5A5",fontSize:11,cursor:"pointer"}}>Remove</button>
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
  const [jobs, setJobs]     = useState(buildInitJobs);
  const [nextId, setNextId] = useState(9);
  const [workers, setWorkers] = useState(initWorkers);
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
  const [threads, setThreads] = useState({});
  const [threadModal, setThreadModal] = useState(null);
  const [threadAuthor, setThreadAuthor] = useState("");
  const [threadText, setThreadText] = useState("");
  const [threadPhoto, setThreadPhoto] = useState(null);
  const [threadCaption, setThreadCaption] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPinEntry, setAdminPinEntry] = useState("");
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [threadNextId, setThreadNextId] = useState(1);
  const ADMIN_PIN = "1234";
  const threadPhotoRef = useRef();
  const poInputRef = useRef();
  const photoInputRef = useRef();

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
    setForm({ ...emptyForm, startDate:sd, endDate:sd });
    setEditId(null); setShowModal(true); setDayPopup(null);
  };
  const openEdit = (job) => {
    setForm({ crew:job.crew, location:job.location, startDate:job.startDate, endDate:job.endDate, workers:[...job.workers], notes:job.notes, invoiced:job.invoiced||false, poFile:job.poFile||null, poFileName:job.poFileName||"", photos:job.photos||[] });
    setEditId(job.id); setShowModal(true);
  };
  const saveJob = () => {
    if (!form.location.trim() || !form.startDate) return;
    const endDate = form.endDate && form.endDate >= form.startDate ? form.endDate : form.startDate;
    if (editId !== null) { setJobs(p => p.map(j => j.id===editId ? {...j,...form,endDate} : j)); }
    else { setJobs(p => [...p, { id:nextId, ...form, endDate }]); setNextId(n=>n+1); }
    setShowModal(false);
  };
  const deleteJob = (id) => { setJobs(p=>p.filter(j=>j.id!==id)); setShowModal(false); setDayPopup(null); };
  const toggleWorker = (w) => setForm(p => ({ ...p, workers: p.workers.includes(w) ? p.workers.filter(x=>x!==w) : [...p.workers,w] }));
  const toggleInvoiced = (id) => setJobs(p => p.map(j => j.id===id ? {...j, invoiced:!j.invoiced} : j));
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
    setLeave(p => [...p, { id:leaveNextId, ...leaveForm }]);
    setLeaveNextId(p => p+1);
    setLeaveForm(p => ({...p, workerName:"", startDate:"", endDate:"", reason:""}));
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
    return d.toLocaleDateString("en-AU",{day:"numeric",month:"short"}) + " " + d.toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
  };

  const s_hdr = {background:"#111827",color:"#F9F7F4"};

  return (
    <div style={{minHeight:"100vh",background:"#F0EDE8",fontFamily:"system-ui,sans-serif"}}>

      {/* HEADER */}
      <div style={s_hdr}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18}}>
            <div>
              <div style={{fontSize:24,fontWeight:800,letterSpacing:-0.5}}>Site Planner</div>
              <div style={{fontSize:11,color:"#6B9E7A",letterSpacing:2,marginTop:2}}>CONSTRUCTION SCHEDULER</div>
            </div>
            <button onClick={()=>openAdd()} style={{background:"#22C55E",color:"#fff",border:"none",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>+ New Job</button>
          </div>
          <div style={{display:"flex",gap:2,marginTop:16,flexWrap:"wrap"}}>
            {[["schedule","📅  Weekly"],["month","🗓️  Month"],["jobs","📊  Job List"],["contacts","📋  Contacts"],["leave","🏖️  Leave"]].map(([id,lbl])=>(
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
            <div style={{display:"flex",gap:5,background:"#fff",borderRadius:10,padding:4,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
              <button onClick={()=>setCrewFilter("All")} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",background:crewFilter==="All"?"#111827":"transparent",color:crewFilter==="All"?"#fff":"#6B7280",fontWeight:600,fontSize:12}}>Both</button>
              {crewKeys.map(crew=>(
                <button key={crew} onClick={()=>setCrewFilter(crew)} style={{display:"flex",alignItems:"center",padding:"5px 10px",borderRadius:7,border:crewFilter===crew?`2px solid ${C(crew).color}`:"2px solid transparent",cursor:"pointer",background:crewFilter===crew?C(crew).light:"transparent"}}>
                  <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={crew} style={{height:20,objectFit:"contain"}}/>
                </button>
              ))}
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
                  <div style={{display:"grid",gridTemplateColumns:"150px 1fr",background:s.color}}>
                    <div style={{padding:"7px 14px",display:"flex",alignItems:"center",gap:8,gridColumn:"1/-1"}}>
                      <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={crew} style={{height:18,objectFit:"contain",filter:"brightness(0) invert(1)",opacity:0.9}}/>
                      <span style={{fontSize:11,fontWeight:900,color:"#fff"}}>{crew.toUpperCase()}</span>
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
                              {job&&(
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
                              )}
                              {!job&&!workerLeave&&(
                                <button onClick={()=>{setForm({...emptyForm,crew,startDate:dk,endDate:dk,workers:[worker.name]});setEditId(null);setShowModal(true);}}
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
            <div style={{display:"flex",gap:5,background:"#fff",borderRadius:10,padding:4,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
              <button onClick={()=>setMonthCrewFilter("All")} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",background:monthCrewFilter==="All"?"#111827":"transparent",color:monthCrewFilter==="All"?"#fff":"#6B7280",fontWeight:600,fontSize:12}}>Both</button>
              {crewKeys.map(crew=>(
                <button key={crew} onClick={()=>setMonthCrewFilter(crew)} style={{display:"flex",alignItems:"center",padding:"5px 10px",borderRadius:7,border:monthCrewFilter===crew?`2px solid ${C(crew).color}`:"2px solid transparent",cursor:"pointer",background:monthCrewFilter===crew?C(crew).light:"transparent"}}>
                  <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={crew} style={{height:20,objectFit:"contain"}}/>
                </button>
              ))}
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
                    return (
                      <div key={job.id} style={{background:isStart?s.color:s.light,border:`1px solid ${s.color}`,borderRadius:5,padding:"3px 5px",opacity:isStart?1:0.7}}>
                        <div style={{fontSize:10,fontWeight:800,color:isStart?"#fff":s.accent,lineHeight:1.2}}>{job.location.split("–")[0].trim()}</div>
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
