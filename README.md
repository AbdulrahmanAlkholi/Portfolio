# Abdulrahman Alkholi — Portfolio

Static portfolio site: plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure

```
index.html              Home: hero, about, projects, skills, education & certifications, contact
projects/*.html         One page per project (9 pages)
assets/css/style.css    All styles, including the light/dark theme
assets/js/main.js       Theme toggle, animations, lightbox, embeds, contact form
assets/img/             Optimised images (logos, screenshots, certificates, portrait)
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5500
```

Then visit http://localhost:5500.

## Publish on GitHub Pages

1. Create a repository and push the contents of this folder to it (with `index.html` at the root).
2. In the repository, go to **Settings → Pages**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
3. The site will be live at `https://<username>.github.io/<repository>/`.

## Notes

- The contact form doesn't send anything itself. It opens the visitor's email app with the message filled in, addressed to AbdulrahmanAlkholi1@gmail.com.
- The MedLabs, PageRank and GeoData pages can load the live dashboard, graph or map inside the page when the visitor clicks the preview.
