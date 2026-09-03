import { Plus, Upload, X } from 'lucide-react';
import { NEXUS, TWC_CATEGORIES } from '../data/categories';
import Field from '../components/Field';

export default function Logger({ newIncident, setNewIncident, crews, fileInputRef, handleFileUpload, onSave, onCancel }) {
  const category = TWC_CATEGORIES[newIncident.category];
  const field = {
    className: 'w-full p-3 rounded-lg border text-sm bg-transparent',
    style: { borderColor: NEXUS.cyan, color: NEXUS.cyan, backgroundColor: NEXUS.darker }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-xl" style={{ color: NEXUS.green }}>INCIDENT DOCUMENTATION</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="INCIDENT CATEGORY">
          <select {...field} value={newIncident.category} onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}>
            {Object.entries(TWC_CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </Field>
        <Field label="CREW">
          <select {...field} value={newIncident.crew} onChange={(e) => setNewIncident({ ...newIncident, crew: e.target.value })}>
            {crews.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="DATE">
          <input type="date" {...field} value={newIncident.date} onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })} />
        </Field>
        <Field label="TIME">
          <input type="time" {...field} value={newIncident.time} onChange={(e) => setNewIncident({ ...newIncident, time: e.target.value })} />
        </Field>
      </div>

      <Field label="EMPLOYEE NAME">
        <input type="text" placeholder="Full name" {...field} value={newIncident.employee} onChange={(e) => setNewIncident({ ...newIncident, employee: e.target.value })} />
      </Field>
      <Field label="INCIDENT DESCRIPTION">
        <textarea placeholder="Detailed description of what happened..." {...field} className={`${field.className} h-24 resize-none`} value={newIncident.description} onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })} />
      </Field>
      <Field label="WITNESSES (OPTIONAL)">
        <input type="text" placeholder="Names of witnesses, comma-separated" {...field} value={newIncident.witnesses} onChange={(e) => setNewIncident({ ...newIncident, witnesses: e.target.value })} />
      </Field>

      <Field label="EVIDENCE (PHOTOS/DOCUMENTS)">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2"
          style={{ borderColor: NEXUS.yellow, backgroundColor: `${NEXUS.yellow}08`, color: NEXUS.yellow }}
        >
          <Upload size={16} />
          <span className="text-sm">Click to upload (max 4MB each)</span>
        </button>
        <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.txt,.doc,.docx" />
        {newIncident.evidence.length > 0 && (
          <div className="mt-3 space-y-2">
            {newIncident.evidence.map((file, i) => (
              <div key={`${file.name}-${i}`} className="p-2 rounded flex items-center justify-between text-sm" style={{ backgroundColor: `${NEXUS.yellow}15`, borderLeft: `3px solid ${NEXUS.yellow}` }}>
                <span className="truncate" style={{ color: NEXUS.yellow }}>{file.name}</span>
                <button onClick={() => setNewIncident({ ...newIncident, evidence: newIncident.evidence.filter((_, j) => j !== i) })}>
                  <X size={14} style={{ color: NEXUS.pink }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <div className="p-4 rounded-lg border" style={{ borderColor: category.color, backgroundColor: `${category.color}08` }}>
        <div className="font-bold text-sm mb-2" style={{ color: category.color }}>
          {category.name.toUpperCase()} — Risk Level: {category.risk}
        </div>
        <div className="text-xs space-y-1 mb-3" style={{ color: NEXUS.cyan }}>
          <div className="font-bold">Documentation Required:</div>
          {category.docs.map((doc) => (
            <div key={doc} className="ml-2">• {doc}</div>
          ))}
        </div>
        <div className="text-xs space-y-1" style={{ color: NEXUS.yellow }}>
          <div className="font-bold">Common Examples:</div>
          {category.examples.map((ex) => (
            <div key={ex} className="ml-2">• {ex}</div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onSave} className="flex-1 py-3 rounded-lg font-bold" style={{ backgroundColor: NEXUS.green, color: NEXUS.darker }}>
          <Plus className="inline mr-2" size={16} />
          LOG INCIDENT
        </button>
        <button onClick={onCancel} className="flex-1 py-3 rounded-lg font-bold border" style={{ borderColor: NEXUS.cyan, color: NEXUS.cyan }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
