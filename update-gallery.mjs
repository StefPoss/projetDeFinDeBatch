// update-gallery.mjs
// À placer à la racine du projet (parent de /back et /front)

import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Gestion du chemin absolu
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Fonction utilitaire pour lancer une commande synchronously et afficher les logs
function run(cmd, cwd = process.cwd(), options = {}) {
  console.log(`\n---\n▶️  ${cmd} (in ${cwd})`)
  try {
    execSync(cmd, { stdio: "inherit", cwd, ...options })
  } catch (e) {
    // Spécial pour git commit "nothing to commit, working tree clean"
    if (cmd.startsWith("git commit") && e.status === 1) {
      console.log("ℹ️  Rien à committer (working tree clean).")
    } else {
      console.error(`❌ Erreur pour "${cmd}" :`, e.message)
      process.exit(1)
    }
  }
}

// 0. (Optionnel) Upload images locales vers Cloudinary
// Décommente la ligne suivante pour uploader toutes les images locales avant de générer le JSON :
// run("node scripts/upload-front.js", path.join(__dirname, "back"))

// 1. Génère le JSON d'images (list-images.js)
run("node scripts/list-images.js", path.join(__dirname, "back"))

// 2. Génère la galerie markdown (generate-md-gallery.js)
run("node scripts/generate-md-gallery.js", path.join(__dirname, "back"))

// 3. Ajoute les fichiers générés au suivi git et commit
const filesToAdd = [
  "back/front/data/imagesData.json",
  "back/docs/images-gallery.md",
]
for (const relPath of filesToAdd) {
  const absPath = path.join(__dirname, relPath)
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Fichier introuvable : ${relPath}`)
    process.exit(1)
  }
}

run(`git add ${filesToAdd.join(" ")}`, __dirname)
run(`git commit -m "Update image gallery"`, __dirname)

// Pour push automatiquement, décommente la ligne ci-dessous :
// run(`git push`, __dirname)

console.log("\n✅ Galerie mise à jour et commitée !")
