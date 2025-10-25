import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ORGANIZATION = "ORGANIZATION",
  ADMIN = "ADMIN",
}

const JWT_SECRET = process.env.JWT_SECRET;

export const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

export const authPageRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export const customerHomeRoutes = "/customer/home";
export const organizationHomeRoutes = "/organization/home";

export async function getCurrentUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(JWT_SECRET)
  );
  return payload.role;
}
