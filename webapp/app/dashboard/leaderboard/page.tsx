"use client";

import ConsistencyTable from "@/components/ConsistencyTable";
import RecentRunsTable from "@/components/RecentRunsTable";
import TopRunsTable from "@/components/TopRunsTable";
import React, { useState, useEffect } from "react";
import { getRaces } from "@/lib/db-helper";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { get } from "http";

export default function Page() {
  const showingConsistency = true;
  const [race, setRace] = useState(new Set(["Empty"]));
  const [races, setRaces] = useState<any[]>([]);
  const selectedRace = React.useMemo(
    () => Array.from(race).join(", ").replace(/_/g, ""),
    [race]
  );

   // eslint-disable-next-line react-hooks/exhaustive-deps
   const fetchRaces = async () => {
      const races = await getRaces();
      setRaces(races);
    };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchRaces();
  }, []);

  if (showingConsistency) {
    return (
      <>
        <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
        <b>Select Race: </b>
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="flat">
              {selectedRace}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={race}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(race: any) => setRace(race)}
          >
            {races && races.length ? (
              races.map((r) => {
                const key = r.race_id ?? "";
                const label = r.race_name ?? "2026";
                return (
                  <DropdownItem key={String(key)} value={String(key)}>
                    {label}
                  </DropdownItem>
                );
              })
            ) : (
              <DropdownItem key="empty" isDisabled>
                No races
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

        <h2 className="py-2 text-xl font-bold">⭐ Competitive Consistency</h2>
        <ConsistencyTable race={race} />
        <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
        <TopRunsTable race={race} />
      </>
    );
  } else {
    return (
      <div>
        <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
        <p>
          The Aim of the challenge is to have your two most recent runs be
          closest to eachother in time.
        </p>
        <p>
          View recent runs or click an entry to view the persons current
          consistency.
        </p>
        <h2 className="py-2 text-xl font-bold">Recent Runs</h2>
        <RecentRunsTable />
        <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
        <TopRunsTable />
      </div>
    );
  }
}
