# AutoLog

En mobil-først, enkel serviceloggbok for bilen. Appen er en installérbar PWA og kan åpnes fra en lokal webserver eller deployes som en statisk nettside. På iPhone velger du «Legg til på Hjem-skjerm» i Safari.

## Vedlikehold og vedlegg

- Hver bil har egne serviceintervaller i måneder og kilometer, samt valgbare måneder for sommer- og vinterdekk.
- Kommende service og dekkskift vises øverst i loggboken.
- Bilder og PDF-kvitteringer kan legges ved en hendelse. De lagres lokalt i IndexedDB på enheten, ikke i `localStorage`.
- Appskallet fungerer offline etter første besøk. Verkstedsøk og OBD-oppslag krever fortsatt nettverk.

## Konto og synk

AutoLog har foreløpig lokal data og ingen innlogging. En ekte konto må ha en backend for å kunne fungere på tvers av iPhone, Android og web uten at passord eller filer lagres usikkert i klienten.

Anbefalt neste steg er Supabase Auth med e-post og Apple/Google-pålogging, Postgres for biler og hendelser, og Supabase Storage for kvitteringer. Hold prosjekt-URL og publiserbar anon-nøkkel i runtime-konfigurasjon, aldri administratornøkkel i nettleserkoden. Med den backend-en kan den samme PWA-en pakkes som en native iOS- og Android-app med Capacitor.

## OBD-II-feilkoder

AutoLog har en innebygd, enkel tolkning av vanlige generiske DTC-koder og kan lagre en avlest kode i bilens historikk. Dette er beslutningsstøtte, ikke en reparasjonsdiagnose: en feil kan ha flere årsaker, og merkespesifikke koder krever ofte bilens merke, modell og årsmodell.

For produksjon anbefales [OBDex](https://github.com/foerbsnavi/obdex), en åpen CC0-database med over 9 000 generiske OBD-II-koder og ingen API-nøkkel, som supplement til den lokale listen. Betalte alternativer med bredere dekning finnes, blant annet [CarsXE](https://docs.carsxe.com/docs/products/obd-codes-decoder) og [CarAPI](https://carapi.app/docs/api/obd-codes/).
