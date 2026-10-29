import { mkdir, writeFile } from "node:fs/promises";
const { build } = await import(process.env.ESBUILD_PATH || "esbuild");
await mkdir("docs/assets", { recursive: true });
await build({ entryPoints: ["src/main.tsx"], bundle: true, minify: true, jsx: "automatic", format: "iife", target: ["es2020"], outfile: "docs/assets/portfolio.js", define: { "process.env.NODE_ENV": '"production"' }, legalComments: "linked" });
console.log("Built docs/assets/portfolio.js. Text and artwork in docs/ are preserved.");
