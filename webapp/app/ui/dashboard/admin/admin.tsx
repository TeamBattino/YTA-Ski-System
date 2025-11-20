"use client";

import React, { useState, useEffect } from "react";
import { getRaces } from "@/lib/db-helper";
import AdminRecentRunsTable from "@/components/AdminRecentRunsTable";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Race = {
  race_id: string;
  name: string;
};

export default function Admin() {
  const [race, setRace] = useState<Race>();
  const [open, setOpen] = React.useState(false);
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
      <AdminRecentRunsTable race={race} />
    </>
  );
}
