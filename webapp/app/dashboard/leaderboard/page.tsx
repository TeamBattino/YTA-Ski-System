"use client";

import ConsistencyTable from "@/components/ConsistencyTable";
import RecentRunsTable from "@/components/RecentRunsTable";
import TopRunsTable from "@/components/TopRunsTable";
import React, { useState, useEffect } from "react";
import { getRaces } from "@/lib/db-helper";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import { useSession } from "next-auth/react"
import { get } from "http";

import { race as Race } from '@prisma/client';

export default function Page() {
  const showingConsistency = true;
  const [race, setRace] = useState<Race>();
  const [open, setOpen] = React.useState(false);
  const [races, setRaces] = useState<Race[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRaces = async () => {
    const races = await getRaces();
    setRaces(races);
  };

  const {data:session } = useSession()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchRaces();
    console.log(session)
  }, [session]);


  if (showingConsistency) {
    return (
      <>
        <h1 className="py-2 text-2xl font-bold">Leaderboards</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {race
                ? races.find((currentRace) => race === currentRace)?.name
                : "Select race..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search race..." className="h-9" />
              <CommandList>
                <CommandEmpty>No race found.</CommandEmpty>
                <CommandGroup>
                  {races.map((currentRace) => (
                    <CommandItem
                      key={currentRace.race_id}
                      value={currentRace.name}
                      onSelect={(currentValue) => {
                        setRace(
                          races.find(
                            (raceWithName) => currentValue === raceWithName.name
                          )
                        );
                        setOpen(false);
                      }}
                    >
                      {currentRace.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          currentRace === race ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
          closest to each other in time.
        </p>
        <p>
          View recent runs or click an entry to view the persons current
          consistency.
        </p>
        <h2 className="py-2 text-xl font-bold">Recent Runs</h2>
        <RecentRunsTable />
        <h2 className="py-2 text-xl font-bold">Non-Competitive Top Runs</h2>
        <TopRunsTable race={race} />
      </div>
    );
  }
}
