"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { getRaces } from "@/lib/db-helper";
import AdminRecentRunsTable from "@/components/AdminRecentRunsTable";
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
import { signOut } from "next-auth/react";
import { getAdminByEmail } from "@/lib/db-helper";

type Race = {
  race_id: string;
  name: string;
};

export default function Admin(session: any) {
  const [race, setRace] = useState<Race>();
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [open, setOpen] = React.useState(false);
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const races = await getRaces();
      setRaces(races);
    };
    fetchRaces();
  }, [session]);
  if (isAdmin) {
    return (
      <>
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
        <br />
        <button
          onClick={() => signOut({ redirectTo: "/dashboard/leaderboard" })}
        >
          Sign Out
        </button>
        <AdminRecentRunsTable race={race} />
      </>
    );
  } else {
    return <>You are not allowed on this site.</>;
  }
}
