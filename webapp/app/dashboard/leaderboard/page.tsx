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

function rankWithTies(sortedList: any[], key: string) {
  const rankedList = [];
  let currentRank = 1;

  for (let i = 0; i < sortedList.length; i++) {
    const item = sortedList[i];
    const previousItem = sortedList[i - 1];

    // If the current item has the same value as the previous item, it gets the same rank
    if (i > 0 && item[key] === previousItem[key]) {
      rankedList.push({
        ...item,
        rank: currentRank
      });
    } else {
      rankedList.push({
        ...item,
        rank: currentRank
      });
      currentRank = currentRank + 1;  // Increment rank for the next unique value
    }
  }

  return rankedList;
}

export default async function Page() {
  const runs = await fetchRuns();
  const racers = await fetchRacers();
  const racerConsistencyData = await calculateConsistency(racers);

  const bestRunsMap = new Map<any, any>();

  runs.forEach(run => {
    const existingRun = bestRunsMap.get(run.ski_pass);
    if (!existingRun || run.duration! < existingRun.duration!) {
      bestRunsMap.set(run.ski_pass, run); // Keep the fastest run for each racer
    }
  });

  const bestRuns = Array.from(bestRunsMap.values());

  const sortedRuns = bestRuns.sort((a, b) => a.duration! - b.duration!);
  const runsWithRank = rankWithTies(sortedRuns, 'duration'); // Rank runs with ties

  const sortedConsistency = racerConsistencyData.sort((a, b) => a.consistency - b.consistency);
  const consistencyWithRank = rankWithTies(sortedConsistency, 'consistency'); // Rank consistency with ties


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Consistency</h2>
        <p className="mt-2 rounded-md px-4 py-2 text-gray-700 italic">aka the difference in milliseconds between the most recent 2 runs</p>
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
