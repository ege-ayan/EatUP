import { prisma } from "./prisma";
import { UserRole } from "@/generated/prisma";

export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  customerUsers: number;
  organizationUsers: number;
  organizationsWithUsers: number;
  organizationsWithoutUsers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalUsers,
    totalOrganizations,
    customerUsers,
    organizationUsers,
    organizationsWithUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
    prisma.user.count({ where: { role: UserRole.ORGANIZATION } }),
    prisma.organization.count({
      where: {
        users: {
          some: {},
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalOrganizations,
    customerUsers,
    organizationUsers,
    organizationsWithUsers,
    organizationsWithoutUsers: totalOrganizations - organizationsWithUsers,
  };
}

export interface DetailedAdminStats {
  users: {
    total: number;
    customers: number;
    organizations: number;
    admins: number;
    recent: number;
  };
  organizations: {
    total: number;
  };
  offerings: {
    total: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    recent: number;
  };
  revenue: {
    total: number;
    monthly: Array<{ month: string; revenue: number }>;
  };
  topOrganizations: Array<{
    id: string;
    name: string;
    location: string;
    totalOfferings: number;
    totalBookings: number;
  }>;
}

export async function getDetailedAdminStats(): Promise<DetailedAdminStats> {
  // Get counts
  const [
    totalUsers,
    totalCustomers,
    totalOrganizations,
    totalAdmins,
    totalOfferings,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
    prisma.user.count({ where: { role: UserRole.ORGANIZATION } }),
    prisma.user.count({ where: { role: UserRole.ADMIN } }),
    prisma.offering.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
  ]);

  // Get recent users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Get recent bookings (last 30 days)
  const recentBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Get total revenue
  const bookingsWithRevenue = await prisma.booking.findMany({
    where: {
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      },
    },
    select: {
      totalPrice: true,
    },
  });

  const totalRevenue = bookingsWithRevenue.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );

  // Get revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const bookingsByMonth = await prisma.booking.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      },
    },
    _sum: {
      totalPrice: true,
    },
  });

  // Process monthly revenue
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    const revenue = bookingsByMonth
      .filter((b) => {
        const bookingMonth = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, "0")}`;
        return bookingMonth === monthKey;
      })
      .reduce((sum, b) => sum + (b._sum.totalPrice || 0), 0);

    return {
      month: monthKey,
      revenue,
    };
  }).reverse();

  // Get top organizations by bookings
  const topOrganizations = await prisma.organization.findMany({
    take: 5,
    include: {
      _count: {
        select: {
          offerings: true,
        },
      },
      offerings: {
        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const topOrgsWithBookings = topOrganizations
    .map((org) => ({
      id: org.id,
      name: org.name,
      location: org.location,
      totalOfferings: org._count.offerings,
      totalBookings: org.offerings.reduce(
        (sum, offering) => sum + offering._count.bookings,
        0
      ),
    }))
    .sort((a, b) => b.totalBookings - a.totalBookings);

  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      organizations: totalOrganizations,
      admins: totalAdmins,
      recent: recentUsers,
    },
    organizations: {
      total: totalOrganizations,
    },
    offerings: {
      total: totalOfferings,
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      recent: recentBookings,
    },
    revenue: {
      total: totalRevenue,
      monthly: monthlyRevenue,
    },
    topOrganizations: topOrgsWithBookings,
  };
}
