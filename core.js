export const FEELINGS = ['Meh', 'OK', 'Good', 'Great', 'Holiday magic'];
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function isAvailable(movie, today = localDay()) {
  return movie.available === true || Boolean(movie.streaming && movie.streaming <= today);
}
export function belongs(movie, section, records, today = localDay()) {
  if (records[movie.id]?.wontWatch) return section === 'wontWatch';
  if (section === 'wontWatch') return false;
  const watched = Boolean(records[movie.id]?.watched);
  if (section === 'watched') return watched;
  return !watched && (section === 'watch' ? isAvailable(movie,today) : !isAvailable(movie,today));
}
export function compareMovies(a,b,section,records) {
  if(section==='watched') return String(records[b.id]?.watchedAt??'').localeCompare(String(records[a.id]?.watchedAt??''));
  if(section==='watch') return Number(a.type==='series')-Number(b.type==='series') || String(b.streaming??'').localeCompare(String(a.streaming??''));
  return String(a.streaming??'9999').localeCompare(String(b.streaming??'9999'));
}
export function validateBackup(data, movies) {
  if (!data || data.app !== 'merry-watch' || data.version !== 1 || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) throw new Error('Choose a Merry Watch backup file.');
  const allowed = new Set(movies.map(m=>m.id));
  const result = {};
  for (const [id, r] of Object.entries(data.records)) {
    if (!allowed.has(id)) continue;
    if (!r || typeof r !== 'object' || typeof r.watched !== 'boolean' || (r.feeling != null && !FEELINGS.includes(r.feeling)) || !Number.isSafeInteger(r.episodes ?? 0) || (r.episodes ?? 0) < 0 || (r.episodes ?? 0) > 10000 || (r.watchedAt != null && !Number.isFinite(Date.parse(r.watchedAt)))) throw new Error('This backup contains an invalid watch record. Nothing was imported.');
    if (('wontWatch' in r && typeof r.wontWatch !== 'boolean') || (r.wontWatch && r.watched)) throw new Error('This backup contains an invalid watch record. Nothing was imported.');
    result[id] = { watched:r.watched, feeling:r.feeling ?? null, episodes:r.episodes ?? 0, watchedAt:r.watchedAt ?? null, ...('wontWatch' in r ? {wontWatch:r.wontWatch} : {}) };
  }
  return result;
}
