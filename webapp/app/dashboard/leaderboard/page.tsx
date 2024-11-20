import LeaderboardTable from "../../ui/dashboard/leaderboard/leaderboard-table";
import { fetchRuns } from "@/app/lib/actions/runs/data";

export default async function Page() {
const data = await fetchRuns();
    return (
    <div>
      <div>
      <h2>Top speed</h2>
      <LeaderboardTable run={data}/>
      </div>
      <div>
      <h2>Top Consistency</h2>
      <LeaderboardTable run={data}/>
      </div>
    </div>
    );
  }