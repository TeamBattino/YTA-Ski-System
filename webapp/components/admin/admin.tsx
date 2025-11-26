"use client";

import React, { useState, useEffect } from "react";
import { getRaces } from "@/lib/db-helper";
import AdminRecentRunsTable from "@/components/Tables/AdminRecentRunsTable";
import { signOut } from "next-auth/react";
import {Session} from "next-auth"
import { race as Race } from "@prisma/client";
import RaceSelect from "@/components/RaceSelect";

export default function Admin(session: Session ) {
  const [race, setRace] = useState<Race>();
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const races = await getRaces();
      setRaces(races);
    };
    fetchRaces();
  }, [session]);
  return (
    <>
      <RaceSelect races={races} setRace={setRace} />
      <br />
      <button onClick={() => signOut( { redirectTo: "/dashboard/leaderboard" })}>
        Sign Out
      </button>
      <AdminRecentRunsTable race={race} />
    </>
  );
}
