import { fetchRacers, bruh } from "@/app/lib/actions/racers/data";
import LeaderboardTable from "../../ui/dashboard/leaderboard/leaderboard-table";
import { fetchRuns } from "@/app/lib/actions/runs/data";
import type { racer } from '@prisma/client'

async function processBruhh(racer : racer[]){
  const list : {racer : racer, consistency: number}[] = [];
  for (const x of racer){
    const runs = await bruh(x);
    if (runs.length > 1){
      const duration1 = runs[0].duration
      const duration2 = runs[1].duration
      const consistency = (duration1! - duration2!) < 0 ? ((duration1! - duration2!) * -1) : ((duration1! - duration2!));
      const entry : {racer : racer, consistency : number}= {racer : x, consistency : consistency!};
      list.push(entry);}
      else {
        const entry : {racer : racer, consistency : number}= {racer : x, consistency : 999999};
      list.push(entry);}
      }
      return list;
  }

export default async function Page() {
const run = await fetchRuns();
const racer = await fetchRacers();
const bruh = await processBruhh(racer);


    return (
    <div>
      <div>
      <h2>Top speed</h2>
      <LeaderboardTable run={run.sort((a, b) => a.duration! - b.duration!)}/>
      </div>
      <div>
      <h2>Top Consistency</h2>
      <LeaderboardTable bruh={bruh.sort((a, b) => a.consistency! - b.consistency!)}/>
      </div>
    </div>
    );
  }