import { completeContent, projects, type PortfolioContent } from "./portfolio-data";

export function parseContent(value: unknown): PortfolioContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Choose a valid portfolio.json file.");
  const raw = value as Record<string, unknown>;
  const fields = { name: 100, specialty: 160, headline: 120, introduction: 650, about: 2400, email: 254 };
  const clean: Partial<PortfolioContent> = {};
  for (const [key, max] of Object.entries(fields)) {
    if (raw[key] === undefined) continue;
    if (typeof raw[key] !== "string" || (raw[key] as string).length > max) throw new Error(`Check the ${key} field in your text file.`);
    (clean as Record<string, unknown>)[key] = raw[key];
  }
  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) throw new Error("Enter a valid contact email or leave it blank.");
  if (clean.headline !== undefined && !clean.headline.trim()) throw new Error("The homepage headline cannot be blank.");
  const result = completeContent(clean);
  if (!raw.projects || typeof raw.projects !== "object" || Array.isArray(raw.projects)) throw new Error("This file is missing the portfolio projects.");
  const notes = raw.projects as Record<string, unknown>;
  for (const project of projects) {
    const item = notes[project.id];
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`This file is missing the ${project.title} project.`);
    const entry = item as Record<string, unknown>;
    for (const [key, max] of Object.entries({ title: 100, description: 2400, role: 180, tools: 180, year: 40 })) {
      const text = entry[key];
      if (text === undefined) continue;
      if (typeof text !== "string" || text.length > max) throw new Error(`Check ${project.title}: ${key}.`);
      if (key === "title" && !text.trim()) throw new Error("Project titles cannot be blank.");
      (result.projects[project.id] as unknown as Record<string, unknown>)[key] = text;
    }
    if (entry.captions !== undefined) {
      if (!entry.captions || typeof entry.captions !== "object" || Array.isArray(entry.captions)) throw new Error(`Check the image captions for ${project.title}.`);
      const captions = entry.captions as Record<string, unknown>;
      for (const image of project.images) {
        const caption = captions[image.id];
        if (caption === undefined) continue;
        if (typeof caption !== "string" || caption.length > 1200) throw new Error(`Check the caption for ${image.label}.`);
        result.projects[project.id].captions[image.id] = caption;
      }
    }
  }
  return result;
}
