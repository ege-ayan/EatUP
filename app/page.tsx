import { redirect } from "next/navigation";

export default function Home() {
  // Since middleware protects this route, authenticated users will reach here
  // Redirect them to the main home page
  redirect("/home");
}
