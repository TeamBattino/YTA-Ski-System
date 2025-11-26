import WithConsistency from "@/components/leaderboard/WithConsistency";
import WithoutConsistency from "@/components/leaderboard/WithoutConsistency";


export default function Page() {
  const showingConsistency = true;


  if (showingConsistency) {
    return (
      <>
        <WithConsistency />
      </>
    );
  } else {
    return (
      <>
        <WithoutConsistency />
      </>
    );
  }
}
