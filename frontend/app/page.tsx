'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Building2, Database, MapPinned } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './globals.css';

type Row = {
  id: number;
  year: number;
  municipality: string;
  region: string;
  population: number;
};

type Summary = {
  year: number;
  total_population: number;
  municipalities: number;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const formatNumber = (value: number) => new Intl.NumberFormat('en-CA').format(value);

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const latest = await getJson<Summary>(`${API}/api/v1/summary`);
        const population = await getJson<Row[]>(`${API}/api/v1/population?year=${latest.year}`);
        if (active) {
          setSummary(latest);
          setRows(population);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load OPIP data');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const chart = useMemo(
    () => [...rows].sort((a, b) => b.population - a.population),
    [rows],
  );

  return (
    <main>
      <header>
        <div>
          <span className="eyebrow">CLOUDGENIUS • DATA INTELLIGENCE</span>
          <h1>Ontario Population Intelligence Platform</h1>
          <p>Operational population analytics, regional insights and data-quality visibility in one platform.</p>
        </div>
        <div className={`live ${error ? 'offline' : ''}`}>
          <Activity size={16} /> {error ? 'Data Unavailable' : 'Platform Online'}
        </div>
      </header>

      {error && <div className="errorBanner">Unable to load the analytics API. {error}</div>}

      <section className="cards">
        <Card icon={<MapPinned />} label="Population represented" value={loading ? '—' : formatNumber(summary?.total_population || 0)} sub={`Latest sample year ${summary?.year || '—'}`} />
        <Card icon={<Building2 />} label="Municipalities" value={loading ? '—' : String(summary?.municipalities || 0)} sub="Current sample coverage" />
        <Card icon={<Database />} label="Data source" value="Training Dataset" sub="Synthetic • replaceable" />
        <Card icon={<Activity />} label="API status" value={error ? 'Unavailable' : loading ? 'Checking…' : 'Operational'} sub="FastAPI + PostgreSQL" />
      </section>

      <section className="grid">
        <article className="panel chart">
          <div className="panelHead">
            <div><h2>Population by municipality</h2><p>Latest synthetic training dataset</p></div>
            <span>{summary?.year || '—'}</span>
          </div>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={chart} margin={{ top: 10, right: 10, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="municipality" angle={-35} textAnchor="end" interval={0} height={80} />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar dataKey="population" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <div className="panelHead"><div><h2>Municipality overview</h2><p>Population records</p></div></div>
          <div className="table">
            <div className="tr th"><span>Municipality</span><span>Region</span><span>Population</span></div>
            {chart.slice(0, 8).map((row) => (
              <div className="tr" key={row.id}>
                <strong>{row.municipality}</strong><span>{row.region}</span><span>{formatNumber(row.population)}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer>CloudGenius OPIP • Training & portfolio environment • Synthetic demonstration data</footer>
    </main>
  );
}

function Card({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return <article className="card"><div className="icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></article>;
}
