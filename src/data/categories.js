export const NEXUS = {
  green: '#00ff87',
  cyan: '#60efff',
  pink: '#ff0080',
  yellow: '#ffcc00',
  dark: '#0a0e27',
  darker: '#050812',
  grid: 'rgba(0, 255, 135, 0.05)'
};

export const TWC_CATEGORIES = {
  attendance: {
    name: 'Attendance Violations',
    risk: 'HIGH',
    docs: ['Attendance records', 'Written warnings', 'Policy acknowledgment'],
    color: NEXUS.pink,
    examples: ['Excessive tardiness', 'No-call/no-show', 'Unexcused absence', 'Left early without auth']
  },
  insubordination: {
    name: 'Insubordination',
    risk: 'CRITICAL',
    docs: ['Witness statements', 'Written warnings', 'Incident details'],
    color: NEXUS.pink,
    examples: ['Refused direct instruction', 'Disrespectful conduct', 'Hung up on manager']
  },
  safety: {
    name: 'Safety Violations',
    risk: 'CRITICAL',
    docs: ['Safety policies', 'Training records', 'Photos/videos', 'Witness statements'],
    color: NEXUS.yellow,
    examples: ['No PPE used', 'Unsafe ladder use', 'Chemical violation', 'Equipment misuse']
  },
  jobAbandon: {
    name: 'Job Abandonment',
    risk: 'CRITICAL',
    docs: ['Communication logs', 'Schedule records', 'Attendance records'],
    color: NEXUS.pink,
    examples: ['Stopped reporting', 'Missed multiple shifts', 'No response to contact']
  },
  policy: {
    name: 'Policy Violations',
    risk: 'HIGH',
    docs: ['Written policies', 'Signed acknowledgments', 'Prior warnings'],
    color: NEXUS.cyan,
    examples: ['Procedure failure', 'Improper checkout', 'Missing reports', 'Unauthorized asset use']
  },
  dishonesty: {
    name: 'Theft or Dishonesty',
    risk: 'CRITICAL',
    docs: ['Investigation records', 'Witness statements', 'Photos/videos', 'Receipts'],
    color: NEXUS.pink,
    examples: ['Theft', 'Falsified records', 'Timecard fraud', 'Expense fraud']
  },
  harassment: {
    name: 'Harassment or Conduct',
    risk: 'CRITICAL',
    docs: ['Complaints', 'Investigation', 'Witness statements'],
    color: NEXUS.pink,
    examples: ['Threats', 'Harassment', 'Fighting', 'Discrimination']
  },
  drug: {
    name: 'Drug or Alcohol',
    risk: 'CRITICAL',
    docs: ['Written policy', 'Test results', 'Chain-of-custody'],
    color: NEXUS.yellow,
    examples: ['Positive test', 'Refusal to test', 'Possession at work', 'Working impaired']
  },
  performance: {
    name: 'Excessive Performance Issues',
    risk: 'MEDIUM',
    docs: ['Performance records', 'Coaching sessions', 'Prior warnings'],
    color: NEXUS.cyan,
    examples: ['Repeated mistakes', 'Failed to meet standards', 'Low productivity']
  },
  voluntary: {
    name: 'Voluntary Quit',
    risk: 'MEDIUM',
    docs: ['Resignation letter', 'Offered accommodations', 'Work availability docs'],
    color: NEXUS.green,
    examples: ['Unsafe complaint', 'Medical', 'Family emergency', 'Hours reduced']
  }
};

export const RISK_WEIGHT = { CRITICAL: 3, HIGH: 2, MEDIUM: 1 };

export function emptyIncidentForm(crews = ['Crew A']) {
  return {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    category: 'attendance',
    crew: crews[0] || 'Crew A',
    employee: '',
    description: '',
    witnesses: '',
    evidence: [],
    docStatus: {}
  };
}
