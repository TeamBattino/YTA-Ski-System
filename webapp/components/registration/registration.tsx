"use client";

import React, { useState } from "react";
import { createRacer } from "@/lib/db-helper";
import RaceSelect from "@/components/RaceSelect";

import { race as Race } from "@/src/generated/client";

type RegistrationProp = {
  races: Race[];
}

export default function Registration({races}: RegistrationProp[]) {
  const [name, setName] = useState<string>("");
  const [ldap, setLdap] = useState<string>("");
  const [selectedLocation, setLocation] = useState<any>();
  const [ski_pass, setSkiPass] = useState<string>();
  const [race, setRace] = useState<Race>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>(""); // for nfc reader

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
        const responseRacer = await createRacer(
          name,
          ldap,
          ski_pass,
          selectedLocation,
          race.race_id
        );

        if (responseRacer.racer_id) {
          alert("Registration successful!");
          setName("");
          setLdap("");
          setLocation("");
          setSkiPass("");
        } else {
          alert("Registration failed. Please try again.");
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

      <RaceSelect races={races} setRace={setRace} />

      <br />
      <br />

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
