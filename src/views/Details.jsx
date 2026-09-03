import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { NEXUS, TWC_CATEGORIES } from '../data/categories';
import { documentationScore } from '../lib/report';

export default function Details({ incident, onBack, onToggleDoc, onDelete }) {
  if (!incident) return null;
  const category = TWC_CATEGORIES[incident.category];
  const score = documentationScore(incident);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm hover:underline" style={{ color: NEXUS.cyan }}>← Back to list</button>

      <div className="p-6 rounded-lg border" style={{ borderColor: category.color, backgroundColor: `${category.color}08` }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-sm" style={{ color: category.color }}>{category.name}</div>
            <div className="text-xs mt-2 space-y-1" style={{ color: NEXUS.cyan }}>
              <div>Employee: <span style={{ color: NEXUS.green }}>{incident.employee}</span></div>
              <div>Crew: <span style={{ color: NEXUS.green }}>{incident.crew}</span></div>
              <div>Date/Time: <span style={{ color: NEXUS.green }}>{incident.date} {incident.time}</span></div>
              <div>Docs ready: <span style={{ color: NEXUS.yellow }}>{score.pct}%</span></div>
            </div>
          </div>
          <div className="px-3 py-1 rounded text-xs font-bold" style={{ backgroundColor: category.color, color: NEXUS.darker }}>
            {category.risk}
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-bold text-sm mb-2" style={{ color: NEXUS.green }}>DESCRIPTION</h3>
        <p className="text-sm leading-relaxed p-4 rounded border" style={{ borderColor: NEXUS.cyan, backgroundColor: `${NEXUS.cyan}08`, color: NEXUS.cyan }}>
          {incident.description}
        </p>
      </section>

      {incident.witnesses && (
        <section>
          <h3 className="font-bold text-sm mb-2" style={{ color: NEXUS.green }}>WITNESSES</h3>
          <p className="text-sm" style={{ color: NEXUS.cyan }}>{incident.witnesses}</p>
        </section>
      )}

      <section>
        <h3 className="font-bold text-sm mb-3" style={{ color: NEXUS.green }}>DOCUMENTATION STATUS</h3>
        <div className="space-y-2">
          {category.docs.map((doc) => {
            const done = Boolean(incident.docStatus?.[doc]);
            return (
              <div key={doc} className="p-3 rounded flex items-center justify-between border" style={{ borderColor: done ? NEXUS.green : NEXUS.cyan, backgroundColor: done ? `${NEXUS.green}08` : `${NEXUS.cyan}08` }}>
                <span className="text-sm" style={{ color: NEXUS.cyan }}>{doc}</span>
                <button onClick={() => onToggleDoc(incident.id, doc, !done)} aria-label={`Toggle ${doc}`}>
                  {done ? <CheckCircle2 size={20} style={{ color: NEXUS.green }} /> : <AlertCircle size={20} style={{ color: NEXUS.pink }} />}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {incident.evidence?.length > 0 && (
        <section>
          <h3 className="font-bold text-sm mb-3" style={{ color: NEXUS.green }}>EVIDENCE FILES ({incident.evidence.length})</h3>
          <div className="space-y-2">
            {incident.evidence.map((file, i) => (
              <div key={`${file.name}-${i}`} className="p-3 rounded border text-sm" style={{ borderColor: NEXUS.yellow, backgroundColor: `${NEXUS.yellow}08` }}>
                <div className="truncate" style={{ color: NEXUS.yellow }}>{file.name}</div>
                {String(file.type || '').startsWith('image/') && file.data && (
                  <img src={file.data} alt={file.name} className="mt-2 max-h-48 rounded" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <button
        onClick={() => onDelete(incident.id)}
        className="w-full py-3 rounded-lg font-bold"
        style={{ backgroundColor: `${NEXUS.pink}20`, color: NEXUS.pink, border: `1px solid ${NEXUS.pink}` }}
      >
        <Trash2 className="inline mr-2" size={16} />
        DELETE INCIDENT
      </button>
    </div>
  );
}
