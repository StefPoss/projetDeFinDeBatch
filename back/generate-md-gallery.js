// generate-md-gallery.js
import fs from "fs"
import path from "path"

const images = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/imagesData.json"), "utf-8")
)

function humanFileSize(bytes) {
  if (bytes === 0) return "0 Ko"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ["octets", "Ko", "Mo", "Go"]
  return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + sizes[i]
}

let md = `
<!--
Galerie générée dynamiquement avec toutes les propriétés Cloudinary affichées.
-->
<style>
  .gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1200px; margin: 2rem auto; }
  @media (max-width: 1000px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .gallery { grid-template-columns: 1fr; } }
  .gallery-card { background: #fafafa; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #0001; padding: 12px; display: flex; flex-direction: column; align-items: center; }
  .gallery-card img { width: 100%; border-radius: 8px; object-fit: cover; transition: filter 0.2s; }
  .cloud-tags { margin: 8px 0; font-size: .85em; color: #888; }
  .cloud-info { font-size: .9em; color: #444; margin-bottom: 6px; }
  .gallery-actions { margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .gallery-actions button { border: none; background: #f0b429; color: #222; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: .95em; transition: background 0.2s; }
  .gallery-actions button:active { background: #c29526; }
  .gallery-variant { margin-top: 6px; font-size: 0.85em; color: #607d8b; }
</style>
<div class="gallery">
`

images.forEach((img) => {
  // Prépare variantes format (ex: avif, jpg, png)
  let variants = ""
  const baseUrl = img.url.replace(/f_auto,q_auto[\/,]*/, "")
  if (img.format && img.format !== "avif") {
    // Propose AVIF, JPG, PNG
    variants = `
      <div class="gallery-variant">
        Voir en :
        <a href="${img.url.replace(
          "f_auto",
          "f_avif"
        )}" target="_blank">AVIF</a> |
        <a href="${img.url.replace(
          "f_auto",
          "f_jpg"
        )}" target="_blank">JPG</a> |
        <a href="${img.url.replace("f_auto", "f_png")}" target="_blank">PNG</a>
      </div>
    `
  }
  md += `
  <div class="gallery-card">
    <img src="${img.url}" alt="${img.alt}" data-original="${img.url}">
    <div class="cloud-info">
      Format : <b>${img.format || "-"}</b> | Dimensions : <b>${
    img.width || "?"
  }×${img.height || "?"}</b> | Taille : <b>${humanFileSize(img.bytes || 0)}</b>
    </div>
    <div class="cloud-tags">Tags : ${
      img.tags && img.tags.length ? img.tags.join(", ") : "aucun"
    }</div>
    <div class="gallery-actions">
      <button onclick="window.open('${img.url}', '_blank')">Ouvrir</button>
      <button class="copy-btn" data-url="${img.url}">Copier URL</button>
      <button class="filter-btn" data-filter="grayscale">Niveaux de gris</button>
      <button class="filter-btn" data-filter="none">Couleurs normales</button>
    </div>
    ${variants}
  </div>
  `
})

md += `</div>
<script>
// Boutons Copier
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    navigator.clipboard.writeText(btn.dataset.url)
    btn.textContent = "Copié !"
    setTimeout(() => btn.textContent = "Copier URL", 1200)
  })
})
// Boutons Filtres
document.querySelectorAll('.gallery-card').forEach(card => {
  const img = card.querySelector('img')
  card.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.dataset.filter === "grayscale") img.style.filter = "grayscale(1)"
      else img.style.filter = ""
    })
  })
})
</script>
`

fs.writeFileSync(path.resolve(__dirname, "images-gallery.md"), md, "utf-8")
console.log("✅ images-gallery.md généré enrichi et interactif !")
