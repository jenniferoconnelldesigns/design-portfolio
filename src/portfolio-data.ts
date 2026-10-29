export type Artwork = { id: string; src: string; thumb: string; label: string; background?: string };
export type Project = { id: string; category: string; title: string; type: string; images: Artwork[]; pdf?: string; pdfLabel?: string; presentation?: string };
const art = (id: string, label: string, background?: string): Artwork => ({ id, src: `./art/${id}.webp`, thumb: `./art/${id}-thumb.webp`, label, background });
export const categories = [
  { id: "identity", number: "01", name: "Logos & mission patches", short: "Logos & patches", description: "Distinct identities for the teams behind the mission." },
  { id: "fabric", number: "02", name: "Fabric & merchandise", short: "Fabric & goods", description: "Graphic work that moves beyond the screen." },
  { id: "embroidery", number: "03", name: "Embroidery", short: "Embroidery", description: "Artwork and production details, ready for thread." },
  { id: "flyers", number: "04", name: "Flyers & communications", short: "Flyers", description: "Information, imagery, and a clear message." },
  { id: "publishing", number: "05", name: "Publishing & editorial", short: "Publishing", description: "Stories brought together through layout and typography." },
];
export const projects: Project[] = [
  { id: "coldflow", category: "identity", title: "Coldflow", type: "Mission patch · PSP Liquids", images: [art("coldflow", "Coldflow mission patch")], presentation: "ice" },
  { id: "cratermaker", category: "identity", title: "CraterMaker Special", type: "Mission patch · PSP Liquids", images: [art("cratermaker", "CraterMaker Special full-color mission patch")], presentation: "sand" },
  { id: "hotfire", category: "identity", title: "Hotfire", type: "Mission patch · PSP Liquids", images: [art("hotfire", "Hotfire mission patch")], presentation: "white" },
  { id: "condor", category: "identity", title: "Condor Test Cell", type: "Logo · Light & dark variants", images: [art("condor-black", "Condor logo — dark outline", "#e8e8e2"), art("condor-white", "Condor logo — light outline", "#242827")], presentation: "stone" },
  { id: "psp-30", category: "identity", title: "30 Years of PSP", type: "Anniversary identity", images: [art("psp-30", "Purdue Space Program 30th anniversary artwork")], presentation: "sand" },
  { id: "bravo", category: "identity", title: "Bravo’s Best", type: "Illustrated company identity", images: [art("bravo", "Bravo’s Best illustrated company emblem")], presentation: "white" },
  { id: "shirt", category: "fabric", title: "PSP Liquids Shirt", type: "Repeat pattern · Front & back", images: [art("shirt-front", "Shirt front artwork with PSP Liquids mark"), art("shirt-back", "Shirt back repeat-pattern artwork")], presentation: "pattern" },
  { id: "upper-plumbing", category: "fabric", title: "Upper Plumbing", type: "Flag artwork", images: [art("upper-plumbing", "Upper Plumbing flag artwork")], presentation: "charcoal" },
  { id: "keychain", category: "fabric", title: "CraterMaker Shaker", type: "Keychain · Product concept sheet", images: [art("keychain", "CraterMaker Shaker keychain concept and assembly sheet")], presentation: "stone" },
  { id: "liquids-embroidery", category: "embroidery", title: "CraterMaker in Thread", type: "Embroidery artwork & production sheet", images: [art("cratermaker-embroidery", "Simplified CraterMaker Special embroidery artwork"), art("liquids-production-01", "Liquids mission patch production sheet")], pdf: "./documents/liquids-production.pdf", pdfLabel: "Production sheet", presentation: "sand" },
  { id: "coldflow-embroidery", category: "embroidery", title: "Coldflow Production", type: "Embroidery production sheet", images: [art("coldflow-production-01", "Coldflow embroidery production sheet and thread specifications")], pdf: "./documents/coldflow-production.pdf", pdfLabel: "Production sheet", presentation: "paper" },
  { id: "thank-you", category: "flyers", title: "A Year of Support", type: "PSP Liquids · Thank-you graphic", images: [art("liquids-thank-you", "Purdue Space Program Liquids 2025 thank-you graphic")], presentation: "charcoal" },
  { id: "giving-day", category: "flyers", title: "Purdue Day of Giving", type: "Boiler Battalion · Fundraising flyer", images: [art("giving-day", "Boiler Battalion Purdue Day of Giving flyer")], presentation: "paper" },
  { id: "bayonet", category: "publishing", title: "Boiler Bayonet", type: "Fall 2025 · 13-page publication", images: Array.from({length:13},(_,i)=>art(`bayonet-${String(i+1).padStart(2,"0")}`, `Boiler Bayonet — page ${i+1}`)), pdf: "./documents/boiler-bayonet-fall-2025.pdf", pdfLabel: "Full publication", presentation: "editorial" },
];
export type ProjectNotes = { title: string; description: string; role: string; tools: string; year: string; captions: Record<string, string> };
export type PortfolioContent = { extraImages?: Record<string, Artwork[]>; revision: number; name: string; specialty: string; headline: string; introduction: string; about: string; email: string; projects: Record<string, ProjectNotes> };
export const defaultContent: PortfolioContent = {
  revision: 0, name: "", specialty: "Graphic design & visual storytelling", headline: "Design with\na mission.",
  introduction: "Visual identities. Objects with character. Stories in print. A selection of work across graphics, fabric, and the page.",
  about: "A collection of work exploring how graphic design gives teams, programs, and shared experiences a visual identity. From a mission patch to a printed page, each format offers a different way to tell a story.",
  email: "", projects: Object.fromEntries(projects.map(p=>[p.id,{title:p.title,description:"",role:"",tools:"",year:"",captions:Object.fromEntries(p.images.map(i=>[i.id,""]))}])),
};
export function completeContent(value: Partial<PortfolioContent> | null): PortfolioContent {
  if(!value) return structuredClone(defaultContent);
  return { ...defaultContent, ...value, projects: Object.fromEntries(projects.map(p=>[p.id,{...defaultContent.projects[p.id],...value.projects?.[p.id],captions:{...defaultContent.projects[p.id].captions,...value.projects?.[p.id]?.captions}}])) };
}

export function galleryProjects(content: PortfolioContent): Project[] { return projects.map(p=>({...p,images:[...p.images,...(content.extraImages?.[p.id]||[])]})); }
