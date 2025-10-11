import { NextRequest, NextResponse } from "next/server";
import { getOfferings } from "@/lib/offerings";
import { prisma } from "@/lib/prisma";
import { addOfferingApiSchema } from "@/lib/schemas/offering-schemas";
import { deleteImage } from "@/lib/supabase";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const organizationId = searchParams.get("organizationId") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    const result = await getOfferings(
      { categoryId, organizationId },
      { limit, offset }
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Offerings API error:", error);
    return NextResponse.json(
      { success: false, error: "Teklifler alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = addOfferingApiSchema.parse(body);

    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        isActive: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Geçersiz kategori seçimi" },
        { status: 400 }
      );
    }

    let organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
    });

    if (!organization) {
      organization = await prisma.organization.findFirst({
        where: { ownerId: validatedData.organizationId },
      });
    }

    if (!organization) {
      organization = await prisma.organization.findFirst();
    }

    if (!organization) {
      return NextResponse.json(
        { success: false, error: "Organizasyon bulunamadı" },
        { status: 400 }
      );
    }

    const offering = await prisma.offering.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice || null,
        stock: validatedData.stock,
        bookingDuration: validatedData.bookingDuration,
        expirationDate: new Date(validatedData.expirationDate),
        isAvailable: validatedData.stock > 0,
        organizationId: organization.id,
        categoryId: validatedData.categoryId,
        image: validatedData.image || null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            locationName: true,
            category: true,
            image: true,
          },
        },
      },
    });

    const transformedOffering = {
      id: offering.id,
      name: offering.name,
      description: offering.description,
      image: offering.image,
      price: offering.price,
      originalPrice: offering.originalPrice,
      stock: offering.stock,
      bookingDuration: offering.bookingDuration,
      expirationDate: offering.expirationDate?.toISOString(),
      isAvailable: offering.isAvailable,
      organizationId: offering.organizationId,
      categoryId: offering.categoryId,
      category: {
        id: offering.category.id,
        name: offering.category.name,
        description: offering.category.description,
      },
      organization: {
        id: offering.organization.id,
        name: offering.organization.name,
        locationName: offering.organization.locationName,
        category: offering.organization.category,
        image: offering.organization.image,
      },
      createdAt: offering.createdAt.toISOString(),
      updatedAt: offering.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      offering: transformedOffering,
    });
  } catch (error) {
    console.error("Create offering API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Ürün oluşturulamadı" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Ürün ID gerekli" },
        { status: 400 }
      );
    }

    const existingOffering = await prisma.offering.findUnique({
      where: { id },
    });

    if (!existingOffering) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    if (existingOffering.image) {
      try {
        await deleteImage(existingOffering.image);
      } catch (imageError) {
        console.error("Failed to delete image from bucket:", imageError);
      }
    }

    await prisma.offering.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Ürün başarıyla silindi",
    });
  } catch (error) {
    console.error("Delete offering API error:", error);
    return NextResponse.json(
      { success: false, error: "Ürün silinemedi" },
      { status: 500 }
    );
  }
}
