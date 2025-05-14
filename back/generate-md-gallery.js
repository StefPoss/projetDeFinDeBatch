// generate-md-gallery.js
import fs from "fs"
import path from "path"

// 1. Charge le JSON généré précédemment
const images = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/imagesData.json"), "utf-8")
)

// 2. Construis le Markdown
let md = `<!-- .md en HTML pur : on peut injecter <style> et <div> -->
<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .gallery img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
  }
</style>

<div class="gallery">
`

images.forEach(({ url, alt }) => {
  md += `  <img src="${url}" alt="${alt}">\n`
})

md += `</div>\n`

// 3. Écris le fichier Markdown final
fs.writeFileSync(path.resolve(__dirname, "images-gallery.md"), md, "utf-8")

console.log("✅ images-gallery.md généré !")
