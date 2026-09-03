import { ChevronDown } from 'lucide-react';
import { NEXUS, TWC_CATEGORIES } from '../data/categories';

export default function CategoriesGuide() {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl mb-6" style={{ color: NEXUS.green }}>TWC VIOLATION CATEGORIES & DEFENSE GUIDE</h2>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {Object.entries(TWC_CATEGORIES).map(([key, cat]) => (
          <details key={key} className="p-4 rounded-lg border" style={{ borderColor: cat.color, backgroundColor: `${cat.color}08` }}>
            <summary className="flex items-center justify-between font-bold cursor-pointer list-none">
              <div>
                <div style={{ color: cat.color }}>{cat.name}</div>
                <div className="text-xs mt-1" style={{ color: NEXUS.yellow }}>Risk: {cat.risk}</div>
              </div>
              <ChevronDown size={20} style={{ color: cat.color }} />
            </summary>
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: NEXUS.green }}>DOCUMENTATION REQUIRED</div>
                <ul className="text-xs space-y-1 ml-2" style={{ color: NEXUS.cyan }}>
                  {cat.docs.map((doc) => <li key={doc}>✓ {doc}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: NEXUS.green }}>COMMON EXAMPLES</div>
                <ul className="text-xs space-y-1 ml-2" style={{ color: NEXUS.cyan }}>
                  {cat.examples.map((ex) => <li key={ex}>• {ex}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded text-xs" style={{ backgroundColor: `${cat.color}15`, borderLeft: `3px solid ${cat.color}`, color: NEXUS.cyan }}>
                <span className="font-bold">Defense Strategy:</span> Document immediately. Get witness statements in writing. Enforce the same rule across every crew. Keep signed policies on file.
              </div>
            </div>
          </details>
        ))}
      </div>
      <div className="p-6 rounded-lg border mt-6" style={{ borderColor: NEXUS.green, backgroundColor: `${NEXUS.green}08` }}>
        <h3 className="font-bold text-sm mb-4" style={{ color: NEXUS.green }}>TOP 5 WAYS TO WIN AT TWC</h3>
        <ol className="text-xs space-y-2 ml-2" style={{ color: NEXUS.cyan }}>
          <li><span style={{ color: NEXUS.yellow }}>1.</span> Clear written policy — signed by employee</li>
          <li><span style={{ color: NEXUS.yellow }}>2.</span> Employee signed acknowledgment — keep on file</li>
          <li><span style={{ color: NEXUS.yellow }}>3.</span> Prior warnings documented — per policy</li>
          <li><span style={{ color: NEXUS.yellow }}>4.</span> Consistent enforcement — same rules for all crews</li>
          <li><span style={{ color: NEXUS.yellow }}>5.</span> Detailed incident documentation — date, time, witnesses, description</li>
        </ol>
      </div>
    </div>
  );
}
