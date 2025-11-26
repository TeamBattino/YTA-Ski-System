"use client";

import { useState, useEffect } from "react";
import { race as Race } from "@prisma/client";
import { getRaces } from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";
import ConsistencyTable from "@/components/Tables/ConsistencyTable";
import TopRunsTable from "@/components/Tables/TopRunsTable";

export default function WithConsistency() {
  const [race, setRace] = useState<Race>();
  const [races, setRaces] = useState<Race[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRaces = async () => {
    const races = await getRaces();
    setRaces(races);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchRaces();
  }, []);

  return (
    <>
      <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
      <RaceSelect races={races} setRace={setRace} />

      <h2 className="py-2 text-xl font-bold">⭐ Competitive Consistency</h2>
      <ConsistencyTable race={race} />
      <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
      <TopRunsTable race={race} />
    </>
  );
}
