import { NEXUS } from '../data/categories';

export default function SystemPanel({ crews, setCrews, newCrew, setNewCrew, onExport, onImportClick, ping }) {
  const addCrew = () => {
    const name = newCrew.trim();
    if (!name) return;
    if (crews.includes(name)) {
      ping('Crew already exists', 'error');
      return;
    }
    setCrews([...crews, name]);
    setNewCrew('');
    ping(`Crew ${name} online`);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-xl" style={{ color: NEXUS.green }}>SYSTEM / CREWS / BACKUP</h2>
      <p className="text-sm leading-relaxed" style={{ color: NEXUS.cyan }}>
        Data lives in this browser only. Export a JSON backup before you wipe a device. Add this app to the home screen — custom shield icon is already wired.
      </p>

      <div className="p-5 rounded-lg border space-y-3" style={{ borderColor: NEXUS.cyan, backgroundColor: `${NEXUS.cyan}08` }}>
        <h3 className="text-sm font-bold" style={{ color: NEXUS.green }}>CREWS</h3>
        {crews.map((c) => (
          <div key={c} className="flex items-center justify-between text-sm">
            <span>{c}</span>
            <button
              onClick={() => setCrews(crews.filter((x) => x !== c))}
              className="text-xs"
              style={{ color: NEXUS.pink }}
              disabled={crews.length === 1}
            >
              remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={newCrew}
            onChange={(e) => setNewCrew(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCrew()}
            placeholder="New crew name"
            className="flex-1 p-2 rounded border bg-transparent text-sm"
            style={{ borderColor: NEXUS.cyan, color: NEXUS.cyan }}
          />
          <button onClick={addCrew} className="px-3 rounded font-bold text-xs" style={{ backgroundColor: NEXUS.green, color: NEXUS.darker }}>
            ADD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={onExport} className="py-3 rounded-lg font-bold" style={{ backgroundColor: NEXUS.cyan, color: NEXUS.darker }}>
          EXPORT JSON BACKUP
        </button>
        <button onClick={onImportClick} className="py-3 rounded-lg font-bold border" style={{ borderColor: NEXUS.yellow, color: NEXUS.yellow }}>
          IMPORT JSON BACKUP
        </button>
      </div>
    </div>
  );
}
