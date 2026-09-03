const KEYS = {
  incidents: 'kec_incidents',
  crews: 'kec_crews'
};

export function loadIncidents() {
  try {
    const raw = localStorage.getItem(KEYS.incidents);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIncidents(incidents) {
  try {
    localStorage.setItem(KEYS.incidents, JSON.stringify(incidents));
    return true;
  } catch (err) {
    console.error('KEC SHIELD storage write failed', err);
    return false;
  }
}

export function loadCrews() {
  try {
    const raw = localStorage.getItem(KEYS.crews);
    return raw ? JSON.parse(raw) : ['Crew A', 'Crew B', 'Crew C', 'Crew D'];
  } catch {
    return ['Crew A', 'Crew B', 'Crew C', 'Crew D'];
  }
}

export function saveCrews(crews) {
  localStorage.setItem(KEYS.crews, JSON.stringify(crews));
}

export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const element = document.createElement('a');
  element.href = URL.createObjectURL(new Blob([text], { type: mime }));
  element.download = filename;
  element.click();
  URL.revokeObjectURL(element.href);
}

export function downloadJson(filename, data) {
  downloadText(filename, JSON.stringify(data, null, 2), 'application/json');
}

export function fileToEvidence(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file'));
    if (file.size > 4 * 1024 * 1024) {
      return reject(new Error('File exceeds 4MB local storage cap'));
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        data: evt.target.result,
        timestamp: new Date().toISOString()
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
