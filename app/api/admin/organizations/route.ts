import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/generated/prisma";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/lib/organizations";

// GET all organizations (admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const organizations = await getOrganizations({ search });

    return NextResponse.json({
      success: true,
      organizations,
      total: organizations.length,
    });
  } catch (error) {
    console.error("Organizasyonlar alınamadı:", error);
    return NextResponse.json(
      { error: "Organizasyonlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST create new organization (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await request.json();
    const { name, location, description, phone, email, website } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: "Zorunlu alanları doldurunuz (name, location)" },
        { status: 400 }
      );
    }

    const organization = await createOrganization({
      name,
      location,
      description,
      phone,
      email,
      website,
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error: any) {
    console.error("Organizasyon oluşturulamadı:", error);
    return NextResponse.json(
      { error: error.message || "Organizasyon oluşturulamadı" },
      { status: 500 }
    );
  }
}

// PATCH update organization (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      location,
      description,
      phone,
      email,
      website,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Organizasyon ID gerekli" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (website !== undefined) updateData.website = website;

    const organization = await updateOrganization(id, updateData);

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error: any) {
    console.error("Organizasyon güncellenemedi:", error);
    return NextResponse.json(
      { error: error.message || "Organizasyon güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE organization (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Organizasyon ID gerekli" },
        { status: 400 }
      );
    }

    await deleteOrganization(id);

    return NextResponse.json({
      success: true,
      message: "Organizasyon silindi",
    });
  } catch (error: any) {
    console.error("Organizasyon silinemedi:", error);
    return NextResponse.json(
      { error: "Organizasyon silinemedi" },
      { status: 500 }
    );
  }
}
