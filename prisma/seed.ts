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

// Helper function to generate random max reservation per customer
function getRandomMaxReservation(): number {
  return Math.floor(Math.random() * 4) + 1; // 1-5 items per customer
}

// Valid food image URLs from Unsplash (verified working links at higher resolution)
const foodImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80", // Burger
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80", // Pizza
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80", // Pasta
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80", // Salad
  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop&q=80", // Breakfast
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop&q=80", // Soup
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80", // Restaurant Food
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop&q=80", // Coffee
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop&q=80", // Tea
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop&q=80", // Kebab/Meat
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80", // Bread
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop&q=80", // Ice cream
  "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&h=600&fit=crop&q=80", // Dessert
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&q=80", // Sushi
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop&q=80", // Fresh food
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop&q=80", // Food platter
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80", // Pancakes
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80", // Bowl food
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80", // Restaurant dish
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&q=80", // Fruit bowl
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=600&fit=crop&q=80", // Plate food
  "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=600&fit=crop&q=80", // Sandwich
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop&q=80", // Tacos
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80", // Sushi/Asian
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80", // Burger deluxe
  "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&q=80", // Salmon
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&q=80", // Steak
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop&q=80", // Breakfast platter
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&q=80", // Beverage
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&q=80", // Cake/Dessert
];

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

  // Create organizations with hardcoded owner accounts
  const organizationData = [
    {
      name: "Simit Sarayı",
      ownerName: "Ahmet",
      ownerSurname: "Yılmaz",
      ownerEmail: "ahmet.yilmaz@simitsarayi.com",
      category: "Kafeterya",
    },
    {
      name: "Çorba Evi",
      ownerName: "Mehmet",
      ownerSurname: "Kaya",
      ownerEmail: "mehmet.kaya@corbaevi.com",
      category: "Restoran",
    },
    {
      name: "Kahve Köşesi",
      ownerName: "Ayşe",
      ownerSurname: "Demir",
      ownerEmail: "ayse.demir@kahvekosesi.com",
      category: "Kafeterya",
    },
    {
      name: "Lezzet Durağı",
      ownerName: "Fatma",
      ownerSurname: "Çelik",
      ownerEmail: "fatma.celik@lezzetduragi.com",
      category: "Restoran",
    },
    {
      name: "Taze Yemek",
      ownerName: "Ali",
      ownerSurname: "Şahin",
      ownerEmail: "ali.sahin@tazeyemek.com",
      category: "Restoran",
    },
    {
      name: "Campus Cafe",
      ownerName: "Zeynep",
      ownerSurname: "Yıldız",
      ownerEmail: "zeynep.yildiz@campuscafe.com",
      category: "Kafeterya",
    },
    {
      name: "Öğrenci Kantini",
      ownerName: "Emre",
      ownerSurname: "Koç",
      ownerEmail: "emre.koc@ogrencikantini.com",
      category: "Kafeterya",
    },
    {
      name: "Yemekhane",
      ownerName: "Deniz",
      ownerSurname: "Öztürk",
      ownerEmail: "deniz.ozturk@yemekhane.com",
      category: "Restoran",
    },
    {
      name: "Fast Food",
      ownerName: "Can",
      ownerSurname: "Aydın",
      ownerEmail: "can.aydin@fastfood.com",
      category: "Restoran",
    },
    {
      name: "Healthy Bites",
      ownerName: "Ece",
      ownerSurname: "Güneş",
      ownerEmail: "ece.gunes@healthybites.com",
      category: "Kafeterya",
    },
    {
      name: "Tatlı Dünyası",
      ownerName: "Burak",
      ownerSurname: "Arslan",
      ownerEmail: "burak.arslan@tatlidunyasi.com",
      category: "Kafeterya",
    },
    {
      name: "Çay Bahçesi",
      ownerName: "Selin",
      ownerSurname: "Polat",
      ownerEmail: "selin.polat@caybahcesi.com",
      category: "Kafeterya",
    },
    {
      name: "Kafeterya",
      ownerName: "Kerem",
      ownerSurname: "Kara",
      ownerEmail: "kerem.kara@kafeterya.com",
      category: "Kafeterya",
    },
    {
      name: "Restoran",
      ownerName: "Elif",
      ownerSurname: "Aksoy",
      ownerEmail: "elif.aksoy@restoran.com",
      category: "Restoran",
    },
    {
      name: "Bistro",
      ownerName: "Mert",
      ownerSurname: "Erdoğan",
      ownerEmail: "mert.erdogan@bistro.com",
      category: "Restoran",
    },
  ];

  const organizations = [];
  for (let i = 0; i < organizationData.length; i++) {
    const orgData = organizationData[i];
    const org = await prisma.organization.create({
      data: {
        name: orgData.name,
        location: `39.${8912 + Math.floor(Math.random() * 100)},32.${
          7857 + Math.floor(Math.random() * 100)
        }`,
        locationName: getRandomElement(locations),
        category: orgData.category,
        description: `${orgData.name} - ${getRandomElement(descriptions)}`,
        phone: `+90 312 210 ${String(1000 + i).padStart(4, "0")}`,
        email: `info@${orgData.name.toLowerCase().replace(/\s+/g, "")}.com`,
        website: `https://${orgData.name.toLowerCase().replace(/\s+/g, "")}.com`,
        owner: {
          create: {
            name: orgData.ownerName,
            surname: orgData.ownerSurname,
            email: orgData.ownerEmail,
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

  // Create offerings (50 is sufficient for testing)
  console.log("🏭 Generating offerings...");
  const offerings = [];
  const targetOfferings = 50;

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
        image: getRandomElement(foodImages),
        categoryId: category.id,
        price: basePrice,
        originalPrice: originalPrice
          ? Math.round(originalPrice * 100) / 100
          : null,
        stock: getRandomStock(),
        maxReservationPerCustomer: getRandomMaxReservation(),
        bookingDuration: getRandomBookingDuration(),
        expirationDate: getRandomExpirationDate(),
        organizationId: organization.id,
      },
    });

    offerings.push(offering);

    if ((i + 1) % 10 === 0) {
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

    // Respect maxReservationPerCustomer limit
    const quantity = Math.min(
      Math.floor(Math.random() * 3) + 1,
      randomOffering.maxReservationPerCustomer
    );

    // Calculate pickup time based on booking duration
    const pickupTime = new Date();
    pickupTime.setMinutes(
      pickupTime.getMinutes() + (randomOffering.bookingDuration || 30)
    );

    const booking = await prisma.booking.create({
      data: {
        userId: randomUser.id,
        offeringId: randomOffering.id,
        quantity: quantity,
        status: getRandomElement(["PENDING", "CONFIRMED", "COMPLETED"]),
        totalPrice: randomOffering.price * quantity,
        pickupTime: pickupTime,
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
