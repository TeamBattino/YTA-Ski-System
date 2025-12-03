import WithConsistency from "@/components/leaderboard/WithConsistency";
import WithoutConsistency from "@/components/leaderboard/WithoutConsistency";
import { getRaces, getCurrentRace, } from "@/lib/db-helper";


export default async function Page() {
  const showingConsistency = true;
  const races = await getRaces();
  const currentRace = await getCurrentRace();

  if (showingConsistency) {
    return (
      <>
        <WithConsistency races={races} currentRace={currentRace} />
      </>
    );
  } else {
    return (
      <>
        <WithoutConsistency races={races} currentRace={currentRace} />
      </>
    );
  }
}
