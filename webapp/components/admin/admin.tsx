"use client";

import React, { useState } from "react";
import AdminRecentRunsTable from "@/components/Tables/AdminRecentRunsTable";
import { signOut } from "next-auth/react";
import {Session} from "next-auth"
import { race as Race } from "@/src/generated/client";
import RaceSelect from "@/components/RaceSelect";

type AdminProp = {
  session : Session;
  races: Race[];
}

export default function Admin({session, races}: AdminProp ) {
  const [race, setRace] = useState<Race>();

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
