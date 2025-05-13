// scripts/upload-front.js
import { v2 as cloudinary } from "cloudinary";
import { sync as globSync } from "glob";
import path from "path";

// 1) Tes credentials Cloudinary
cloudinary.config({
  cloud_name: "deuhttaaq",
  api_key: "111424268314556",
  api_secret: "vcxDvo6oXMnZ6AD0apb41a2MfNc",
});

// 2) Chemin absolu vers ton dossier front/resources/images
const BASE = "C:/__DevWeb/_laCapsule/ProjetFinDeBatch/front/resources/images/";

try {
  // 3) Recherche tous les fichiers images
  const files = globSync(`${BASE}**/*.{avif,jpg,png,webp}`, { nocase: true });
  if (files.length === 0) {
    console.error("❌ Aucun fichier trouvé dans ", BASE);
    process.exit(1);
  }

  for (const file of files) {
    // calcule le chemin relatif et le public_id sans extension
    const rel = path.relative(BASE, file).replace(/\\/g, "/");
    const publicId = `projectFinDeBatch/front/images/${rel}`.replace(
      /\.[^/.]+$/,
      ""
    );
    try {
      const res = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        resource_type: "image",
      });
      console.log(`✅ ${rel} → ${res.secure_url}`);
    } catch (e) {
      console.error(`❌ Échec upload ${rel}:`, e.message);
    }
  }
} catch (err) {
  console.error("❌ Erreur globbing ou script :", err);
  process.exit(1);
}
