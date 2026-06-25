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
};

export const projects: Project[] = (generated as Project[]).filter((p) => !p.archived);
