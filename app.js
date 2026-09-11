const defaultEntries = [
  { id: 1, type: 'service', title: 'Olje og oljefilter', date: '2026-08-23', mileage: '82 400 km', place: 'Møller Bil Lillestrøm', cost: 2890 },
  { id: 2, type: 'repair', title: 'Byttet bremseskiver foran', date: '2026-04-14', mileage: '76 890 km', place: 'Mekonomen Skedsmo', cost: 6490 },
  { id: 3, type: 'tire', title: 'Sommerdekk på', date: '2026-04-07', mileage: '76 430 km', place: 'Hjemme', cost: 0 },
];
const typeInfo = { service: ['🔧', 'Service'], repair: ['🛠️', 'Reparasjon'], tire: ['🛞', 'Dekk'], other: ['📌', 'Annet'] };
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
let data = JSON.parse(localStorage.getItem('bilbok-data') || 'null') || { vehicle: { name: 'Volvo V60', meta: '2019 · AB 12345' }, entries: defaultEntries };
let activeFilter = 'all';
let lastDecoded = null;
const $ = (id) => document.getElementById(id);
const formatDate = (date) => new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
function persist() { localStorage.setItem('bilbok-data', JSON.stringify(data)); }
function render() {
  $('vehicleName').textContent = data.vehicle.name; $('vehicleMeta').textContent = data.vehicle.meta;
  $('entryCount').textContent = data.entries.length;
  const sorted = [...data.entries].sort((a,b) => b.date.localeCompare(a.date));
  $('latestDate').textContent = sorted[0] ? formatDate(sorted[0].date) : '—';
  const visible = activeFilter === 'all' ? sorted : sorted.filter(item => item.type === activeFilter);
  $('entries').innerHTML = visible.map(item => { const [icon, label] = typeInfo[item.type]; return `<article class="entry"><div class="entry-icon ${item.type}">${icon}</div><div class="entry-main"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.place || label)}${item.mileage ? ` · ${escapeHtml(item.mileage)}` : ''}</p></div><div class="entry-date"><strong>${formatDate(item.date)}</strong>${item.cost ? `${Number(item.cost).toLocaleString('nb-NO')} kr` : '—'}</div></article>`; }).join('');
  $('emptyState').classList.toggle('hidden', visible.length > 0);
}
function escapeHtml(value) { const el = document.createElement('div'); el.textContent = value; return el.innerHTML; }
$('addButton').onclick = () => { const form = $('entryForm'); form.reset(); form.elements.namedItem('date').valueAsDate = new Date(); $('entryDialog').showModal(); };
$('editVehicle').onclick = () => { const form = $('vehicleForm'); form.elements.namedItem('name').value = data.vehicle.name; form.elements.namedItem('meta').value = data.vehicle.meta; $('vehicleDialog').showModal(); };
$('filterButton').onclick = () => $('filterRow').classList.toggle('hidden');
document.querySelectorAll('.chip').forEach(button => button.onclick = () => { activeFilter = button.dataset.filter; document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === button)); render(); });
$('entryForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); data.entries.push({ id: Date.now(), type: form.get('type'), title: form.get('title').trim(), date: form.get('date'), mileage: form.get('mileage') ? `${Number(form.get('mileage')).toLocaleString('nb-NO')} km` : '', place: form.get('place').trim(), cost: form.get('cost') || 0, note: form.get('note').trim() }); persist(); $('entryDialog').close(); render(); });
$('vehicleForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); data.vehicle = { name: form.get('name').trim(), meta: form.get('meta').trim() }; persist(); $('vehicleDialog').close(); render(); });
function categoryForCode(code) { return { P: 'Motor og drivlinje', B: 'Karosseri og komfort', C: 'Chassis', U: 'Kommunikasjon og nettverk' }[code[0]]; }
function showDecode(code, info) { lastDecoded = { code, title: info[0], detail: info[1] }; $('decodeResult').innerHTML = `<div class="result-topline"><span class="result-code">${code}</span><span>${categoryForCode(code)}</span></div><h3>${escapeHtml(info[0])}</h3><p>${escapeHtml(info[1])}</p><p class="next-step"><strong>Neste steg:</strong> ${escapeHtml(info[2])}</p><button class="save-dtc" id="saveDtcButton">＋ Lagre i bilens loggbok</button>`; $('decodeResult').classList.remove('hidden'); $('saveDtcButton').onclick = saveDtcToLog; }
function decodeDtc() { const code = $('dtcInput').value.trim().toUpperCase().replace(/\s/g, ''); $('dtcInput').value = code; if (!/^[PBCU][0-9A-F]{4}$/.test(code)) { $('decodeResult').innerHTML = '<p>Bruk en femtegns OBD-II-kode, for eksempel <strong>P0420</strong>.</p>'; $('decodeResult').classList.remove('hidden'); return; } const fallback = ['Generisk OBD-II-feilkode', `Koden peker på ${categoryForCode(code).toLowerCase()}. AutoLog har ikke en lokal forklaring på akkurat denne koden ennå.`, 'Skriv ned koden og symptomer før du sletter den. Søk på merke og modell hos verksted, særlig hvis motorlampen blinker eller bilen oppfører seg annerledes.']; showDecode(code, dtcLibrary[code] || fallback); }
function saveDtcToLog() { if (!lastDecoded) return; data.entries.push({ id: Date.now(), type: 'other', title: `${lastDecoded.code} · ${lastDecoded.title}`, date: new Date().toISOString().slice(0, 10), mileage: '', place: 'OBD-II avlesning', cost: 0, note: lastDecoded.detail }); persist(); render(); $('saveDtcButton').textContent = '✓ Lagret i bilens loggbok'; $('saveDtcButton').disabled = true; }
$('decodeButton').onclick = decodeDtc;
$('dtcInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); decodeDtc(); } });
render();
