// Public presentation aliases only. Original repository identities stay unchanged.
export function audienceText(value) {
  return String(value)
    .replace(/\bREGULATOR\s*\/\/\s*GHOST(?:\s+V3)?/gi, 'Interactive demonstration')
    .replace(/\bGHOST-/g, 'DEMO-')
    .replace(/Ghost Demonstration Fund/g, 'Demonstration Fund')
    .replace(/\bGhost(?:’s|'s)\b/g, "this demonstration's")
    .replace(/\bGhost\b/g, 'this demonstration')
    .replace(/\bGHOST\b/g, 'demonstration');
}
export function audienceEvidence(value) {
  if (typeof value === 'string') return audienceText(value);
  if (Array.isArray(value)) return value.map(audienceEvidence);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[audienceText(key),audienceEvidence(item)]));
  return value;
}
