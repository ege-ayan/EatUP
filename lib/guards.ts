import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return false;
  }
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(JWT_SECRET)
  );
  return payload;
}
