/**
 * Landing page - redirect to plan
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/plan");
}
