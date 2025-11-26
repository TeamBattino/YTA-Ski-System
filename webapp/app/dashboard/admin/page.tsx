import Admin from "@/app/ui/dashboard/admin/admin";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  console.log("Session", session);
  if (session && session.user) {
    return <Admin session={session} />;
  } else {
    redirect("/dashboard/leaderboard");
  }
}
