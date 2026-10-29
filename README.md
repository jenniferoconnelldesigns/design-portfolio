# Design Portfolio

A static portfolio with 14 projects, 29 artwork views, and 3 downloadable PDFs. The sections are logos and mission patches, fabric and merchandise, embroidery, flyers, and publishing. No server, database, login, paid hosting, or outside asset service is required.

## Publish on GitHub Pages

1. Upload this package's extracted contents to `XanderBeal/design-portfolio`, preserving the `docs` and `src` folders. Upload the files, not the ZIP archive.
2. Open the repository's **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose branch **main**, folder **/docs**, then **Save**.
5. Wait for the Pages deployment to finish. GitHub displays the live URL in that same settings page.

The expected address for this repository is `https://xanderbeal.github.io/design-portfolio/`. This address becomes live only after the files are uploaded and Pages is enabled.

GitHub's official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Add her name, contact details, and descriptions

1. Open **Portfolio editor** in the website footer, or add `edit.html` to the site's address.
2. Fill in her name, contact email, introduction, project descriptions, role, tools, and year. Expand each project for individual image captions.
3. Select **Preview changes** to review the result. Use **Back to editor** to continue editing.
4. Select **Download text**. This saves a file named `portfolio.json` to your computer.
5. In the GitHub repository, open the **docs** folder, use **Add file → Upload files**, and upload the downloaded file with the name exactly `portfolio.json`. Commit the change to `main`.
6. GitHub Pages republishes the site. Reload it after the deployment finishes.

The editor creates a draft in the current browser tab. It does not save changes to GitHub automatically. Download before closing the tab. **Load text file** lets you continue from a previous download. Only people with repository write access can publish changes. Blank optional fields stay hidden from visitors.

You can also edit `docs/portfolio.json` directly on GitHub. Keep its property names and JSON syntax intact. A title is required for each project; profile name and email can remain blank.

## Files

- `docs/` — complete, ready-to-host website. All asset paths are relative so it works at a repository URL or a custom domain.
- `docs/portfolio.json` — all editable profile, project, and image-caption text.
- `docs/art/` — full-size images and compact gallery thumbnails.
- `docs/documents/` — embroidery production PDFs and the full 13-page newsletter.
- `src/` — readable React/TypeScript components and artwork catalogue.
- `docs/assets/styles.css` — responsive visual styling.
- `build.mjs` / `package.json` — optional bundle rebuild tools.

## Optional code changes

Text and CSS updates do not need a build. To change the components, install a current Node.js LTS release, run `npm install`, edit `src/`, then run `npm run build`. Commit the changed source and generated `docs/assets/portfolio.js` (and its license notice). The build preserves text and artwork in `docs/`.

For a local preview, serve the `docs` folder using a local static HTTP server. Opening the HTML directly as a `file://` URL will not load `portfolio.json` in most browsers.

To add artwork, place the full image and thumbnail in `docs/art/`, update `src/portfolio-data.ts`, add its text fields to `docs/portfolio.json`, and rebuild. To replace an existing image, use the same filename.

The supplied artwork is preserved. Any wording embedded inside an image or PDF must be changed in its original design file; the portfolio text editor changes only the website's text and captions.

## Rights

The artwork remains the property of its respective creators and rights holders. This repository does not grant permission to reuse it. Bundled third-party code retains its license notices in `docs/assets/portfolio.js.LEGAL.txt` and `THIRD-PARTY-NOTICES.txt`.
