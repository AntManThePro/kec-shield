import { Plus, Search } from 'lucide-react';
import { NEXUS, TWC_CATEGORIES } from '../data/categories';
import { documentationScore } from '../lib/report';

export default function Dashboard({ stats, incidents, query, setQuery, onOpen, onNew }) {
  const byCategory = Object.fromEntries(
    Object.entries(TWC_CATEGORIES).map(([key]) => [key, incidents.filter((i) => i.category === key).length])
  );
  const maxCount = Math.max(1, ...Object.values(byCategory));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Incidents', value: stats.total, color: NEXUS.cyan },
          { label: 'Critical Risk', value: stats.critical, color: NEXUS.pink },
          { label: 'This Week', value: stats.thisWeek, color: NEXUS.yellow },
          { label: 'Documented', value: stats.documented, color: NEXUS.green },
          { label: 'Readiness', value: `${stats.readiness}%`, color: NEXUS.green }
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg border"
            style={{ borderColor: stat.color, backgroundColor: `${stat.color}08`, boxShadow: `0 0 20px ${stat.color}20` }}
          >
            <div className="text-[10px] uppercase tracking-wide" style={{ color: stat.color }}>{stat.label}</div>
            <div className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-3.5" style={{ color: NEXUS.cyan }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employee, crew, category..."
          className="w-full pl-9 p-3 rounded-lg border text-sm bg-transparent"
          style={{ borderColor: NEXUS.cyan, color: NEXUS.cyan }}
        />
      </div>

      <div className="p-5 sm:p-6 rounded-lg border" style={{ borderColor: NEXUS.cyan, backgroundColor: `${NEXUS.cyan}05` }}>
        <h3 className="font-bold mb-4 text-sm" style={{ color: NEXUS.green }}>INCIDENTS BY CATEGORY</h3>
        <div className="space-y-3">
          {Object.entries(byCategory).map(([key, count]) => (
            <div key={key} className="flex items-center justify-between text-sm gap-3">
              <span className="truncate" style={{ color: NEXUS.cyan }}>{TWC_CATEGORIES[key].name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 sm:w-32 h-2 rounded-full" style={{ backgroundColor: `${NEXUS.cyan}20` }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: TWC_CATEGORIES[key].color }}
                  />
                </div>
                <span className="font-bold w-4 text-right" style={{ color: TWC_CATEGORIES[key].color }}>{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 text-sm" style={{ color: NEXUS.green }}>RECENT INCIDENTS</h3>
        <div className="space-y-2 max-h-[28rem] overflow-y-auto">
          {incidents.length === 0 && (
            <p className="text-sm opacity-70">No incidents in the packet yet. Log the first one before memory fades.</p>
          )}
          {incidents.slice(0, 20).map((inc) => {
            const cat = TWC_CATEGORIES[inc.category];
            const score = documentationScore(inc);
            return (
              <button
                key={inc.id}
                onClick={() => onOpen(inc.id)}
                className="w-full text-left p-3 rounded border transition-all"
                style={{ borderColor: cat.color, backgroundColor: `${cat.color}08` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-sm" style={{ color: cat.color }}>{cat.name}</div>
                    <div className="text-xs mt-1 truncate" style={{ color: NEXUS.cyan }}>
                      {inc.employee} • {inc.date} • {inc.crew} • docs {score.collected}/{score.required}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold px-2 py-1 rounded shrink-0" style={{ color: NEXUS.yellow }}>
                    {cat.risk}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNew}
        className="w-full py-3 rounded-lg font-bold"
        style={{ backgroundColor: NEXUS.green, color: NEXUS.darker, boxShadow: `0 0 20px ${NEXUS.green}40` }}
      >
        <Plus className="inline mr-2" size={16} />
        NEW INCIDENT
      </button>
    </div>
  );
}
