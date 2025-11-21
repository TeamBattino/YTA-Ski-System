"use client";

import React, { useState, useEffect } from "react";
import { getRaces } from "@/lib/db-helper";
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

export default function Registration() {
  const [name, setName] = useState<string>("");
  const [ldap, setLdap] = useState<string>("");
  const [selectedLocation, setLocation] = useState<any>();
  const [ski_pass, setSkiPass] = useState<string>("prrthiusdfhg");
  const [race, setRace] = useState<Race>();
  const [open, setOpen] = React.useState(false);
  const [races, setRaces] = useState<Race[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>(""); // for nfc reader

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRaces = async () => {
    const races = await getRaces();
    setRaces(races);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchRaces();
  }, []);

  const handleScan = async () => {
    if ("NDEFReader" in window) {
      try {
        const ndef = new (window as any).NDEFReader(); // Use `as any` to avoid TypeScript errors for NDEFReader.
        await ndef.scan();

        console.log("Scan started successfully.");
        setMessage("Scanning...");

        ndef.onreadingerror = () => {
          console.log("Cannot read data from the NFC tag. Try another one?");
          setMessage("Try again!");
        };

        ndef.onreading = (event: any) => {
          console.log("NDEF message read.");
          const serialNumber = event.serialNumber || "Unknown";
          setMessage(`Scan successful:\n ${serialNumber}`);
          setSkiPass(String(serialNumber).replaceAll(":", "").toLowerCase());
        };
      } catch (error) {
        console.log(`Error! Scan failed to start: ${error}.`);
        setMessage("Error starting NFC scan. Try again!");
      }
    } else {
      console.log("NFC is not supported on this device.");
      setMessage(
        "NFC is not supported on this device.\nPlease use Chrome on an Android device."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (ldap && ldap.includes("@")) {
      alert("LDAP cannot contain '@'.");
      setIsSubmitting(false);
      return;
    }
    if (!name || !ldap || !ski_pass || !selectedLocation || !race) {
      alert("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (name && ldap && ski_pass && selectedLocation && race) {
        const response = await fetch("/api/racers", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            ldap: ldap,
            location: selectedLocation,
            ski_pass: ski_pass,
            race_id: race.race_id, 
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Registration successful!");
          setName("");
          setLdap("");
          setLocation("");
          setSkiPass("");
        } else {
          alert("Registration failed. Please try again." + response.statusText);
          return;
        }
      }
    } catch (error) {
      console.error("Error registering racer: ", error);
      alert("An error occurred. Please try again.: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start bg-gray-50 px-4 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Registration</h1>

      {/* NFC Reader */}
      <div className="flex flex-col items-center mb-6 w-60">
        <button
          onClick={handleScan}
          className="w-full rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600"
        >
          Scan Card with Phone
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>

      {/* Name Field */}
      <div className="mb-6 w-60">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* LDAP Field */}
      <div className="mb-6 w-60">
        <label
          htmlFor="ldap"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Your ldap (without @google)
        </label>
        <input
          id="ldap"
          name="ldap"
          type="text"
          value={ldap}
          onChange={(e) => setLdap(e.target.value)}
          placeholder="Enter your LDAP"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Site Selection */}
      <div className="mb-6 w-60">
        <p className="mb-4 text-sm font-medium text-gray-700">
          Choose Your Site
        </p>
        <div className="grid grid-cols-2 gap-3">
          {["ZRH", "WAW", "US", "DE"].map((location) => (
            <button
              key={location}
              onClick={() => {
                setLocation(location);
              }}
              className={`flex h-12 w-full items-center justify-center rounded-md ${
                location === selectedLocation ? "bg-blue-600" : "bg-blue-400"
              } text-white hover:bg-sky-100 hover:text-blue-600`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

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

      <br /><br />

      {/* Register Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-60 rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
