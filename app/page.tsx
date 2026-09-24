"use client";
import {useMemo,useState} from "react";
import {Activity,ArrowUpRight,Bot,CheckCircle2,ChevronLeft,ChevronRight,Command,Inbox,LayoutDashboard,Plus,Settings,ShieldCheck,Target,Users,WalletCards,Zap} from "lucide-react";

type Agent={id:number;name:string;role:string;dept:string;status:"Working"|"Waiting"|"Idle";color:string;task:string};
const initialAgents:Agent[]=[
{id:1,name:"Atlas",role:"Executive Orchestrator",dept:"Command",status:"Working",color:"gold",task:"Coordinating your active workforce"},
{id:2,name:"Ledger",role:"Finance & Banking",dept:"Finance",status:"Working",color:"blue",task:"Monitoring account activity"},
{id:3,name:"Mail",role:"Email Operations",dept:"Communications",status:"Waiting",color:"purple",task:"3 messages awaiting review"},
{id:4,name:"Forge",role:"Fitness & Health",dept:"Personal",status:"Working",color:"green",task:"Preparing today's training plan"},
{id:5,name:"Scout",role:"Research & Intelligence",dept:"Intelligence",status:"Idle",color:"orange",task:"Ready for your next assignment"}];

const nav=[["Command Center",LayoutDashboard],["My Workforce",Users],["Missions",Target],["Tasks",CheckCircle2],["Approvals",ShieldCheck],["Activity",Activity]] as const;

export default function Home(){
 const [collapsed,setCollapsed]=useState(false); const [command,setCommand]=useState(""); const [agents,setAgents]=useState(initialAgents);
 const [sent,setSent]=useState(false);
 const working=useMemo(()=>agents.filter(a=>a.status==="Working").length,[agents]);
 function execute(){if(!command.trim())return; setSent(true); setAgents(a=>a.map(x=>x.id===1?{...x,status:"Working",task:"Executing your latest command"}:x)); setTimeout(()=>setSent(false),2200); setCommand("")}
 return <main className="shell">
  <aside className={collapsed?"sidebar collapsed":"sidebar"}>
   <div className="brand"><div className="brandMark">W</div>{!collapsed&&<div><strong>PERSONAL AI</strong><span>WORKFORCE</span></div>}</div>
   <nav>{nav.map(([label,Icon],i)=><button className={i===0?"navItem active":"navItem"} key={label}><Icon size={18}/>{!collapsed&&<span>{label}</span>}{!collapsed&&label==="Approvals"&&<b>3</b>}</button>)}</nav>
   <div className="sidebarBottom"><button className="navItem"><Settings size={18}/>{!collapsed&&<span>Settings</span>}</button><button className="collapse" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<ChevronRight size={18}/>:<><ChevronLeft size={18}/><span>Collapse</span></>}</button></div>
  </aside>
  <section className="content">
   <header><div><div className="eyebrow">THURSDAY · 24 SEPTEMBER 2026</div><h1>Command Center</h1></div><div className="profile"><div className="online"></div><div className="avatar">MH</div><div className="profileText"><strong>Mauricio</strong><span>Owner</span></div></div></header>
   <div className="commandBox"><Command size={20}/><input value={command} onChange={e=>setCommand(e.target.value)} onKeyDown={e=>e.key==="Enter"&&execute()} placeholder="Tell your workforce what needs to happen..." /><button onClick={execute}><Zap size={16}/> Execute</button></div>
   {sent&&<div className="toast"><CheckCircle2 size={17}/> Command accepted. Atlas is coordinating the workforce.</div>}
   <div className="metrics">
    <Metric icon={<Users/>} label="Agents online" value={working+"/"+agents.length} sub="workforce status"/>
    <Metric icon={<Target/>} label="Active missions" value="4" sub="2 need attention"/>
    <Metric icon={<Inbox/>} label="Pending approvals" value="3" sub="human decision required"/>
    <Metric icon={<Activity/>} label="Tasks today" value="27" sub="+8 completed"/>
   </div>
   <div className="grid">
    <section className="panel workforce"><div className="panelHead"><div><span className="sectionLabel">WORKFORCE</span><h2>Agents at work</h2></div><button className="ghost"><Plus size={16}/> New agent</button></div>
    <div className="agentList">{agents.map(a=><div className="agent" key={a.id}><div className={"agentIcon "+a.color}><Bot size={19}/></div><div className="agentMain"><div className="agentTitle"><strong>{a.name}</strong><span>{a.role}</span></div><p>{a.task}</p></div><div className={"status "+a.status.toLowerCase()}><i></i>{a.status}</div><ArrowUpRight size={17} className="arrow"/></div>)}</div></section>
    <section className="panel mission"><div className="panelHead"><div><span className="sectionLabel">MISSION CONTROL</span><h2>Active missions</h2></div><button className="textButton">View all</button></div>
      <Mission title="Organize today's priorities" progress={82} agents="Atlas · Mail · Scout"/>
      <Mission title="Personal finance review" progress={56} agents="Ledger"/>
      <Mission title="Optimize weekly training" progress={34} agents="Forge"/>
    </section>
   </div>
   <div className="lower">
    <section className="panel activity"><div className="panelHead"><div><span className="sectionLabel">LIVE FEED</span><h2>Workforce activity</h2></div><Activity size={18}/></div>
    {["Ledger checked 4 new transactions","Forge updated today's training mission","Mail classified 12 incoming messages","Atlas delegated research to Scout"].map((x,i)=><div className="feed" key={x}><span className="feedDot"></span><div><strong>{x}</strong><small>{i+2} min ago</small></div></div>)}</section>
    <section className="panel approvals"><div className="panelHead"><div><span className="sectionLabel">HUMAN GATE</span><h2>Approval queue</h2></div><span className="count">3</span></div>
      <div className="approval"><ShieldCheck size={17}/><div><strong>Reply to important email</strong><small>Mail · low risk</small></div><button>Review</button></div>
      <div className="approval"><WalletCards size={17}/><div><strong>Schedule bank transfer</strong><small>Ledger · high risk</small></div><button>Review</button></div>
    </section>
   </div>
  </section>
 </main>
}
function Metric({icon,label,value,sub}:{icon:React.ReactNode;label:string;value:string;sub:string}){return <div className="metric"><div className="metricIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></div>}
function Mission({title,progress,agents}:{title:string;progress:number;agents:string}){return <div className="missionItem"><div className="missionTop"><strong>{title}</strong><span>{progress}%</span></div><div className="bar"><i style={{width:progress+"%"}}/></div><small>{agents}</small></div>}