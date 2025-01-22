
import ConsistencyTable from "@/components/ConsistencyTable";
import RecentRunsTable from "@/components/RecentRunsTable";
import TopRunsTable from "@/components/TopRunsTable";
import { getAllConsistency } from "@/lib/db-helper";
import { get } from "http";




export default async function Page() {
  const showingConsistency = true;

  if (showingConsistency) {
    return (
      <div>
        <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
        <h2 className="py-2 text-xl font-bold">⭐ Competitive Consistency</h2>
        <ConsistencyTable />
        <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
        <TopRunsTable />
      </div>
    )
  } else {
    return (
      <div>
        <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
        <p>
          The Aim of the challenge is to have your two most recent runs be closest to eachother in time.
        </p>
        <p>
          View recent runs or click an entry to view the persons current consistency.
        </p>
        <h2 className="py-2 text-xl font-bold">Recent Runs</h2>
        <RecentRunsTable />
        <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
        <TopRunsTable />
      </div>
    )
  }
}