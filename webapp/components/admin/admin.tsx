"use client";

import React, { useState, useCallback } from "react";
import AdminRecentRunsTable from "@/components/Tables/AdminRecentRunsTable";
import { signOut } from "next-auth/react";
import { race as Race } from "@/src/generated/client";
import { updateCurrentRace, createRace } from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";
import AdminRaceSelect from "@/components/AdminRaceSelect";
import ShowConsistencySwitch from "@/components/leaderboard/ShowConsistencySwitch";
import { Button } from "@/components/common/button";

type AdminProp = {
  races: Race[];
  adminRace: Race;
  defaultValue: boolean;
};

export default function Admin({ races, adminRace, defaultValue }: AdminProp) {
  const [race, setRace] = useState<Race>(adminRace);
  const [currentRace, setCurrentRace] = useState<Race>(adminRace);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [raceName, setRaceName] = useState<string>("");

  console.log(adminRace);

  function hasValidName(race: Race): race is Race & { name: string } {
    return race.name !== null && race.name !== undefined;
  }

  const currentRaceOnChange = useCallback(async () => {
    setIsLoading(true);
    if (hasValidName(currentRace)) {
      await updateCurrentRace(currentRace);
      window.location.reload();
    }
    setIsLoading(false);
  }, [currentRace]);

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
          setRace={setCurrentRace}
          currentRace={currentRace}
        />
        {currentRace.race_id != adminRace.race_id ? (
          <Button
            onClick={async () => await currentRaceOnChange()}
            disabled={isLoading}
            className="m-4"
          >
            {isLoading ? "Saving..." : "Save Change"}
          </Button>
        ) : (
          <></>
        )}
      </div>
      <ShowConsistencySwitch defaultValue={defaultValue} />
      <div className="flex items-center space-x-2 my-4">
        <input
          type="text"
          placeholder="Enter race name"
          id="raceName"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        {raceName.trim() ? (
          <Button
            onClick={async () => {
              const raceExists = races.some(
                (r) => r.name?.toLowerCase() === raceName.trim().toLowerCase()
              );
              if (raceExists) {
                alert("A race with this name already exists.");
              } else {
                await createNewRace(raceName.trim());
                window.location.reload();
              }
              setRaceName("");
            }}
            className="mx-4"
          >
            Create Race
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div>
        <Button
          onClick={() => signOut({ redirectTo: "/dashboard/leaderboard" })}
          className="my-4"
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}
