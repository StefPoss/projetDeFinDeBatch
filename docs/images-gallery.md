---
layout: default
title: Gallery
---

## Galerie d'images Cloudinary

Hébergement des images du projet sur CDN via Cloudinary pour la gestion, la transformation et la distribution des images > permet de fournir les URLs optimisées pour le frontend (React Native & web).

---

<!-- 1. Ton CSS Grid pour la galerie -->
<style>
  .gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1200px; margin: 2rem auto; }
  @media (max-width: 1000px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .gallery { grid-template-columns: 1fr; } }
  .gallery-card { background: #fafafa; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #0001; padding: 8px; display: flex; flex-direction: column; align-items: center; }
  .gallery-card img { width: 100%; border-radius: 8px; }
  .cloud-tags { margin: 8px 0; font-size: .85em; color: #888; }
  .gallery-actions { margin-top: 8px; display: flex; gap: 8px; }
  .gallery-actions button { border: none; background: #f0b429; color: #222; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: .95em; }
</style>

<!-- 2. Conteneur de la galerie -->
<div id="gallery" class="gallery"></div>

<!-- 3. Script client pour populer la galerie -->
<script>
(async function () {
  // Version proxy backend (recommandé, pour garder ta clé Cloudinary safe)
  const images = await fetch('/api/cloudinary-images').then(r => r.json());

  const gallery = document.getElementById('gallery');
  images.forEach(img => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    // Affichage image
    card.innerHTML = `
      <img src="${img.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')}" alt="${img.public_id}">
      <div class="cloud-tags">${(img.tags || []).join(', ')}</div>
      <div class="gallery-actions">
        <button onclick="window.open('${img.secure_url}', '_blank')">Ouvrir</button>
        <button onclick="navigator.clipboard.writeText('${img.secure_url}')">Copier URL</button>
        ${img.colors && img.colors.length > 0
          ? `<button onclick="alert('Variantes couleur non implémentées')">Voir couleurs</button>`
          : ''
        }
      </div>
    `;
    gallery.appendChild(card);
  });
})();
</script>
