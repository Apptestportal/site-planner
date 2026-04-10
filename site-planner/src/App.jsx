import { useState, useMemo, useRef } from "react";

const TOPCON_LOGO = "data:image/jpeg;base64,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";
const NQ_LOGO = "data:image/jpeg;base64,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";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CREW_STYLE = {
  "Topcon Builders": { color: "#1B2D5B", light: "#E8ECF5", accent: "#0F1A36", tag: "TOPCON" },
  "NQ Stripouts":    { color: "#C0121C", light: "#FDEAEA", accent: "#7A0009", tag: "NQ"     },
};

const initWorkers = {
  "Topcon Builders": [
    { name: "Adam Clarke", phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Ben Torres",  phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Chris Ray",   phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Dan Smith",   phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Ed Walsh",    phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Frank Li",    phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
  ],
  "NQ Stripouts": [
    { name: "Gary Hunt",  phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Harry Fox",  phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Ivan Marsh", phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Jake Owen",  phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Kyle Park",  phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
    { name: "Leo James",  phone: "", email: "", role: "", address: "", emergency: "", emergencyPhone: "", license: "", notes: "", active: true },
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
function weekKey(monday) { return monday.toISOString().slice(0,10); }
function dateKey(date) { return date.toISOString().slice(0,10); }

function buildInitJobs() {
  const mon = getMonday(new Date());
  const fmt = (d) => d.toISOString().slice(0,10);
  return [
    { id:1, crew:"Topcon Builders", location:"Harbour View – 12 Marina Rd",   startDate:fmt(mon),             endDate:fmt(addDays(mon,1)),  workers:["Adam Clarke","Ben Torres"], notes:"",                 invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:2, crew:"NQ Stripouts",    location:"CBD Office – 88 Commerce St",    startDate:fmt(mon),             endDate:fmt(mon),             workers:["Gary Hunt","Jake Owen"],    notes:"Loading dock",      invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:3, crew:"Topcon Builders", location:"Westside Estate – 55 Palm Ave",  startDate:fmt(addDays(mon,2)),  endDate:fmt(addDays(mon,4)),  workers:["Chris Ray","Frank Li"],     notes:"",                 invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:4, crew:"NQ Stripouts",    location:"Industrial Park – Unit 7",        startDate:fmt(addDays(mon,4)),  endDate:fmt(addDays(mon,4)),  workers:["Harry Fox","Ivan Marsh"],   notes:"PPE required",      invoiced:true,  poFile:null, poFileName:"", photos:[] },
    { id:5, crew:"Topcon Builders", location:"Riverside Complex – 3 River St",  startDate:fmt(addDays(mon,7)),  endDate:fmt(addDays(mon,8)),  workers:["Adam Clarke","Dan Smith"],  notes:"",                 invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:6, crew:"NQ Stripouts",    location:"North Mall – Shop 12",            startDate:fmt(addDays(mon,10)), endDate:fmt(addDays(mon,11)), workers:["Kyle Park","Leo James"],    notes:"Early start 6am",   invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:7, crew:"Topcon Builders", location:"Airport Hotel – Terminal 2",      startDate:fmt(addDays(mon,14)), endDate:fmt(addDays(mon,14)), workers:["Ed Walsh","Ben Torres"],    notes:"",                 invoiced:false, poFile:null, poFileName:"", photos:[] },
    { id:8, crew:"NQ Stripouts",    location:"Beachside Apartments – Blk C",   startDate:fmt(addDays(mon,16)), endDate:fmt(addDays(mon,18)), workers:["Gary Hunt","Ivan Marsh"],   notes:"",                 invoiced:false, poFile:null, poFileName:"", photos:[] },
  ];
}

function jobDates(job) {
  const dates = []; let cur = new Date(job.startDate); const end = new Date(job.endDate);
  while (cur <= end) { dates.push(dateKey(cur)); cur = addDays(cur,1); }
  return dates;
}
function jobOnDate(job, dk) { return jobDates(job).includes(dk); }

const emptyForm = { crew:"Topcon Builders", location:"", startDate:"", endDate:"", workers:[], notes:"", invoiced:false, poFile:null, poFileName:"", photos:[] };

export default function App() {
  const [jobs, setJobs]       = useState(buildInitJobs);
  const [nextId, setNextId]   = useState(9);
  const [workers, setWorkers] = useState(initWorkers);
  const [tab, setTab]         = useState("schedule");
  const [weekOffset, setWeekOffset]   = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [showModal, setShowModal]     = useState(false);
  const [editId, setEditId]           = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [sendModal, setSendModal]     = useState(null);
  const [crewFilter, setCrewFilter]   = useState("All");
  const [dayPopup, setDayPopup]       = useState(null);
  const [expandedWorker, setExpandedWorker] = useState(null); // "crew|idx"
  const [monthCrewFilter, setMonthCrewFilter] = useState("All"); // "All" | crew name
  const [leave, setLeave] = useState([]); // [{id, crew, workerName, startDate, endDate, reason}]
  const [leaveNextId, setLeaveNextId] = useState(1);
  const [leaveForm, setLeaveForm] = useState({crew:"Topcon Builders",workerName:"",startDate:"",endDate:"",reason:""});
  const [leaveFilter, setLeaveFilter] = useState("All");
  const [jobListPeriod, setJobListPeriod] = useState("week"); // "week" | "month"
  const [jobListOffset, setJobListOffset] = useState(0);
  // Thread / Activity feed
  const [threads, setThreads] = useState({}); // { jobId: [{id, type, author, text, photoData, photoName, photoCaption, ts}] }
  const [threadNextId, setThreadNextId] = useState(1);
  const [threadModal, setThreadModal] = useState(null); // job object
  const [threadAuthor, setThreadAuthor] = useState("");
  const [threadText, setThreadText] = useState("");
  const [threadPhoto, setThreadPhoto] = useState(null); // {data, name}
  const [threadCaption, setThreadCaption] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPinEntry, setAdminPinEntry] = useState("");
  const [showAdminPin, setShowAdminPin] = useState(false);
  const ADMIN_PIN = "1234"; // change this to your preferred PIN
  const threadPhotoRef = useRef();
  const [modalTab, setModalTab] = useState("details"); // "details" | "thread" | "photos"
  const poPhotoRef = useRef(); // for PO photo capture
  const poInputRef = useRef();
  const photoInputRef = useRef();

  const crewKeys = Object.keys(CREW_STYLE);
  const C = (crew) => CREW_STYLE[crew] || CREW_STYLE["Topcon Builders"];

  // ── Week ──
  const monday    = useMemo(() => addDays(getMonday(new Date()), weekOffset * 7), [weekOffset]);
  const weekDates = useMemo(() => DAYS.map((_,i) => addDays(monday,i)), [monday]);
  const isToday   = (d) => d.toDateString() === new Date().toDateString();
  const visCrews  = crewFilter === "All" ? crewKeys : [crewFilter];

  const weekJobsAll = useMemo(() => {
    const wdks = weekDates.map(d => dateKey(d));
    return jobs.filter(j => jobDates(j).some(dk => wdks.includes(dk)));
  }, [jobs, weekDates]);

  const getWorkerJobOnDate = (crew, workerName, date) => {
    const dk = dateKey(date);
    return jobs.find(j => j.crew === crew && j.workers.includes(workerName) && jobOnDate(j,dk));
  };

  // ── Month ──
  const today = new Date();
  const monthYear = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
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

  const addLeave = () => {
    if (!leaveForm.workerName || !leaveForm.startDate || !leaveForm.endDate) { alert("Please fill in worker, start and end date."); return; }
    if (leaveForm.endDate < leaveForm.startDate) { alert("End date must be on or after start date."); return; }
    setLeave(p => [...p, { id:leaveNextId, ...leaveForm }]);
    setLeaveNextId(p => p+1);
    setLeaveForm(p => ({...p, workerName:"", startDate:"", endDate:"", reason:""}));
  };
  const deleteLeave = (id) => setLeave(p => p.filter(lv => lv.id !== id));

  // ── Modal ──
  const todayStr = () => new Date().toISOString().slice(0,10);
  const openAdd = (prefillDate=null) => {
    const sd = prefillDate ? dateKey(prefillDate) : todayStr();
    setForm({ ...emptyForm, startDate:sd, endDate:sd });
    setEditId(null); setShowModal(true); setDayPopup(null); setModalTab("details");
  };
  const openEdit = (job) => {
    setForm({ crew:job.crew, location:job.location, startDate:job.startDate, endDate:job.endDate, workers:[...job.workers], notes:job.notes, invoiced:job.invoiced||false, poFile:job.poFile||null, poFileName:job.poFileName||"", photos:job.photos||[] });
    setEditId(job.id); setShowModal(true); setModalTab("details");
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

  // ── PO File ──
  const handlePOFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) { alert("Please upload a PDF or Word document (.pdf, .doc, .docx)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, poFile: ev.target.result, poFileName: file.name }));
    reader.readAsDataURL(file);
  };
  const handlePOPhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, poFile: ev.target.result, poFileName: file.name }));
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const openPOFile = (job) => {
    if (!job.poFile) return;
    const a = document.createElement("a"); a.href = job.poFile; a.download = job.poFileName || "purchase_order"; a.click();
  };
  const removePO = () => setForm(p => ({ ...p, poFile: null, poFileName: "" }));
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const imageTypes = ["image/jpeg","image/png","image/gif","image/webp","image/heic","image/heif"];
    const valid = files.filter(f => imageTypes.includes(f.type) || f.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/i));
    if (valid.length !== files.length) alert("Some files were skipped — only images (JPG, PNG, HEIC, etc.) are accepted.");
    valid.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(p => ({ ...p, photos: [...(p.photos||[]), { data: ev.target.result, name: file.name }] }));
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  const removePhoto = (idx) => setForm(p => ({ ...p, photos: p.photos.filter((_,i)=>i!==idx) }));

  // ── Thread / Activity feed ──
  const addThreadEntry = (jobId, type) => {
    if (!threadAuthor.trim()) { alert("Please select your name first."); return; }
    if (type==="note" && !threadText.trim()) { alert("Please write a note first."); return; }
    if (type==="photo" && !threadPhoto) { alert("Please select a photo first."); return; }
    const entry = {
      id: threadNextId,
      type,
      author: threadAuthor.trim(),
      text: threadText.trim(),                              // always saved — can be note or comment on photo
      photoData: type==="photo" ? threadPhoto.data : null,
      photoName: type==="photo" ? threadPhoto.name : "",
      photoCaption: type==="photo" ? threadCaption.trim() : "",
      ts: new Date().toISOString(),
    };
    setThreads(p => ({ ...p, [jobId]: [...(p[jobId]||[]), entry] }));
    setThreadNextId(n => n+1);
    setThreadText(""); setThreadCaption(""); setThreadPhoto(null);
    if (threadPhotoRef.current) threadPhotoRef.current.value = "";
  };
  const deleteThreadEntry = (jobId, entryId) => {
    if (!isAdmin) { alert("Admin access required to delete entries."); return; }
    setThreads(p => ({ ...p, [jobId]: (p[jobId]||[]).filter(e=>e.id!==entryId) }));
  };
  const handleThreadPhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setThreadPhoto({ data: ev.target.result, name: file.name });
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const fmtTs = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}) + " " +
           d.toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
  };
  // Auto-add system entry when a job is saved/created
  const addJobSystemEntry = (job, isNew) => {
    const entry = {
      id: threadNextId,
      type: "system",
      author: "System",
      text: isNew
        ? `Job created. Workers: ${job.workers.join(", ")}. Dates: ${spanLabel(job)}.`
        : `Job updated. Workers: ${job.workers.join(", ")}. Dates: ${spanLabel(job)}.`,
      photoData: null, photoName: "", photoCaption: "",
      ts: new Date().toISOString(),
    };
    setThreads(p => ({ ...p, [job.id]: [...(p[job.id]||[]), entry] }));
    setThreadNextId(n => n+1);
  };

  // ── Workers ──
  const updateWorker = (crew, idx, field, val) => {
    setWorkers(p => {
      const arr = p[crew].map((w,i) => i===idx ? {...w,[field]:val} : w);
      if (field==="name") { const old=p[crew][idx].name; setJobs(js=>js.map(j=>j.crew===crew?{...j,workers:j.workers.map(w=>w===old?val:w)}:j)); }
      return {...p,[crew]:arr};
    });
  };

  // ── Worker add ──
  const addWorker = (crew) => {
    const blank = { name:"New Worker", phone:"", email:"", role:"", address:"", emergency:"", emergencyPhone:"", license:"", notes:"", active:true };
    setWorkers(p => ({ ...p, [crew]: [...(p[crew]||[]), blank] }));
  };
  const toggleWorkerActive = (crew, idx) => {
    setWorkers(p => {
      const w = p[crew][idx];
      const nowStr = new Date().toISOString().slice(0,10);
      const updated = w.active === false
        ? {...w, active:true, deactivatedAt:null}               // reactivating
        : {...w, active:false, deactivatedAt:nowStr};            // deactivating — stamp the date
      const arr = p[crew].map((x,i) => i===idx ? updated : x);
      return {...p, [crew]:arr};
    });
  };

  // Returns workers to show for a given reference date:
  // - active workers always shown
  // - inactive workers shown IF they had any job during the week/month containing refDate
  const getWorkersForPeriod = (crew, periodDates) => {
    const all = workers[crew] || [];
    return all.filter(w => {
      if (w.active !== false) return true;                        // currently active — always show
      // Inactive: show if they had a job during this period
      const periodKeys = new Set(periodDates.map(d => dateKey(d)));
      return jobs.some(j =>
        j.crew === crew &&
        j.workers.includes(w.name) &&
        jobDates(j).some(dk => periodKeys.has(dk))
      );
    });
  };

  // ── Messaging ──
  const buildMessage = (job, workerName) => {
    const sd = new Date(job.startDate), ed = new Date(job.endDate);
    const dateRange = job.startDate===job.endDate ? fmtDate(sd) : `${fmtDate(sd)} – ${fmtDate(ed)}`;
    return `Hi ${workerName},\n\nYou are scheduled for:\n📍 ${job.location}\n📅 ${dateRange}\n👷 Crew: ${job.crew}${job.notes?`\n📝 Note: ${job.notes}`:""}\n\nPlease confirm receipt.`;
  };
  const buildGroupMessage = (job) => {
    const sd = new Date(job.startDate), ed = new Date(job.endDate);
    const dateRange = job.startDate===job.endDate ? fmtDate(sd) : `${fmtDate(sd)} – ${fmtDate(ed)}`;
    const names = job.workers.join(", ");
    return `📋 JOB SCHEDULE — ${job.crew}\n\n📍 ${job.location}\n📅 ${dateRange}\n👷 Workers: ${names}${job.notes?`\n📝 Note: ${job.notes}`:""}\n\nPlease confirm receipt.`;
  };
  const sendSMS = (job,worker) => { if (!worker.phone){alert("Add phone in Contacts tab.");return;} window.open(`sms:${worker.phone}?body=${encodeURIComponent(buildMessage(job,worker.name))}`); };
  const sendEmail = (job,worker) => { if (!worker.email){alert("Add email in Contacts tab.");return;} window.open(`mailto:${worker.email}?subject=${encodeURIComponent(`Job – ${fmtDate(new Date(job.startDate))}`)}&body=${encodeURIComponent(buildMessage(job,worker.name))}`); };
  const copyMsg = (job,worker) => { navigator.clipboard.writeText(buildMessage(job,worker.name)); alert("Copied!"); };
  const copyGroupMsg = (job) => { navigator.clipboard.writeText(buildGroupMessage(job)); alert("Group message copied!"); };
  const sendWhatsApp = (job,worker) => {
    const msg = buildMessage(job,worker.name);
    const phone = worker.phone ? worker.phone.replace(/\D/g,"") : "";
    if (!phone) { alert("Add phone in Contacts tab."); return; }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };
  const sendWhatsAppGroup = (job) => {
    const msg = buildGroupMessage(job);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  const spanLabel = (job) => { const sd=new Date(job.startDate),ed=new Date(job.endDate); return job.startDate===job.endDate ? fmtDate(sd) : `${fmtDate(sd)} – ${fmtDate(ed)}`; };
  const numDays = (job) => Math.round((new Date(job.endDate)-new Date(job.startDate))/86400000)+1;

  const workerKey = (crew,idx) => `${crew}|${idx}`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#F0EDE8",fontFamily:"'DM Sans',sans-serif"}}>

      {/* HEADER */}
      <div style={{background:"#111827",color:"#F9F7F4"}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:20}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,letterSpacing:-0.5}}>Site Planner</div>
              <div style={{fontSize:11,color:"#6B9E7A",letterSpacing:2,marginTop:2}}>CONSTRUCTION SCHEDULER</div>
            </div>
            <button onClick={()=>openAdd()} style={{background:"#22C55E",color:"#fff",border:"none",padding:"10px 22px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>+ New Job</button>
          </div>
          <div style={{display:"flex",gap:2,marginTop:18,flexWrap:"wrap"}}>
            {[["schedule","📅  Weekly Schedule"],["month","🗓️  Month"],["jobs","📊  Job List"],["contacts","📋  Contacts"],["leave","🏖️  Leave"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{background:tab===id?"#F0EDE8":"transparent",color:tab===id?"#111827":"#6B7280",border:"none",padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",borderRadius:"8px 8px 0 0",transition:"all 0.15s"}}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1500,margin:"0 auto",padding:"24px"}}>

        {/* ══════════════ WEEKLY SCHEDULE ══════════════ */}
        {tab==="schedule" && (<>
          {/* ── Toolbar ── */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setWeekOffset(w=>w-1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <div style={{textAlign:"center",minWidth:230}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#111827"}}>{fmtDate(monday)} – {fmtDate(addDays(monday,6))}</div>
                <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{weekOffset===0?"This week":weekOffset===1?"Next week":weekOffset===-1?"Last week":`Week ${weekOffset>0?"+":""}${weekOffset}`}</div>
              </div>
              <button onClick={()=>setWeekOffset(w=>w+1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
              {weekOffset!==0 && <button onClick={()=>setWeekOffset(0)} style={{background:"#111827",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>Today</button>}
            </div>
            <div style={{display:"flex",gap:6,background:"#fff",borderRadius:12,padding:5,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <button onClick={()=>setCrewFilter("All")} style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",background:crewFilter==="All"?"#111827":"transparent",color:crewFilter==="All"?"#fff":"#6B7280",fontWeight:600,fontSize:12}}>Both</button>
              <button onClick={()=>setCrewFilter("Topcon Builders")} style={{display:"flex",alignItems:"center",padding:"6px 12px",borderRadius:8,border:crewFilter==="Topcon Builders"?`2px solid ${CREW_STYLE["Topcon Builders"].color}`:"2px solid transparent",cursor:"pointer",background:crewFilter==="Topcon Builders"?CREW_STYLE["Topcon Builders"].light:"transparent"}}>
                <img src={TOPCON_LOGO} alt="Topcon" style={{height:22,objectFit:"contain"}}/>
              </button>
              <button onClick={()=>setCrewFilter("NQ Stripouts")} style={{display:"flex",alignItems:"center",padding:"6px 12px",borderRadius:8,border:crewFilter==="NQ Stripouts"?`2px solid ${CREW_STYLE["NQ Stripouts"].color}`:"2px solid transparent",cursor:"pointer",background:crewFilter==="NQ Stripouts"?CREW_STYLE["NQ Stripouts"].light:"transparent"}}>
                <img src={NQ_LOGO} alt="NQ" style={{height:22,objectFit:"contain"}}/>
              </button>
            </div>
          </div>

          {/* Past record banner */}
          {weekOffset<0&&(
            <div style={{background:"#1E293B",border:"1.5px solid #334155",borderRadius:10,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:16}}>📋</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9"}}>Viewing historical record</div>
                <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>Workers who had jobs this week are shown even if now inactive, so you have a complete record.</div>
              </div>
            </div>
          )}

          {/* ── Master Planning Grid ── */}
          <div style={{background:"#fff",borderRadius:14,overflow:"auto",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>

            {/* Column headers: WORKER label + Mon–Sun with full date */}
            <div style={{display:"grid",gridTemplateColumns:"160px repeat(7,minmax(140px,1fr))",background:"#1a2235",position:"sticky",top:0,zIndex:10,minWidth:1140}}>
              <div style={{padding:"14px 16px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:1.5}}>WORKER</div>
              {DAYS.map((d,i)=>{
                const fullDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
                const isT=isToday(weekDates[i]);
                const lvCount=(leaveByDate[dateKey(weekDates[i])]||[]).length;
                const isWeekend=i>=5;
                return (
                  <div key={d} style={{padding:"12px 12px 10px",borderLeft:"1px solid rgba(255,255,255,0.08)",background:isT?"rgba(34,197,94,0.18)":isWeekend?"rgba(255,255,255,0.06)":"transparent"}}>
                    <div style={{fontSize:15,fontWeight:900,color:isT?"#22C55E":"#fff",lineHeight:1}}>{fullDays[i]}</div>
                    <div style={{fontSize:12,color:isT?"#86efac":"rgba(255,255,255,0.5)",marginTop:4,fontWeight:500}}>{fmtDate(weekDates[i])}</div>

                  </div>
                );
              })}
            </div>

            {/* Crew sections */}
            {visCrews.map((crew,crewIdx)=>{
              const s=C(crew);
              const activeWorkers = getWorkersForPeriod(crew, weekDates);
              if(activeWorkers.length===0) return null;
              const isPast = weekOffset < 0;
              return (
                <div key={crew} style={{minWidth:1140}}>
                  {/* Crew banner */}
                  <div style={{display:"grid",gridTemplateColumns:"160px 1fr",background:s.color}}>
                    <div style={{padding:"8px 16px",display:"flex",alignItems:"center",gap:8,gridColumn:"1/-1"}}>
                      <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={crew} style={{height:20,objectFit:"contain",filter:"brightness(0) invert(1)",opacity:0.95}}/>
                      <span style={{fontSize:12,fontWeight:900,color:"#fff",letterSpacing:0.5}}>{crew.toUpperCase()}</span>
                      {isPast&&<span style={{fontSize:10,color:"rgba(255,255,255,0.7)",marginLeft:8,fontStyle:"italic"}}>showing workers active this week</span>}
                    </div>
                  </div>

                  {/* Worker rows */}
                  {activeWorkers.map((worker,wi)=>{
                    const isEven=wi%2===0;
                    return (
                      <div key={worker.name} style={{display:"grid",gridTemplateColumns:"160px repeat(7,minmax(140px,1fr))",borderTop:"1px solid #EDEBE8",background:isEven?"#fff":"#F8F8F7",minHeight:90}}>

                        {/* Worker name */}
                        <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderRight:`4px solid ${s.color}`,background:isEven?"#fff":"#F8F8F7"}}>
                          <div style={{width:36,height:36,borderRadius:"50%",background:worker.active===false?"#F3F4F6":s.light,border:`2.5px solid ${worker.active===false?"#9CA3AF":s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:worker.active===false?"#9CA3AF":s.accent,flexShrink:0}}>
                            {worker.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <div style={{fontSize:13,fontWeight:700,color:worker.active===false?"#6B7280":"#111827",lineHeight:1.3}}>{worker.name}</div>
                            {worker.active===false
                              ? <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",marginTop:2,letterSpacing:0.3}}>FORMER WORKER</div>
                              : worker.role&&<div style={{fontSize:10,color:"#9CA3AF",marginTop:2}}>{worker.role}</div>
                            }
                          </div>
                        </div>

                        {/* Day cells */}
                        {weekDates.map((wd,di)=>{
                          const dk=dateKey(wd);
                          const job=getWorkerJobOnDate(crew,worker.name,wd);
                          const isFirst=job&&(dateKey(new Date(job.startDate))===dk||(di===0&&jobOnDate(job,dk)));
                          const isLast=job&&dateKey(new Date(job.endDate))===dk;
                          const isTodayCol=isToday(wd);
                          const isWeekendCol=di>=5;
                          const workerLeave=(leaveByDate[dk]||[]).find(lv=>lv.workerName===worker.name);
                          return (
                            <div key={di} style={{borderLeft:"1px solid #EDEBE8",padding:"5px 5px",background:isTodayCol?"rgba(34,197,94,0.04)":isWeekendCol?"#F5F3F0":"transparent"}}>
                              {/* Leave */}
                              {workerLeave&&!job&&(
                                <div style={{background:"#FFFBEB",border:"2px solid #F59E0B",borderRadius:10,padding:"8px 10px",height:"calc(100% - 10px)",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:3}}>
                                  <div style={{fontSize:13,fontWeight:800,color:"#92400E"}}>🏖️ On Leave</div>
                                  {workerLeave.reason&&<div style={{fontSize:11,color:"#B45309",lineHeight:1.4}}>{workerLeave.reason}</div>}
                                </div>
                              )}
                              {/* Job */}
                              {job&&(
                                <div onClick={()=>openEdit(job)}
                                  style={{
                                    background: isFirst ? s.color : `${s.color}18`,
                                    border:`2.5px solid ${s.color}`,
                                    borderLeft: isFirst ? `2.5px solid ${s.color}` : "none",
                                    borderRight: isLast ? `2.5px solid ${s.color}` : "none",
                                    borderRadius: isFirst&&isLast ? 10 : isFirst ? "10px 0 0 10px" : isLast ? "0 10px 10px 0" : 0,
                                    padding:"8px 10px",
                                    height:"calc(100% - 10px)",
                                    boxSizing:"border-box",
                                    cursor:"pointer",
                                    display:"flex",
                                    flexDirection:"column",
                                    gap:4,
                                    minHeight:60,
                                  }}>
                                  {isFirst?(
                                    <>
                                      {/* Full location — no truncation */}
                                      <div style={{fontSize:12,fontWeight:800,color:isFirst?"#fff":s.accent,lineHeight:1.35}}>{job.location}</div>
                                      {/* Badges only */}
                                      <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",marginTop:"auto"}}>
                                        {job.poFileName&&<span style={{fontSize:10,fontWeight:700,background:"#F59E0B",color:"#fff",borderRadius:5,padding:"1px 6px"}}>PO</span>}
                                        {job.crew==="NQ Stripouts"&&job.invoiced&&<span style={{fontSize:10,fontWeight:700,background:"#16A34A",color:"#fff",borderRadius:5,padding:"1px 6px"}}>✓ INV</span>}
                                        {(job.photos||[]).length>0&&<span style={{fontSize:10,fontWeight:700,background:"rgba(255,255,255,0.25)",color:"#fff",borderRadius:5,padding:"1px 6px"}}>📷{job.photos.length}</span>}
                                      </div>
                                      {/* Send buttons */}
                                      <div style={{display:"flex",gap:3,marginTop:2}}>
                                        <button onClick={e=>{e.stopPropagation();setThreadModal(job);}}
                                          style={{flex:1,background:"rgba(99,102,241,0.35)",color:"#fff",border:"1px solid rgba(99,102,241,0.5)",borderRadius:5,padding:"4px 0",fontSize:9,fontWeight:700,cursor:"pointer"}}>💬{(threads[job.id]||[]).length||""}</button>
                                        <button onClick={e=>{e.stopPropagation();setSendModal({job,worker});}}
                                          style={{flex:1,background:"rgba(255,255,255,0.2)",color:"#fff",border:"1px solid rgba(255,255,255,0.4)",borderRadius:5,padding:"4px 0",fontSize:9,fontWeight:700,cursor:"pointer"}}>SEND</button>
                                        <button onClick={e=>{e.stopPropagation();setSendModal({job,worker:"ALL"});}}
                                          style={{flex:1,background:"rgba(37,211,102,0.3)",color:"#fff",border:"1px solid rgba(37,211,102,0.5)",borderRadius:5,padding:"4px 0",fontSize:9,fontWeight:700,cursor:"pointer"}}>ALL</button>
                                      </div>
                                    </>
                                  ):(
                                    /* Continuation days — show location so readable */
                                    <div style={{fontSize:11,fontWeight:700,color:s.accent,lineHeight:1.3,opacity:0.7}}>
                                      {job.location.split("–")[0].trim()}
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* Empty */}
                              {!job&&!workerLeave&&(
                                <button onClick={()=>{setForm({...emptyForm,crew,startDate:dk,endDate:dk,workers:[worker.name]});setEditId(null);setShowModal(true);}}
                                  style={{width:"100%",height:"100%",minHeight:60,background:"transparent",border:"2px dashed #DEDADA",borderRadius:10,cursor:"pointer",color:"#C4B8AC",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}
                                  onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.color=s.color;e.currentTarget.style.background=s.light;}}
                                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#DEDADA";e.currentTarget.style.color="#C4B8AC";e.currentTarget.style.background="transparent";}}>
                                  +
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {crewIdx<visCrews.length-1&&<div style={{height:8,background:"#EDEBE8"}}/>}
                </div>
              );
            })}
          </div>

        </>)}

        {/* ══════════════ MONTH TAB ══════════════ */}
        {tab==="month" && (<>
          {/* Month nav + crew filter tabs */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setMonthOffset(m=>m-1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#111827",minWidth:200,textAlign:"center"}}>{MONTH_NAMES[monthYear.month]} {monthYear.year}</div>
              <button onClick={()=>setMonthOffset(m=>m+1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
              {monthOffset!==0&&<button onClick={()=>setMonthOffset(0)} style={{background:"#111827",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>This Month</button>}
            </div>
            {/* Crew switcher tabs with logos */}
            <div style={{display:"flex",gap:6,background:"#fff",borderRadius:12,padding:6,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <button onClick={()=>setMonthCrewFilter("All")}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",background:monthCrewFilter==="All"?"#111827":"transparent",color:monthCrewFilter==="All"?"#fff":"#6B7280",fontWeight:600,fontSize:12,transition:"all 0.15s"}}>
                Both Crews
              </button>
              <button onClick={()=>setMonthCrewFilter("Topcon Builders")}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:8,border:monthCrewFilter==="Topcon Builders"?`2px solid ${CREW_STYLE["Topcon Builders"].color}`:"2px solid transparent",cursor:"pointer",background:monthCrewFilter==="Topcon Builders"?CREW_STYLE["Topcon Builders"].light:"transparent",transition:"all 0.15s"}}>
                <img src={TOPCON_LOGO} alt="Topcon" style={{height:24,objectFit:"contain"}}/>
              </button>
              <button onClick={()=>setMonthCrewFilter("NQ Stripouts")}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:8,border:monthCrewFilter==="NQ Stripouts"?`2px solid ${CREW_STYLE["NQ Stripouts"].color}`:"2px solid transparent",cursor:"pointer",background:monthCrewFilter==="NQ Stripouts"?CREW_STYLE["NQ Stripouts"].light:"transparent",transition:"all 0.15s"}}>
                <img src={NQ_LOGO} alt="NQ Stripouts" style={{height:24,objectFit:"contain"}}/>
              </button>
            </div>
          </div>
          {/* Calendar grid — large readable cells, day name at bottom of each cell */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {calendarDays.map((day,idx)=>{
              const dk=dateKey(day);
              const allDayJobs=jobsByDate[dk]||[];
              const dayJobs=monthCrewFilter==="All"?allDayJobs:allDayJobs.filter(j=>j.crew===monthCrewFilter);
              const dayLeave=(leaveByDate[dk]||[]).filter(lv=>monthCrewFilter==="All"||lv.crew===monthCrewFilter);
              const isThisMonth=day.getMonth()===monthYear.month;
              const todayCell=day.toDateString()===new Date().toDateString();
              const hasActivity=dayJobs.length>0||dayLeave.length>0;
              const isWeekendDay=day.getDay()===0||day.getDay()===6;
              return (
                <div key={idx}
                  style={{background:todayCell?"#111827":isWeekendDay&&isThisMonth?"#F5F3F0":isThisMonth?"#fff":"#EDECEA",borderRadius:10,minHeight:160,padding:"8px 8px 6px",boxShadow:todayCell?"0 4px 16px rgba(17,24,39,0.3)":"0 1px 3px rgba(0,0,0,0.05)",border:todayCell?"2.5px solid #22C55E":isThisMonth?"1.5px solid #E5E2DD":"1.5px solid #EDEBE8",display:"flex",flexDirection:"column",gap:4}}>

                  {/* Date number + day name */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:2}}>
                    <div style={{fontSize:20,fontWeight:900,color:todayCell?"#22C55E":isThisMonth?"#111827":"#C4B8AC",lineHeight:1}}>{day.getDate()}</div>
                    {todayCell&&<span style={{fontSize:9,fontWeight:700,color:"#22C55E",background:"rgba(34,197,94,0.15)",borderRadius:4,padding:"1px 5px"}}>TODAY</span>}
                  </div>

                  {/* Job entries — show all, full names */}
                  {dayJobs.map(job=>{
                    const s=C(job.crew);
                    const isStart=dateKey(new Date(job.startDate))===dk;
                    return (
                      <div key={job.id}
                        onClick={()=>setDayPopup({date:day,jobs:dayJobs,leave:dayLeave})}
                        style={{background:isStart?s.color:s.light,border:`1.5px solid ${s.color}`,borderRadius:7,padding:"5px 7px",cursor:"pointer",opacity:isStart?1:0.75}}>
                        <div style={{fontSize:11,fontWeight:800,color:isStart?"#fff":s.accent,lineHeight:1.3}}>{job.location.split("–")[0].trim()}</div>
                        {job.location.includes("–")&&<div style={{fontSize:9,color:isStart?"rgba(255,255,255,0.8)":s.color,marginTop:1}}>{job.location.split("–")[1]?.trim()}</div>}
                        <div style={{display:"flex",gap:3,marginTop:3,flexWrap:"wrap"}}>
                          {job.poFileName&&<span style={{fontSize:9,fontWeight:700,color:"#fff",background:"#F59E0B",borderRadius:4,padding:"0 5px"}}>PO</span>}
                          {job.crew==="NQ Stripouts"&&job.invoiced&&<span style={{fontSize:9,fontWeight:700,color:"#fff",background:"#16A34A",borderRadius:4,padding:"0 5px"}}>✓</span>}
                          {(job.photos||[]).length>0&&<span style={{fontSize:9,fontWeight:700,color:"#fff",background:"rgba(0,0,0,0.3)",borderRadius:4,padding:"0 5px"}}>📷{job.photos.length}</span>}
                        </div>
                      </div>
                    );
                  })}

                  {/* Leave entries */}
                  {dayLeave.map(lv=>(
                    <div key={lv.id} style={{background:"#FFFBEB",border:"1.5px solid #F59E0B",borderRadius:7,padding:"5px 7px"}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#92400E",lineHeight:1.3}}>🏖️ {lv.workerName}</div>
                      {lv.reason&&<div style={{fontSize:9,color:"#B45309",marginTop:1}}>{lv.reason}</div>}
                    </div>
                  ))}
                  {/* Day of week label at bottom */}
                  <div style={{marginTop:"auto",paddingTop:4,borderTop:"1px solid #E5E2DD",fontSize:10,fontWeight:700,color:todayCell?"#22C55E":isThisMonth?"#9CA3AF":"#C4B8AC",letterSpacing:0.5,textAlign:"right"}}>
                    {day.toLocaleDateString("en-AU",{weekday:"long"})}
                  </div>
                </div>
              );
            })}
          </div>

        </>)}

        {/* ══════════════ JOB LIST TAB ══════════════ */}
        {tab==="jobs" && (()=>{
          // Compute period window
          const isWeek = jobListPeriod==="week";
          const periodMonday = isWeek ? addDays(getMonday(new Date()), jobListOffset*7) : null;
          const periodDates  = isWeek ? DAYS.map((_,i)=>addDays(periodMonday,i)) : null;
          const pYear  = isWeek ? null : new Date(new Date().getFullYear(), new Date().getMonth()+jobListOffset, 1).getFullYear();
          const pMonth = isWeek ? null : new Date(new Date().getFullYear(), new Date().getMonth()+jobListOffset, 1).getMonth();

          const periodJobs = isWeek
            ? jobs.filter(j=>{ const wdks=periodDates.map(d=>dateKey(d)); return jobDates(j).some(dk=>wdks.includes(dk)); })
                  .sort((a,b)=>a.startDate.localeCompare(b.startDate))
            : jobs.filter(j=>{ const sd=new Date(j.startDate); return sd.getFullYear()===pYear&&sd.getMonth()===pMonth; })
                  .sort((a,b)=>a.startDate.localeCompare(b.startDate));

          const periodLabel = isWeek
            ? `${fmtDate(periodMonday)} – ${fmtDate(addDays(periodMonday,6))}`
            : `${MONTH_NAMES[pMonth]} ${pYear}`;

          return (
            <div>
              {/* Period switcher */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",gap:4,background:"#fff",borderRadius:10,padding:4,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
                  {[["week","Weekly"],["month","Monthly"]].map(([val,lbl])=>(
                    <button key={val} onClick={()=>{setJobListPeriod(val);setJobListOffset(0);}}
                      style={{padding:"7px 18px",borderRadius:7,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,
                        background:jobListPeriod===val?"#111827":"transparent",
                        color:jobListPeriod===val?"#fff":"#6B7280",transition:"all 0.15s"}}>
                      {lbl}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>setJobListOffset(o=>o-1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#111827",minWidth:220,textAlign:"center"}}>{periodLabel}</div>
                  <button onClick={()=>setJobListOffset(o=>o+1)} style={{background:"#fff",border:"1.5px solid #D1C9BE",borderRadius:8,width:36,height:36,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                  {jobListOffset!==0&&<button onClick={()=>setJobListOffset(0)} style={{background:"#111827",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>Current</button>}
                </div>
                {/* Stats */}
                <div style={{display:"flex",gap:16,alignItems:"center"}}>
                  <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#111827"}}>{periodJobs.length}</div><div style={{fontSize:11,color:"#9CA3AF"}}>total jobs</div></div>
                  {crewKeys.map(crew=>(
                    <div key={crew} style={{textAlign:"center"}}>
                      <div style={{fontSize:22,fontWeight:800,color:C(crew).color}}>{periodJobs.filter(j=>j.crew===crew).length}</div>
                      <div style={{fontSize:11,color:"#9CA3AF",maxWidth:80,lineHeight:1.2}}>{crew}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job list */}
              {periodJobs.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px",color:"#9CA3AF",fontSize:15,background:"#fff",borderRadius:14,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  No jobs scheduled for this {jobListPeriod}.
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {periodJobs.map(job=>{
                    const s=C(job.crew);
                    const sd=new Date(job.startDate), ed=new Date(job.endDate);
                    const days=Math.round((ed-sd)/86400000)+1;
                    return (
                      <div key={job.id}
                        onClick={()=>openEdit(job)}
                        style={{background:"#fff",borderRadius:12,padding:"14px 18px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:`1.5px solid ${s.color}22`,cursor:"pointer",display:"flex",gap:16,alignItems:"flex-start",transition:"box-shadow 0.12s"}}
                        onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 16px ${s.color}33`}
                        onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"}>
                        {/* Crew colour strip */}
                        <div style={{width:4,borderRadius:4,background:s.color,alignSelf:"stretch",flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                            <img src={job.crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={job.crew} style={{height:16,objectFit:"contain",opacity:0.85}}/>
                            <span style={{fontSize:15,fontWeight:800,color:"#111827"}}>{job.location}</span>
                            {job.poFileName&&<span style={{fontSize:10,fontWeight:700,background:"#F59E0B",color:"#fff",borderRadius:5,padding:"1px 7px"}}>PO</span>}
                            {job.crew==="NQ Stripouts"&&job.invoiced&&<span style={{fontSize:10,fontWeight:700,background:"#16A34A",color:"#fff",borderRadius:5,padding:"1px 7px"}}>✓ Invoiced</span>}
                            {(job.photos||[]).length>0&&<span style={{fontSize:10,fontWeight:700,background:"#6366F1",color:"#fff",borderRadius:5,padding:"1px 7px"}}>📷 {job.photos.length} photo{job.photos.length!==1?"s":""}</span>}
                            {(threads[job.id]||[]).length>0&&<span style={{fontSize:10,fontWeight:700,background:"#4338CA",color:"#fff",borderRadius:5,padding:"1px 7px"}}>💬 {threads[job.id].length}</span>}
                          </div>
                          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
                            <div style={{fontSize:12,color:"#6B7280"}}>📅 {spanLabel(job)}{days>1?` (${days} days)`:""}</div>
                            <div style={{fontSize:12,color:"#6B7280"}}>👷 {job.workers.join(", ")}</div>
                            {job.notes&&<div style={{fontSize:12,color:"#6B7280"}}>📝 {job.notes}</div>}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,flexShrink:0}}>
                          <button onClick={e=>{e.stopPropagation();setThreadModal(job);}}
                            style={{padding:"6px 12px",border:"1.5px solid #6366F1",borderRadius:8,background:"#EEF2FF",color:"#4338CA",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                            💬 Thread {(threads[job.id]||[]).length>0?`(${threads[job.id].length})`:""}
                          </button>
                          <button onClick={e=>{e.stopPropagation();setSendModal({job,worker:"ALL"});}}
                            style={{padding:"6px 12px",border:"none",borderRadius:8,background:s.color,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                            Send All
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ══════════════ CONTACTS TAB ══════════════ */}
        {tab==="contacts" && (
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {/* Add Worker buttons */}
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {crewKeys.map(crew=>{
                const s=CREW_STYLE[crew];
                return (
                  <button key={crew} onClick={()=>addWorker(crew)}
                    style={{flex:1,padding:"10px 14px",border:`2px dashed ${s.color}`,borderRadius:10,background:s.light,color:s.accent,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={crew} style={{height:18,objectFit:"contain"}}/>
                    + Add Worker
                  </button>
                );
              })}
            </div>
            {/* All workers unified list */}
            {crewKeys.flatMap(crew=>(workers[crew]||[]).map((worker,idx)=>{
              const s=C(crew);
              return { crew, worker, idx, s };
            })).map(({crew,worker,idx,s})=>{
                      const key=workerKey(crew,idx);
                      const isOpen=expandedWorker===key;
                      const jobCount=jobs.filter(j=>j.crew===crew&&j.workers.includes(worker.name)).length;
                      return (
                        <div key={`${crew}-${idx}`} style={{border:`1.5px solid ${isOpen?s.color:worker.active===false?"#D1D5DB":"#EDE9E4"}`,borderRadius:12,overflow:"hidden",transition:"border-color 0.15s",marginBottom:8}}>
                          {/* Header row */}
                          <div onClick={()=>setExpandedWorker(isOpen?null:key)}
                            style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",background:isOpen?s.light:"#fff"}}>
                            <div style={{width:40,height:40,borderRadius:"50%",background:isOpen?s.color:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:isOpen?"#fff":s.accent,flexShrink:0,transition:"all 0.15s"}}>
                              {worker.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                            </div>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <div style={{fontSize:14,fontWeight:700,color:"#1F2937"}}>{worker.name||"(unnamed)"}</div>
                                <img src={crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={crew} style={{height:16,objectFit:"contain",opacity:0.85}}/>
                              </div>
                              <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>
                                {[worker.active===false?"⚫ Inactive":null,worker.role&&worker.role,worker.phone&&`📱 ${worker.phone}`,`${jobCount} job${jobCount!==1?"s":""}`].filter(Boolean).join("  ·  ")}
                              </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              {/* Active / Inactive toggle */}
                              <div onClick={e=>{e.stopPropagation();toggleWorkerActive(crew,idx);}}
                                style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",userSelect:"none"}}>
                                <div style={{
                                  width:44,height:24,borderRadius:12,
                                  background:worker.active===false?"#D1D5DB":"#22C55E",
                                  position:"relative",transition:"background 0.2s",flexShrink:0,
                                  border:`2px solid ${worker.active===false?"#9CA3AF":"#16A34A"}`
                                }}>
                                  <div style={{
                                    width:16,height:16,borderRadius:"50%",background:"#fff",
                                    position:"absolute",top:2,
                                    left:worker.active===false?2:22,
                                    transition:"left 0.2s",
                                    boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
                                  }}/>
                                </div>
                                <span style={{fontSize:11,fontWeight:700,color:worker.active===false?"#9CA3AF":"#16A34A",whiteSpace:"nowrap"}}>
                                  {worker.active===false?"Inactive":"Active"}
                                </span>
                              </div>
                              <div style={{fontSize:16,color:s.color,transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>›</div>
                            </div>
                          </div>

                          {/* Expanded detail form */}
                          {isOpen&&(
                            <div style={{padding:"16px 20px",borderTop:`1px solid ${s.color}22`,background:"#FAFAF8",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                              {[
                                {label:"Full Name",field:"name",placeholder:"e.g. Adam Clarke"},
                                {label:"Role / Trade",field:"role",placeholder:"e.g. Labourer, Foreman"},
                                {label:"Phone",field:"phone",placeholder:"+61 4xx xxx xxx"},
                                {label:"Email",field:"email",placeholder:"worker@email.com"},
                                {label:"Home Address",field:"address",placeholder:"123 Main St, Suburb QLD 4000",full:true},
                                {label:"License / Ticket No.",field:"license",placeholder:"e.g. White Card, EWP Ticket"},
                                {label:"Emergency Contact Name",field:"emergency",placeholder:"e.g. Jane Clarke (spouse)"},
                                {label:"Emergency Contact Phone",field:"emergencyPhone",placeholder:"+61 4xx xxx xxx"},
                              ].map(({label,field,placeholder,full})=>(
                                <div key={field} style={{gridColumn:full?"1/-1":"auto"}}>
                                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>{label.toUpperCase()}</label>
                                  <input value={worker[field]||""} onChange={e=>updateWorker(crew,idx,field,e.target.value)} placeholder={placeholder}
                                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1F2937",outline:"none",boxSizing:"border-box",background:"#fff"}}
                                    onFocus={e=>e.target.style.borderColor=s.color} onBlur={e=>e.target.style.borderColor="#EDE9E4"}/>
                                </div>
                              ))}
                              {/* Notes full width */}
                              <div style={{gridColumn:"1/-1"}}>
                                <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>NOTES</label>
                                <textarea value={worker.notes||""} onChange={e=>updateWorker(crew,idx,"notes",e.target.value)} placeholder="Any additional notes about this worker..."
                                  rows={2}
                                  style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1F2937",outline:"none",boxSizing:"border-box",resize:"vertical",background:"#fff"}}
                                  onFocus={e=>e.target.style.borderColor=s.color} onBlur={e=>e.target.style.borderColor="#EDE9E4"}/>
                              </div>
                              {/* Upcoming jobs */}
                              {jobCount>0&&(
                                <div style={{gridColumn:"1/-1"}}>
                                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>SCHEDULED JOBS</label>
                                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                    {jobs.filter(j=>j.crew===crew&&j.workers.includes(worker.name)).map(j=>(
                                      <span key={j.id} style={{background:s.light,border:`1px solid ${s.color}`,color:s.accent,fontSize:10,padding:"3px 10px",borderRadius:10,fontWeight:600}}>
                                        {spanLabel(j)} — {j.location.split("–")[0].trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
          </div>
        )}
      </div>

      {/* ════════ DAY POPUP ════════ */}
      {dayPopup&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setDayPopup(null);}}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:500,boxShadow:"0 24px 64px rgba(0,0,0,0.25)",overflow:"hidden",maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
            <div style={{background:"#111827",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>{dayPopup.date.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})}</div>
                <div style={{fontSize:11,color:"#6B9E7A",marginTop:2}}>{dayPopup.jobs.length} job{dayPopup.jobs.length!==1?"s":""}{(dayPopup.leave||[]).length>0?` · ${dayPopup.leave.length} on leave`:""} on this day</div>
              </div>
              <button onClick={()=>setDayPopup(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
              {dayPopup.jobs.map(job=>{
                const s=C(job.crew);
                return (
                  <div key={job.id} style={{border:`1.5px solid ${s.color}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{background:s.color,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{job.location}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {job.crew==="NQ Stripouts"&&(
                          <button onClick={()=>toggleInvoiced(job.id)} style={{background:job.invoiced?"#16A34A":"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                            {job.invoiced?"✓ Invoiced":"Mark Invoiced"}
                          </button>
                        )}
                        <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:700}}>{s.tag}</span>
                      </div>
                    </div>
                    <div style={{padding:"10px 14px",background:s.light}}>
                      <div style={{fontSize:11,color:s.accent,marginBottom:5}}>📅 {spanLabel(job)}{numDays(job)>1?` (${numDays(job)} days)`:""}</div>
                      {job.notes&&<div style={{fontSize:11,color:s.accent,fontStyle:"italic",marginBottom:6}}>📝 {job.notes}</div>}
                      {job.poFileName&&(
                        <button onClick={()=>openPOFile(job)} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:7,padding:"4px 10px",fontSize:11,fontWeight:600,color:"#92400E",cursor:"pointer",marginBottom:8}}>
                          📄 {job.poFileName}
                        </button>
                      )}
                      <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:6}}>WORKERS</div>
                      <div style={{display:"flex",flexDirection:"column",gap:5}}>
                        {job.workers.map(wName=>{
                          const workerData=(workers[job.crew]||[]).find(w=>w.name===wName)||{name:wName,phone:"",email:""};
                          return (
                            <div key={wName} style={{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:8,padding:"7px 10px"}}>
                              <div style={{width:24,height:24,borderRadius:"50%",background:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:s.accent,flexShrink:0}}>
                                {wName.split(" ").map(n=>n[0]).join("").slice(0,2)}
                              </div>
                              <div style={{flex:1,fontSize:12,fontWeight:600,color:"#1F2937"}}>{wName}</div>
                              <button onClick={()=>setSendModal({job,worker:workerData})} style={{background:s.color,color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}}>SEND</button>
                              <button onClick={e=>{e.stopPropagation();setSendModal({job,worker:"ALL"});}} style={{background:"#25D366",color:"#fff",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>ALL</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{padding:"8px 14px",background:"#fff",display:"flex",gap:8}}>
                      <button onClick={()=>{setThreadModal(job);setDayPopup(null);}} style={{flex:1,padding:"8px",border:"1.5px solid #6366F1",borderRadius:8,background:"#EEF2FF",color:"#4338CA",fontSize:12,fontWeight:700,cursor:"pointer"}}>💬 Job Thread ({(threads[job.id]||[]).length})</button>
                      <button onClick={()=>{openEdit(job);setDayPopup(null);}} style={{flex:1,padding:"8px",border:"1.5px solid #D1C9BE",borderRadius:8,background:"#fff",color:"#374151",fontSize:12,fontWeight:600,cursor:"pointer"}}>Edit Job</button>
                      <button onClick={()=>deleteJob(job.id)} style={{padding:"8px 14px",border:"1.5px solid #FCA5A5",borderRadius:8,background:"#FEF2F2",color:"#DC2626",fontSize:12,fontWeight:600,cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>openAdd(dayPopup.date)} style={{padding:"12px",border:"2px dashed #D1C9BE",borderRadius:10,background:"transparent",color:"#9CA3AF",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add job on this day</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ ADD/EDIT JOB MODAL ════════ */}
      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setShowModal(false);}}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:540,boxShadow:"0 24px 64px rgba(0,0,0,0.25)",overflow:"hidden",maxHeight:"93vh",display:"flex",flexDirection:"column"}}>
            {/* Modal header */}
            <div style={{background:C(form.crew).color,padding:"16px 20px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>{editId?"Edit Job":"New Job"}</div>
                <button onClick={()=>setShowModal(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              {/* Tabs — only shown when editing an existing job */}
              {editId&&(
                <div style={{display:"flex",gap:2,marginTop:12}}>
                  {[["details","📋 Details"],["thread","💬 Thread"],["photos","📷 Photos"]].map(([tid,lbl])=>(
                    <button key={tid} onClick={()=>setModalTab(tid)}
                      style={{padding:"6px 14px",borderRadius:"6px 6px 0 0",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                        background:modalTab===tid?"#fff":"rgba(255,255,255,0.15)",
                        color:modalTab===tid?C(form.crew).color:"rgba(255,255,255,0.85)",
                        transition:"all 0.15s"}}>
                      {lbl} {tid==="thread"&&(threads[editId]||[]).length>0?`(${(threads[editId]||[]).length})`:""}
                      {tid==="photos"&&(form.photos||[]).length>0?`(${form.photos.length})`:""}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>

              {/* Crew */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>CREW</label>
                <div style={{display:"flex",gap:8}}>
                  {crewKeys.map(crew=>(
                    <button key={crew} onClick={()=>setForm(p=>({...p,crew,workers:[]}))}
                      style={{flex:1,padding:"9px 8px",border:`2px solid ${form.crew===crew?C(crew).color:"#E5E0D8"}`,borderRadius:8,background:form.crew===crew?C(crew).light:"#fff",color:form.crew===crew?C(crew).accent:"#9CA3AF",fontSize:12,fontWeight:600,cursor:"pointer",lineHeight:1.3}}>
                      {crew}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>JOB DATES</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <div style={{fontSize:11,color:"#9CA3AF",marginBottom:4}}>Start date</div>
                    <input type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value,endDate:p.endDate<e.target.value?e.target.value:p.endDate}))}
                      style={{width:"100%",border:`1.5px solid ${C(form.crew).color}`,borderRadius:8,padding:"9px 10px",fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none",color:"#1F2937",background:C(form.crew).light}}/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:"#9CA3AF",marginBottom:4}}>End date <span style={{color:"#C4B8AC"}}>(same = 1 day)</span></div>
                    <input type="date" value={form.endDate} min={form.startDate} onChange={e=>setForm(p=>({...p,endDate:e.target.value}))}
                      style={{width:"100%",border:`1.5px solid ${C(form.crew).color}`,borderRadius:8,padding:"9px 10px",fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none",color:"#1F2937",background:C(form.crew).light}}/>
                  </div>
                </div>
                {form.startDate&&form.endDate&&(
                  <div style={{fontSize:11,color:C(form.crew).color,marginTop:6,fontWeight:600}}>
                    📅 {form.startDate===form.endDate?`1 day — ${fmtDate(new Date(form.startDate))}`:
                    `${Math.round((new Date(form.endDate)-new Date(form.startDate))/86400000)+1} days — ${fmtDate(new Date(form.startDate))} to ${fmtDate(new Date(form.endDate))}`}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>LOCATION / ADDRESS</label>
                <input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Site Name – 123 Main St"
                  style={{width:"100%",border:"1.5px solid #E5E0D8",borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=C(form.crew).color} onBlur={e=>e.target.style.borderColor="#E5E0D8"}/>
              </div>

              {/* Workers */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>ASSIGN WORKERS <span style={{color:C(form.crew).color}}>({form.workers.length} selected)</span></label>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(workers[form.crew]||[]).filter(w=>w.active!==false).map(w=>{
                    const sel=form.workers.includes(w.name); const s=C(form.crew);
                    return (
                      <button key={w.name} onClick={()=>toggleWorker(w.name)}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",border:`1.5px solid ${sel?s.color:"#E5E0D8"}`,borderRadius:8,background:sel?s.light:"#FAFAF8",cursor:"pointer",textAlign:"left"}}>
                        <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${sel?s.color:"#CCC"}`,background:sel?s.color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {sel&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
                        </div>
                        <span style={{fontSize:13,color:sel?s.accent:"#555",fontWeight:sel?600:400}}>{w.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>NOTES (optional)</label>
                <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="e.g. PPE required, access via loading dock..."
                  style={{width:"100%",border:"1.5px solid #E5E0D8",borderRadius:8,padding:"10px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=C(form.crew).color} onBlur={e=>e.target.style.borderColor="#E5E0D8"}/>
              </div>

              {/* Purchase Order */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>PURCHASE ORDER</label>
                {form.poFileName?(
                  <div style={{background:"#FEF3C7",border:"1.5px solid #F59E0B",borderRadius:10,overflow:"hidden"}}>
                    {/* If PO is an image, show thumbnail */}
                    {form.poFile&&form.poFile.startsWith("data:image")?(
                      <div style={{position:"relative"}}>
                        <img src={form.poFile} alt="PO" style={{width:"100%",maxHeight:180,objectFit:"contain",background:"#FFFBEB",display:"block"}}
                          onClick={()=>window.open(form.poFile,"_blank")}/>
                        <div style={{position:"absolute",top:6,right:6}}>
                          <button onClick={removePO} style={{background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>Remove</button>
                        </div>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
                        <span style={{fontSize:20}}>📄</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#92400E"}}>{form.poFileName}</div>
                          <div style={{fontSize:10,color:"#B45309",marginTop:1}}>Purchase order attached</div>
                        </div>
                        <button onClick={removePO} style={{background:"#fff",border:"1px solid #F59E0B",borderRadius:6,padding:"4px 10px",fontSize:11,color:"#DC2626",cursor:"pointer",fontWeight:600}}>Remove</button>
                      </div>
                    )}
                  </div>
                ):(
                  <div style={{display:"flex",gap:8}}>
                    <div onClick={()=>poInputRef.current?.click()}
                      style={{flex:1,border:"2px dashed #D1C9BE",borderRadius:10,padding:"14px 10px",textAlign:"center",cursor:"pointer",background:"#FAFAF8",transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C(form.crew).color;e.currentTarget.style.background=C(form.crew).light;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="#D1C9BE";e.currentTarget.style.background="#FAFAF8";}}>
                      <div style={{fontSize:22,marginBottom:4}}>📄</div>
                      <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>PDF / Doc</div>
                    </div>
                    <div onClick={()=>poPhotoRef.current?.click()}
                      style={{flex:1,border:"2px dashed #D1C9BE",borderRadius:10,padding:"14px 10px",textAlign:"center",cursor:"pointer",background:"#FAFAF8",transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C(form.crew).color;e.currentTarget.style.background=C(form.crew).light;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="#D1C9BE";e.currentTarget.style.background="#FAFAF8";}}>
                      <div style={{fontSize:22,marginBottom:4}}>📷</div>
                      <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>Photo / Scan</div>
                    </div>
                  </div>
                )}
                <input ref={poInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handlePOFile} style={{display:"none"}}/>
                <input ref={poPhotoRef} type="file" accept="image/*"
                  onChange={handlePOPhoto} style={{display:"none"}} capture="environment"/>
              </div>

              {/* Photos */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>PHOTOS / SITE IMAGES</label>
                {(form.photos||[]).length>0&&(
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                    {(form.photos||[]).map((ph,pi)=>(
                      <div key={pi} style={{position:"relative",width:80,height:80,borderRadius:8,overflow:"hidden",border:"1.5px solid #D1C9BE"}}>
                        <img src={ph.data} alt={ph.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <button onClick={()=>removePhoto(pi)}
                          style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                          ✕
                        </button>
                      </div>
                    ))}
                    <div onClick={()=>photoInputRef.current?.click()}
                      style={{width:80,height:80,borderRadius:8,border:"2px dashed #D1C9BE",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#FAFAF8",gap:2}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C(form.crew).color;e.currentTarget.style.background=C(form.crew).light;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="#D1C9BE";e.currentTarget.style.background="#FAFAF8";}}>
                      <span style={{fontSize:20}}>+</span>
                      <span style={{fontSize:9,color:"#9CA3AF"}}>Add</span>
                    </div>
                  </div>
                )}
                {(form.photos||[]).length===0&&(
                  <div onClick={()=>photoInputRef.current?.click()}
                    style={{border:"2px dashed #D1C9BE",borderRadius:10,padding:"18px",textAlign:"center",cursor:"pointer",background:"#FAFAF8",transition:"all 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C(form.crew).color;e.currentTarget.style.background=C(form.crew).light;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#D1C9BE";e.currentTarget.style.background="#FAFAF8";}}>
                    <div style={{fontSize:28,marginBottom:6}}>📷</div>
                    <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Tap to add site photos</div>
                    <div style={{fontSize:11,color:"#9CA3AF",marginTop:3}}>JPG, PNG, HEIC — multiple allowed</div>
                  </div>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" multiple
                  onChange={handlePhotos} style={{display:"none"}} capture="environment"/>
              </div>

              {/* Invoice — NQ only */}
              {form.crew==="NQ Stripouts"&&(
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:8}}>INVOICING</label>
                  <button onClick={()=>setForm(p=>({...p,invoiced:!p.invoiced}))}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:`2px solid ${form.invoiced?"#16A34A":"#E5E0D8"}`,borderRadius:10,background:form.invoiced?"#F0FDF4":"#FAFAF8",cursor:"pointer",width:"100%",textAlign:"left"}}>
                    <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${form.invoiced?"#16A34A":"#D1C9BE"}`,background:form.invoiced?"#16A34A":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                      {form.invoiced&&<span style={{color:"#fff",fontSize:13,fontWeight:700}}>✓</span>}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:form.invoiced?"#15803D":"#374151"}}>Job Invoiced</div>
                      <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>Tick when invoice has been sent to client</div>
                    </div>
                  </button>
                </div>
              )}

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"11px",border:"1.5px solid #E5E0D8",borderRadius:8,background:"#fff",color:"#9CA3AF",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                {editId&&<button onClick={()=>deleteJob(editId)} style={{padding:"11px 16px",border:"1.5px solid #FCA5A5",borderRadius:8,background:"#FEF2F2",color:"#DC2626",fontSize:13,fontWeight:600,cursor:"pointer"}}>Delete</button>}
                <button onClick={saveJob} style={{flex:1,padding:"11px",border:"none",borderRadius:8,background:C(form.crew).color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{editId?"Save Changes":"Add Job"}</button>
              </div>
              </div>
            ) : null}

            {/* ── THREAD TAB ── */}
            {editId&&modalTab==="thread"&&(()=>{
              const job=jobs.find(j=>j.id===editId);
              if(!job) return null;
              const s=C(job.crew);
              const allWorkers=[...(workers[job.crew]||[]).map(w=>w.name),...crewKeys.filter(c=>c!==job.crew).flatMap(c=>(workers[c]||[]).map(w=>w.name))];
              const entries=[...(threads[editId]||[])].sort((a,b)=>a.ts.localeCompare(b.ts));
              const grouped=entries.reduce((acc,e)=>{const day=e.ts.slice(0,10);if(!acc[day])acc[day]=[];acc[day].push(e);return acc;},{});
              const sortedDays=Object.keys(grouped).sort();
              return (
                <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
                  {/* Feed */}
                  <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4}}>
                    {sortedDays.length===0?(
                      <div style={{textAlign:"center",padding:"40px 20px",color:"#9CA3AF",fontSize:13}}>
                        <div style={{fontSize:32,marginBottom:8}}>💬</div>
                        No entries yet.
                      </div>
                    ):sortedDays.map(day=>{
                      const dayLabel=new Date(day+"T12:00:00").toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
                      return (
                        <div key={day}>
                          <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 0 8px"}}>
                            <div style={{flex:1,height:1,background:"#D1C9BE"}}/>
                            <span style={{fontSize:11,fontWeight:700,color:"#9CA3AF",whiteSpace:"nowrap"}}>{dayLabel}</span>
                            <div style={{flex:1,height:1,background:"#D1C9BE"}}/>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {grouped[day].map(entry=>{
                              const isSystem=entry.type==="system";
                              const isPhoto=entry.type==="photo";
                              const timeStr=new Date(entry.ts).toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
                              return (
                                <div key={entry.id} style={{background:isSystem?"transparent":"#fff",borderRadius:12,padding:isSystem?"6px 12px":"12px 14px",border:isSystem?"1px dashed #D1C9BE":"1px solid #E5E2DD"}}>
                                  {isSystem&&<div style={{fontSize:11,color:"#9CA3AF",textAlign:"center"}}>⚙️ {entry.text} · {timeStr}</div>}
                                  {!isSystem&&(
                                    <>
                                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                                          <div style={{width:32,height:32,borderRadius:"50%",background:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:s.accent,flexShrink:0}}>
                                            {entry.author.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                                          </div>
                                          <div>
                                            <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{entry.author}</div>
                                            <div style={{fontSize:10,color:"#9CA3AF"}}>{timeStr} · {isPhoto?"📷 Photo":"📝 Note"}</div>
                                          </div>
                                        </div>
                                        {isAdmin&&<button onClick={()=>deleteThreadEntry(editId,entry.id)} style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:700,color:"#DC2626",cursor:"pointer"}}>Delete</button>}
                                      </div>
                                      {isPhoto&&entry.photoData&&(
                                        <img src={entry.photoData} alt="" style={{width:"100%",maxHeight:220,objectFit:"cover",borderRadius:10,cursor:"pointer",border:"1px solid #E5E2DD",display:"block",marginBottom:6}} onClick={()=>window.open(entry.photoData,"_blank")}/>
                                      )}
                                      {isPhoto&&entry.photoCaption&&<div style={{fontSize:12,color:"#374151",fontStyle:"italic",background:"#F8F6F3",borderRadius:7,padding:"5px 9px",marginBottom:entry.text?6:0}}>{entry.photoCaption}</div>}
                                      {entry.text&&<div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{entry.text}</div>}
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Compose */}
                  <div style={{background:"#fff",borderTop:"1px solid #E5E2DD",padding:"12px 14px",flexShrink:0}}>
                    <select value={threadAuthor} onChange={e=>setThreadAuthor(e.target.value)}
                      style={{width:"100%",border:`1.5px solid ${threadAuthor?s.color:"#E5E2DD"}`,borderRadius:8,padding:"8px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:threadAuthor?"#111827":"#9CA3AF",outline:"none",background:"#fff",marginBottom:8}}>
                      <option value="">Select your name…</option>
                      {job.workers.length>0&&<optgroup label="On this job">{job.workers.map(n=>(<option key={n} value={n}>{n}</option>))}</optgroup>}
                      {allWorkers.filter(n=>!job.workers.includes(n)).length>0&&<optgroup label="Other workers">{allWorkers.filter(n=>!job.workers.includes(n)).map(n=>(<option key={n} value={n}>{n}</option>))}</optgroup>}
                    </select>
                    {threadPhoto&&(
                      <div style={{position:"relative",marginBottom:8,borderRadius:8,overflow:"hidden",border:"1.5px solid #D1C9BE"}}>
                        <img src={threadPhoto.data} alt="" style={{width:"100%",maxHeight:120,objectFit:"cover",display:"block"}}/>
                        <button onClick={()=>{setThreadPhoto(null);setThreadCaption("");}} style={{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    )}
                    {threadPhoto&&<textarea value={threadCaption} onChange={e=>setThreadCaption(e.target.value)} placeholder="Caption… (optional)" rows={2} style={{width:"100%",border:"1.5px solid #E5E2DD",borderRadius:8,padding:"8px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",boxSizing:"border-box",outline:"none",marginBottom:6}}/>}
                    <textarea value={threadText} onChange={e=>setThreadText(e.target.value)} placeholder={threadPhoto?"Add a note on this photo…":"Write a note about this job…"} rows={2} style={{width:"100%",border:"1.5px solid #E5E2DD",borderRadius:8,padding:"8px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",boxSizing:"border-box",outline:"none",marginBottom:8}}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>threadPhotoRef.current?.click()} style={{padding:"9px 14px",border:`1.5px solid ${s.color}`,borderRadius:8,background:s.light,color:s.accent,fontSize:12,fontWeight:700,cursor:"pointer"}}>📷 {threadPhoto?"Change":"Add Photo"}</button>
                      <button onClick={()=>addThreadEntry(editId,threadPhoto?"photo":"note")} style={{flex:1,padding:"9px",border:"none",borderRadius:8,background:s.color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{threadPhoto?"Post Photo":"Post Note"}</button>
                    </div>
                    <input ref={threadPhotoRef} type="file" accept="image/*" onChange={handleThreadPhoto} style={{display:"none"}} capture="environment"/>
                  </div>
                </div>
              );
            })()}

            {/* ── PHOTOS TAB ── */}
            {editId&&modalTab==="photos" ? (
              <div style={{padding:"16px",overflowY:"auto",flex:1}}>
                {/* Job photos from form */}
                {(form.photos||[]).length===0&&(threads[editId]||[]).filter(e=>e.photoData).length===0?(
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#9CA3AF",fontSize:13}}>
                    <div style={{fontSize:40,marginBottom:8}}>📷</div>
                    No site photos yet.
                  </div>
                ):(
                  <>
                    {/* Job-level photos */}
                    {(form.photos||[]).length>0&&(
                      <div style={{marginBottom:16}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:10}}>JOB PHOTOS</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                          {(form.photos||[]).map((ph,pi)=>(
                            <div key={pi} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",border:"1.5px solid #D1C9BE"}}>
                              <img src={ph.data} alt={ph.name} style={{width:"100%",height:"100%",objectFit:"cover",cursor:"pointer"}} onClick={()=>window.open(ph.data,"_blank")}/>
                              <button onClick={()=>removePhoto(pi)} style={{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                            </div>
                          ))}
                          <div onClick={()=>photoInputRef.current?.click()} style={{aspectRatio:"1",borderRadius:10,border:"2px dashed #D1C9BE",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#FAFAF8",gap:4}}>
                            <span style={{fontSize:24}}>+</span>
                            <span style={{fontSize:10,color:"#9CA3AF"}}>Add</span>
                          </div>
                        </div>
                        <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotos} style={{display:"none"}} capture="environment"/>
                      </div>
                    )}
                    {(form.photos||[]).length===0&&(
                      <div>
                        <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:8}}>JOB PHOTOS</div>
                        <div onClick={()=>photoInputRef.current?.click()} style={{border:"2px dashed #D1C9BE",borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer",background:"#FAFAF8",marginBottom:16}}>
                          <div style={{fontSize:28,marginBottom:6}}>📷</div>
                          <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>Tap to add site photos</div>
                          <div style={{fontSize:11,color:"#9CA3AF",marginTop:3}}>Camera or library — multiple allowed</div>
                        </div>
                        <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotos} style={{display:"none"}} capture="environment"/>
                      </div>
                    )}
                    {/* Thread photos */}
                    {(threads[editId]||[]).filter(e=>e.photoData).length>0&&(
                      <div>
                        <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:10}}>THREAD PHOTOS</div>
                        <div style={{display:"flex",flexDirection:"column",gap:12}}>
                          {[...(threads[editId]||[])].filter(e=>e.photoData).sort((a,b)=>a.ts.localeCompare(b.ts)).map(entry=>{
                            const s=C((jobs.find(j=>j.id===editId)||{}).crew||"Topcon Builders");
                            return (
                              <div key={entry.id} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid #E5E2DD"}}>
                                <img src={entry.photoData} alt="" style={{width:"100%",maxHeight:200,objectFit:"cover",display:"block",cursor:"pointer"}} onClick={()=>window.open(entry.photoData,"_blank")}/>
                                <div style={{padding:"10px 12px"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                                    <div style={{width:24,height:24,borderRadius:"50%",background:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:s.accent}}>
                                      {entry.author.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                                    </div>
                                    <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{entry.author}</span>
                                    <span style={{fontSize:10,color:"#9CA3AF",marginLeft:"auto"}}>{new Date(entry.ts).toLocaleDateString("en-AU",{day:"numeric",month:"short"})} {new Date(entry.ts).toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"})}</span>
                                  </div>
                                  {entry.photoCaption&&<div style={{fontSize:12,color:"#374151",fontStyle:"italic"}}>{entry.photoCaption}</div>}
                                  {entry.text&&<div style={{fontSize:12,color:"#6B7280",marginTop:3}}>{entry.text}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : null}

            </div>
            </div>
          </div>
        </div>
      )}

        {/* ══════════════ LEAVE TAB ══════════════ */}
        {tab==="leave" && (
          <div>
            {/* Add Leave Form */}
            <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",marginBottom:20}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#111827",marginBottom:16}}>📝 Add Leave / Day Off</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {/* Crew */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>CREW</label>
                  <div style={{display:"flex",gap:6}}>
                    {["Topcon Builders","NQ Stripouts"].map(cr=>(
                      <button key={cr} onClick={()=>setLeaveForm(p=>({...p,crew:cr,workerName:""}))}
                        style={{flex:1,padding:"7px 0",border:`1.5px solid ${leaveForm.crew===cr?CREW_STYLE[cr].color:"#EDE9E4"}`,borderRadius:8,background:leaveForm.crew===cr?CREW_STYLE[cr].light:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                        <img src={cr==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={cr} style={{height:18,objectFit:"contain"}}/>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Worker */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>WORKER</label>
                  <select value={leaveForm.workerName} onChange={e=>setLeaveForm(p=>({...p,workerName:e.target.value}))}
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1F2937",outline:"none",background:"#fff"}}>
                    <option value="">Select worker…</option>
                    {(workers[leaveForm.crew]||[]).filter(w=>w.active!==false).map(w=>(<option key={w.name} value={w.name}>{w.name}</option>))}
                  </select>
                </div>
                {/* Start Date */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>START DATE</label>
                  <input type="date" value={leaveForm.startDate} onChange={e=>setLeaveForm(p=>({...p,startDate:e.target.value,endDate:p.endDate||e.target.value}))}
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1F2937",outline:"none",boxSizing:"border-box"}}/>
                </div>
                {/* End Date */}
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>END DATE</label>
                  <input type="date" value={leaveForm.endDate} min={leaveForm.startDate} onChange={e=>setLeaveForm(p=>({...p,endDate:e.target.value}))}
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1F2937",outline:"none",boxSizing:"border-box"}}/>
                </div>
                {/* Reason */}
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>REASON (optional)</label>
                  <input type="text" value={leaveForm.reason} onChange={e=>setLeaveForm(p=>({...p,reason:e.target.value}))} placeholder="e.g. Annual leave, Sick day, Public holiday..."
                    style={{width:"100%",border:"1.5px solid #EDE9E4",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1F2937",outline:"none",boxSizing:"border-box"}}/>
                </div>
              </div>
              <button onClick={addLeave}
                style={{marginTop:14,padding:"11px 28px",border:"none",borderRadius:9,background:"#F59E0B",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>
                + Add Leave
              </button>
            </div>

            {/* Filter */}
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {["All",...Object.keys(CREW_STYLE)].map(f=>(
                <button key={f} onClick={()=>setLeaveFilter(f)}
                  style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${leaveFilter===f?(f==="All"?"#111827":CREW_STYLE[f]?.color):"#EDE9E4"}`,background:leaveFilter===f?(f==="All"?"#111827":CREW_STYLE[f]?.light):"#fff",color:leaveFilter===f?(f==="All"?"#fff":CREW_STYLE[f]?.accent):"#6B7280",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {f==="All"?"All Crews":f}
                </button>
              ))}
            </div>

            {/* Leave list */}
            {leave.length===0?(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#9CA3AF",fontSize:14}}>
                No leave recorded yet. Add a day off above.
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {leave
                  .filter(lv=>leaveFilter==="All"||lv.crew===leaveFilter)
                  .sort((a,b)=>a.startDate.localeCompare(b.startDate))
                  .map(lv=>{
                    const s=C(lv.crew);
                    const sd=new Date(lv.startDate), ed=new Date(lv.endDate);
                    const days=Math.round((ed-sd)/86400000)+1;
                    const dateStr=lv.startDate===lv.endDate?fmtDate(sd):`${fmtDate(sd)} – ${fmtDate(ed)}`;
                    return (
                      <div key={lv.id} style={{background:"#fff",borderRadius:12,padding:"14px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1.5px solid #EDE9E4",display:"flex",alignItems:"center",gap:12}}>
                        <div style={{fontSize:24}}>🏖️</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{fontSize:14,fontWeight:700,color:"#1F2937"}}>{lv.workerName}</div>
                            <img src={lv.crew==="Topcon Builders"?TOPCON_LOGO:NQ_LOGO} alt={lv.crew} style={{height:14,objectFit:"contain",opacity:0.8}}/>
                          </div>
                          <div style={{fontSize:12,color:"#6B7280",marginTop:2}}>{dateStr} · {days} day{days!==1?"s":""}{lv.reason?` · ${lv.reason}`:""}</div>
                        </div>
                        <button onClick={()=>deleteLeave(lv.id)}
                          style={{padding:"5px 10px",border:"1.5px solid #FCA5A5",borderRadius:7,background:"#FEF2F2",color:"#DC2626",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                          Remove
                        </button>
                      </div>
                    );
                  })
                }
              </div>
            )}
          </div>
        )}

      {/* ════════ THREAD MODAL ════════ */}
      {threadModal&&(()=>{
        const job=threadModal;
        const s=C(job.crew);
        // All workers across both crews for the dropdown
        const allWorkers = [
          ...(workers[job.crew]||[]).map(w=>w.name),
          ...(crewKeys.filter(c=>c!==job.crew).flatMap(c=>(workers[c]||[]).map(w=>w.name)))
        ];
        // Sort entries by date ascending (oldest first = day order)
        const entries=[...(threads[job.id]||[])].sort((a,b)=>a.ts.localeCompare(b.ts));

        // Group entries by date for day-order display
        const grouped = entries.reduce((acc,e)=>{
          const day = e.ts.slice(0,10);
          if(!acc[day]) acc[day]=[];
          acc[day].push(e);
          return acc;
        },{});
        const sortedDays = Object.keys(grouped).sort();

        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}}
            onClick={e=>{if(e.target===e.currentTarget)setThreadModal(null);}}>
            <div style={{background:"#F4F3F0",borderRadius:18,width:"100%",maxWidth:580,maxHeight:"92vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 28px 80px rgba(0,0,0,0.3)"}}>

              {/* ── Header ── */}
              <div style={{background:s.color,padding:"16px 20px",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:900,color:"#fff",lineHeight:1.2}}>{job.location}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:4}}>
                      📅 {spanLabel(job)}{numDays(job)>1?` · ${numDays(job)} days`:""}
                    </div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>
                      👷 {job.workers.join(", ")}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <button onClick={()=>setShowAdminPin(p=>!p)}
                      style={{background:isAdmin?"#22C55E":"rgba(255,255,255,0.15)",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}}>
                      {isAdmin?"🔓 Admin":"🔒 Admin"}
                    </button>
                    <button onClick={()=>setThreadModal(null)}
                      style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                </div>
                {showAdminPin&&!isAdmin&&(
                  <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}>
                    <input type="password" value={adminPinEntry} onChange={e=>setAdminPinEntry(e.target.value)}
                      placeholder="Enter admin PIN"
                      style={{flex:1,padding:"8px 12px",borderRadius:8,border:"none",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}
                      onKeyDown={e=>{if(e.key==="Enter"){if(adminPinEntry===ADMIN_PIN){setIsAdmin(true);setShowAdminPin(false);setAdminPinEntry("");}else alert("Incorrect PIN");}}}/>
                    <button onClick={()=>{
                      if(adminPinEntry===ADMIN_PIN){setIsAdmin(true);setShowAdminPin(false);setAdminPinEntry("");}
                      else alert("Incorrect PIN");
                    }} style={{padding:"8px 16px",background:"#22C55E",border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Unlock</button>
                  </div>
                )}
                {isAdmin&&<div style={{marginTop:6,fontSize:11,color:"rgba(255,255,255,0.85)"}}>🔓 Admin — tap Delete on any entry to remove it</div>}
              </div>

              {/* ── Thread feed grouped by day ── */}
              <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:4}}>
                {sortedDays.length===0?(
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#9CA3AF",fontSize:13}}>
                    <div style={{fontSize:32,marginBottom:8}}>💬</div>
                    No entries yet — add the first note or photo below.
                  </div>
                ):sortedDays.map(day=>{
                  const dayEntries=grouped[day];
                  const dayLabel=new Date(day+"T12:00:00").toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
                  return (
                    <div key={day}>
                      {/* Day divider */}
                      <div style={{display:"flex",alignItems:"center",gap:10,margin:"10px 0 8px"}}>
                        <div style={{flex:1,height:1,background:"#D1C9BE"}}/>
                        <span style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:0.5,whiteSpace:"nowrap"}}>{dayLabel}</span>
                        <div style={{flex:1,height:1,background:"#D1C9BE"}}/>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {dayEntries.map(entry=>{
                          const isSystem=entry.type==="system";
                          const isPhoto=entry.type==="photo";
                          const timeStr=new Date(entry.ts).toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
                          return (
                            <div key={entry.id} style={{
                              background:isSystem?"transparent":"#fff",
                              borderRadius:12,
                              padding:isSystem?"6px 12px":"12px 14px",
                              border:isSystem?"1px dashed #D1C9BE":"1px solid #E5E2DD",
                            }}>
                              {isSystem&&(
                                <div style={{fontSize:11,color:"#9CA3AF",textAlign:"center"}}>
                                  ⚙️ {entry.text} <span style={{fontSize:10,color:"#C4B8AC"}}>· {timeStr}</span>
                                </div>
                              )}
                              {!isSystem&&(
                                <>
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                                      <div style={{width:32,height:32,borderRadius:"50%",background:s.light,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:s.accent,flexShrink:0}}>
                                        {entry.author.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                                      </div>
                                      <div>
                                        <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{entry.author}</div>
                                        <div style={{fontSize:10,color:"#9CA3AF"}}>{timeStr} · {isPhoto?"📷 Photo":"📝 Note"}</div>
                                      </div>
                                    </div>
                                    {isAdmin&&(
                                      <button onClick={()=>deleteThreadEntry(job.id,entry.id)}
                                        style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:700,color:"#DC2626",cursor:"pointer",flexShrink:0}}>
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                  {/* Photo first, then caption/note below */}
                                  {isPhoto&&entry.photoData&&(
                                    <div style={{marginBottom:entry.text||entry.photoCaption?8:0}}>
                                      <img src={entry.photoData} alt={entry.photoName}
                                        style={{width:"100%",maxHeight:260,objectFit:"cover",borderRadius:10,cursor:"pointer",border:"1px solid #E5E2DD",display:"block"}}
                                        onClick={()=>window.open(entry.photoData,"_blank")}/>
                                    </div>
                                  )}
                                  {/* Caption under photo */}
                                  {isPhoto&&entry.photoCaption&&(
                                    <div style={{fontSize:12,color:"#374151",lineHeight:1.5,fontStyle:"italic",background:"#F8F6F3",borderRadius:7,padding:"6px 10px",marginBottom:entry.text?6:0}}>
                                      {entry.photoCaption}
                                    </div>
                                  )}
                                  {/* Note text (on photo entries this is the additional comment) */}
                                  {entry.text&&(
                                    <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{entry.text}</div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Compose area ── */}
              <div style={{background:"#fff",borderTop:"1px solid #E5E2DD",padding:"14px 16px",flexShrink:0}}>

                {/* Who is posting — dropdown of workers */}
                <div style={{marginBottom:10}}>
                  <label style={{fontSize:10,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:5}}>POSTING AS</label>
                  <select value={threadAuthor} onChange={e=>setThreadAuthor(e.target.value)}
                    style={{width:"100%",border:`1.5px solid ${threadAuthor?s.color:"#E5E2DD"}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:threadAuthor?"#111827":"#9CA3AF",outline:"none",background:"#fff",appearance:"auto"}}>
                    <option value="">Select your name…</option>
                    {job.workers.length>0&&<optgroup label="On this job">{job.workers.map(n=>(<option key={n} value={n}>{n}</option>))}</optgroup>}
                    {allWorkers.filter(n=>!job.workers.includes(n)).length>0&&(
                      <optgroup label="Other workers">{allWorkers.filter(n=>!job.workers.includes(n)).map(n=>(<option key={n} value={n}>{n}</option>))}</optgroup>
                    )}
                  </select>
                </div>

                {/* Photo preview */}
                {threadPhoto&&(
                  <div style={{position:"relative",marginBottom:10,borderRadius:10,overflow:"hidden",border:"1.5px solid #D1C9BE"}}>
                    <img src={threadPhoto.data} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover",display:"block"}}/>
                    <button onClick={()=>{setThreadPhoto(null);setThreadCaption("");}}
                      style={{position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✕</button>
                  </div>
                )}

                {/* Caption (if photo attached) */}
                {threadPhoto&&(
                  <textarea value={threadCaption} onChange={e=>setThreadCaption(e.target.value)}
                    placeholder="Caption for this photo… (optional)"
                    rows={2}
                    style={{width:"100%",border:"1.5px solid #E5E2DD",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",boxSizing:"border-box",outline:"none",marginBottom:8}}
                    onFocus={e=>e.target.style.borderColor=s.color} onBlur={e=>e.target.style.borderColor="#E5E2DD"}/>
                )}

                {/* Note / comment text */}
                <textarea value={threadText} onChange={e=>setThreadText(e.target.value)}
                  placeholder={threadPhoto?"Add a note or comment on this photo… (optional)":"Write a note about this job…"}
                  rows={threadPhoto?2:3}
                  style={{width:"100%",border:"1.5px solid #E5E2DD",borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",boxSizing:"border-box",outline:"none",marginBottom:10}}
                  onFocus={e=>e.target.style.borderColor=s.color} onBlur={e=>e.target.style.borderColor="#E5E2DD"}/>

                {/* Buttons */}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>threadPhotoRef.current?.click()}
                    style={{padding:"10px 16px",border:`1.5px solid ${s.color}`,borderRadius:9,background:s.light,color:s.accent,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    📷 {threadPhoto?"Change":"Add Photo"}
                  </button>
                  <button onClick={()=>addThreadEntry(job.id, threadPhoto?"photo":"note")}
                    style={{flex:1,padding:"10px",border:"none",borderRadius:9,background:s.color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    {threadPhoto?"Post Photo + Note":"Post Note"}
                  </button>
                </div>
                <input ref={threadPhotoRef} type="file" accept="image/*" onChange={handleThreadPhoto}
                  style={{display:"none"}} capture="environment"/>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════ SEND MODAL ════════ */}
      {sendModal&&(()=>{
        const {job,worker}=sendModal; const s=C(job.crew);
        const isBulk=worker==="ALL";
        const msg = isBulk ? buildGroupMessage(job) : buildMessage(job,worker.name);
        const title = isBulk ? `Send to All ${job.workers.length} Workers` : `Send to ${worker.name}`;
        const subtitle = isBulk ? `${job.workers.join(", ")}` : `${spanLabel(job)} — ${job.location}`;
        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}}
            onClick={e=>{if(e.target===e.currentTarget)setSendModal(null);}}>
            <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:440,boxShadow:"0 24px 64px rgba(0,0,0,0.25)",overflow:"hidden",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
              <div style={{background:s.color,padding:"16px 20px"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>{title}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>{subtitle}</div>
              </div>
              <div style={{padding:"18px 20px",overflowY:"auto"}}>
                <div style={{background:"#F8F6F3",borderRadius:10,padding:"12px 14px",fontSize:12,color:"#374151",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:16,border:"1.5px solid #EDE9E4"}}>{msg}</div>

                {isBulk ? (
                  /* ── Group / Bulk send ── */
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:4}}>SEND GROUP MESSAGE</div>
                    <button onClick={()=>sendWhatsAppGroup(job)}
                      style={{padding:"12px",border:"none",borderRadius:9,background:"#25D366",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                      <span style={{fontSize:16}}>💬</span> Open in WhatsApp — Share with Group
                    </button>
                    <button onClick={()=>copyGroupMsg(job)}
                      style={{padding:"12px",border:"1.5px solid #D1C9BE",borderRadius:9,background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      📋 Copy Group Message
                    </button>
                    <div style={{background:"#FEF9E7",border:"1px solid #F59E0B",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#92400E",lineHeight:1.5}}>
                      💡 <strong>WhatsApp Group tip:</strong> Tap "Open in WhatsApp" → choose your crew group chat → send. The message includes all worker names and job details.
                    </div>
                    <div style={{marginTop:4}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:6}}>OR SEND INDIVIDUALLY</div>
                      {job.workers.map(wName=>{
                        const wd=(workers[job.crew]||[]).find(w=>w.name===wName)||{name:wName,phone:"",email:""};
                        return (
                          <div key={wName} style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                            <div style={{flex:1,fontSize:12,fontWeight:600,color:"#374151"}}>{wName}</div>
                            <button onClick={()=>sendWhatsApp(job,wd)}
                              style={{padding:"5px 10px",border:"none",borderRadius:6,background:"#25D366",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>WhatsApp</button>
                            <button onClick={()=>sendSMS(job,wd)}
                              style={{padding:"5px 10px",border:"none",borderRadius:6,background:"#22C55E",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>SMS</button>
                            <button onClick={()=>sendEmail(job,wd)}
                              style={{padding:"5px 10px",border:"none",borderRadius:6,background:"#3B82F6",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>Email</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ── Individual send ── */
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <button onClick={()=>sendWhatsApp(job,worker)}
                      style={{padding:"12px",border:"none",borderRadius:9,background:"#25D366",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      💬 WhatsApp {worker.phone?`— ${worker.phone}`:"(add phone in Contacts)"}
                    </button>
                    <button onClick={()=>sendSMS(job,worker)}
                      style={{padding:"12px",border:"none",borderRadius:9,background:"#22C55E",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      📱 SMS {worker.phone?`— ${worker.phone}`:"(add phone in Contacts)"}
                    </button>
                    <button onClick={()=>sendEmail(job,worker)}
                      style={{padding:"12px",border:"none",borderRadius:9,background:"#3B82F6",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      ✉️ Email {worker.email?`— ${worker.email}`:"(add email in Contacts)"}
                    </button>
                    <button onClick={()=>copyMsg(job,worker)}
                      style={{padding:"12px",border:"1.5px solid #D1C9BE",borderRadius:9,background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      📋 Copy Message
                    </button>
                  </div>
                )}
                <button onClick={()=>setSendModal(null)} style={{width:"100%",marginTop:12,padding:"10px",border:"none",background:"none",color:"#9CA3AF",fontSize:12,cursor:"pointer"}}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
