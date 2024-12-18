
import ConsistencyTable from "@/components/ConsistencyTable";
import { getConsistency } from "@/lib/db-helper";
import { get } from "http";




export default async function Page() {
  return (
    <div>
      <h1>Leaderboard</h1>
      <ConsistencyTable />
    </div>
  );
}