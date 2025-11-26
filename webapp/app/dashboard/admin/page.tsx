import Admin from "@/components/admin/admin";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getRaces } from "@/lib/db-helper";

export default async function Page() {
  const session = await auth();
  const races = await getRaces();
  if (session && session.user) {
    return <Admin session={session} races={races} />;
  } else {
    redirect("/dashboard/leaderboard");
  }
}
