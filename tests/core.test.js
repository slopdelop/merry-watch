import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {belongs,isAvailable,validateBackup,localDay,compareMovies} from '../core.js';
const c=JSON.parse(fs.readFileSync(new URL('../catalogue.json',import.meta.url),'utf8'));
test('the supplied Hallmark slate has 34 movies and excludes scripted series',()=>{
  assert.equal(c.movies.filter(m=>m.type==='movie').length,34);
  assert.equal(c.movies.filter(m=>m.service==='Hallmark+').length,35);
  assert.ok(!c.movies.some(m=>m.title.includes('Mistletoe Murders')));
  assert.equal(new Set(c.movies.map(m=>m.id)).size,c.movies.length);
  for(const m of c.movies){assert.ok(m.synopsis&&m.image&&m.source);if(m.service==='Hallmark+'){const d=new Date(m.premiere+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);assert.equal(m.streaming,d.toISOString().slice(0,10));}}
});
test('streaming date, not television date, determines available section',()=>{
  const m=c.movies.find(m=>m.id==='forgotten-holiday');
  assert.equal(isAvailable(m,'2026-10-24'),false);
  assert.equal(belongs(m,'soon',{},'2026-10-24'),true);
  assert.equal(isAvailable(m,'2026-10-25'),true);
  assert.equal(belongs(m,'watch',{},'2026-10-25'),true);
});
test('watched status removes a title from both unwatched sections',()=>{
  const m=c.movies[0],r={[m.id]:{watched:true,feeling:'Holiday magic'}};
  assert.equal(belongs(m,'watched',r,'2026-10-24'),true);
  assert.equal(belongs(m,'watch',r,'2026-10-24'),false);
  assert.equal(belongs(m,'soon',r,'2026-10-15'),false);
});
test('unconfirmed streaming date is never treated as available',()=>{
  const m=c.movies.find(m=>m.id==='holiday-baking-championship');
  assert.equal(isAvailable(m,'2027-01-01'),false);
  assert.equal(belongs(m,'soon',{},'2027-01-01'),true);
  const light=c.movies.find(m=>m.id==='great-christmas-light-fight');
  assert.equal(isAvailable(light,'2026-10-24'),true);
  assert.equal(light.premiere,null);
});
test('episode progress leaves a show in To watch until explicitly finished',()=>{
  const m=c.movies.find(m=>m.id==='great-christmas-light-fight');
  const r={[m.id]:{watched:false,episodes:3}};
  assert.equal(belongs(m,'watch',r,'2026-10-24'),true);
  assert.equal(belongs(m,'watched',r,'2026-10-24'),false);
});
test('backup round trip preserves ratings and rejects malformed records atomically',()=>{
  const id=c.movies[0].id;const r={[id]:{watched:true,feeling:'Great',episodes:0,watchedAt:'2026-10-24T20:00:00.000Z'}};
  const backup={app:'merry-watch',version:1,records:r};
  assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(backup)),c.movies),r);
  assert.throws(()=>validateBackup({...backup,records:{[id]:{watched:'yes'}}},c.movies));
  assert.throws(()=>validateBackup({...backup,records:{[id]:{watched:true,feeling:'invalid'}}},c.movies));
  assert.deepEqual(validateBackup({...backup,records:{unknown:{watched:true}}},c.movies),{});
  assert.throws(()=>validateBackup({records:r},c.movies));
});
test('calendar day does not use UTC conversion',()=>assert.equal(localDay(new Date(2026,9,24,23,59)),'2026-10-24'));
test('unconfirmed stream dates appear after all dated releases',()=>{
  const sorted=[...c.movies].filter(m=>belongs(m,'soon',{},'2026-10-24')).sort((a,b)=>compareMovies(a,b,'soon',{}));
  assert.equal(sorted.at(-1).id,'holiday-baking-championship');
});
