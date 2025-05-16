// scripts/list-images.js
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })
const { v2: cloudinary } = require("cloudinary")
const fs = require("fs")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function humanFileSize(bytes) {
  if (bytes === 0) return "0 Ko"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ["octets", "Ko", "Mo", "Go"]
  return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + sizes[i]
}

async function generateGalleries() {
  try {
    const result = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "projectFinDeBatch/front/images",
      max_results: 500,
      tags: true,
    })
    const images = result.resources.map((img) => ({
      url: img.secure_url.replace("/upload/", "/upload/f_auto,q_auto/"),
      original_url: img.secure_url,
      alt: img.public_id,
      tags: img.tags || [],
      format: img.format,
      width: img.width,
      height: img.height,
      bytes: img.bytes,
    }))

    // 1. Génère le JSON riche pour le frontend
    const jsonDir = path.join(__dirname, "../../front/data")
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true })
    const jsonPath = path.join(jsonDir, "imagesData.json")
    fs.writeFileSync(jsonPath, JSON.stringify(images, null, 2), "utf-8")
    console.log("✅ JSON enrichi généré :", jsonPath)

    // 2. Génère le markdown enrichi (galerie statique avec actions)
    let md = `
<!--
Galerie générée dynamiquement avec toutes les propriétés Cloudinary affichées.
Le style des cards/galerie est maintenant dans /docs/assets/style.css et /docs/assets/dark.css
-->
<div class="gallery">
`

    images.forEach((img) => {
      // Prépare variantes format + crop/resize
      let variants = `
      <div class="gallery-variant">
        <span>Voir en :</span>
        <a href="${img.original_url.replace(
          "/upload/",
          "/upload/f_avif/"
        )}" class="variant-link" target="_blank">AVIF</a>
        <a href="${img.original_url.replace(
          "/upload/",
          "/upload/f_jpg/"
        )}" class="variant-link" target="_blank">JPG</a>
        <a href="${img.original_url.replace(
          "/upload/",
          "/upload/f_png/"
        )}" class="variant-link" target="_blank">PNG</a>
        <span class="sep">|</span>
        <a href="${img.original_url
          .replace("/upload/", "/upload/w_400,h_400,c_fill/")
          .replace(
            /f_[^/]+\//,
            ""
          )}" class="variant-link" target="_blank">Carré</a>
        <a href="${img.original_url
          .replace("/upload/", "/upload/w_256/")
          .replace(
            /f_[^/]+\//,
            ""
          )}" class="variant-link" target="_blank">Vignette</a>
      </div>
    `
      md += `
  <div class="gallery-card">
    <img src="${img.url}" alt="${img.alt}" data-original="${img.url}">
    <div class="cloud-info">
      Format : <b>${img.format || "-"}</b> | Dimensions : <b>${
        img.width || "?"
      }×${img.height || "?"}</b> | Taille : <b>${humanFileSize(
        img.bytes || 0
      )}</b>
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

    const mdPath = path.join(__dirname, "../../docs/images-gallery.md")
    fs.writeFileSync(mdPath, md, "utf-8")
    console.log("✅ Markdown enrichi généré :", mdPath)
  } catch (err) {
    console.error("Erreur lors de la récupération des images :", err)
    process.exit(1)
  }
}

generateGalleries()
