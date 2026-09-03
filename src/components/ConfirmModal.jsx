import { NEXUS } from '../data/categories';

export default function ConfirmModal({ open, title, body, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(5,8,18,0.82)' }}>
      <div
        className="w-full max-w-md rounded-lg border p-5 space-y-4"
        style={{ borderColor: NEXUS.pink, backgroundColor: NEXUS.dark, boxShadow: `0 0 40px ${NEXUS.pink}25` }}
      >
        <h3 className="font-bold text-sm" style={{ color: NEXUS.pink }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: NEXUS.cyan }}>{body}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded font-bold text-xs"
            style={{ backgroundColor: NEXUS.pink, color: NEXUS.darker }}
          >
            {confirmLabel || 'CONFIRM'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded font-bold text-xs border"
            style={{ borderColor: NEXUS.cyan, color: NEXUS.cyan }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
