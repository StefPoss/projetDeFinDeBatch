// scripts/list-images.js
// Récupère les images Cloudinary et génère un JSON utilisable côté front

import path from "path"
import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { fileURLToPath } from "url"

// Gestion du contexte de chemin (pour scripts)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Charge les credentials Cloudinary depuis .env (à la racine du projet)
dotenv.config({ path: path.join(__dirname, "../.env") })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Fonction utilitaire pour affichage taille
function humanFileSize(bytes) {
  if (bytes === 0) return "0 Ko"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ["octets", "Ko", "Mo", "Go"]
  return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + sizes[i]
}

async function generateGalleries() {
  try {
    // Appel Cloudinary : récupère toutes les images du projet
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

    // Génère le JSON pour le frontend, dans le bon dossier
    const jsonDir = path.join(__dirname, "../front/data")
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true })
    const jsonPath = path.join(jsonDir, "imagesData.json")
    fs.writeFileSync(jsonPath, JSON.stringify(images, null, 2), "utf-8")
    console.log("✅ JSON enrichi généré :", jsonPath)
  } catch (err) {
    console.error("Erreur lors de la récupération des images :", err)
    process.exit(1)
  }
}

generateGalleries()
