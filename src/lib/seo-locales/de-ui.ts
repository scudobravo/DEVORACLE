import type { SeoBundle } from "./types";

export const deUi: Pick<SeoBundle, "meta" | "index" | "common"> = {
  meta: {
    aiToolsIndex: {
      title: "KI-Tools für technische Interviewvorbereitung",
      description:
        "Entdecke KI-Tools und Arbeitsabläufe für Coding-Interviews, System Design und verhaltensbasierte Vorbereitung mit praxisnahen Anleitungen.",
      ogTitle: "KI-Tools für technische Interviewvorbereitung",
      ogDescription:
        "Entdecke KI-Tools und Arbeitsabläufe für Coding-Interviews, System Design und verhaltensbasierte Vorbereitung mit praxisnahen Anleitungen.",
    },
    guidesIndex: {
      title: "Leitfäden zu technischen Interviews",
      description:
        "Ausführliche Anleitungen zu KI-Interview-Tools, DevOracle-Workflows, Alternativen und Vergleichsrahmen.",
      ogTitle: "Leitfäden zu technischen Interviews",
      ogDescription:
        "Ausführliche Anleitungen zu KI-Interview-Tools, DevOracle-Workflows, Alternativen und Vergleichsrahmen.",
    },
  },
  index: {
    aiTools: {
      h1: "KI-Tools",
      intro:
        "Kuratierte KI-Tools für die Vorbereitung auf technische Interviews. Starte mit den Tool-Seiten und vertiefe mit taktischen Guides und Frameworks.",
      chooseTitle: "So wählst du das richtige KI-Tool für technische Interviews",
      chooseP1:
        "Nicht die längste Feature-Liste zählt, sondern bessere Leistung unter realen Bedingungen: Coding unter Zeitdruck, offenes System-Design, Storytelling mit klarer Zeitschiene. Nutze ein einheitliches Simulations- und ein Bewertungskriterium: Kontexterhalt, Relevanz, Latenz, Coaching-Qualität.",
      chooseP2:
        "Viele wechseln ständig das Tool, bevor ein fester Ablauf steht. Nimm ein primäres Tool für tägliches Training und ein zweites für wöchentliches Review. In den unten verlinkten Guides findest du Alternativen, rollenbasierte Routinen und eine sich aufschaukelnde 4-Wochen-Logik.",
      openTool: "Zur Tool-Seite",
      relatedTitle: "Weiterführende Inhalte",
      relatedBestAi: {
        href: "/guides/best-ai-tools-for-technical-interviews",
        label: "Die besten KI-Tools für technische Interviews",
      },
      relatedHowTo: {
        href: "/guides/how-to-use-devoracle",
        label: "DevOracle effektiv nutzen",
      },
      relatedPlaybook: {
        href: "/guides/interview-prep-playbook-2026",
        label: "Interview-Prep-Playbook 2026",
      },
    },
    guides: {
      h1: "Leitfäden",
      intro:
        "Lange, redaktionelle Leitfäden für Suchintents mit hoher Relevanz – KI und technische Interviews.",
      readGuide: "Leitfaden lesen",
    },
  },
  common: {
    longForm: {
      searchIntent: "Haupt-Keyword und Suchintention",
      primaryKeyword: "Haupt-Keyword:",
      relatedKeywords: "Verwandte Keywords:",
      faq: "FAQ",
      relatedContent: "Weiterführende Inhalte",
    },
    section: { aiTools: "KI-Tools", guides: "Leitfäden" },
    breadcrumbHome: "Start",
  },
};
