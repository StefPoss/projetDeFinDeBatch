// scripts/list-images.js
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configuration Cloudinary via .env variables
// Requis : CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function generateMarkdownGallery() {
  try {
    // Liste des ressources depuis Cloudinary
    const result = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "projectFinDeBatch/front/images",
      max_results: 500,
    });
    const images = result.resources;

    // Construire le markdown
    let md = "# Images Gallery\n\n";
    md += "## Galerie d'images Cloudinary\n\n";
    images.forEach((img) => {
      const url = img.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
      md += `![${img.public_id}](<${url}>)\n\n`;
    });

    // Enregistrer dans docs/images-gallery.md
    const outPath = path.join(process.cwd(), "..", "docs", "images-gallery.md");
    fs.writeFileSync(outPath, md);
    console.log(`Markdown gallery générée : ${outPath}`);
  } catch (err) {
    console.error("Erreur lors de la récupération des images :", err);
    process.exit(1);
  }
}

generateMarkdownGallery();
