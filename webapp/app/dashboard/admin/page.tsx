import Admin from "@/components/admin/admin";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getRaces, getCurrentRace } from "@/lib/db-helper";

export default async function Page() {
  const session = await auth();
  const races = await getRaces();
  const currentRace = await getCurrentRace();
  if (session && session.user) {
    return <Admin session={session} races={races} adminRace={currentRace} />;
  } else {
    redirect("/dashboard/leaderboard");
  }
}
