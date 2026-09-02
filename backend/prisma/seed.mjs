import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const parseJson = (value) => JSON.stringify(value);
const dakarRegionCities = ['Dakar', 'Rufisque', 'Pikine', 'Keur Massar'];

const properties = [
  {
    title: 'Appartement raffiné - Mermoz',
    description: 'Appartement lumineux et bien fini dans un immeuble calme à Mermoz. Séjour sobre, cuisine moderne, balcon ventilé et proximité des commodités.',
    price: 450000,
    type: 'apartment',
    transactionType: 'rent',
    surface: 96,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    address: 'Rue MZ-14, Mermoz',
    city: 'Dakar',
    neighborhood: 'Mermoz',
    postalCode: '12000',
    latitude: 14.7232,
    longitude: -17.4798,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Balcon', 'Cuisine moderne', 'Climatisation', 'Ascenseur', 'Parking'],
    featured: true,
  },
  {
    title: 'Maison familiale - Ouakam',
    description: 'Maison simple et soignée à Ouakam, pensée pour une vie de famille confortable. Grand salon, patio discret et chambres bien distribuées.',
    price: 180000,
    type: 'house',
    transactionType: 'rent',
    surface: 165,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 2,
    address: 'Lot 22, Ouakam',
    city: 'Dakar',
    neighborhood: 'Ouakam',
    postalCode: '11500',
    latitude: 14.7291,
    longitude: -17.5109,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Patio', 'Salon spacieux', 'Ventilation naturelle', 'Quartier calme'],
  },
  {
    title: 'Appartement contemporain - Plateau',
    description: 'Appartement élégant au Plateau, avec finitions sobres et vue dégagée. Idéal pour un cadre de vie urbain et pratique.',
    price: 52000000,
    type: 'apartment',
    transactionType: 'sale',
    surface: 118,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    address: 'Boulevard de la République, Plateau',
    city: 'Dakar',
    neighborhood: 'Plateau',
    postalCode: '11000',
    latitude: 14.6928,
    longitude: -17.4467,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Vue dégagée', 'Ascenseur', 'Cuisine équipée', 'Sécurité 24h'],
  },
  {
    title: 'Villa familiale - Almadies',
    description: 'Villa chic aux Almadies avec jardin propre, terrasse ouverte et belle circulation intérieure. Une maison raffinée sans excès.',
    price: 95000000,
    type: 'villa',
    transactionType: 'sale',
    surface: 280,
    rooms: 7,
    bedrooms: 5,
    bathrooms: 4,
    address: '12 Route des Almadies',
    city: 'Dakar',
    neighborhood: 'Almadies',
    postalCode: '10500',
    latitude: 14.7433,
    longitude: -17.51,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Jardin', 'Terrasse', 'Garage', 'Piscine', 'Sécurité'],
    featured: true,
  },
  {
    title: 'Maison lumineuse - Parcelles Assainies',
    description: 'Maison propre et fonctionnelle dans un secteur vivant. Espaces bien aérés, séjour accueillant et cour pratique pour le quotidien.',
    price: 220000,
    type: 'house',
    transactionType: 'rent',
    surface: 190,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    address: 'Unité 18, Parcelles Assainies',
    city: 'Dakar',
    neighborhood: 'Parcelles Assainies',
    postalCode: '14200',
    latitude: 14.75,
    longitude: -17.45,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Cour intérieure', 'Cuisine moderne', 'Lumineux', 'Parking'],
  },
  {
    title: 'Appartement pratique - Rufisque',
    description: 'Appartement bien agencé à Rufisque avec des finitions propres et une circulation agréable. Parfait pour un premier achat ou une location stable.',
    price: 17000000,
    type: 'apartment',
    transactionType: 'sale',
    surface: 74,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    address: 'Cité Sipres, Rufisque',
    city: 'Rufisque',
    neighborhood: 'Cité Sipres',
    postalCode: '13000',
    latitude: 14.7148,
    longitude: -17.2734,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Cuisine aménagée', 'Séjour pratique', 'Quartier calme'],
  },
  {
    title: 'Appartement simple et propre - Mbao',
    description: 'Appartement lumineux à Mbao avec séjour fonctionnel, finitions soignées et accès rapide aux axes principaux. Un cadre simple et serein.',
    price: 175000,
    type: 'apartment',
    transactionType: 'rent',
    surface: 82,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    address: 'Route de Mbao, Mbao',
    city: 'Pikine',
    neighborhood: 'Mbao',
    postalCode: '14000',
    latitude: 14.7262,
    longitude: -17.3363,
    images: [
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Lumineux', 'Cuisine ouverte', 'Balcon', 'Accès routier facile'],
  },
  {
    title: 'Maison familiale - Keur Mbaye Fall',
    description: 'Maison bien tenue à Keur Mbaye Fall, pensée pour une vie familiale calme. Salon convivial, chambres confortables et cour pratique.',
    price: 32000000,
    type: 'house',
    transactionType: 'sale',
    surface: 150,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    address: 'Keur Mbaye Fall, Pikine',
    city: 'Pikine',
    neighborhood: 'Keur Mbaye Fall',
    postalCode: '14000',
    latitude: 14.7258,
    longitude: -17.3824,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Cour', 'Salon spacieux', 'Cuisine pratique', 'Quartier calme'],
  },
  {
    title: 'Appartement moderne - Keur Massar',
    description: 'Appartement moderne et bien agencé à Keur Massar. Une proposition propre et raffinée pour habiter ou investir avec sérénité.',
    price: 38000000,
    type: 'apartment',
    transactionType: 'sale',
    surface: 104,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    address: 'Cité Afia, Keur Massar',
    city: 'Keur Massar',
    neighborhood: 'Keur Massar',
    postalCode: '14500',
    latitude: 14.7593,
    longitude: -17.3147,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Cuisine moderne', 'Balcon', 'Luminosité', 'Parking'],
  },
  {
    title: 'Terrain à vendre - Rufisque',
    description: 'Terrain nu et constructible à Rufisque, avec une belle emprise pour un projet de maison ou d\'investissement. Parcelle plane, propre et bien située.',
    price: 12500000,
    type: 'land',
    transactionType: 'sale',
    surface: 300,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    address: 'Cité Cité Mbao, Rufisque',
    city: 'Rufisque',
    neighborhood: 'Rufisque',
    postalCode: '13000',
    latitude: 14.7209,
    longitude: -17.2791,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=80&auto=format&fit=crop',
    ],
    features: ['Terrain nu', 'Constructible', 'Accès facile', 'Zone calme'],
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@diaspora-imo-mathiam-mbow.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'admin', fullName: 'Administrateur' },
    create: { email, password: hashedPassword, role: 'admin', fullName: 'Administrateur' },
  });

  await prisma.property.deleteMany({
    where: { city: { notIn: dakarRegionCities } },
  });

  for (const property of properties) {
    const existing = await prisma.property.findFirst({ where: { title: property.title } });
    if (existing) continue;
    await prisma.property.create({
      data: {
        ...property,
        // Le client Prisma accepte maintenant directement les valeurs d'enum (string identiques)
        type: property.type,
        transactionType: property.transactionType,
        images: parseJson(property.images),
        features: parseJson(property.features),
        ownerId: admin.id,
      },
    });
  }

  console.log(`Administrateur prêt : ${email}`);
}

main().finally(() => prisma.$disconnect());