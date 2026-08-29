import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
}

const CATEGORY_TREE = [
  {
    nameUz: 'Noutbuklar', nameRu: 'Ноутбуки', nameEn: 'Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    children: [
      { nameUz: 'Gaming Noutbuklar', nameRu: 'Игровые ноутбуки', nameEn: 'Gaming Laptops' },
      { nameUz: 'Biznes Noutbuklar', nameRu: 'Бизнес ноутбуки', nameEn: 'Business Laptops' },
      { nameUz: 'Ultrabuklar', nameRu: 'Ультрабуки', nameEn: 'Ultrabooks' },
    ],
  },
  {
    nameUz: 'Kompyuterlar', nameRu: 'Компьютеры', nameEn: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800',
    children: [
      { nameUz: 'Monitorlar', nameRu: 'Мониторы', nameEn: 'Monitors' },
      { nameUz: 'Tizim bloklari', nameRu: 'Системные блоки', nameEn: 'System Units' },
      { nameUz: 'Hammasi birda (All-in-One)', nameRu: 'Моноблоки', nameEn: 'All-in-One' },
    ],
  },
  {
    nameUz: 'Aksessuarlar', nameRu: 'Аксессуары', nameEn: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    children: [
      { nameUz: 'Klaviaturalar', nameRu: 'Клавиатуры', nameEn: 'Keyboards' },
      { nameUz: 'Sichqonchalar', nameRu: 'Мыши', nameEn: 'Mice' },
      { nameUz: 'Quloqchinlar', nameRu: 'Наушники', nameEn: 'Headphones' },
      { nameUz: 'Sumkalar', nameRu: 'Сумки', nameEn: 'Bags' },
    ],
  },
  {
    nameUz: 'Ehtiyot qismlar', nameRu: 'Запчасти', nameEn: 'Components',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
    children: [
      { nameUz: 'Videokartalar', nameRu: 'Видеокарты', nameEn: 'Video Cards' },
      { nameUz: 'Protsessorlar', nameRu: 'Процессоры', nameEn: 'Processors' },
      { nameUz: 'Operativ xotira', nameRu: 'Оперативная память', nameEn: 'RAM' },
    ],
  },
  {
    nameUz: 'Smartfonlar', nameRu: 'Смартфоны', nameEn: 'Smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    children: [
      { nameUz: 'Flagmanlar', nameRu: 'Флагманы', nameEn: 'Flagships' },
      { nameUz: 'Byudjet', nameRu: 'Бюджетные', nameEn: 'Budget' },
    ],
  },
  {
    nameUz: 'Planshetlar', nameRu: 'Планшеты', nameEn: 'Tablets',
    imageUrl: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800',
    children: [
      { nameUz: 'Kattalar uchun', nameRu: 'Для взрослых', nameEn: 'For adults' },
      { nameUz: 'Bolalar uchun', nameRu: 'Для детей', nameEn: 'For kids' },
    ],
  },
];

const BRANDS = ['ASUS', 'HP', 'Lenovo', 'Apple', 'MSI', 'Acer', 'Dell', 'Logitech', 'Razer', 'Samsung', 'HyperX'];

const PRODUCT_TEMPLATES = [
  {
    name: 'ROG Strix G16', cat: 'Gaming Laptops', brand: 'ASUS', price: 18500000,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800',
      'https://images.unsplash.com/photo-1593642702821-c823b2816934?w=800'
    ]
  },
  {
    name: 'MacBook Pro 14 M3', cat: 'Ultrabooks', brand: 'Apple', price: 24000000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800'
    ]
  },
  {
    name: 'ThinkPad X1 Carbon', cat: 'Business Laptops', brand: 'Lenovo', price: 19800000,
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      'https://images.unsplash.com/photo-1618424181497-157f25b6ce5e?w=800'
    ]
  },
  {
    name: 'Gaming Mouse G502', cat: 'Mice', brand: 'Logitech', price: 850000,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c399c?w=800',
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800'
    ]
  },
  {
    name: 'Mechanical Keyboard BlackWidow', cat: 'Keyboards', brand: 'Razer', price: 1650000,
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800'
    ]
  },
  {
    name: 'Odyssey G7 27"', cat: 'Monitors', brand: 'Samsung', price: 6500000,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', // Monitor
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800'
    ]
  },
  {
    name: 'Cloud II Wireless', cat: 'Headphones', brand: 'HyperX', price: 1450000,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
    ]
  },
  {
    name: 'RTX 4090 24GB', cat: 'Video Cards', brand: 'ASUS', price: 28000000,
    images: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800',
      'https://images.unsplash.com/photo-1658428886367-e95e86d26732?w=800'
    ]
  },
];

async function main() {
  console.log('Seeding database for Professional Tools...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.question.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.sliderBanner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@protools.uz',
      username: '1234',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      adminLevel: 'SUPER_ADMIN',
    },
  });
  await prisma.cart.create({ data: { userId: admin.id } });
  await prisma.wishlist.create({ data: { userId: admin.id } });

  const categoryBySlug = new Map();
  for (const parent of CATEGORY_TREE) {
    const parentSlug = slugify(parent.nameEn);
    const createdParent = await prisma.category.create({
      data: { nameUz: parent.nameUz, nameRu: parent.nameRu, nameEn: parent.nameEn, slug: parentSlug, imageUrl: parent.imageUrl },
    });
    categoryBySlug.set(parent.nameEn, createdParent);

    for (const child of parent.children) {
      const childSlug = slugify(child.nameEn);
      const createdChild = await prisma.category.create({
        data: {
          nameUz: child.nameUz, nameRu: child.nameRu, nameEn: child.nameEn,
          slug: childSlug, parentId: createdParent.id,
        },
      });
      categoryBySlug.set(child.nameEn, createdChild);
    }
  }

  const brandByName = new Map();
  for (const name of BRANDS) {
    const brand = await prisma.brand.create({ data: { name } });
    brandByName.set(name, brand);
  }

  let sku = 5000;
  for (const tpl of PRODUCT_TEMPLATES) {
    const category = categoryBySlug.get(tpl.cat);
    const brand = brandByName.get(tpl.brand);
    if (!category) continue;

    sku += 1;
    await prisma.product.create({
      data: {
        nameUz: `${tpl.brand} ${tpl.name}`,
        nameRu: `${tpl.brand} ${tpl.name}`,
        nameEn: `${tpl.brand} ${tpl.name}`,
        descriptionUz: `${tpl.brand} ${tpl.name} — eng so'nggi texnologiyalar asosida yaratilgan professional uskunalar.`,
        descriptionRu: `${tpl.brand} ${tpl.name} — профессиональное оборудование, созданное на основе новейших технологий.`,
        descriptionEn: `${tpl.brand} ${tpl.name} — professional equipment created based on the latest technology.`,
        slug: slugify(`${tpl.brand}-${tpl.name}`),
        price: tpl.price,
        stock: 50,
        sku: `PT-${sku}`,
        specs: JSON.stringify({ Brend: tpl.brand, Kafolat: '24 oy' }),
        brandId: brand?.id,
        categoryId: category.id,
        isFeatured: true,
        images: { create: tpl.images.map((url, i) => ({ url, order: i })) },
      },
    });
  }

  await prisma.sliderBanner.createMany({
    data: [
      { title: "Yangi Gaming Noutbuklar", subtitle: "20% gacha chegirma", imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1600', link: '/catalog', order: 0 },
      { title: 'Professional Monitorlar', subtitle: "4K va OLED panellar", imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1600', link: '/catalog', order: 1 },
    ],
  });

  console.log('Seed complete for Professional Tools.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
