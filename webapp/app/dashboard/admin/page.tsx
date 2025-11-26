import Admin from "@/components/admin/admin";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session && session.user) {
    return <Admin session={session} />;
  } else {
    redirect("/dashboard/leaderboard");
  }
}
