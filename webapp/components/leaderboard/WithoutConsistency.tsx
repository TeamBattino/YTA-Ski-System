"use client";

import { useState, useEffect } from "react";
import { race as Race } from "@/src/generated/prisma/client";
import { getRaces } from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";
import RecentRunsTable from "@/components/Tables/RecentRunsTable";
import TopRunsTable from "@/components/Tables/TopRunsTable";

type LeaderboardProp = {
  races: Race[];
};

export default function WithoutConsistency({ races }: LeaderboardProp) {
  const [race, setRace] = useState<Race>();
  return (
    <>
      <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
      <RaceSelect races={races} setRace={setRace} />

      <p>
        The Aim of the challenge is to have your two most recent runs be closest
        to each other in time.
      </p>
      <p>
        View recent runs or click an entry to view the persons current
        consistency.
      </p>
      <h2 className="py-2 text-xl font-bold">Recent Runs</h2>
      
      {race ? (
        <>
          <RecentRunsTable race={race} />
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
