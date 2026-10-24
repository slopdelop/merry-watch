import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {belongs,isAvailable,validateBackup,localDay,compareMovies} from '../core.js';
const c=JSON.parse(fs.readFileSync(new URL('../catalogue.json',import.meta.url),'utf8'));
test('the supplied Hallmark slate has 34 movies and excludes scripted series',()=>{
  assert.equal(c.movies.filter(m=>m.type==='movie'&&m.service==='Hallmark+').length,34);
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
  assert.equal(isAvailable(light,'2026-10-24'),false);
  assert.equal(light.premiere,null);
  assert.equal(light.streaming,null);
  assert.equal(light.previousStreaming,'2025-12-05');
  assert.equal(belongs(light,'soon',{},'2026-10-24'),true);
});
test('episode progress leaves a show in To watch until explicitly finished',()=>{
  const m=c.movies.find(m=>m.id==='wizards-of-baking');
  const r={[m.id]:{watched:false,episodes:3}};
  assert.equal(belongs(m,'watch',r,'2026-11-04'),true);
  assert.equal(belongs(m,'watched',r,'2026-11-04'),false);
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

test('won’t-watch titles stay hidden through release day and restore to the appropriate list',()=>{
  const m=c.movies.find(m=>m.id==='wizards-of-baking');
  const records={[m.id]:{watched:false,wontWatch:true,episodes:2,feeling:null,watchedAt:null}};
  for(const today of ['2026-10-24','2026-11-04','2027-01-01']){
    for(const section of ['watch','soon','watched'])assert.equal(belongs(m,section,records,today),false);
    assert.equal(belongs(m,'wontWatch',records,today),true);
  }
  records[m.id].wontWatch=false;
  assert.equal(belongs(m,'soon',records,'2026-10-24'),true);
  assert.equal(belongs(m,'watch',records,'2026-11-04'),true);
  assert.equal(belongs(m,'wontWatch',records,'2026-11-04'),false);
  assert.equal(records[m.id].episodes,2);
});

test('backups preserve won’t-watch choices and reject conflicting or malformed statuses',()=>{
  const id=c.movies[0].id;
  const records={[id]:{watched:false,wontWatch:true,feeling:null,episodes:2,watchedAt:null}};
  const backup={app:'merry-watch',version:1,records};
  assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(backup)),c.movies),records);
  assert.throws(()=>validateBackup({...backup,records:{[id]:{...records[id],wontWatch:'yes'}}},c.movies));
  assert.throws(()=>validateBackup({...backup,records:{[id]:{...records[id],watched:true}}},c.movies));
  assert.equal(validateBackup({...backup,records:{[id]:{...records[id],wontWatch:false}}},c.movies)[id].wontWatch,false);
});
test('unconfirmed stream dates appear after all dated releases',()=>{
  const sorted=[...c.movies].filter(m=>belongs(m,'soon',{},'2026-10-24')).sort((a,b)=>compareMovies(a,b,'soon',{}));
  const firstUnknown=sorted.findIndex(m=>!m.streaming);
  assert.ok(firstUnknown>=0);
  assert.ok(sorted.slice(0,firstUnknown).every(m=>m.streaming));
  assert.ok(sorted.slice(firstUnknown).every(m=>!m.streaming));
});
test('every title has its own local cookie and correctly identified detail artwork',()=>{
  assert.equal(new Set(c.movies.map(m=>m.thumbnail)).size,c.movies.length);
  for(const movie of c.movies){
    assert.ok(movie.thumbnail.startsWith('assets/cookies-'));
    if(movie.imageKind!=='cookie')assert.notEqual(movie.thumbnail,movie.image);
    assert.ok(fs.existsSync(new URL('../'+movie.thumbnail,import.meta.url)),movie.id);
    assert.ok(fs.existsSync(new URL('../'+movie.image,import.meta.url)),movie.id+' detail artwork');
  }
});

test('new streamer releases use their announced dates rather than the Hallmark next-day rule',()=>{
  const releases={
    'a-dogs-perfect-christmas':['Netflix','2026-11-04'],
    'the-gospel-of-christmas':['Netflix','2026-11-11'],
    'the-christmas-switch':['Netflix','2026-11-12'],
    'guarding-stars':['Netflix','2026-11-18'],
    'in-a-holidaze':['Netflix','2026-12-02'],
    'the-man-with-the-bag':['Prime Video','2026-12-02'],
    'twelve-days-of-snoopy':['Apple TV','2026-11-13'],
    'fraggle-rock-a-holiday-gift':['Apple TV','2026-12-04'],
    'gabbys-dollhouse-bakers-and-makers':['Netflix','2026-12-09'],
    'christmas-at-the-zoo':['Tubi','2026-11-10']
  };
  for(const [id,[service,date]] of Object.entries(releases)){
    const m=c.movies.find(m=>m.id===id);
    assert.ok(m,id);assert.equal(m.service,service);assert.equal(m.streaming,date);
    const before=new Date(date+'T12:00:00Z');before.setUTCDate(before.getUTCDate()-1);
    assert.equal(isAvailable(m,before.toISOString().slice(0,10)),false,id);
    assert.equal(isAvailable(m,date),true,id);
  }
  assert.equal(c.movies.find(m=>m.id==='gabbys-dollhouse-bakers-and-makers').totalEpisodes,4);
});
