import { fetchRacers, bruh } from "@/app/lib/actions/racers/data";
import LeaderboardTable from "../../ui/dashboard/leaderboard/leaderboard-table";
import { fetchRuns } from "@/app/lib/actions/runs/data";
import type { racer } from '@prisma/client';

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

  const sortedRuns = runs.sort((a, b) => a.duration! - b.duration!);
  const runsWithRank = sortedRuns.map((run, index) => ({
    ...run,
    rank: index + 1,
  }));
  
  const sortedConsistency = racerConsistencyData.sort((a, b) => a.consistency - b.consistency);
  const consistencyWithRank = sortedConsistency.map((item, index) => ({
    ...item,
    rank: index + 1,  
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Consistency</h2>
        <div className="overflow-x-auto">
          <LeaderboardTable 
            bruh={consistencyWithRank} 
          />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Speed</h2>
        <p className="mt-2 rounded-md px-4 py-2 text-gray-700 italic">Who is the fastest of all time!?</p>
        <div className="overflow-x-auto">
          <LeaderboardTable 
            run={runsWithRank} 
          />
        </div>
      </div>
    </div>
  );
}
