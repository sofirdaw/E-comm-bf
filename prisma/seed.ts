// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding e-comm-bf database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommbf.com' },
    update: {},
    create: {
      name: 'August Admin',
      email: 'admin@ecommbf.com',
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Demo user
  const userPassword = await bcrypt.hash('user123!', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@ecommbf.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@ecommbf.com',
      password: userPassword,
      role: Role.USER,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Demo user created:', user.email)

  // Categories
  const categories = [
    { name: 'Smartphones', description: 'Téléphones mobiles et accessoires', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
    { name: 'Laptops', description: 'Ordinateurs portables et ultrabooks', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    { name: 'Audio', description: 'Casques, écouteurs et enceintes', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { name: 'Gaming', description: 'Consoles, jeux et accessoires gaming', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
    { name: 'Cameras', description: 'Appareils photo et caméscopes', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
    { name: 'Accessories', description: 'Accessoires tech et gadgets', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  ]

  const createdCategories: { [key: string]: string } = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: slugify(cat.name, { lower: true }) },
      update: {},
      create: {
        name: cat.name,
        slug: slugify(cat.name, { lower: true }),
        description: cat.description,
        image: cat.image,
      },
    })
    createdCategories[cat.name] = created.id
  }
  console.log('✅ Categories created')

  // Products
  const products = [
    {
      name: 'iPhone 16 Pro Max',
      category: 'Smartphones',
      price: 1299000,
      salePrice: 1199000,
      stock: 25,
      featured: true,
      brand: 'Apple',
      description: 'Le smartphone ultime avec puce A18 Pro, caméra 48MP pro avec zoom optique 5x, écran Super Retina XDR 6.9" et autonomie exceptionnelle.',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
      ],
      tags: ['apple', 'iphone', 'flagship'],
    },
    {
      name: 'Samsung Galaxy S25 Ultra',
      category: 'Smartphones',
      price: 1149000,
      salePrice: null,
      stock: 30,
      featured: true,
      brand: 'Samsung',
      description: 'Maîtrisez l\'art de la productivité avec le S Pen intégré, la caméra 200MP et le processeur Snapdragon 8 Elite.',
      images: [
        'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600',
      ],
      tags: ['samsung', 'galaxy', 'android'],
    },
    {
      name: 'MacBook Pro 16" M4 Pro',
      category: 'Laptops',
      price: 2499000,
      salePrice: 2199000,
      stock: 15,
      featured: true,
      brand: 'Apple',
      description: 'La puissance révolutionnaire de la puce M4 Pro avec 24 cœurs GPU, écran Liquid Retina XDR et jusqu\'à 48GB de RAM unifiée.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600',
      ],
      tags: ['apple', 'macbook', 'laptop'],
    },
    {
      name: 'Dell XPS 15 OLED',
      category: 'Laptops',
      price: 1899000,
      salePrice: null,
      stock: 12,
      featured: false,
      brand: 'Dell',
      description: 'Écran OLED 3.5K OLED à 120Hz, Intel Core Ultra 9, RTX 4070 et design CNC aluminium premium.',
      images: [
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600',
      ],
      tags: ['dell', 'xps', 'windows'],
    },
    {
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      price: 399000,
      salePrice: 329000,
      stock: 50,
      featured: true,
      brand: 'Sony',
      description: 'Réduction de bruit leader du marché avec 30h d\'autonomie, son Hi-Res Audio et confort premium pour des écoutes longues durée.',
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      ],
      tags: ['sony', 'casque', 'anc'],
    },
    {
      name: 'AirPods Pro 2',
      category: 'Audio',
      price: 279000,
      salePrice: null,
      stock: 60,
      featured: false,
      brand: 'Apple',
      description: 'ANC adaptatif, audio spatial personnalisé, mode transparence avancé et jusqu\'à 30h d\'autonomie totale avec le boîtier.',
      images: [
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600',
      ],
      tags: ['apple', 'airpods', 'earbuds'],
    },
    {
      name: 'PlayStation 5 Pro',
      category: 'Gaming',
      price: 699000,
      salePrice: null,
      stock: 8,
      featured: true,
      brand: 'Sony',
      description: 'La console next-gen ultime avec GPU amélioré pour la 4K native à 60fps, ray tracing amélioré et SSD ultra-rapide.',
      images: [
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600',
      ],
      tags: ['playstation', 'gaming', 'console'],
    },
    {
      name: 'Sony Alpha 7R V',
      category: 'Cameras',
      price: 3799000,
      salePrice: 3499000,
      stock: 5,
      featured: false,
      brand: 'Sony',
      description: 'Capteur plein format BSI CMOS 61MP, autofocus AI révolutionnaire, vidéo 8K et stabilisation IBIS 8 stops.',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
      ],
      tags: ['sony', 'appareil photo', 'mirrorless'],
    },
    {
      name: 'Apple Watch Ultra 2',
      category: 'Accessories',
      price: 799000,
      salePrice: null,
      stock: 20,
      featured: false,
      brand: 'Apple',
      description: 'La montre connectée la plus robuste avec boîtier titane, GPS de précision L5, autonomie 60h et certification MIL-STD-810H.',
      images: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600',
      ],
      tags: ['apple', 'watch', 'smartwatch'],
    },
    {
      name: 'Samsung Galaxy Tab S10 Ultra',
      category: 'Accessories',
      price: 1299000,
      salePrice: 1099000,
      stock: 18,
      featured: false,
      brand: 'Samsung',
      description: 'Tablette premium 14.6" Super AMOLED, puce Snapdragon 8 Gen 3, S Pen inclus et mode DeX pour la productivité.',
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
      ],
      tags: ['samsung', 'tablette', 'android'],
    },
  ]

  for (const p of products) {
    const slug = slugify(p.name, { lower: true, strict: true })
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        featured: p.featured,
        brand: p.brand,
        images: p.images,
        tags: p.tags,
        categoryId: createdCategories[p.category],
        rating: Math.random() * 1.5 + 3.5,
        reviewCount: Math.floor(Math.random() * 200 + 10),
        views: Math.floor(Math.random() * 2000 + 100),
      },
    })
  }
  console.log('✅ Products created')

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Nouvelle Collection 2026',
        subtitle: 'Découvrez les dernières innovations tech',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1400',
        link: '/store/products',
        buttonText: 'Explorer',
        active: true,
        order: 1,
      },
      {
        title: 'Gaming Pro Setup',
        subtitle: 'Équipez-vous comme un pro',
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400',
        link: '/store/products?category=gaming',
        buttonText: 'Voir les Gaming',
        active: true,
        order: 2,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Banners created')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
