'use client';
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Building2, Database, MapPinned } from 'lucide-react';
import './globals.css';

type Row={id:number;year:number;municipality:string;region:string;population:number};
type Summary={year:number;total_population:number;municipalities:number};
const API=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const fmt=(n:number)=>new Intl.NumberFormat('en-CA').format(n);
export default function Home(){
 const [rows,setRows]=useState<Row[]>([]); const [summary,setSummary]=useState<Summary|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([fetch(`${API}/api/v1/population?year=2025`).then(r=>r.json()),fetch(`${API}/api/v1/summary`).then(r=>r.json())]).then(([a,b])=>{setRows(a);setSummary(b)}).finally(()=>setLoading(false));},[]);
 const chart=useMemo(()=>[...rows].sort((a,b)=>b.population-a.population),[rows]);
 return <main><header><div><span className="eyebrow">CLOUDGENIUS • DATA INTELLIGENCE</span><h1>Ontario Population Intelligence Platform</h1><p>Operational population analytics, regional insights and data-quality visibility in one platform.</p></div><div className="live"><Activity size={16}/> Platform Online</div></header>
 <section className="cards"><Card icon={<MapPinned/>} label="Population represented" value={loading?'—':fmt(summary?.total_population||0)} sub={`Latest sample year ${summary?.year||'—'}`}/><Card icon={<Building2/>} label="Municipalities" value={loading?'—':String(summary?.municipalities||0)} sub="Current sample coverage"/><Card icon={<Database/>} label="Data source" value="Training Dataset" sub="Synthetic • replaceable"/><Card icon={<Activity/>} label="API status" value="Operational" sub="FastAPI + PostgreSQL"/></section>
 <section className="grid"><article className="panel chart"><div className="panelHead"><div><h2>Population by municipality</h2><p>Latest synthetic training dataset</p></div><span>2025</span></div><ResponsiveContainer width="100%" height={360}><BarChart data={chart} margin={{top:10,right:10,left:20,bottom:50}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="municipality" angle={-35} textAnchor="end" interval={0} height={80}/><YAxis tickFormatter={v=>`${(v/1000000).toFixed(1)}M`}/><Tooltip formatter={(v)=>fmt(Number(v))}/><Bar dataKey="population" radius={[7,7,0,0]}/></BarChart></ResponsiveContainer></article>
 <article className="panel"><div className="panelHead"><div><h2>Municipality overview</h2><p>Population records</p></div></div><div className="table"><div className="tr th"><span>Municipality</span><span>Region</span><span>Population</span></div>{chart.slice(0,8).map(r=><div className="tr" key={r.id}><strong>{r.municipality}</strong><span>{r.region}</span><span>{fmt(r.population)}</span></div>)}</div></article></section>
 <footer>CloudGenius OPIP • Training & portfolio environment • Synthetic demonstration data</footer></main>}
function Card({icon,label,value,sub}:{icon:React.ReactNode,label:string,value:string,sub:string}){return <article className="card"><div className="icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></article>}
