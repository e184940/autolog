# AutoLog

En mobil-først, enkel serviceloggbok for bilen. Åpne `index.html` i nettleseren for å bruke den.

Data lagres lokalt i nettleseren. For en iPhone-app senere anbefales en TypeScript-basert React Native/Expo-klient med samme datamodell og en synkronisert backend.

## OBD-II-feilkoder

AutoLog har en innebygd, enkel tolkning av vanlige generiske DTC-koder og kan lagre en avlest kode i bilens historikk. Dette er beslutningsstøtte, ikke en reparasjonsdiagnose: en feil kan ha flere årsaker, og merkespesifikke koder krever ofte bilens merke, modell og årsmodell.

For produksjon anbefales [OBDex](https://github.com/foerbsnavi/obdex), en åpen CC0-database med over 9 000 generiske OBD-II-koder og ingen API-nøkkel, som supplement til den lokale listen. Betalte alternativer med bredere dekning finnes, blant annet [CarsXE](https://docs.carsxe.com/docs/products/obd-codes-decoder) og [CarAPI](https://carapi.app/docs/api/obd-codes/).
