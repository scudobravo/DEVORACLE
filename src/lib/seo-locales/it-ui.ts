import type { SeoBundle } from "./types";

export const itUi: Pick<SeoBundle, "meta" | "index" | "common"> = {
  meta: {
    aiToolsIndex: {
      title: "Strumenti AI per la preparazione ai colloqui tecnici",
      description:
        "Scopri strumenti AI e flussi di lavoro per colloqui di programmazione, system design e preparazione comportamentale, con guide operative.",
      ogTitle: "Strumenti AI per la preparazione ai colloqui tecnici",
      ogDescription:
        "Scopri strumenti AI e flussi di lavoro per colloqui di programmazione, system design e preparazione comportamentale, con guide operative.",
    },
    guidesIndex: {
      title: "Guide sui colloqui tecnici",
      description:
        "Guide approfondite su strumenti AI, workflow DevOracle, alternative e modelli di confronto per colloqui tecnici.",
      ogTitle: "Guide sui colloqui tecnici",
      ogDescription:
        "Guide approfondite su strumenti AI, workflow DevOracle, alternative e modelli di confronto per colloqui tecnici.",
    },
  },
  index: {
    aiTools: {
      h1: "Strumenti AI",
      intro:
        "Strumenti AI curati per la preparazione ai colloqui tecnici. Parti dalle schede prodotto e passa a guide tattiche e framework operativi.",
      chooseTitle: "Come scegliere lo strumento giusto per i colloqui in AI",
      chooseP1:
        "Lo strumento migliore non è quello con l’elenco di funzioni più lungo, ma quello che migliora l’esecuzione in condizioni reali: pressione sul coding, domande aperte di system design, storytelling con tempi serrati. Per valutare in fretta, usa un unico script di simulazione ripetuto e dà un punteggio a contesto, pertinenza, latenza e qualità del coaching.",
      chooseP2:
        "Molti passano da uno strumento all’altro senza fissare un flusso. Scegli un tool principale per le sessioni quotidiane e una risorsa secondaria per le revisioni settimanali, così il progresso diventa misurabile. Nelle guide collegate trovi confronti, routine per ruolo e un sistema di prep da comporre mese su mese.",
      openTool: "Apri la scheda strumento",
      relatedTitle: "Contenuti collegati",
      relatedBestAi: {
        href: "/guides/best-ai-tools-for-technical-interviews",
        label: "Migliori strumenti AI per i colloqui tecnici",
      },
      relatedHowTo: {
        href: "/guides/how-to-use-devoracle",
        label: "Come usare DevOracle in modo efficace",
      },
      relatedPlaybook: {
        href: "/guides/interview-prep-playbook-2026",
        label: "Playbook di prep ai colloqui 2026",
      },
    },
    guides: {
      h1: "Guide",
      intro:
        "Guide lunghe e operative per le domande a più alta intenzione su colloqui tecnici e preparazione in AI.",
      readGuide: "Leggi la guida",
    },
  },
  common: {
    longForm: {
      searchIntent: "Keyword principale e intento di ricerca",
      primaryKeyword: "Keyword principale:",
      relatedKeywords: "Keyword correlate:",
      faq: "Domande frequenti",
      relatedContent: "Contenuti collegati",
    },
    section: { aiTools: "Strumenti AI", guides: "Guide" },
    breadcrumbHome: "Home",
  },
};
