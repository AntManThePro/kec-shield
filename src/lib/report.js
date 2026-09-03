import { TWC_CATEGORIES } from '../data/categories';

export function documentationScore(incident) {
  const cat = TWC_CATEGORIES[incident.category];
  if (!cat) return { collected: 0, required: 0, pct: 0 };
  const required = cat.docs.length;
  const collected = cat.docs.filter((d) => incident.docStatus?.[d]).length;
  return {
    collected,
    required,
    pct: required ? Math.round((collected / required) * 100) : 0
  };
}

export function buildTWCReport(incidents) {
  const header = [
    'KEC SHIELD /// TWC DEFENSE PACKET',
    `Generated: ${new Date().toISOString()}`,
    `Incidents: ${incidents.length}`,
    'This packet is an operations aid. It is not legal advice.',
    '='.repeat(64)
  ].join('\n');

  const body = incidents
    .map((inc) => {
      const cat = TWC_CATEGORIES[inc.category] || { name: inc.category, docs: [], risk: '?' };
      const score = documentationScore(inc);
      return [
        `INCIDENT #${inc.id}`,
        `Date: ${inc.date}  Time: ${inc.time}`,
        `Category: ${cat.name}`,
        `Risk: ${cat.risk}`,
        `Employee: ${inc.employee}`,
        `Crew: ${inc.crew}`,
        `Description: ${inc.description}`,
        `Witnesses: ${inc.witnesses || 'None documented'}`,
        `Documentation: ${score.collected}/${score.required} (${score.pct}%)`,
        `Evidence files: ${inc.evidence?.length || 0}`,
        '-'.repeat(32)
      ].join('\n');
    })
    .join('\n\n');

  return `${header}\n\n${body || 'No incidents logged.'}\n`;
}

export function readinessIndex(incidents) {
  if (!incidents.length) return 0;
  const avg =
    incidents.reduce((sum, inc) => sum + documentationScore(inc).pct, 0) / incidents.length;
  return Math.round(avg);
}
