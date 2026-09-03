import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileText, Home, Settings } from 'lucide-react';
import { NEXUS, TWC_CATEGORIES, emptyIncidentForm } from './data/categories';
import { loadIncidents, saveIncidents, loadCrews, saveCrews, downloadText, downloadJson, fileToEvidence } from './lib/storage';
import { buildTWCReport, readinessIndex } from './lib/report';
import ParticleField from './components/ParticleField';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import Dashboard from './views/Dashboard';
import Logger from './views/Logger';
import Details from './views/Details';
import CategoriesGuide from './views/CategoriesGuide';
import SystemPanel from './views/SystemPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState(loadIncidents);
  const [crews, setCrews] = useState(loadCrews);
  const [newIncident, setNewIncident] = useState(() => emptyIncidentForm(loadCrews()));
  const [expandedIncident, setExpandedIncident] = useState(null);
  const [showLogger, setShowLogger] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [newCrew, setNewCrew] = useState('');
  const fileInputRef = useRef(null);
  const importRef = useRef(null);

  useEffect(() => {
    if (!saveIncidents(incidents)) ping('Storage full — evidence files may be too large', 'error');
  }, [incidents]);

  useEffect(() => {
    saveCrews(crews);
  }, [crews]);

  const ping = (message, type = 'ok') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  };

  const addIncident = () => {
    if (!newIncident.employee.trim() || !newIncident.description.trim()) {
      ping('Employee name and description required', 'error');
      return;
    }
    const cat = TWC_CATEGORIES[newIncident.category];
    const incident = {
      id: Date.now(),
      ...newIncident,
      employee: newIncident.employee.trim(),
      description: newIncident.description.trim(),
      timestamp: new Date(`${newIncident.date}T${newIncident.time}`).toISOString(),
      docStatus: Object.fromEntries(cat.docs.map((d) => [d, false]))
    };
    setIncidents([incident, ...incidents]);
    setNewIncident(emptyIncidentForm(crews));
    setShowLogger(false);
    setActiveTab('dashboard');
    ping('Incident locked into the packet');
  };

  const deleteIncident = (id) => {
    setIncidents(incidents.filter((i) => i.id !== id));
    setExpandedIncident(null);
    setPendingDelete(null);
    ping('Incident purged');
  };

  const updateDocStatus = (incidentId, doc, status) => {
    setIncidents(
      incidents.map((i) =>
        i.id === incidentId ? { ...i, docStatus: { ...i.docStatus, [doc]: status } } : i
      )
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const evidence = await fileToEvidence(file);
      setNewIncident({ ...newIncident, evidence: [...newIncident.evidence, evidence] });
      ping(`Attached ${file.name}`);
    } catch (err) {
      ping(err.message, 'error');
    }
  };

  const generateTWCReport = () => {
    const report = buildTWCReport(incidents);
    downloadText(`TWC_Report_${new Date().toISOString().slice(0, 10)}.txt`, report);
    ping('TWC packet exported');
  };

  const exportBackup = () => {
    downloadJson(`kec-shield-backup_${new Date().toISOString().slice(0, 10)}.json`, {
      version: 1,
      exportedAt: new Date().toISOString(),
      crews,
      incidents
    });
    ping('JSON backup downloaded');
  };

  const importBackup = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(String(evt.target.result));
        if (!Array.isArray(data.incidents)) throw new Error('Invalid backup');
        setIncidents(data.incidents);
        if (Array.isArray(data.crews) && data.crews.length) setCrews(data.crews);
        ping(`Imported ${data.incidents.length} incidents`);
      } catch {
        ping('Backup file unreadable', 'error');
      }
    };
    reader.readAsText(file);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return incidents;
    return incidents.filter((inc) => {
      const cat = TWC_CATEGORIES[inc.category];
      return [inc.employee, inc.crew, inc.description, inc.witnesses, cat?.name]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [incidents, query]);

  const stats = useMemo(() => {
    const today = new Date();
    return {
      total: incidents.length,
      critical: incidents.filter((i) => TWC_CATEGORIES[i.category]?.risk === 'CRITICAL').length,
      thisWeek: incidents.filter((i) => (today - new Date(i.date)) / 86400000 <= 7).length,
      documented: incidents.filter((i) => Object.values(i.docStatus || {}).some(Boolean)).length,
      readiness: readinessIndex(incidents)
    };
  }, [incidents]);

  const resetNav = (tab) => {
    setActiveTab(tab);
    setShowLogger(false);
    setExpandedIncident(null);
  };

  return (
    <div className="min-h-screen font-mono relative grid-bg" style={{ backgroundColor: NEXUS.darker, color: NEXUS.cyan }}>
      <ParticleField />
      <Toast toast={toast} />
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="PURGE INCIDENT"
        body="This cannot be undone. Evidence attached to this record will be dropped from local storage."
        confirmLabel="DELETE"
        onConfirm={() => deleteIncident(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />

      <header
        className="relative border-b no-print"
        style={{ borderColor: NEXUS.green, backgroundColor: `${NEXUS.dark}cc`, boxShadow: `0 0 40px ${NEXUS.green}20` }}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={`${import.meta.env.BASE_URL}icons/favicon.svg`} alt="" className="w-8 h-8 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: NEXUS.green }} />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: NEXUS.green }}>
                  KEC SHIELD
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs truncate" style={{ color: NEXUS.cyan }}>
                /// TWC Defense & Incident Documentation — DoubleA @ AntManThePro
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px]" style={{ color: NEXUS.yellow }}>
            READINESS {stats.readiness}%
          </div>
        </div>
      </header>

      <nav className="relative border-b no-print" style={{ borderColor: NEXUS.cyan, backgroundColor: `${NEXUS.cyan}08` }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex gap-1 py-2 overflow-x-auto">
          {[
            { id: 'dashboard', icon: Home, label: 'DASHBOARD' },
            { id: 'categories', icon: FileText, label: 'CATEGORIES' },
            { id: 'settings', icon: Settings, label: 'SYSTEM' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => resetNav(tab.id)}
              className="px-3 sm:px-4 py-2 rounded-t font-bold text-[11px] transition-all flex items-center gap-2 border-b-2 whitespace-nowrap"
              style={{
                color: activeTab === tab.id ? NEXUS.green : NEXUS.cyan,
                borderColor: activeTab === tab.id ? NEXUS.green : 'transparent',
                backgroundColor: activeTab === tab.id ? `${NEXUS.green}15` : 'transparent'
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {showLogger ? (
          <Logger
            newIncident={newIncident}
            setNewIncident={setNewIncident}
            crews={crews}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            onSave={addIncident}
            onCancel={() => setShowLogger(false)}
          />
        ) : expandedIncident ? (
          <Details
            incident={incidents.find((i) => i.id === expandedIncident)}
            onBack={() => setExpandedIncident(null)}
            onToggleDoc={updateDocStatus}
            onDelete={(id) => setPendingDelete(id)}
          />
        ) : activeTab === 'dashboard' ? (
          <Dashboard
            stats={stats}
            incidents={filtered}
            query={query}
            setQuery={setQuery}
            onOpen={(id) => setExpandedIncident(id)}
            onNew={() => setShowLogger(true)}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesGuide />
        ) : (
          <SystemPanel
            crews={crews}
            setCrews={setCrews}
            newCrew={newCrew}
            setNewCrew={setNewCrew}
            onExport={exportBackup}
            onImportClick={() => importRef.current?.click()}
            ping={ping}
          />
        )}
      </main>

      <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={importBackup} />

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 no-print">
        <button
          onClick={generateTWCReport}
          className="p-4 rounded-lg font-bold"
          style={{ backgroundColor: NEXUS.yellow, color: NEXUS.darker, boxShadow: `0 0 30px ${NEXUS.yellow}50` }}
          title="Export TWC report"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}
