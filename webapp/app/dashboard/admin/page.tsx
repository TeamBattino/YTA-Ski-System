import Admin from "@/components/admin/admin";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getRaces, getCurrentRace, getShowConsistency } from "@/lib/db-helper";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();
  const races = await getRaces();
  const currentRace = await getCurrentRace();
  const showConsistency = await getShowConsistency();

  if (session && session.user) {
    return <Admin races={races} adminRace={currentRace} defaultValue={showConsistency} />;
  } else {
    redirect("/dashboard/login");
  }
}
