import { createRoot } from "react-dom/client";
import Portfolio from "./Portfolio";
import Editor from "./Editor";
import { parseContent } from "./content";

async function start() {
  const mount = document.getElementById("root")!;
  try {
    const response = await fetch("./portfolio.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("The portfolio text could not be loaded.");
    const content = parseContent(await response.json());
    const editor = document.body.dataset.page === "editor";
    createRoot(mount).render(editor ? <Editor initial={content}/> : <Portfolio content={content} canEdit={false}/>);
  } catch (error) {
    mount.replaceChildren();
    const panel = document.createElement("div"); panel.className = "access-page";
    const heading = document.createElement("h1"); heading.textContent = "The portfolio needs a moment.";
    const text = document.createElement("p"); text.textContent = error instanceof Error ? error.message : "Please reload the page.";
    const reload = document.createElement("button"); reload.className = "button dark"; reload.textContent = "Try again"; reload.onclick = () => location.reload();
    panel.append(heading, text, reload); mount.append(panel);
  }
}
start();
