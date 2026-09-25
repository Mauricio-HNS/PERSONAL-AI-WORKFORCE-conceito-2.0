"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bot, CreditCard, LayoutDashboard, ShieldCheck, Target, Wallet, Zap } from "lucide-react";

type Opportunity = { id:string; title:string; category:string; description:string; estimatedValue:number; confidence:number; status:string };

export default function Home() {
  const [income,setIncome]=useState("");
  const [expenses,setExpenses]=useState("");
  const [debt,setDebt]=useState("");
  const [recurring,setRecurring]=useState("");
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState<any>(null);
  const [opportunities,setOpportunities]=useState<Opportunity[]>([]);

  const load=async()=>{ const r=await fetch("/api/rescue"); if(r.ok)setOpportunities(await r.json()); };
  useEffect(()=>{load()},[]);

  const rescue=async()=>{
    setBusy(true); setResult(null);
    try {
      const r=await fetch("/api/rescue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        income:Number(income), expenses:Number(expenses), debt:Number(debt||0), recurringCosts:Number(recurring||0)
      })});
      const data=await r.json(); setResult(data); if(r.ok) setOpportunities(data.opportunities.map((x:any,i:number)=>({...x,id:String(i),status:"detected"})));
    } finally { setBusy(false); }
  };

  const balance=result?.monthlyBalance ?? (Number(income||0)-Number(expenses||0));
  const recovery=result?.recoveryPotential ?? 0;
  const incomePotential=result?.incomePotential ?? 0;

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandMark">R</div><div><strong>FINANCIAL</strong><span>RESCUE AI</span></div></div>
      <nav>
        <button className="navItem active"><LayoutDashboard size={18}/><span>Rescue Center</span></button>
        <button className="navItem"><Wallet size={18}/><span>Financial Health</span></button>
        <button className="navItem"><Target size={18}/><span>Recovery Plan</span></button>
        <button className="navItem"><ShieldCheck size={18}/><span>Approvals</span></button>
        <button className="navItem"><Activity size={18}/><span>Activity</span></button>
      </nav>
      <div className="sidebarBottom"><small style={{color:"#60777d"}}>PERSONAL AI WORKFORCE · 0.3</small></div>
    </aside>

    <section className="content">
      <header><div><div className="eyebrow">PERSONAL AI WORKFORCE · FINANCIAL RESCUE</div><h1>Financial Rescue Center</h1></div><div className="profile"><div className="online"/><div className="avatar">MH</div><div className="profileText"><strong>Mauricio</strong><span>Owner</span></div></div></header>

      <section className="hero panel">
        <div><span className="sectionLabel">MISSION</span><h2>Get out of financial pressure.</h2><p>Analyze the current situation, find possible savings and identify realistic paths to increase income.</p></div>
        <div className="heroIcon"><Bot size={34}/></div>
      </section>

      <section className="panel formPanel">
        <div className="panelHead"><div><span className="sectionLabel">START WITH THE NUMBERS</span><h2>Your monthly picture</h2></div><span className="status working"><i/>Private analysis</span></div>
        <div className="financeForm">
          <label><span>Monthly income</span><input type="number" min="0" value={income} onChange={e=>setIncome(e.target.value)} placeholder="€ 2,500"/></label>
          <label><span>Monthly expenses</span><input type="number" min="0" value={expenses} onChange={e=>setExpenses(e.target.value)} placeholder="€ 2,700"/></label>
          <label><span>Total debt</span><input type="number" min="0" value={debt} onChange={e=>setDebt(e.target.value)} placeholder="€ 8,000"/></label>
          <label><span>Recurring costs</span><input type="number" min="0" value={recurring} onChange={e=>setRecurring(e.target.value)} placeholder="€ 500"/></label>
          <button className="rescueButton" onClick={rescue} disabled={busy||!income||!expenses}><Zap size={17}/>{busy?"Analyzing...":"Run Financial Rescue"}</button>
        </div>
      </section>

      <div className="metrics">
        <Metric icon={<Wallet/>} label="Monthly balance" value={format(balance)} sub={balance>=0?"positive cash flow":"monthly deficit"}/>
        <Metric icon={<ArrowDownRight/>} label="Recovery potential" value={format(recovery)} sub="estimated savings"/>
        <Metric icon={<ArrowUpRight/>} label="Income potential" value={format(incomePotential)} sub="estimated additional income"/>
        <Metric icon={<CreditCard/>} label="Debt" value={format(result?.debt ?? Number(debt||0))} sub="reported total"/>
      </div>

      {result?.error && <div className="toast error">{result.error}</div>}
      <section className="panel">
        <div className="panelHead"><div><span className="sectionLabel">AI OPPORTUNITY RADAR</span><h2>Where money can move</h2></div><span className="count">{opportunities.length}</span></div>
        {opportunities.length===0 ? <div className="empty">Run the rescue analysis to generate the first recovery opportunities.</div> :
          opportunities.map(o=><div className="opportunity" key={o.id}><div className={"oppIcon "+o.category}><Target size={18}/></div><div className="oppMain"><strong>{o.title}</strong><p>{o.description}</p><small>{Math.round(o.confidence*100)}% confidence · {o.status}</small></div><div className="oppValue">€ {o.estimatedValue.toFixed(0)}<small>potential</small></div></div>)}
      </section>

      <div className="disclaimer">The Rescue engine produces estimates and action candidates. It does not move money, negotiate contracts, or make financial decisions without explicit authorization.</div>
    </section>
  </main>
}

function format(value:number){return "€ "+Number(value||0).toLocaleString("en-IE",{minimumFractionDigits:0,maximumFractionDigits:0})}
function Metric({icon,label,value,sub}:{icon:React.ReactNode;label:string;value:string;sub:string}){return <div className="metric"><div className="metricIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></div>}
