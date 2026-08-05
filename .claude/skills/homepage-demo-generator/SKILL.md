---
name: homepage-demo-generator
description: "Genera homepage demo ad alto impatto (hotel, hospitality, servizi locali) a partire da un sito esistente e un documento di audit. Estrae URL immagini reali, testi e concetti originali dal sito, poi li riscrive/rigenera seguendo le raccomandazioni dell'audit — non copia 1:1 e non sostituisce con immagini stock generiche. Usa quando l'utente fornisce l'URL di un sito reale + un audit (o feedback critico) e chiede una nuova versione demo/homepage/redesign di quel sito."
---

# Homepage Demo Generator

Genera demo di homepage (tipicamente hotel/hospitality/servizi locali) partendo da un sito reale esistente, applicando correzioni guidate da un audit fornito dall'utente.

## Quando usare questa skill

Attivala quando l'utente fornisce (o offre di fornire):
1. L'**URL del sito originale** di un business reale
2. Un **documento di audit** (SEO, UX, conversione, contenuti — qualsiasi tipo di analisi critica)

...e chiede di generare una nuova homepage/demo/redesign basata su quel sito.

Non attivarla per richieste di siti **inventati da zero** senza un sito reale di riferimento (in quel caso vale il workflow normale: skill `ui-ux-pro-max` per design system + contenuti plausibili).

## Regola fondamentale — le 4 fonti

Per ogni homepage demo generata con questa skill, rispetta sempre queste 4 regole:

1. **URL immagini reali** — usa gli URL delle immagini effettivamente presenti sul sito originale (estratte via fetch/scraping). Non sostituirle con foto stock (Unsplash, Pexels, ecc.) a meno che l'audit stesso segnali immagini mancanti, rotte o di qualità insufficiente da rimpiazzare.
2. **Testi originali come base** — i copy, le headline, le descrizioni dei servizi, i dati di contatto partono dal contenuto reale del sito, non da testo inventato.
3. **Concetti/struttura originali come base** — l'information architecture, la value proposition, le sezioni presenti (es. "Camere", "Eventi", "Dove siamo") derivano da cosa il sito originale comunica e offre, non da un template generico.
4. **Riscrittura guidata dall'audit, non copia 1:1** — ogni testo/concetto va **riscritto o rigenerato** applicando le correzioni indicate nell'audit (es. "headline poco emozionale" → riscrivi mantenendo il significato ma alzando l'impatto emozionale; "manca CTA above the fold" → aggiungila; "tono troppo corporate" → rendilo più caldo). L'audit guida la trasformazione, non sostituisce la fonte.

In sintesi: **fonte = sito reale, trasformazione = audit**. Il sito dà cosa dire e mostrare, l'audit dice come dirlo/mostrarlo meglio.

## Workflow

### Step 1 — Raccogli le due fonti
Se l'utente non ha ancora fornito URL e/o audit, chiedili esplicitamente prima di procedere. Non generare contenuti "placeholder" per queste due fonti: sono i pilastri della skill.

### Step 2 — Estrai dal sito originale
Usa WebFetch (o strumenti equivalenti disponibili) per estrarre in modo strutturato:
- Nome brand, tagline, value proposition
- Testi di ogni sezione (hero, servizi/camere, chi siamo, contatti, footer)
- URL di tutte le immagini rilevanti (hero, gallery, sezioni) — verifica che siano assoluti e pubblicamente accessibili
- Dati legali/contatto (indirizzo, P.IVA, telefono, social, ecc.)
- Palette colori e font se rilevabili (altrimenti deducili dallo stile visivo delle immagini/brand)

Se il fetch è bloccato (403, paywall, JS-rendered) prova varianti (con/senza www, pagina cache, sotto-pagine) e se non riesci comunque, dillo esplicitamente all'utente — non inventare contenuti al posto della fonte mancante.

### Step 3 — Leggi e struttura l'audit
Estrai dall'audit le raccomandazioni azionabili, categorizzate per tipo:
- **Contenuti/copy** (tono, chiarezza, lunghezza, emotività)
- **Struttura/UX** (ordine sezioni, CTA mancanti, navigazione)
- **SEO/tecnico** (meta tag, schema.org, performance)
- **Visivo/design** (palette, tipografia, gerarchia)

### Step 4 — Design system
Applica la skill `ui-ux-pro-max` (se disponibile) per le raccomandazioni di stile/palette/font/motion, usando come query il settore + le correzioni di stile dell'audit. Se l'audit specifica esplicitamente palette o font, quelli hanno priorità sulle raccomandazioni generiche della skill.

### Step 5 — Genera la homepage
Per ogni sezione del sito originale:
1. Prendi il testo/concetto originale
2. Applica le correzioni dell'audit pertinenti a quella sezione
3. Scrivi il nuovo copy (riscritto, non tradotto letteralmente né copiato)
4. Inserisci l'URL immagine originale corrispondente (con `background-color` di fallback discreto, non uno stock diverso, se l'immagine non carica)

Mantieni gli altri principi di qualità già in uso in questo progetto: SEO completo (meta tag, schema.org, llms.txt se rilevante), accessibilità (contrast AA/AAA, focus visible, reduced-motion, touch target 44px+), performance (self-contained quando possibile), responsive.

### Step 6 — Traccia le correzioni applicate
Nella consegna, riepiloga esplicitamente **quali punti dell'audit sono stati applicati e dove** (es. tabella "Raccomandazione audit → Dove l'ho applicata"). Questo permette all'utente di verificare che l'audit sia stato seguito, non solo il sito copiato.

## Fast mode — obbligatorio, riduce tempo e token

Le generazioni precedenti riscrivevano da zero ~1500-2000 righe di CSS/JS quasi identiche a ogni sito (bottoni, nav, reveal-on-scroll, cursor, 3D tilt, marquee, footer, form). Da ora questo è vietato: quel codice è **condiviso e va copiato, non rigenerato**.

**Regola**: target ≤180 secondi per generazione. Il modo per starci è generare solo la parte che cambia davvero da sito a sito (contenuto, palette, font, layout bespoke), non il framework.

### Procedura

1. **Copia i file base con Bash `cp`** (costo zero in token, istantaneo) — non leggerli/riscriverli:
   ```bash
   cp .claude/skills/homepage-demo-generator/templates/base.css <dest>/base.css
   cp .claude/skills/homepage-demo-generator/templates/base.js <dest>/base.js
   ```
2. **Scrivi solo `index.html`**, partendo dalla struttura di `templates/skeleton.html`:
   - Un blocco `<style>` con SOLO gli override dei token `:root` (colori, font, radius) + eventuali regole bespoke che `base.css` non copre già (es. uno stack fotografico hero specifico). Non ridefinire classi già presenti in `base.css` (`.btn`, `.nav`, `.reveal`, `.marquee`, `.tilt-3d`, `.gallery-3d`, `.sticky-pair`, ecc.) — usale così come sono.
   - Contenuto HTML reale (testi riscritti secondo l'audit, immagini reali del sito sorgente).
   - `<link rel="stylesheet" href="base.css">` e `<script src="base.js" defer></script>` — niente JS inline salvo logica davvero specifica di quel sito (rara).
3. **Non chiamare `ui-ux-pro-max --design-system` con output ASCII completo per ogni sito** se palette/font sono già dettati dalla fonte (sito originale) o dall'audit — usa la skill solo per una query mirata (`--domain color` o `--domain typography`, output breve) quando serve davvero una decisione, non come rito di apertura.
4. **Un'unica sequenza di tool call**, non a ondate: leggi audit + fonte, poi genera in un solo passaggio. Evita cicli di bozza-poi-rifinitura a meno che l'utente non lo chieda esplicitamente.

### Quando è OK derogare

Se il sito richiede un pattern visivo che `base.css` non copre affatto (es. un cubo 3D rotante, un layout bento specifico), scrivi quella porzione bespoke nello `<style>` della pagina — ma resta un'eccezione mirata, non un motivo per riscrivere tutto da capo.

## Cosa NON fare

- Non inventare testi che non derivano né dal sito né da una riscrittura guidata dall'audit di un testo esistente.
- Non usare immagini stock generiche quando l'immagine originale è disponibile.
- Non ignorare l'audit copiando il sito 1:1 (l'obiettivo è una versione migliorata, non un mirror).
- Non ignorare il sito originale inventando un brand/concept da zero (a meno che l'audit non lo richieda esplicitamente, es. "il posizionamento attuale è sbagliato, riposizionare come X").
- Non fabbricare dati legali (P.IVA, CIN, indirizzo) — se non li trovi sul sito, segnali come TODO come già fatto in questo progetto.

## Esempio di applicazione

Sito originale (hotel): "Il nostro hotel offre camere e servizi di qualità per il tuo soggiorno."
Audit dice: "Headline generica, zero impatto emozionale, nessuna differenziazione."

Riscrittura corretta (fonte + audit): "Ogni mattina, la luce del [elemento reale del luogo] entra dalla tua finestra. Non è un dettaglio — è il motivo per cui torni." (mantiene il concetto "camere/soggiorno" del sito originale, ma riscritto con tecnica emozionale/sensoriale che l'audit richiedeva).

Non corretto: inventare un brand story completamente nuovo scollegato dal sito originale, oppure lasciare la headline originale intatta ignorando l'audit.
