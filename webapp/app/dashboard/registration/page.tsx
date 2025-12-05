import Registration from "@/components/registration/registration";
import { getRaces, getCurrentRace } from "@/lib/db-helper";

export const dynamic = "force-dynamic";

export default async function Page() {
  const races = await getRaces();
  const currentRace = await getCurrentRace();

  return <Registration races={races} currentRace={currentRace} />;
}
