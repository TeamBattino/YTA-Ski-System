"use client";

import React, { useState, useCallback } from "react";
import AdminRecentRunsTable from "@/components/Tables/AdminRecentRunsTable";
import { signOut } from "next-auth/react";
import { race as Race } from "@/src/generated/client";
import { updateCurrentRace, createRace } from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";
import AdminRaceSelect from "@/components/AdminRaceSelect";

type AdminProp = {
  races: Race[];
  adminRace: Race;
};

export default function Admin({ races, adminRace }: AdminProp) {
  const [race, setRace] = useState<Race>(adminRace);
  const [currentRace, setCurrentRace] = useState<Race>(adminRace);

  console.log(adminRace);

  const currentRaceOnChange = useCallback(async (race: Race) => {
    setCurrentRace(race);
    if (race.name !== null) {
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
