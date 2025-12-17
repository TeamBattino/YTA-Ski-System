import { getRaces, getCurrentRace, getShowConsistency } from "@/lib/db-helper";
import WithConsistency from "@/components/leaderboard/WithConsistency";
import WithoutConsistency from "@/components/leaderboard/WithoutConsistency";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const races = await getRaces();
  const currentRace = await getCurrentRace();
  const showConsistency = await getShowConsistency();

  if (showConsistency) {
    return (
      <>
        <WithConsistency
          races={races}
          currentRace={currentRace}
        />
      </>
    );
  } else {
    return (
      <>
        <WithoutConsistency
          races={races}
          currentRace={currentRace}
        />
      </>
    );
  }
}
