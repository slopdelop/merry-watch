import { FEELINGS, localDay, isAvailable, belongs, compareMovies, validateBackup } from './core.js?v=8';
const $ = s => document.querySelector(s);
const KEY = 'merry-watch-v1';
const symbols = ['☁','◒','❋','★','✧'];
const labels = {watch:'To watch',soon:'Coming soon',watched:'Watched'};
const ticket = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Z"/><path d="m9 12 2 2 4-4"/></svg>';
const escapeHTML = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalogue, movies=[], records={}, section='watch', selected=null, ratingMovie=null, ratingReturn=null, storageOK=true, toastTimer, previousDay=localDay();
let sectionScroll={watch:0,soon:0,watched:0};
function notify(message,undo) {
  clearTimeout(toastTimer); const el=$('#toast'); el.replaceChildren(document.createTextNode(message));
  if(undo){const b=document.createElement('button');b.textContent='Undo';b.onclick=()=>{undo();el.hidden=true;};el.append(b);}
  el.hidden=false;toastTimer=setTimeout(()=>el.hidden=true,undo?7000:4500);
}
function save(next) {
  try {localStorage.setItem(KEY,JSON.stringify({app:'merry-watch',version:1,records:next}));storageOK=true;}
  catch {storageOK=false;notify('Couldn’t save on this device. Export a backup to keep your changes.');}
  records=next;
}
function readStorage(){
  try{const raw=localStorage.getItem(KEY);if(raw)records=validateBackup(JSON.parse(raw),movies);}
  catch{storageOK=false;notify('Saved data could not be read. Your original saved data has been left untouched.');}
}
function shortDate(day,weekday=false){return day?new Date(day+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',...(weekday?{weekday:'short'}:{})}):'To be announced';}
function dateLabel(m){
  if(m.releaseStatus)return m.releaseStatus;
  if(m.available) return 'Available seasons · streaming now';
  if(!m.streaming) return m.premiere?`TV ${shortDate(m.premiere)} · streaming TBA`:'Streaming date to be confirmed';
  const today=localDay(),tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
  if(m.streaming===today)return 'Streaming today';
  if(m.streaming===localDay(tomorrow))return 'Streaming tomorrow';
  return m.streaming<today?`Streaming since ${shortDate(m.streaming)}`:`Streaming ${shortDate(m.streaming,true)}`;
}
function imageMarkup(m,detail=false){
  if(detail)return `<img class="detail-image${m.imageFit==='contain'?' contain':''}" src="${escapeHTML(m.image)}" alt="${escapeHTML(m.title)} — ${m.imageKind==='cookie'?'cookie illustration':'promotional artwork'}">`;
  return `<div class="thumb-wrap"><span class="thumb-fallback" aria-hidden="true">${m.type==='series'?'❋':'✧'}</span><img src="${escapeHTML(m.thumbnail??m.image)}" alt="" loading="lazy" width="108" height="108">${m.type!=='movie'?`<span class="movie-type">${m.type==='series'?'Festive show':'Special'}</span>`:''}</div>`;
}
function bindImageFallbacks(root){root.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>{img.hidden=true;if(img.classList.contains('detail-image'))img.outerHTML='<div class="detail-image" style="display:grid;place-items:center;font-size:45px" aria-label="Official artwork unavailable">✧</div>';},{once:true});});}
function visibleMovies(){
  return movies.filter(m=>belongs(m,section,records)).sort((a,b)=>compareMovies(a,b,section,records));
}
function render(){
  $('#section-title').textContent=labels[section];
  $('#wont-watch-link').hidden=section!=='watched';
  const list=visibleMovies();
  $('.shop-row').dataset.state=section;
  $('#shop-art').src=`assets/shops-${section}-v2.webp`;
  document.querySelectorAll('.shop').forEach(b=>{const active=b.dataset.section===section;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  let group='',out='';
  for(const m of list){
    const r=records[m.id];
    const groupName=section==='soon'?(m.streaming?new Date(m.streaming+'T12:00:00').toLocaleDateString(undefined,{month:'long'}):'Streaming dates to confirm'):'';
    if(groupName!==group){group=groupName;out+=`<h3 class="movie-group-title">${escapeHTML(group)}</h3>`;}
    out+=`<article class="movie-card"><button class="movie-open" data-id="${m.id}" aria-label="Details for ${escapeHTML(m.title)}">${imageMarkup(m)}<div class="movie-copy"><h3 class="movie-title">${escapeHTML(m.title)}</h3><span class="movie-service">${escapeHTML(m.service)}${m.subtitle?' · '+escapeHTML(m.subtitle):''}</span><p class="movie-date">${escapeHTML(dateLabel(m))}</p><p class="movie-tagline">${escapeHTML(m.tagline)}</p>${r?.watched?`<span class="reaction-badge">${escapeHTML(r.feeling??'Watched · not rated')}</span>`:r?.episodes?`<div class="episode-badge">${r.episodes} episode${r.episodes===1?'':'s'} watched</div>`:''}</div><span class="row-chevron" aria-hidden="true">›</span></button></article>`;
  }
  if(!list.length){out=`<div class="empty"><span class="symbol" aria-hidden="true">${section==='watched'?'♡':'✧'}</span><h3>${section==='watched'?'Nothing watched yet':section==='watch'?'All caught up':'Nothing scheduled yet'}</h3><p>${section==='watched'?'Mark a title watched to add it here.':section==='watch'?'Visit Coming soon to see what’s arriving next.':'New releases will appear when the collection is updated.'}</p></div>`;}
  $('#movie-list').innerHTML=out;$('#movie-list').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openDetail(b.dataset.id));bindImageFallbacks($('#movie-list'));
  if($('#wont-watch-dialog').open)renderWontWatchList();
}
function switchSection(next){sectionScroll[section]=window.scrollY;section=next;render();window.scrollTo({top:sectionScroll[next],behavior:'instant'});}
function openDetail(id){
  selected=movies.find(m=>m.id===id);const m=selected,r=records[id];
  $('#detail-content').innerHTML=`<div class="sheet-close-bar"><button class="close-sheet" data-close aria-label="Close movie details">×</button></div>${imageMarkup(m,true)}<div class="detail-body"><span class="service-pill">${escapeHTML(m.service)}${m.subtitle?' · '+escapeHTML(m.subtitle):''}</span><h2>${escapeHTML(m.title)}</h2>${r?.watched?`<span class="reaction-badge">${escapeHTML(r.feeling??'Watched · not rated')}</span>`:''}<p class="detail-description">${escapeHTML(m.synopsis)}</p><div class="detail-dates"><div><span>Streaming</span><strong>${m.releaseStatus?escapeHTML(m.releaseStatus):m.available?'Existing seasons available':m.streaming?shortDate(m.streaming,true):'Date to be confirmed'}</strong></div>${m.previousStreaming?`<div><span>Last season on Hulu / Disney+</span><strong>${shortDate(m.previousStreaming)} · 2025</strong></div>`:''}${m.premiere&&(m.network!==m.service||!m.streaming)?`<div><span>${escapeHTML(m.network)} premiere</span><strong>${shortDate(m.premiere,true)}${m.airtime?' · '+escapeHTML(m.airtime):''}</strong></div>`:''}</div><p class="detail-note">${escapeHTML(m.availabilityNote)}</p>${m.releaseSource?`<a class="source-link" href="${escapeHTML(m.releaseSource)}" target="_blank" rel="noopener noreferrer">Confirmed season 13 streaming announcement ↗</a>`:''}${m.cast?`<p class="cast"><strong>${m.type==='series'?'Featuring':'Starring'}</strong> ${escapeHTML(m.cast)}</p>`:''}${m.type==='series'?`<div class="episode-controls"><button id="episode-minus" aria-label="Remove one watched episode" ${(r?.episodes??0)===0?'disabled':''}>−</button><output id="episode-count">${r?.episodes??0}${m.totalEpisodes?' / '+m.totalEpisodes:''} episode${(r?.episodes??0)===1?'':'s'} watched</output><button id="episode-plus" aria-label="Add one watched episode" ${m.totalEpisodes&&(r?.episodes??0)>=m.totalEpisodes?'disabled':''}>+</button></div><p class="detail-note">Episode count is a personal tally${m.subtitle?' for '+escapeHTML(m.subtitle.toLowerCase()):''}. The show stays here until you mark it finished.</p>`:''}<button class="primary" id="mark-watched">${ticket}${r?.watched?'Change my feeling':m.type==='series'?'Finish watching & rate':'Mark watched'}</button>${r?.watched?'<button class="secondary" id="mark-unwatched">Move back to unwatched</button>':'<button class="secondary wont-watch-button" id="mark-wont-watch">Won’t watch</button>'}<a class="source-link" href="${escapeHTML(m.source)}" target="_blank" rel="noopener noreferrer">${m.service==='Hulu'?'View Hulu listing':'Original listing & latest information'} ↗</a><p class="image-credit">${m.imageKind==='cookie'?'AI cookie illustration: ':'Official promotional artwork: © '}${escapeHTML(m.imageCredit)}</p></div>`;
  $('#detail-content').querySelector('[data-close]').onclick=()=>$('#detail-dialog').close();
  $('#mark-watched').onclick=()=>openRating(m);
  if(!r?.watched)$('#mark-wont-watch').onclick=()=>markWontWatch(m);
  if(r?.watched)$('#mark-unwatched').onclick=()=>{const before=structuredClone(records);save({...records,[id]:{...r,watched:false,feeling:null,watchedAt:null}});$('#detail-dialog').close();render();notify('Moved back to unwatched.',()=>{save(before);render();});};
  if(m.type==='series'){ $('#episode-minus').onclick=()=>setEpisodes(-1);$('#episode-plus').onclick=()=>setEpisodes(1); }
  bindImageFallbacks($('#detail-content'));if(!$('#detail-dialog').open)$('#detail-dialog').showModal();
}
function setEpisodes(delta){const m=selected;const r=records[m.id]??{watched:false,feeling:null,watchedAt:null,episodes:0};const count=Math.max(0,Math.min(m.totalEpisodes??10000,(r.episodes??0)+delta));save({...records,[m.id]:{...r,episodes:count}});render();openDetail(m.id);}
function openRating(m){ratingMovie=m;ratingReturn=$('#detail-dialog').open?m.id:null;$('#detail-dialog').close();$('#rating-title').textContent=m.title;$('#rating-options').innerHTML=FEELINGS.map((f,i)=>`<button class="rating-option" data-feeling="${f}" aria-pressed="${records[m.id]?.feeling===f}"><span aria-hidden="true">${symbols[i]}</span>${f}</button>`).join('');$('#rating-options').querySelectorAll('button').forEach(b=>b.onclick=()=>markWatched(b.dataset.feeling));$('#rating-dialog').showModal();}
function markWatched(feeling){const m=ratingMovie,before=structuredClone(records);save({...records,[m.id]:{...(records[m.id]??{}),watched:true,wontWatch:false,feeling,episodes:records[m.id]?.episodes??0,watchedAt:new Date().toISOString()}});ratingReturn=null;$('#rating-dialog').close();render();notify(storageOK?`Saved in Watched${feeling?' · '+feeling:''}.`:'Watched for this session. Export a backup to keep it.',()=>{save(before);render();});}
$('#watched-no-rating').onclick=()=>markWatched(null);

function markWontWatch(m){
  const before=structuredClone(records);
  save({...records,[m.id]:{...(records[m.id]??{}),watched:false,wontWatch:true,feeling:null,watchedAt:null,episodes:records[m.id]?.episodes??0}});
  $('#detail-dialog').close();render();
  notify(storageOK?'Moved to Won’t watch. Find it inside Watched.':'Skipped for this session. Export a backup to keep it.',()=>{save(before);render();});
}
function renderWontWatchList(){
  const list=movies.filter(m=>belongs(m,'wontWatch',records)).sort((a,b)=>a.title.localeCompare(b.title));
  $('#wont-watch-list').innerHTML=list.length?list.map(m=>`<article class="skipped-card"><img src="${escapeHTML(m.thumbnail??m.image)}" alt="" loading="lazy" width="64" height="64"><div><h3>${escapeHTML(m.title)}</h3><p>${escapeHTML(m.service)}</p><button class="restore-button" data-restore="${m.id}" aria-label="Restore ${escapeHTML(m.title)}">Restore to ${isAvailable(m)?'To watch':'Coming soon'} <span aria-hidden="true">↗</span></button></div></article>`).join(''):'<div class="empty"><h3>Nothing skipped</h3><p>Titles you choose not to watch will appear here.</p></div>';
  $('#wont-watch-list').querySelectorAll('[data-restore]').forEach(button=>button.onclick=()=>{
    const m=movies.find(m=>m.id===button.dataset.restore);
    save({...records,[m.id]:{...records[m.id],wontWatch:false}});render();
    $('#wont-watch-status').textContent=`${m.title} restored to ${isAvailable(m)?'To watch':'Coming soon'}${storageOK?'':' for this session. Export a backup to keep it'}.`;
    ($('#wont-watch-list [data-restore]')??$('#wont-watch-dialog [data-close]')).focus();
  });
  bindImageFallbacks($('#wont-watch-list'));
}
$('#wont-watch-link').onclick=()=>{renderWontWatchList();$('#wont-watch-status').textContent='';$('#wont-watch-dialog').showModal();};

document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#rating-dialog').addEventListener('close',()=>{if(ratingReturn){const id=ratingReturn;ratingReturn=null;openDetail(id);}});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
document.querySelectorAll('.shop').forEach(b=>b.onclick=()=>switchSection(b.dataset.section));
function settings(){ $('#storage-status').textContent=storageOK?'Changes are stored on this device. Backups do not include movie artwork.':'Device storage is unavailable. Please export a backup before leaving.';$('#settings-dialog').showModal(); }
$('#settings').onclick=settings;$('#about').onclick=settings;
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify({app:'merry-watch',version:1,exportedAt:new Date().toISOString(),records},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`merry-watch-backup-${localDay()}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);notify('Watch list exported. Keep it somewhere safe.');};
$('#import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2_000_000)throw new Error('That file is too large to be a watch list backup.');const imported=validateBackup(JSON.parse(await file.text()),movies);save({...records,...imported});render();notify(storageOK?`Imported ${Object.keys(imported).length} watch records.`:'Imported for this session. Export a backup to keep it.');}catch(err){notify(err instanceof SyntaxError?'This file is not valid JSON. Nothing was imported.':err.message);}finally{e.target.value='';}};
window.addEventListener('storage',e=>{if(e.key===KEY){readStorage();render();}});
function refreshDate(){const day=localDay();if(day!==previousDay){previousDay=day;render();}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDate();});setInterval(refreshDate,60000);
try{const response=await fetch('catalogue.json?v=6');if(!response.ok)throw new Error('Catalogue request failed');catalogue=await response.json();movies=catalogue.movies;readStorage();render();for(const state of ['watch','soon','watched']){const image=new Image();image.src=`assets/shops-${state}-v2.webp`;}if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});}catch(error){$('#movie-list').innerHTML='<div class="empty"><h3>The village couldn’t open</h3><p>Please refresh while connected to the internet to load the collection.</p><button class="secondary" id="retry">Try again</button></div>';$('#retry').onclick=()=>location.reload();}
