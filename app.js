const defaultEntries = [
  { id: 1, type: 'service', title: 'Olje og oljefilter', date: '2026-08-23', mileage: '82 400 km', place: 'Møller Bil Lillestrøm', cost: 2890 },
  { id: 2, type: 'repair', title: 'Byttet bremseskiver foran', date: '2026-04-14', mileage: '76 890 km', place: 'Mekonomen Skedsmo', cost: 6490 },
  { id: 3, type: 'tire', title: 'Sommerdekk på', date: '2026-04-07', mileage: '76 430 km', place: 'Hjemme', cost: 0 },
];
const typeInfo = { service: ['🔧', 'service'], repair: ['🛠️', 'repair'], tire: ['🛞', 'tire'], other: ['📌', 'other'] };
const translations = {
  nb: { myVehicle: 'MIN BIL', entries: 'hendelser', latestService: 'siste service', decoderTitle: 'Feilkodehjelp', decoderIntro: 'Lim inn en feilkode fra OBD-leseren, så får du en enkel forklaring og forslag til neste steg.', dtcPlaceholder: 'For eksempel P0420', decodeButton: 'Forklar kode', inputHint: 'Støtter generiske P-, B-, C- og U-koder. Merke-spesifikke koder kan variere.', history: 'HISTORIKK', logbook: 'Bilens loggbok', filter: 'Filter', all: 'Alle', service: 'Service', repair: 'Reparasjon', tire: 'Dekk', other: 'Annet', noMatches: 'Ingen treff', noMatchesHint: 'Prøv et annet filter, eller legg til en ny hendelse.', add: 'Legg til', deleteEntry: 'Slett hendelse', deleteConfirm: 'Slette denne hendelsen permanent?', symptoms: 'Symptomer', causes: 'Vanlige årsaker', solution: 'Hva kan løse det', loading: 'Henter og oversetter forklaring fra OBDex…', translating: 'Oversetter…', invalidCode: 'Bruk en femtegns OBD-II-kode, for eksempel', genericCode: 'Generisk OBD-II-feilkode', saveDtc: '＋ Lagre i bilens loggbok', savedDtc: '✓ Lagret i bilens loggbok', categories: { P: 'Motor og drivlinje', B: 'Karosseri og komfort', C: 'Chassis', U: 'Kommunikasjon og nettverk' } },
  en: { myVehicle: 'MY CAR', entries: 'entries', latestService: 'latest service', decoderTitle: 'Trouble code help', decoderIntro: 'Paste a code from your OBD reader to get a clear explanation and suggested next steps.', dtcPlaceholder: 'For example P0420', decodeButton: 'Explain code', inputHint: 'Supports generic P, B, C and U codes. Manufacturer-specific codes may vary.', history: 'HISTORY', logbook: 'Vehicle logbook', filter: 'Filter', all: 'All', service: 'Service', repair: 'Repair', tire: 'Tires', other: 'Other', noMatches: 'No matches', noMatchesHint: 'Try another filter or add a new entry.', add: 'Add', deleteEntry: 'Delete entry', deleteConfirm: 'Permanently delete this entry?', symptoms: 'Symptoms', causes: 'Common causes', solution: 'What may fix it', loading: 'Loading OBDex explanation…', translating: 'Loading…', invalidCode: 'Use a five-character OBD-II code, for example', genericCode: 'Generic OBD-II trouble code', saveDtc: '＋ Save to vehicle logbook', savedDtc: '✓ Saved to vehicle logbook', categories: { P: 'Powertrain', B: 'Body and comfort', C: 'Chassis', U: 'Communication and network' } },
  
};
const fleetTranslations = { nb: { fleet: 'BILPARK', myVehicles: 'Mine biler', addVehicle: 'Legg til bil', vehicles: 'biler', totalCost: 'totale kostnader', registrations: 'hendelser' }, en: { fleet: 'FLEET', myVehicles: 'My vehicles', addVehicle: 'Add vehicle', vehicles: 'vehicles', totalCost: 'total costs', registrations: 'events' } };
const dtcLibrary = {
  P0101: ['Ugyldig luftmengdesignal (MAF)', 'Luftmengdemåleren eller luftinntaket gir en verdi utenfor forventet område.', 'Sjekk luftfilter, innsugsslanger og kontakt til luftmengdemåleren.'],
  P0128: ['Motortemperatur under normal driftstemperatur', 'Motoren bruker lengre tid enn forventet på å bli varm.', 'Kontroller kjølevæskenivå og få termostat / temperatursensor vurdert.'],
  P0171: ['Drivstoffblanding for mager (bank 1)', 'Motorstyringen registrerer for mye luft eller for lite drivstoff.', 'Se etter vakuumlekkasje og kontroller luftinntak, MAF-sensor og drivstoffsystem.'],
  P0300: ['Tilfeldig / flere feiltenninger oppdaget', 'Motoren har ujevn forbrenning i én eller flere sylindre.', 'Unngå hard belastning. Verksted bør kontrollere tennplugger, tennspoler, innsprøytning og luftlekkasjer.'],
  P0301: ['Feiltenning i sylinder 1', 'Motorstyringen har registrert ujevn forbrenning i sylinder 1.', 'Kontroller tennplugg og tennspole. Ved blinkende motorlampe: stopp bilen trygt og få hjelp.'],
  P0302: ['Feiltenning i sylinder 2', 'Motorstyringen har registrert ujevn forbrenning i sylinder 2.', 'Kontroller tennplugg og tennspole. Ved blinkende motorlampe: stopp bilen trygt og få hjelp.'],
  P0303: ['Feiltenning i sylinder 3', 'Motorstyringen har registrert ujevn forbrenning i sylinder 3.', 'Kontroller tennplugg og tennspole. Ved blinkende motorlampe: stopp bilen trygt og få hjelp.'],
  P0304: ['Feiltenning i sylinder 4', 'Motorstyringen har registrert ujevn forbrenning i sylinder 4.', 'Kontroller tennplugg og tennspole. Ved blinkende motorlampe: stopp bilen trygt og få hjelp.'],
  P0401: ['For lav EGR-strømning', 'Eksosresirkuleringen har lavere gjennomstrømning enn forventet.', 'La verksted kontrollere EGR-ventil, rør og avleiringer.'],
  P0420: ['Katalysatoreffektivitet under grense (bank 1)', 'Systemet registrerer at katalysatoren renser eksosen dårligere enn forventet.', 'Ikke bytt katalysator kun på grunn av koden. Verksted bør først kontrollere eksoslekkasje, lambdasonder og feiltenning.'],
  P0442: ['Liten lekkasje i fordampningssystemet', 'EVAP-systemet har en liten mulig lekkasje.', 'Kontroller at tanklokket sitter riktig. Kommer koden tilbake, få systemet testet.'],
  P0455: ['Stor lekkasje i fordampningssystemet', 'EVAP-systemet klarer ikke å holde forventet trykk.', 'Sjekk tanklokket først. Hvis det er i orden, bør slanger og ventiler kontrolleres på verksted.'],
  U0100: ['Mistet kommunikasjon med motorstyring', 'En styreenhet får ikke kontakt med motorstyringen over bilens nettverk.', 'Sjekk batterispenning og om flere varsellamper er på. Ved vedvarende feil bør bilen diagnostiseres på verksted.']
};
const obdexUrl = 'https://foerbsnavi.github.io/OBDex/generic.min.json';
const translationUrl = 'https://api.mymemory.translated.net/get';
let obdexCodesPromise = null;
const translationCache = JSON.parse(localStorage.getItem('bilbok-obdex-no') || '{}');
let data = JSON.parse(localStorage.getItem('bilbok-data') || 'null') || { vehicle: { name: 'Volvo V60', meta: '2019 · AB 12345' }, entries: defaultEntries };
if (!data.vehicles) {
  const vehicleId = data.vehicle?.id || Date.now();
  data = { vehicles: [{ id: vehicleId, ...data.vehicle, entries: data.entries || [] }], activeVehicleId: vehicleId };
  localStorage.setItem('bilbok-data', JSON.stringify(data));
}
let activeFilter = 'all';
let lastDecoded = null;
let language = localStorage.getItem('bilbok-language');
let workshopPlaces = [];
let workshopFilter = 'all';
if (!['nb', 'en'].includes(language)) language = 'nb';
const $ = (id) => document.getElementById(id);
const t = (key) => translations[language]?.[key] || translations.nb[key] || key;
const ft = (key) => fleetTranslations[language]?.[key] || fleetTranslations.nb[key] || key;
const activeVehicle = () => data.vehicles.find(vehicle => vehicle.id === data.activeVehicleId) || data.vehicles[0];
const formatDate = (date) => new Intl.DateTimeFormat({ nb: 'nb-NO', en: 'en-GB' }[language], { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
function updateLanguage() { document.documentElement.lang = language; $('languageSelect').value = language; document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); }); document.querySelectorAll('[data-fleet-i18n]').forEach(element => { element.textContent = ft(element.dataset.fleetI18n); }); document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); }); render(); }
function openMenuPanel(panelId) { document.querySelectorAll('.menu-panel').forEach(panel => panel.classList.toggle('hidden', panel.id !== panelId)); const panel = $(panelId); requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' })); }
function persist() { localStorage.setItem('bilbok-data', JSON.stringify(data)); }
function render() {
  const vehicle = activeVehicle();
  $('vehicleName').textContent = vehicle.name; $('vehicleMeta').textContent = vehicle.meta;
  $('entryCount').textContent = vehicle.entries.length;
  const sorted = [...vehicle.entries].sort((a,b) => b.date.localeCompare(a.date));
  $('latestDate').textContent = sorted[0] ? formatDate(sorted[0].date) : '—';
  $('removeVehicleButton').disabled = data.vehicles.length === 1;
  const fleetEntries = data.vehicles.flatMap(item => item.entries || []);
  const fleetCost = fleetEntries.reduce((total, item) => total + Number(item.cost || 0), 0);
  $('fleetVehicleCount').textContent = data.vehicles.length;
  $('fleetEntryCount').textContent = fleetEntries.length;
  $('fleetCost').textContent = `${fleetCost.toLocaleString({ nb: 'nb-NO', en: 'en-GB' }[language])} kr`;
  $('fleetList').innerHTML = data.vehicles.map(item => { const entries = item.entries || []; const latest = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0]; return `<button class="fleet-vehicle ${item.id === vehicle.id ? 'active' : ''}" data-vehicle-id="${item.id}"><span>🚙</span><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.meta)} · ${entries.length} ${ft('registrations')}</small></span><time>${latest ? formatDate(latest.date) : '—'}</time></button>`; }).join('');
  document.querySelectorAll('.fleet-vehicle').forEach(button => button.onclick = () => { data.activeVehicleId = Number(button.dataset.vehicleId); persist(); render(); });
  const visible = activeFilter === 'all' ? sorted : sorted.filter(item => item.type === activeFilter);
  $('entries').innerHTML = visible.map(item => { const [icon, labelKey] = typeInfo[item.type]; return `<article class="entry"><div class="entry-icon ${item.type}">${icon}</div><div class="entry-main"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.place || t(labelKey))}${item.mileage ? ` · ${escapeHtml(item.mileage)}` : ''}</p></div><div class="entry-date"><strong>${formatDate(item.date)}</strong>${item.cost ? `${Number(item.cost).toLocaleString({ nb: 'nb-NO', en: 'en-GB' }[language])} kr` : '—'}</div><button class="delete-entry" data-entry-id="${item.id}" aria-label="${t('deleteEntry')}" title="${t('deleteEntry')}">×</button></article>`; }).join('');
  $('emptyState').classList.toggle('hidden', visible.length > 0);
  document.querySelectorAll('.delete-entry').forEach(button => button.onclick = () => {
    if (!confirm(t('deleteConfirm'))) return;
    vehicle.entries = vehicle.entries.filter(item => item.id !== Number(button.dataset.entryId));
    persist();
    render();
  });
}
function escapeHtml(value) { const el = document.createElement('div'); el.textContent = value; return el.innerHTML; }
$('addButton').onclick = () => { const form = $('entryForm'); form.reset(); form.elements.namedItem('date').valueAsDate = new Date(); $('entryDialog').showModal(); };
$('editVehicle').onclick = () => { const vehicle = activeVehicle(); const form = $('vehicleForm'); form.elements.namedItem('name').value = vehicle.name; form.elements.namedItem('meta').value = vehicle.meta; $('vehicleDialog').showModal(); };
$('addVehicleButton').onclick = () => { $('addVehicleForm').reset(); $('addVehicleDialog').showModal(); };
$('removeVehicleButton').onclick = () => { if (data.vehicles.length === 1) return; const vehicle = activeVehicle(); if (!confirm(`Slette ${vehicle.name} og alle registreringene permanent?`)) return; data.vehicles = data.vehicles.filter(item => item.id !== vehicle.id); data.activeVehicleId = data.vehicles[0].id; persist(); render(); };
$('filterButton').onclick = () => $('filterRow').classList.toggle('hidden');
document.querySelectorAll('.chip').forEach(button => button.onclick = () => { activeFilter = button.dataset.filter; document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === button)); render(); });
$('entryForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); activeVehicle().entries.push({ id: Date.now(), type: form.get('type'), title: form.get('title').trim(), date: form.get('date'), mileage: form.get('mileage') ? `${Number(form.get('mileage')).toLocaleString('nb-NO')} km` : '', place: form.get('place').trim(), cost: form.get('cost') || 0, note: form.get('note').trim() }); persist(); $('entryDialog').close(); render(); });
$('vehicleForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); Object.assign(activeVehicle(), { name: form.get('name').trim(), meta: form.get('meta').trim() }); persist(); $('vehicleDialog').close(); render(); });
$('addVehicleForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const vehicle = { id: Date.now(), name: form.get('name').trim(), meta: form.get('meta').trim(), entries: [] }; data.vehicles.push(vehicle); data.activeVehicleId = vehicle.id; persist(); $('addVehicleDialog').close(); render(); });
function categoryForCode(code) { return t('categories')[code[0]]; }
function loadObdexCodes() {
  if (!obdexCodesPromise) {
    obdexCodesPromise = fetch(obdexUrl).then(response => {
      if (!response.ok) throw new Error(`OBDex svarte med ${response.status}`);
      return response.json();
    }).then(codes => new Map(codes.map(item => [item.code, item]))).catch(() => null);
  }
  return obdexCodesPromise;
}
async function translateToNorwegian(text) {
  if (!text) return text;
  if (translationCache[text] && translationCache[text] !== text) return translationCache[text];
  try {
    const url = new URL(translationUrl);
    url.searchParams.set('q', text);
    url.searchParams.set('langpair', 'en|no');
    const response = await fetch(url);
    const result = await response.json();
    const translated = result.responseData?.translatedText;
    if (translated && translated !== text) {
      translationCache[text] = translated;
      localStorage.setItem('bilbok-obdex-no', JSON.stringify(translationCache));
      return translated;
    }
  } catch { }
  return text;
}
async function obdexInfo(item) {
  const sourceLanguage = 'en';
  const title = item.title?.[sourceLanguage] || item.title?.en || item.title?.de || 'OBD-II-feilkode';
  const description = item.description?.[sourceLanguage] || item.description?.en || item.description?.de || 'OBDex har ingen beskrivelse for denne koden.';
  const causes = (item.common_causes || []).map(cause => cause.label?.[sourceLanguage] || cause.label?.en || cause.label?.de).filter(Boolean);
  const symptoms = (item.symptoms || []).map(symptom => symptom[sourceLanguage] || symptom.en || symptom.de).filter(Boolean);
  const repair = item.repair || {};
  const repairParts = [];
  if (repair.difficulty) repairParts.push(`Vanskelighetsgrad: ${repair.difficulty}.`);
  if (repair.diy_possible === true) repairParts.push('Dette kan i noen tilfeller gjøres selv.');
  if (repair.diy_possible === false) repairParts.push('Dette bør vurderes eller utføres av verksted.');
  if (repair.estimated_hours?.length === 2) repairParts.push(`Anslått arbeidstid: ${repair.estimated_hours[0]}–${repair.estimated_hours[1]} timer.`);
  if (language !== 'nb') return { title, detail: description, nextStep: repairParts.join(' ') || 'Record the code and symptoms before clearing it.', causes, symptoms, solution: repairParts.join(' ') };
  const [norwegianTitle, norwegianDescription, norwegianCauses, norwegianSymptoms] = await Promise.all([translateToNorwegian(title), translateToNorwegian(description), Promise.all(causes.map(translateToNorwegian)), Promise.all(symptoms.map(translateToNorwegian))]);
  return { title: norwegianTitle, detail: norwegianDescription, nextStep: repairParts.join(' ') || 'Skriv ned koden og symptomene før du sletter den. Få bilen vurdert hvis feilen kommer tilbake.', causes: norwegianCauses, symptoms: norwegianSymptoms, solution: repairParts.join(' ') };
}
function detailList(title, items) { return items.length ? `<div class="decode-detail"><h4>${title}</h4><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''; }
function showDecode(code, info) { const normalized = Array.isArray(info) ? { title: info[0], detail: info[1], nextStep: info[2], causes: [], symptoms: [], solution: '' } : info; lastDecoded = { code, title: normalized.title, detail: normalized.detail }; $('decodeResult').innerHTML = `<div class="result-topline"><span class="result-code">${code}</span><span>${categoryForCode(code)}</span></div><h3>${escapeHtml(normalized.title)}</h3><p>${escapeHtml(normalized.detail)}</p>${detailList(t('symptoms'), normalized.symptoms)}${detailList(t('causes'), normalized.causes)}<p class="next-step"><strong>${t('solution')}:</strong> ${escapeHtml(normalized.nextStep)}</p><button class="save-dtc" id="saveDtcButton">${t('saveDtc')}</button>`; $('decodeResult').classList.remove('hidden'); $('saveDtcButton').onclick = saveDtcToLog; }
async function decodeDtc() { const code = $('dtcInput').value.trim().toUpperCase().replace(/\s/g, ''); $('dtcInput').value = code; if (!/^[PBCU][0-9A-F]{4}$/.test(code)) { $('decodeResult').innerHTML = `<p>${t('invalidCode')} <strong>P0420</strong>.</p>`; $('decodeResult').classList.remove('hidden'); return; } const fallback = [t('genericCode'), `${categoryForCode(code)}. AutoLog has no detailed explanation for this code yet.`, 'Record the code and symptoms before clearing it.']; const localInfo = dtcLibrary[code]; if (localInfo && language === 'nb') { showDecode(code, localInfo); return; } $('decodeButton').disabled = true; $('decodeButton').textContent = t('translating'); $('decodeResult').innerHTML = `<p>${t('loading')}</p>`; $('decodeResult').classList.remove('hidden'); const codes = await loadObdexCodes(); const obdexMatch = codes?.get(code); showDecode(code, obdexMatch ? await obdexInfo(obdexMatch) : fallback); $('decodeButton').disabled = false; $('decodeButton').textContent = t('decodeButton'); }
function saveDtcToLog() { if (!lastDecoded) return; activeVehicle().entries.push({ id: Date.now(), type: 'other', title: `${lastDecoded.code} · ${lastDecoded.title}`, date: new Date().toISOString().slice(0, 10), mileage: '', place: 'OBD-II avlesning', cost: 0, note: lastDecoded.detail }); persist(); render(); $('saveDtcButton').textContent = t('savedDtc'); $('saveDtcButton').disabled = true; }
function distanceInKm(latitude, longitude, place) { const radians = Math.PI / 180; const latitudeDelta = (place.latitude - latitude) * radians; const longitudeDelta = (place.longitude - longitude) * radians; const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitude * radians) * Math.cos(place.latitude * radians) * Math.sin(longitudeDelta / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); }
function renderWorkshops() { const visible = workshopPlaces.filter(place => workshopFilter === 'all' || (workshopFilter === 'dealer' ? place.isDealer : !place.isDealer)); $('workshopResults').innerHTML = visible.length ? visible.map(place => `<a class="workshop-result" href="https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=17/${place.latitude}/${place.longitude}" target="_blank" rel="noopener"><span><strong>${escapeHtml(place.name)}</strong><small>${escapeHtml(place.address || 'Adresse ikke oppgitt')} · ${place.isDealer ? 'Forhandler' : 'Selvstendig verksted'}</small></span><em>${place.distance.toFixed(1)} km</em></a>`).join('') : '<p class="workshop-status">Ingen verksteder passer med dette filteret.</p>'; }
async function findWorkshops(position) { const { latitude, longitude } = position.coords; $('locateWorkshops').disabled = true; $('locateWorkshops').textContent = 'Søker…'; $('workshopStatus').textContent = 'Søker etter verksteder innen 15 km…'; const query = `[out:json][timeout:25];(nwr(around:15000,${latitude},${longitude})["shop"="car_repair"];nwr(around:15000,${latitude},${longitude})["amenity"="car_repair"];);out center tags;`; try { const response = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: `data=${encodeURIComponent(query)}` }); if (!response.ok) throw new Error('Søket feilet'); const result = await response.json(); const seen = new Set(); workshopPlaces = result.elements.map(item => { const itemLatitude = item.lat || item.center?.lat; const itemLongitude = item.lon || item.center?.lon; const tags = item.tags || {}; return itemLatitude && itemLongitude ? { name: tags.name || 'Verksted', address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean).join(' '), isDealer: Boolean(tags.brand || tags['brand:wikidata']), latitude: itemLatitude, longitude: itemLongitude } : null; }).filter(Boolean).filter(place => { const key = `${place.name}-${place.latitude}-${place.longitude}`; if (seen.has(key)) return false; seen.add(key); place.distance = distanceInKm(latitude, longitude, place); return true; }).sort((a, b) => a.distance - b.distance).slice(0, 20); const box = .08; $('workshopMap').src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - box}%2C${latitude - box}%2C${longitude + box}%2C${latitude + box}&layer=mapnik&marker=${latitude}%2C${longitude}`; $('workshopMap').classList.add('visible'); $('workshopFilters').hidden = false; $('workshopStatus').textContent = workshopPlaces.length ? `${workshopPlaces.length} verksteder funnet. Trykk på et verksted for å åpne kartet.` : 'Fant ingen registrerte verksteder i nærheten.'; renderWorkshops(); } catch { $('workshopStatus').textContent = 'Kunne ikke hente verksteder akkurat nå. Prøv igjen om litt.'; } finally { $('locateWorkshops').disabled = false; $('locateWorkshops').textContent = '⌖ Finn nær meg'; } }
$('locateWorkshops').onclick = () => { if (!navigator.geolocation) { $('workshopStatus').textContent = 'Posisjonstjenester støttes ikke i denne nettleseren.'; return; } $('workshopStatus').textContent = 'Henter posisjonen din…'; navigator.geolocation.getCurrentPosition(findWorkshops, error => { const message = { 1: 'Posisjonstillatelse er avslått. Tillat posisjon for AutoLog i nettleser- eller iPhone-innstillingene.', 2: 'Posisjon er tillatt, men enheten kan ikke levere en nåværende posisjon. Sjekk at Stedstjenester er på, og prøv igjen.', 3: 'Det tok for lang tid å hente posisjonen. Prøv igjen når du har bedre dekning.' }[error.code] || 'Kunne ikke hente posisjonen akkurat nå. Prøv igjen.'; $('workshopStatus').textContent = message; }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }); };
document.querySelectorAll('.workshop-filter').forEach(button => button.onclick = () => { workshopFilter = button.dataset.workshopFilter; document.querySelectorAll('.workshop-filter').forEach(item => item.classList.toggle('active', item === button)); renderWorkshops(); });
$('decodeButton').onclick = decodeDtc;
$('dtcInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); decodeDtc(); } });
$('languageSelect').onchange = (event) => { language = event.target.value; localStorage.setItem('bilbok-language', language); updateLanguage(); };
$('moreButton').onclick = () => $('appMenu').showModal();
$('closeMenu').onclick = () => $('appMenu').close();
document.querySelectorAll('.menu-option').forEach(button => button.onclick = () => { $('appMenu').close(); openMenuPanel(button.dataset.panel); });
updateLanguage();
