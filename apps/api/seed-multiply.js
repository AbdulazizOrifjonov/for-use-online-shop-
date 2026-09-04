import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
    }
  });

  if (products.length === 0) {
    console.log("No products to duplicate.");
    return;
  }

  // Multiply products to reach at least 15-20 products
  const targetCount = 20;
  const currentCount = products.length;
  const toCreate = targetCount - currentCount;

  if (toCreate <= 0) {
    console.log("Already have enough products.");
    return;
  }

  console.log(`Duplicating products. Need ${toCreate} more...`);

  for (let i = 0; i < toCreate; i++) {
    const p = products[i % products.length];
    
    const suffix = ` (Top ${i + 1})`;
    
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
        specs: p.specs, // scalar JSON field
        images: {
          create: p.images.map(img => ({
            url: img.url,
            isMain: img.isMain
          }))
        }
      }
    });
  }

  console.log("Successfully multiplied products!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
