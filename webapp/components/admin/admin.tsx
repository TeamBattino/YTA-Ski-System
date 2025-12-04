"use client";

import React, { useState, useCallback } from "react";
import AdminRecentRunsTable from "@/components/Tables/AdminRecentRunsTable";
import { signOut } from "next-auth/react";
import { race as Race } from "@/src/generated/client";
import {
  updateCurrentRace,
  createRace,
  updateShowConsistency,
} from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";
import AdminRaceSelect from "@/components/AdminRaceSelect";
import ShowConsistencySwitch from "@/components/leaderboard/ShowConsistencySwitch";

type AdminProp = {
  races: Race[];
  adminRace: Race;
  defaultValue: boolean;
};

export default function Admin({ races, adminRace, defaultValue }: AdminProp) {
  const [race, setRace] = useState<Race>(adminRace);
  const [currentRace, setCurrentRace] = useState<Race>(adminRace);
  const onConsistencyChange = useCallback(async () => {
    await updateShowConsistency(!defaultValue);
  }, [defaultValue]);

  console.log(adminRace);

  function hasValidName(race: Race): race is Race & { name: string } {
    return race.name !== null && race.name !== undefined;
  }

  const currentRaceOnChange = useCallback(async (race: Race) => {
    setCurrentRace(race);
    if (hasValidName(race)) {
      await updateCurrentRace(race);
    }
  }, []);

  const createNewRace = useCallback(async (name: string) => {
    const newRace = await createRace(name);
    console.log("New Race created!", newRace);
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
      <br />
      <br />
      <div>
        CURRENT RACE:{" "}
        <AdminRaceSelect
          races={races}
          setRace={currentRaceOnChange}
          currentRace={currentRace}
        />
      </div>
      <ShowConsistencySwitch defaultValue={defaultValue} onChange={onConsistencyChange} />
      <div>
        CREATE RACE: <br />
        <input
          type="text"
          placeholder="Enter race name"
          id="raceName"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <button
          onClick={async () => {
            const name = (
              document.getElementById("raceName") as HTMLInputElement
            ).value;
            if (name.trim()) {
              await createNewRace(name.trim());
            }
          }}
        >
          Create Race
        </button>
      </div>
    </>
  );
}
