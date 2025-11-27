import { useState, Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
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

import { race as Race } from "@/src/generated/client";

type SetRaceInterface = Dispatch<SetStateAction<Race | undefined>>

type RaceSelectProps = {
races: Race[];  
setRace: SetRaceInterface
}

export default function RaceSelect({ races, setRace}:RaceSelectProps) {
  const [open, setOpen] = useState(false);
  const [race, setRaceLocal] = useState<Race>();

  return (
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
                    const newRaceValue = races.find(
                      (raceWithName) => currentValue === raceWithName.name
                    );
                    setRace(newRaceValue);
                    setRaceLocal(newRaceValue);
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
  );
}
