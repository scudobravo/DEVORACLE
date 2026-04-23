import type { SeoBundle } from "./types";

export const esUi: Pick<SeoBundle, "meta" | "index" | "common"> = {
  meta: {
    aiToolsIndex: {
      title: "Herramientas de IA para entrevistas técnicas",
      description:
        "Explora herramientas de IA y flujos de trabajo para entrevistas de código, diseño de sistemas y preparación conductual, con guías accionables.",
      ogTitle: "Herramientas de IA para entrevistas técnicas",
      ogDescription:
        "Explora herramientas de IA y flujos de trabajo para entrevistas de código, diseño de sistemas y preparación conductual, con guías accionables.",
    },
    guidesIndex: {
      title: "Guías de entrevistas técnicas",
      description:
        "Guías extensas sobre herramientas de IA, flujos de DevOracle, alternativas y marcos de comparación para entrevistas técnicas.",
      ogTitle: "Guías de entrevistas técnicas",
      ogDescription:
        "Guías extensas sobre herramientas de IA, flujos de DevOracle, alternativas y marcos de comparación para entrevistas técnicas.",
    },
  },
  index: {
    aiTools: {
      h1: "Herramientas de IA",
      intro:
        "Herramientas de IA seleccionadas para preparar entrevistas técnicas. Empieza por las fichas de producto y sigue con guías tácticas y marcos de implementación.",
      chooseTitle: "Cómo elegir la herramienta de IA adecuada para entrevistas",
      chooseP1:
        "Lo que importa no es la lista de funciones, sino mejorar el desempeño en condiciones reales: presión de código, dudas abiertas de diseño, narración con tiempos estrictos. Valora con un mismo guion y puntuar contexto, relevancia, latencia y calidad del coaching.",
      chooseP2:
        "Cambiar de herramienta cada semana no crea un flujo estable. Elige un producto principal para el día a día y otro recursos para repasar. Las guías enlazadas comparan alternativas, ayudan a rutinas por rol y un plan de un mes con efecto compuesto.",
      openTool: "Abrir ficha de herramienta",
      relatedTitle: "Contenido relacionado",
      relatedBestAi: {
        href: "/guides/best-ai-tools-for-technical-interviews",
        label: "Mejores herramientas de IA para entrevistas técnicas",
      },
      relatedHowTo: {
        href: "/guides/how-to-use-devoracle",
        label: "Cómo usar DevOracle con eficacia",
      },
      relatedPlaybook: {
        href: "/guides/interview-prep-playbook-2026",
        label: "Playbook de preparación 2026",
      },
    },
    guides: {
      h1: "Guías",
      intro:
        "Guías extensas y prácticas para búsquedas de alto intento sobre entrevistas técnicas e IA.",
      readGuide: "Leer guía",
    },
  },
  common: {
    longForm: {
      searchIntent: "Palabra clave principal e intención de búsqueda",
      primaryKeyword: "Palabra clave principal:",
      relatedKeywords: "Palabras clave relacionadas:",
      faq: "Preguntas frecuentes",
      relatedContent: "Contenido relacionado",
    },
    section: { aiTools: "Herramientas de IA", guides: "Guías" },
    breadcrumbHome: "Inicio",
  },
};
