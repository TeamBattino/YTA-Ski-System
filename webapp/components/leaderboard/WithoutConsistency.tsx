"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { race as Race } from "@/src/generated/client";
import RaceSelect from "@/components/RaceSelect";
import ShowConsistencySwitch from "@/components/leaderboard/ShowConsistencySwitch";
import RecentRunsTable from "@/components/Tables/RecentRunsTable";
import TopRunsTable from "@/components/Tables/TopRunsTable";

type LeaderboardProp = {
  races: Race[];
  currentRace: Race;
  onChange: Dispatch<SetStateAction<boolean>>;
};

export default function WithoutConsistency({
  races,
  currentRace,
  onChange,
}: LeaderboardProp) {
  const [race, setRace] = useState<Race>(currentRace);
  return (
    <>
      <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
      <RaceSelect races={races} setRace={setRace} currentRace={currentRace} />

      <ShowConsistencySwitch defaultValue={false} onChange={onChange} />

      <p>
        The Aim of the challenge is to have your two most recent runs be closest
        to each other in time.
      </p>
      <p>
        View recent runs or toggle the switch again to view people&apos;s current
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
