import Leaderboard from "@/components/leaderboard/Leaderboard";
import { getRaces, getCurrentRace } from "@/lib/db-helper";

export default async function Page() {
  const races = await getRaces();
  const currentRace = await getCurrentRace();

  return (
      <>
        <Leaderboard races={races} currentRace={currentRace} />
      </>
    );
}
