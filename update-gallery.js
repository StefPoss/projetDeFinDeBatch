// update-gallery.js
// À placer à la racine du projet (parent de /back et /front)

import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Gestion du chemin absolu
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Fonction utilitaire pour lancer une commande synchronously et afficher les logs
function run(cmd, cwd = process.cwd()) {
  console.log(`\n---\n▶️  ${cmd} (in ${cwd})`)
  try {
    execSync(cmd, { stdio: "inherit", cwd })
  } catch (e) {
    console.error(`❌ Erreur pour "${cmd}" :`, e.message)
    process.exit(1)
  }
}

// 1. Génère le JSON d'images (list-images.js)
run("node scripts/list-images.js", path.join(__dirname, "back"))

// 2. Génère la galerie markdown (generate-md-gallery.js)
run("node scripts/generate-md-gallery.js", path.join(__dirname, "back"))

// 3. Ajoute les fichiers générés au suivi git et commit
const filesToAdd = ["front/data/imagesData.json", "docs/images-gallery.md"]
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
