# Tracciamento Analisi

App web per tenere traccia nel tempo dei valori delle proprie analisi del
sangue: inserimento manuale referto per referto, andamento storico con
grafici, e sincronizzazione opzionale su Google Drive.

🔗 **App online:** [vinceneede.github.io/HealthTracker](https://vinceneede.github.io/HealthTracker/)

## Cosa fa

- **Inserimento manuale** con un dizionario di oltre 40 esami comuni
  (emocromo pre-compilato, altri esami cercabili) e conversione automatica
  tra le unità di misura più usate dai laboratori italiani (es. `/mmc` ↔
  `10^3/uL`, `ng/mL` ↔ `nmol/L`, ecc.)
- **Vista Andamento** con grafico storico per singolo parametro (zoom e
  pan nel grafico ingrandito) e confronto multiplo tra più esami sullo
  stesso periodo
- **Range di riferimento**, anche differenziati per sesso dove rilevante
  (es. emoglobina, ematocrito, creatinina)
- **Note** opzionali su ogni singolo valore inserito, per annotare eventi
  legati a quel dato (es. "iniziata cura con integratori")
- **Promemoria "controllo scaduto"** personalizzabili per esame, con
  possibilità di disattivarli per gli esami non pertinenti (es. la
  litiemia se non si è in terapia col litio) e riattivarli in seguito
- **Sincronizzazione opzionale su Google Drive**, con riconnessione
  automatica e un flusso di disconnessione pulito per passare da un
  account all'altro sullo stesso dispositivo
- **PWA installabile** (schermata Home su telefono/desktop) con
  funzionamento offline
- **Backup/ripristino manuale** via export/import di un file JSON

## Privacy

Questa app non ha alcun server proprio: i dati restano o sul dispositivo
(IndexedDB) o nel proprio account Google Drive personale (permesso
limitato ai soli file creati dall'app stessa, tramite lo scope
`drive.file` — l'app non può vedere il resto del Drive dell'utente).
Nessun dato passa mai da un server terzo.

## Limiti noti

- Nessun vero "merge" in caso di modifiche contemporanee su due
  dispositivi: la sincronizzazione usa la regola "vince l'ultimo
  salvataggio", adatta per un solo utente alla volta.
- I dati locali (IndexedDB) non sono separati per account: per usare
  l'app con più persone sullo stesso dispositivo/browser si usa il
  pulsante "Disconnetti / cambia account", che pulisce i dati locali
  prima del cambio.

---

## Farne una propria copia

Il codice è pensato per essere facilmente auto-ospitato: è un'unica
pagina HTML statica, pubblicabile gratuitamente su GitHub Pages.

### Cosa contiene il repository

- `index.html` — l'intera applicazione (HTML + CSS + JS in un unico file)
- `manifest.json` — rende l'app installabile come PWA
- `service-worker.js` — permette il funzionamento offline
- `icons/` — icone dell'app

### 1. Pubblicare su GitHub Pages

1. Crea un nuovo repository su GitHub (pubblico, o privato con un piano
   che supporti GitHub Pages).
2. Carica tutti i file di questa cartella nella root del repository.
3. Vai su **Settings → Pages**, in "Source" scegli il branch (es. `main`)
   e la cartella `/ (root)`, salva.
4. Dopo un paio di minuti l'app sarà live su
   `https://tuonomeutente.github.io/nome-repository/`.

A questo punto l'app funziona già (inserimento manuale, grafici,
backup/import JSON) — la sincronizzazione con Google Drive è un passo
*opzionale* aggiuntivo.

### 2. Attivare la sincronizzazione con Google Drive (opzionale)

Senza questo passaggio l'app funziona comunque, salvando i dati solo sul
dispositivo. Per la sincronizzazione automatica tra più dispositivi:

#### 2.1 Crea le credenziali OAuth su Google Cloud Console

1. Vai su [console.cloud.google.com](https://console.cloud.google.com/)
2. Crea un nuovo progetto (o usane uno esistente)
3. Vai su **API e servizi → Libreria**, cerca "Google Drive API" e abilitala
4. Vai su **API e servizi → Schermata di consenso OAuth**:
   - Tipo utente: "Esterno" (a meno che tu non abbia Google Workspace)
   - Compila i campi obbligatori (nome app, email di supporto)
   - Nella sezione "Ambiti" non serve aggiungere nulla manualmente
   - Nella sezione "Utenti di test" (se l'app resta in modalità test)
     aggiungi il tuo indirizzo Gmail
5. Vai su **API e servizi → Credenziali → Crea credenziali → ID client OAuth**:
   - Tipo applicazione: **Applicazione web**
   - In "Origini JavaScript autorizzate" aggiungi l'URL esatto della tua
     GitHub Page, es. `https://tuonomeutente.github.io`
     (senza percorso finale, senza slash finale)
   - Crea, e copia il **Client ID** generato (termina con
     `.apps.googleusercontent.com`)

#### 2.2 Inserisci il Client ID nel codice

Apri `index.html`, cerca la riga:

```js
const DRIVE_CLIENT_ID = 'INSERISCI_QUI_IL_TUO_CLIENT_ID.apps.googleusercontent.com';
```

e sostituisci il valore con il tuo Client ID. Fai commit e push: GitHub
Pages pubblica la modifica in automatico.

#### 2.3 Usa il pulsante "Connetti Google Drive"

In app, tocca **🔗 Connetti Google Drive**. La prima volta Google mostrerà
una schermata di consenso (è normale che dica "app non verificata da
Google" — previsto per app personali non pubblicate ufficialmente). Da
quel momento i dati si sincronizzano automaticamente ogni volta che
aggiungi, modifichi o elimini un referto, e la connessione si rinnova da
sola in background senza dover ripremere "Connetti" ogni ora.

### Come funziona la sincronizzazione

- I dati vivono principalmente sul dispositivo (IndexedDB), per essere
  disponibili anche offline.
- Ad ogni modifica, dopo una breve pausa, l'app carica una copia completa
  dei dati in un file chiamato `tracker_analisi_data.json` nel Drive
  dell'utente (visibile nel Drive normale, non condiviso con nessun altro).
- Aprendo l'app su un altro dispositivo (o dopo aver cancellato i dati
  locali), se il file su Drive è più recente di quello locale, i dati
  vengono scaricati automaticamente.
