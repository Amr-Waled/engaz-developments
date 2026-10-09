import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const path = 'src/generated/published-snapshot.json';
try {
  // Only the public published document is included; never fetch drafts or credentials.
  const response = await fetch('https://api.engazdevelopments.com/api/website/public', { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Public content returned ${response.status}`);
  const result = await response.json();
  if (!result.content?.values || typeof result.content.values !== 'object' || Array.isArray(result.content.values)) throw new Error('Invalid published content');
  writeFileSync(path, JSON.stringify({ content: { values: result.content.values }, revision: result.revision ?? null, updatedAt: result.updatedAt ?? null }, null, 2) + '\n');
  console.log('Saved published content snapshot for deployment fallback.');
} catch (error) {
  const previous = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
  if (!previous?.content?.values || typeof previous.content.values !== 'object') throw error;
  console.warn('Public CMS unavailable; retaining the previously captured published snapshot.');
}
