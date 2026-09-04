import express from 'express';
import { prisma } from '../lib/prisma.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/multiply', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    });

    if (products.length === 0) {
      return res.json({ message: "No products to duplicate" });
    }

    const targetCount = 20;
    const currentCount = products.length;
    const toCreate = targetCount - currentCount;

    if (toCreate <= 0) {
      return res.json({ message: "Already enough products" });
    }

    for (let i = 0; i < toCreate; i++) {
      const p = products[i % products.length];
      const suffix = ` (New ${i + 1})`;
      
      await prisma.product.create({
        data: {
          slug: `${p.slug}-${uuidv4().substring(0, 8)}`,
          nameUz: `${p.nameUz}${suffix}`,
          nameRu: `${p.nameRu}${suffix}`,
          nameEn: `${p.nameEn}${suffix}`,
          descriptionUz: p.descriptionUz,
          descriptionRu: p.descriptionRu,
          descriptionEn: p.descriptionEn,
          price: p.price,
          discountPrice: p.discountPrice,
          stock: p.stock,
          brandId: p.brandId,
          categoryId: p.categoryId,
          specs: p.specs,
          images: {
            create: p.images.map(img => ({
              url: img.url,
              isMain: img.isMain
            }))
          }
        }
      });
    }

    res.json({ message: `Multiplied products! Added ${toCreate} items.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
