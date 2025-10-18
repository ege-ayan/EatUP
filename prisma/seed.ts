import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  console.log("🧹 Clearing existing data...");
  await prisma.booking.deleteMany();
  await prisma.offering.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Kahvaltı",
        description: "Sabah kahvaltısı ürünleri ve yiyecekleri",
      },
    }),
    prisma.category.create({
      data: {
        name: "Çorba",
        description: "Sıcak çorbalar ve başlangıç yemekleri",
      },
    }),
    prisma.category.create({
      data: {
        name: "Ana Yemek",
        description: "Ana yemekler ve öğün yemekleri",
      },
    }),
    prisma.category.create({
      data: {
        name: "İçecek",
        description: "Sıcak ve soğuk içecekler",
      },
    }),
    prisma.category.create({
      data: {
        name: "Tatlı",
        description: "Tatlılar ve desertler",
      },
    }),
    prisma.category.create({
      data: {
        name: "Atıştırmalık",
        description: "Ara öğün atıştırmalıkları",
      },
    }),
  ]);

  console.log("✅ Categories created:", categories.length);

  // Create sample organizations (ODTÜ locations)
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        name: "Simit Sarayı",
        location: "39.8912,32.7857", // ODTÜ coordinates
        locationName: "ODTÜ Kampüsü, Çankaya/Ankara",
        category: "Kafeterya",
        description: "ODTÜ öğrencileri için taze simit ve kahvaltı ürünleri",
        phone: "+90 312 210 0001",
        email: "info@simitsarayi.com",
        website: "https://simitsarayi.com",
        owner: {
          create: {
            name: "Hasan",
            surname: "Yıldırım",
            email: "hasan@simitsarayi.com",
            password:
              "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
            role: "ORGANIZATION",
          },
        },
      },
      include: {
        owner: true,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Çorba Evi",
        location: "39.8921,32.7845",
        locationName: "ODTÜ Mühendislik Fakültesi, Ankara",
        category: "Restoran",
        description: "Sıcak çorbalar ve öğün yemekleri",
        phone: "+90 312 210 0002",
        email: "info@corbaeviodtu.com",
        website: "https://corbaeviodtu.com",
        owner: {
          create: {
            name: "Zeynep",
            surname: "Koç",
            email: "zeynep@corbaeviodtu.com",
            password:
              "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
            role: "ORGANIZATION",
          },
        },
      },
      include: {
        owner: true,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Kahve Köşesi",
        location: "39.8905,32.7862",
        locationName: "ODTÜ Kütüphane Önü, Ankara",
        category: "Kafeterya",
        description: "Öğrenciler için kaliteli kahve ve atıştırmalıklar",
        phone: "+90 312 210 0003",
        email: "info@kahvekosesiodtu.com",
        website: "https://kahvekosesiodtu.com",
        owner: {
          create: {
            name: "Emre",
            surname: "Şahin",
            email: "emre@kahvekosesiodtu.com",
            password:
              "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
            role: "ORGANIZATION",
          },
        },
      },
      include: {
        owner: true,
      },
    }),
  ]);

  console.log("✅ Organizations created:", organizations.length);

  // Create sample offerings (student-oriented Turkish foods)
  const offerings = await Promise.all([
    // Simit Sarayı offerings
    prisma.offering.create({
      data: {
        name: "Simit",
        description: "Taze pişmiş susamlı simit",
        image:
          "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=300&fit=crop",
        categoryId: categories[0].id, // Kahvaltı
        price: 8.0,
        originalPrice: 12.0,
        stock: 25,
        bookingDuration: 15,
        expirationDate: new Date("2025-11-11T14:00:00.000Z"), // Tomorrow at 2 PM
        organizationId: organizations[0].id,
      },
    }),
    prisma.offering.create({
      data: {
        name: "Kaşarlı Poğaça",
        description: "Peynirli taze poğaça",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
        categoryId: categories[0].id, // Kahvaltı
        price: 6.0,
        originalPrice: 10.0,
        stock: 20,
        bookingDuration: 20,
        expirationDate: new Date("2025-11-11T16:00:00.000Z"), // Tomorrow at 4 PM
        organizationId: organizations[0].id,
      },
    }),
    prisma.offering.create({
      data: {
        name: "Türk Kahvesi",
        description: "Geleneksel Türk kahvesi",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
        categoryId: categories[3].id, // İçecek
        price: 12.0,
        originalPrice: 18.0,
        stock: 30,
        bookingDuration: 10,
        expirationDate: new Date("2025-11-12T12:00:00.000Z"), // Day after tomorrow at noon
        organizationId: organizations[0].id,
      },
    }),

    // Çorba Evi offerings
    prisma.offering.create({
      data: {
        name: "Mercimek Çorbası",
        description: "Sıcak mercimek çorbası",
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
        categoryId: categories[1].id, // Çorba
        price: 15.0,
        originalPrice: 22.0,
        stock: 18,
        bookingDuration: 25,
        expirationDate: new Date("2025-11-11T13:00:00.000Z"), // Tomorrow at 1 PM
        organizationId: organizations[1].id,
      },
    }),
    prisma.offering.create({
      data: {
        name: "Ezogelin Çorbası",
        description: "Geleneksel ezogelin çorbası",
        image:
          "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop",
        categoryId: categories[1].id, // Çorba
        price: 16.0,
        originalPrice: 24.0,
        stock: 15,
        bookingDuration: 30,
        expirationDate: new Date("2025-11-11T15:00:00.000Z"), // Tomorrow at 3 PM
        organizationId: organizations[1].id,
      },
    }),
    prisma.offering.create({
      data: {
        name: "Tavuklu Pilav",
        description: "Tavuklu pilav ve yoğurt",
        image:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
        categoryId: categories[2].id, // Ana Yemek
        price: 28.0,
        originalPrice: 35.0,
        stock: 12,
        bookingDuration: 45,
        expirationDate: new Date("2025-11-12T14:00:00.000Z"), // Day after tomorrow at 2 PM
        organizationId: organizations[1].id,
      },
    }),

    // Kahve Köşesi offerings
    prisma.offering.create({
      data: {
        name: "Americano",
        description: "Sıcak americano kahve",
        image:
          "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400&h=300&fit=crop",
        categoryId: categories[3].id, // İçecek
        price: 14.0,
        originalPrice: 20.0,
        stock: 25,
        bookingDuration: 5,
        expirationDate: new Date("2025-11-13T18:00:00.000Z"), // 3 days from now at 6 PM
        organizationId: organizations[2].id,
      },
    }),
    prisma.offering.create({
      data: {
        name: "Çikolatalı Kurabiye",
        description: "Taze çikolatalı kurabiye",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
        categoryId: categories[4].id, // Tatlı
        price: 10.0,
        originalPrice: 15.0,
        stock: 22,
        bookingDuration: 15,
        expirationDate: new Date("2025-11-12T17:00:00.000Z"), // Day after tomorrow at 5 PM
        organizationId: organizations[2].id,
      },
    }),
    prisma.offering.create({
      data: {
        name: "Kumpir",
        description: "Patates kızartması üzerine malzemeler",
        image:
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
        categoryId: categories[5].id, // Atıştırmalık
        price: 20.0,
        originalPrice: 28.0,
        stock: 16,
        bookingDuration: 35,
        expirationDate: new Date("2025-11-11T20:00:00.000Z"), // Tomorrow at 8 PM
        organizationId: organizations[2].id,
      },
    }),
  ]);

  console.log("✅ Offerings created:", offerings.length);

  // Create a sample student user (ODTÜ student)
  const student = await prisma.user.create({
    data: {
      name: "Deniz",
      surname: "Yılmaz",
      email: "deniz.yilmaz@odtu.edu.tr",
      password: "$2b$10$9Xj/7lL0esjDzqNxjKU0KOpQ8vqTtuQ7tDmEKDt1nTa7PTr3DZCyK", // password
      role: "CUSTOMER",
    },
  });

  console.log("✅ Sample student created:", student.email);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
