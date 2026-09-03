import { NEXUS } from '../data/categories';

export default function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold block mb-2" style={{ color: NEXUS.cyan }}>{label}</span>
      {children}
    </label>
  );
}
