---
layout: default
title: Gallery
---

## Galerie d'images Cloudinary

Hébergement des images du projet sur CDN via Cloudinary pour la gestion, la transformation et la distribution des images > permet de fournir les URLs optimisées pour le frontend (React Native & web).

---

<!-- 1. Ton CSS Grid pour la galerie -->
<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    max-width: 1200px;
    margin: 2rem auto;
  }
  .gallery img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
  }
  @media (max-width: 768px) {
    .gallery {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<!-- 2. Conteneur de la galerie -->
<div id="gallery" class="gallery"></div>

<!-- 3. Script client pour peupler la galerie -->
<script>
  (function() {
    fetch('/data/imagesData.json')
      .then(res => res.json())
      .then(images => {
        const gallery = document.getElementById('gallery');
        images.forEach(({ url, alt }) => {
          const img = document.createElement('img');
          img.src = url;
          img.alt = alt;
          gallery.appendChild(img);
        });
      })
      .catch(err => console.error('Erreur galerie :', err));
  })();
</script>
