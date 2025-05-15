// back/routes/api.js (ou équivalent)
import express from "express"
import { v2 as cloudinary } from "cloudinary"

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.get("/cloudinary-images", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "projectFinDeBatch/front/images",
      max_results: 100,
    })
    res.json(result.resources)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
