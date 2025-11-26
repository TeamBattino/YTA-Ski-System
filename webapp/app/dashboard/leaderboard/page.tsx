import WithConsistency from "@/components/leaderboard/WithConsistency";
import WithoutConsistency from "@/components/leaderboard/WithoutConsistency";
import { getRaces } from "@/lib/db-helper";


export default async function Page() {
  const showingConsistency = true;
  const races = await getRaces();

  if (showingConsistency) {
    return (
      <>
        <WithConsistency races={races} />
      </>
    );
  } else {
    return (
      <>
        <WithoutConsistency races={races} />
      </>
    );
  }
}
