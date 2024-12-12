import { fetchRacers, bruh } from "@/app/lib/actions/racers/data";
import LeaderboardTable from "../../ui/dashboard/leaderboard/leaderboard-table";
import { fetchRuns } from "@/app/lib/actions/runs/data";
import type { racer } from '@prisma/client';
import FilterableLeaderboard from "../../ui/dashboard/leaderboard/filterable-leaderboard";

export const dynamic = "force-dynamic";

async function calculateConsistency(racers: racer[]) {
  const consistencyList: { racer: racer, consistency: number }[] = [];

  await Promise.all(racers.map(async (racer) => {
    const runs = await bruh(racer);
    let consistency = 999999;

    if (runs.length > 1) {
      const [duration1, duration2] = runs;
      consistency = Math.abs(duration1.duration! - duration2.duration!);
    }

    consistencyList.push({ racer, consistency });
  }));

  return consistencyList;
}



export default async function Page() {
  const runs = await fetchRuns();
  const racers = await fetchRacers();
  const racerConsistencyData = await calculateConsistency(racers);

  const bestRunsMap = new Map<any, any>();

  runs.forEach(run => {
    const existingRun = bestRunsMap.get(run.ski_pass);
    if (!existingRun || run.duration! < existingRun.duration!) {
      bestRunsMap.set(run.ski_pass, run);
    }
  });

  const bestRuns = Array.from(bestRunsMap.values());

  const sortedRuns = bestRuns.sort((a, b) => a.duration! - b.duration!);
  const sortedConsistency = racerConsistencyData.sort((a, b) => a.consistency - b.consistency);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Consistency</h2>
        <p className="mt-2 rounded-md px-4 py-2 text-gray-700 italic">Consistency is the difference in milliseconds between the most recent 2 runs</p>
        <div className="overflow-x-auto">
          <LeaderboardTable bruh={sortedConsistency} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Speed</h2>
        <p className="mt-2 rounded-md px-4 py-2 text-gray-700 italic">Who is the fastest of all time?</p>
        <div className="overflow-x-auto">
          <LeaderboardTable run={sortedRuns} />
        </div>
      </div>

      {/* Pass the data to the FilterableLeaderboard client component */}
      <FilterableLeaderboard 
        runsWithRank={runs}
        consistencyWithRank={sortedConsistency}
        racers={racers}
      />
    </div>
  );
}
