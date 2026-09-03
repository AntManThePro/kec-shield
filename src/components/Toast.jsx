import { NEXUS } from '../data/categories';

export default function Toast({ toast }) {
  if (!toast) return null;
  const color = toast.type === 'error' ? NEXUS.pink : NEXUS.green;
  return (
    <div
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 py-2 rounded border font-mono text-xs shadow-lg"
      style={{
        borderColor: color,
        color,
        backgroundColor: `${NEXUS.darker}ee`,
        boxShadow: `0 0 24px ${color}40`
      }}
      role="status"
    >
      {toast.message}
    </div>
  );
}
