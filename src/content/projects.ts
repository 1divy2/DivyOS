import generated from "./projects.generated.json";

export type Project = {
  name: string;
  slug: string;
  description: string;
  language: string;
  topics: string[];
  html_url: string;
  homepage: string;
  stars: number;
  updated: string;
  created: string;
  archived: boolean;
  bentoSize?: "large" | "medium" | "small";
  gradient?: string;
  image?: string;
};

const ENRICHMENTS: Record<string, Partial<Project>> = {
  "cortex-ai": {
    bentoSize: "large",
    gradient: "from-[#4F46E5]/20 to-[#7C3AED]/20",
    description: "cOrTeX-aI — A next-generation AI reasoning platform.",
  },
  "veritas-feed": {
    bentoSize: "large",
    gradient: "from-[#10B981]/20 to-[#047857]/20",
  },
  "shoppersend": {
    bentoSize: "medium",
    gradient: "from-[#F59E0B]/20 to-[#D97706]/20",
  },
  "stockpile-terminal": {
    bentoSize: "medium",
    gradient: "from-[#3B82F6]/20 to-[#1D4ED8]/20",
  },
  "objekt": {
    bentoSize: "medium",
    gradient: "from-[#EC4899]/20 to-[#BE185D]/20",
  },
};

const COLORS = [
  "from-os-iris/10 to-os-iris/5",
  "from-blue-500/10 to-blue-600/5",
  "from-emerald-500/10 to-emerald-600/5",
  "from-rose-500/10 to-rose-600/5",
  "from-amber-500/10 to-amber-600/5",
];

export const projects: Project[] = (generated as Project[])
  .filter((p) => !p.archived)
  .map((p, i) => {
    const enrichment = ENRICHMENTS[p.slug] || {};
    return {
      ...p,
      bentoSize: "small",
      gradient: COLORS[i % COLORS.length],
      ...enrichment,
    } as Project;
  });
