# Tracciamento Analisi — PWA

App personale per tracciare i valori delle analisi del sangue nel tempo, con
grafici di andamento e sincronizzazione opzionale su Google Drive.

## Cosa contiene questo progetto

- `index.html` — l'intera applicazione (HTML + CSS + JS in un unico file)
- `manifest.json` — rende l'app installabile come PWA ("Aggiungi a schermata Home")
- `service-worker.js` — permette il funzionamento offline
- `icons/` — icone dell'app

## 1. Pubblicare su GitHub Pages (5 minuti)

1. Crea un nuovo repository su GitHub (può essere pubblico o privato — se privato,
   GitHub Pages richiede un account con un piano che lo supporti).
2. Carica tutti i file di questa cartella nella root del repository
   (`index.html`, `manifest.json`, `service-worker.js`, `icons/`).
3. Vai su **Settings → Pages** del repository.
4. In "Source", scegli il branch (es. `main`) e la cartella `/ (root)`.
5. Salva. Dopo un paio di minuti l'app sarà live su:
   `https://tuonomeutente.github.io/nome-repository/`

A questo punto l'app funziona già (inserimento manuale, grafici, backup/import
JSON) — la sincronizzazione con Google Drive è un passo *opzionale* aggiuntivo.

## 2. Attivare la sincronizzazione con Google Drive (opzionale)

Senza questo passaggio l'app funziona comunque, salvando i dati solo sul
dispositivo (IndexedDB). Se vuoi la sincronizzazione automatica tra più
dispositivi, segui questi passaggi:

### 2.1 Crea le credenziali OAuth su Google Cloud Console

1. Vai su [console.cloud.google.com](https://console.cloud.google.com/)
2. Crea un nuovo progetto (o usane uno esistente)
3. Vai su **API e servizi → Libreria**, cerca "Google Drive API" e abilitala
4. Vai su **API e servizi → Schermata di consenso OAuth**:
   - Tipo utente: "Esterno" (a meno che tu non abbia Google Workspace)
   - Compila i campi obbligatori (nome app, email di supporto)
   - Nella sezione "Ambiti" non serve aggiungere nulla manualmente
   - Nella sezione "Utenti di test" (se l'app resta in modalità test) aggiungi
     il tuo indirizzo Gmail
5. Vai su **API e servizi → Credenziali → Crea credenziali → ID client OAuth**:
   - Tipo applicazione: **Applicazione web**
   - In "Origini JavaScript autorizzate" aggiungi l'URL esatto della tua
     GitHub Page, es. `https://tuonomeutente.github.io`
     (senza percorso finale, senza slash finale)
   - Crea, e copia il **Client ID** generato (una stringa che termina con
     `.apps.googleusercontent.com`)

### 2.2 Inserisci il Client ID nel codice

Apri `index.html`, cerca la riga:

```js
const DRIVE_CLIENT_ID = 'INSERISCI_QUI_IL_TUO_CLIENT_ID.apps.googleusercontent.com';
```

e sostituisci il valore con il tuo Client ID. Ricarica la pagina su GitHub
Pages (fai commit + push della modifica).

### 2.3 Usa il pulsante "Connetti Google Drive"

In app, tocca **🔗 Connetti Google Drive**. La prima volta Google mostrerà una
schermata di consenso (è normale che dica "app non verificata da Google" —
è previsto per app personali non pubblicate ufficialmente; puoi procedere
tranquillamente trattandosi della tua stessa app). Da quel momento i dati si
sincronizzano automaticamente ogni volta che aggiungi, modifichi o elimini
un referto.

## Come funziona la sincronizzazione

- I dati vivono principalmente sul dispositivo (IndexedDB), per essere
  disponibili anche offline.
- Ad ogni modifica, dopo una breve pausa, l'app carica una copia completa dei
  dati in un file chiamato `tracker_analisi_data.json` nel tuo Google Drive
  (visibile nel tuo Drive normale, non condiviso con nessun altro).
- Aprendo l'app su un altro dispositivo (o dopo aver cancellato i dati
  locali), se il file su Drive è più recente di quello locale, i dati vengono
  scaricati automaticamente.
- La regola è "vince chi ha salvato per ultimo" (confrontando un timestamp):
  adatta per un solo utente su un dispositivo alla volta, non per editing
  simultaneo da più dispositivi nello stesso istante.

## Limiti noti di questa prima versione

- Il token di accesso a Google Drive dura circa un'ora: se lo lasci aperto
  più a lungo, potresti dover premere di nuovo "Connetti" per rinnovarlo.
- Le impostazioni personalizzate (range di riferimento propri, intervalli di
  controllo personalizzati) non sono ancora implementate: per ora l'app
  sincronizza solo i referti inseriti.
- Nessun vero "merge" in caso di modifiche contemporanee su due dispositivi:
  vince l'ultimo salvataggio per intero.

## Privacy

Questa app non ha alcun server proprio: i dati restano o sul tuo dispositivo
(IndexedDB) o nel tuo account Google Drive personale (permesso limitato ai
soli file creati dall'app stessa, tramite lo scope `drive.file` — l'app non
può vedere il resto del tuo Drive). Nessun dato passa mai da un server terzo.
# HealthTracker
