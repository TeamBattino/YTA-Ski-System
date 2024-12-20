
import ConsistencyTable from "@/components/ConsistencyTable";
import TopRunsTable from "@/components/TopRunsTable";
import { getAllConsistency } from "@/lib/db-helper";
import { get } from "http";




export default async function Page() {
  return (
    <div>
      <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
      <h2 className="py-2 text-xl font-bold">⭐ Competitive Consistency</h2>
      <ConsistencyTable />
      <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
      <TopRunsTable />
    </div>
  );
}