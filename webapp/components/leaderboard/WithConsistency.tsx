"use client";

import { useState } from "react";
import { race as Race } from "@/src/generated/prisma/client";
import RaceSelect from "@/components/RaceSelect";
import ConsistencyTable from "@/components/Tables/ConsistencyTable";
import TopRunsTable from "@/components/Tables/TopRunsTable";

type LeaderboardProp = {
  races: Race[];
}

export default function WithConsistency({races}:LeaderboardProp) {
  const [race, setRace] = useState<Race>();

  return (
    <>
      <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
      <RaceSelect races={races} setRace={setRace} />

      <h2 className="py-2 text-xl font-bold">⭐ Competitive Consistency</h2>
      {race ? (
        <>
          <ConsistencyTable race={race} />
        </>
      ) : (
        <>Please select a race</>
      )}
      <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>

      {race ? (
        <>
          <TopRunsTable race={race} />
        </>
      ) : (
        <>Please select a race</>
      )}
    </>
  );
}
