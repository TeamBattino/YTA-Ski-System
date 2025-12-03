"use client";

import React, { useState, useCallback } from "react";
import AdminRecentRunsTable from "@/components/Tables/AdminRecentRunsTable";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { race as Race } from "@/src/generated/client";
import { updateCurrentRace } from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";
import AdminRaceSelect from "@/components/AdminRaceSelect";

type AdminProp = {
  session: Session;
  races: Race[];
  adminRace: Race;
};

export default function Admin({ races, adminRace }: AdminProp) {
  const [race, setRace] = useState<Race>();
  const [currentRace, setCurrentRace] = useState<Race>(adminRace);

  const currentRaceOnChange = useCallback(async (race: Race) => {
    setCurrentRace(race);
    if (race.name !== null) {
      await updateCurrentRace(race);
    }
  }, []);

  return (
    <>
      <div>
        <RaceSelect races={races} setRace={setRace} currentRace={adminRace} />
      </div>
      <div>
        <button
          onClick={() => signOut({ redirectTo: "/dashboard/leaderboard" })}
        >
          Sign Out
        </button>
      </div>
      <div>
        {race ? (
          <AdminRecentRunsTable race={race} />
        ) : (
          <>Please select a race</>
        )}
      </div>
      <br /><br />
      <div>
        CURRENT RACE:{" "}
        <AdminRaceSelect
          races={races}
          setRace={currentRaceOnChange}
          currentRace={currentRace}
        />
      </div>
    </>
  );
}
