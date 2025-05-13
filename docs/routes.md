---
layout: default
title: Routes
---

# API Routes

Voici un aperçu des principales routes backend exposées par le service API.  
Elles permettent aux clients (web & mobile) de gérer les utilisateurs et d’accéder aux URLs Cloudinary.

## Authentification

- **POST /api/signup**  
  Crée un nouveau compte utilisateur.

  - **Body** : `{ "email": string, "password": string, "name": string }`
  - **Réponse** : `{ "userId": string, "token": string }`

- **POST /api/signin**  
  Authentifie un utilisateur existant.
  - **Body** : `{ "email": string, "password": string }`
  - **Réponse** : `{ "userId": string, "token": string }`

## Images

- **GET /api/images/:category/:id**  
  Renvoie l’URL publique Cloudinary pour une image donnée.

  - **Params** :
    - `category`: `"avatars" | "backgrounds" | "badges"`
    - `id`: identifiant ou nom de fichier (sans extension)
  - **Réponse** : `{ "url": string }`

- **POST /api/images/upload**  
  Endpoint pour uploader une image (utilise les credentials Cloudinary côté serveur).
  - **Headers** : `Authorization: Bearer <token>`
  - **Body** : FormData avec champ `file` (binary) et `category`
  - **Réponse** : `{ "publicId": string, "secureUrl": string }`

---

> Ces routes sont documentées ici pour que chaque membre de l’équipe sache comment intégrer l’authentification et la récupération des images depuis Cloudinary.
