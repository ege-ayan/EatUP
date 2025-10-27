import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/generated/prisma";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/users";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "ALL";

    const users = await getUsers({
      search,
      role: role as UserRole | "ALL",
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Kullanıcılar alınamadı:", error);
    return NextResponse.json(
      { error: "Kullanıcılar alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await request.json();
    const { name, surname, email, password, role, organizationId } = body;

    if (!name || !surname || !email || !password || !role) {
      return NextResponse.json(
        { error: "Tüm alanları doldurunuz" },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      surname,
      email,
      password,
      role,
      organizationId,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Kullanıcı oluşturulamadı:", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcı oluşturulamadı" },
      { status: 500 }
    );
  }
}

// PATCH update user (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, surname, email, role, password, organizationId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Kullanıcı ID gerekli" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (email) updateData.email = email;
    if (organizationId !== undefined) {
      updateData.organizationId = organizationId;
    }

    const user = await updateUser(id, updateData);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Kullanıcı güncellenemedi:", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcı güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Kullanıcı ID gerekli" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (id === currentUser.id) {
      return NextResponse.json(
        { error: "Kendi hesabınızı silemezsiniz" },
        { status: 400 }
      );
    }

    await deleteUser(id);

    return NextResponse.json({
      success: true,
      message: "Kullanıcı silindi",
    });
  } catch (error: any) {
    console.error("Kullanıcı silinemedi:", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcı silinemedi" },
      { status: 500 }
    );
  }
}
