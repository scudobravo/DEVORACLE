import type { SeoBundle } from "./types";

export const ptUi: Pick<SeoBundle, "meta" | "index" | "common"> = {
  meta: {
    aiToolsIndex: {
      title: "Ferramentas de IA para entrevistas técnicas",
      description:
        "Explore ferramentas de IA e fluxos de trabalho para entrevistas de código, system design e preparação comportamental, com guias práticos.",
      ogTitle: "Ferramentas de IA para entrevistas técnicas",
      ogDescription:
        "Explore ferramentas de IA e fluxos de trabalho para entrevistas de código, system design e preparação comportamental, com guias práticos.",
    },
    guidesIndex: {
      title: "Guias de entrevistas técnicas",
      description:
        "Guias longas sobre ferramentas de IA, fluxos do DevOracle, alternativas e modelos de comparação para entrevistas técnicas.",
      ogTitle: "Guias de entrevistas técnicas",
      ogDescription:
        "Guias longas sobre ferramentas de IA, fluxos do DevOracle, alternativas e modelos de comparação para entrevistas técnicas.",
    },
  },
  index: {
    aiTools: {
      h1: "Ferramentas de IA",
      intro:
        "Ferramentas de IA selecionadas para preparar entrevistas técnicas. Comece pelas páginas de produto e continue com guias táticos e frameworks.",
      chooseTitle: "Como escolher a ferramenta de IA certa para entrevistas",
      chooseP1:
        "O melhor sinal não é a lista de recursos, e sim a melhora na execução com pressão de código, ambiguidade de design e narrativa com tempo limitado. Use o mesmo roteiro de simulação e avalie retenção de contexto, relevância, latência e qualidade do coaching.",
      chooseP2:
        "Trocar de ferramenta a cada semana impede constância. Escolha um produto principal no dia a dia e um apoio para revisão. Os guias abaixo trazem comparações, rotinas por cargo e um plano de um mês com efeito composto.",
      openTool: "Abrir página da ferramenta",
      relatedTitle: "Conteúdo relacionado",
      relatedBestAi: {
        href: "/guides/best-ai-tools-for-technical-interviews",
        label: "Melhores ferramentas de IA para entrevistas técnicas",
      },
      relatedHowTo: {
        href: "/guides/how-to-use-devoracle",
        label: "Como usar o DevOracle com eficiência",
      },
      relatedPlaybook: {
        href: "/guides/interview-prep-playbook-2026",
        label: "Playbook de preparação 2026",
      },
    },
    guides: {
      h1: "Guias",
      intro:
        "Guias longos e editoriais para dúvidas de alta intenção sobre entrevistas técnicas e preparação com IA.",
      readGuide: "Ler o guia",
    },
  },
  common: {
    longForm: {
      searchIntent: "Palavra-chave principal e intenção de busca",
      primaryKeyword: "Palavra-chave principal:",
      relatedKeywords: "Palavras-chave relacionadas:",
      faq: "Perguntas frequentes",
      relatedContent: "Conteúdo relacionado",
    },
    section: { aiTools: "Ferramentas de IA", guides: "Guias" },
    breadcrumbHome: "Início",
  },
};
