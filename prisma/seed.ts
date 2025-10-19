import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Sample data arrays
const foodNames = {
  Kahvaltı: [
    "Simit",
    "Kaşarlı Poğaça",
    "Zeytinli Pide",
    "Menemen",
    "Sahanda Yumurta",
    "Peynirli Omlet",
    "Sucuklu Yumurta",
    "Kahvaltı Tabağı",
    "Tost",
    "Çay",
    "Türk Kahvesi",
    "Espresso",
    "Latte",
    "Cappuccino",
    "Americano",
    "Filtre Kahve",
    "Mocha",
    "Macchiato",
    "Frappuccino",
    "Hot Chocolate",
  ],
  Çorba: [
    "Mercimek Çorbası",
    "Ezogelin Çorbası",
    "Tarhana Çorbası",
    "Yayla Çorbası",
    "Domates Çorbası",
    "Mantar Çorbası",
    "Kremalı Mantar Çorbası",
    "Sebzeli Çorba",
    "Kırmızı Mercimek Çorbası",
    "Yoğurtlu Çorba",
    "Düğün Çorbası",
    "İşkembe Çorbası",
  ],
  "Ana Yemek": [
    "Tavuklu Pilav",
    "Kıymalı Pilav",
    "Etli Pilav",
    "Sebzeli Pilav",
    "Bulgur Pilavı",
    "Köfte",
    "Adana Kebap",
    "Urfa Kebap",
    "Şiş Kebap",
    "Döner",
    "İskender",
    "Lahmacun",
    "Pide",
    "Mantı",
    "Karnıyarık",
    "İmambayıldı",
    "Musakka",
    "Fasulye",
    "Kuru Fasulye",
    "Nohutlu Pilav",
    "Tavuk Sote",
    "Et Sote",
  ],
  İçecek: [
    "Türk Çayı",
    "Yeşil Çay",
    "Siyah Çay",
    "Ihlamur",
    "Ada Çayı",
    "Limonata",
    "Şef Limonata",
    "Portakal Suyu",
    "Elma Suyu",
    "Nar Suyu",
    "Ayran",
    "Sade Ayran",
    "Süzme Ayran",
    "Meyveli Ayran",
    "Kefir",
  ],
  Tatlı: [
    "Baklava",
    "Kadayıf",
    "Sütlaç",
    "Kazandibi",
    "Künefe",
    "Tavuk Göğsü",
    "Dondurma",
    "Kemalpaşa Tatlısı",
    "Revani",
    "Şekerpare",
    "Çikolatalı Kurabiye",
    "Makaron",
    "Profiterol",
    "Tiramisu",
    "Çikolata Soslu Pasta",
  ],
  Atıştırmalık: [
    "Kumpir",
    "Patates Kızartması",
    "Cips",
    "Kraker",
    "Simit",
    "Poğaça",
    "Börek",
    "Sigara Böreği",
    "Kol Böreği",
    "Çiğ Börek",
    "Peynirli Çiğ Börek",
    "Patatesli Çiğ Börek",
    "Kıymalı Çiğ Börek",
    "Ispanaklı Börek",
    "Karışık Börek",
  ],
};

const organizationNames = [
  "Simit Sarayı",
  "Çorba Evi",
  "Kahve Köşesi",
  "Lezzet Durağı",
  "Taze Yemek",
  "Campus Cafe",
  "Öğrenci Kantini",
  "Yemekhane",
  "Fast Food",
  "Healthy Bites",
  "Tatlı Dünyası",
  "Çay Bahçesi",
  "Kafeterya",
  "Restoran",
  "Bistro",
];

const locations = [
  "ODTÜ Kampüsü, Çankaya/Ankara",
  "ODTÜ Mühendislik Fakültesi, Ankara",
  "ODTÜ Kütüphane Önü, Ankara",
  "ODTÜ Spor Kompleksi, Ankara",
  "ODTÜ Öğrenci Yurdu, Ankara",
  "ODTÜ Teknoloji Fakültesi, Ankara",
  "ODTÜ Fen Fakültesi, Ankara",
  "ODTÜ Sosyal Bilimler Fakültesi, Ankara",
];

const descriptions = [
  "Taze pişmiş, günlük üretim",
  "Öğrenciler için özel fiyat",
  "Sıcak servis edilir",
  "Geleneksel tarifler",
  "Doğal malzemeler",
  "Hızlı teslimat",
  "Kaliteli hizmet",
  "Hijyenik ortam",
];

// Helper function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random date between now and 7 days from now
function getRandomExpirationDate(): Date {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const randomTime =
    now.getTime() +
    Math.random() * (sevenDaysFromNow.getTime() - now.getTime());
  return new Date(randomTime);
}

// Helper function to generate random price
function getRandomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Helper function to generate random stock
function getRandomStock(): number {
  return Math.floor(Math.random() * 50) + 5; // 5-55 stock
}

// Helper function to generate random booking duration
function getRandomBookingDuration(): number {
  return Math.floor(Math.random() * 60) + 5; // 5-65 minutes
}

async function main() {
  console.log("🌱 Seeding database...");

  console.log("🧹 Clearing existing data...");
  await prisma.booking.deleteMany();
  await prisma.offering.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categories = await Promise.all(
    Object.keys(foodNames).map((categoryName) =>
      prisma.category.create({
        data: {
          name: categoryName,
          description: `Çeşitli ${categoryName.toLowerCase()} ürünleri`,
        },
      })
    )
  );

  console.log("✅ Categories created:", categories.length);

  // Create organizations (15 different ones)
  const organizations = [];
  for (let i = 0; i < organizationNames.length; i++) {
    const org = await prisma.organization.create({
      data: {
        name: organizationNames[i],
        location: `39.${8912 + Math.floor(Math.random() * 100)},32.${
          7857 + Math.floor(Math.random() * 100)
        }`,
        locationName: getRandomElement(locations),
        category: Math.random() > 0.5 ? "Kafeterya" : "Restoran",
        description: `${organizationNames[i]} - ${getRandomElement(
          descriptions
        )}`,
        phone: `+90 312 210 ${String(1000 + i).padStart(4, "0")}`,
        email: `info@${organizationNames[i]
          .toLowerCase()
          .replace(/\s+/g, "")}.com`,
        website: `https://${organizationNames[i]
          .toLowerCase()
          .replace(/\s+/g, "")}.com`,
        owner: {
          create: {
            name: getRandomElement([
              "Ahmet",
              "Mehmet",
              "Ayşe",
              "Fatma",
              "Ali",
              "Zeynep",
              "Emre",
              "Deniz",
              "Can",
              "Ece",
            ]),
            surname: getRandomElement([
              "Yılmaz",
              "Kaya",
              "Demir",
              "Çelik",
              "Şahin",
              "Yıldız",
              "Koç",
              "Öztürk",
              "Aydın",
              "Güneş",
            ]),
            email: `owner${i}@${organizationNames[i]
              .toLowerCase()
              .replace(/\s+/g, "")}.com`,
            password:
              "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
            role: "ORGANIZATION",
          },
        },
      },
      include: {
        owner: true,
      },
    });
    organizations.push(org);
  }

  console.log("✅ Organizations created:", organizations.length);

  // Create offerings (reduced number for stability)
  console.log("🏭 Generating offerings...");
  const offerings = [];
  const targetOfferings = 300;

  for (let i = 0; i < targetOfferings; i++) {
    // Select random category
    const category = getRandomElement(categories);
    const categoryFoods = foodNames[category.name as keyof typeof foodNames];

    // Select random organization
    const organization = getRandomElement(organizations);

    // Generate offering data
    const foodName = getRandomElement(categoryFoods);
    const basePrice = getRandomPrice(5, 50);
    const hasDiscount = Math.random() > 0.7; // 30% chance of discount
    const originalPrice = hasDiscount
      ? basePrice * (1 + Math.random() * 0.5)
      : null;

    const offering = await prisma.offering.create({
      data: {
        name: foodName,
        description: `${foodName} - ${getRandomElement(descriptions)}`,
        image: `https://images.unsplash.com/photo-${Math.floor(
          Math.random() * 1000000000000
        )}?w=400&h=300&fit=crop`,
        categoryId: category.id,
        price: basePrice,
        originalPrice: originalPrice
          ? Math.round(originalPrice * 100) / 100
          : null,
        stock: getRandomStock(),
        bookingDuration: getRandomBookingDuration(),
        expirationDate: getRandomExpirationDate(),
        organizationId: organization.id,
      },
    });

    offerings.push(offering);

    if ((i + 1) % 50 === 0) {
      console.log(`📦 Created ${i + 1}/${targetOfferings} offerings...`);
    }
  }

  console.log("✅ Offerings created:", offerings.length);

  // Create sample users
  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        name: "Admin",
        surname: "User",
        email: "admin@eatup.com",
        password:
          "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
        role: "ADMIN",
      },
    }),
    // Sample customers
    ...Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          name: getRandomElement([
            "Ahmet",
            "Mehmet",
            "Ayşe",
            "Fatma",
            "Ali",
            "Zeynep",
            "Emre",
            "Deniz",
            "Can",
            "Ece",
          ]),
          surname: getRandomElement([
            "Yılmaz",
            "Kaya",
            "Demir",
            "Çelik",
            "Şahin",
            "Yıldız",
            "Koç",
            "Öztürk",
            "Aydın",
            "Güneş",
          ]),
          email: `customer${i}@eatup.com`,
          password:
            "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
          role: "CUSTOMER",
        },
      })
    ),
  ]);

  console.log("✅ Users created:", users.length);

  // Create some sample bookings
  const sampleBookings = [];
  for (let i = 0; i < 50; i++) {
    const randomUser = getRandomElement(
      users.filter((u) => u.role === "CUSTOMER")
    );
    const randomOffering = getRandomElement(
      offerings.filter((o) => o.stock > 0)
    );

    const booking = await prisma.booking.create({
      data: {
        userId: randomUser.id,
        offeringId: randomOffering.id,
        quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
        status: getRandomElement(["PENDING", "CONFIRMED", "COMPLETED"]),
        totalPrice: randomOffering.price * (Math.floor(Math.random() * 3) + 1),
      },
    });

    sampleBookings.push(booking);
  }

  console.log("✅ Sample bookings created:", sampleBookings.length);

  console.log("🎉 Database seeded successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Organizations: ${organizations.length}`);
  console.log(`   - Offerings: ${offerings.length}`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Bookings: ${sampleBookings.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
