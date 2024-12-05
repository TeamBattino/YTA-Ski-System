'use client'

import React, {useState } from "react";
import NfcReader from "@/app/lib/NfcReader";
import { createRacer } from "@/app/lib/actions/racers/data";


export default function Registration() {
  const [name, setName] = useState<string>("");
  const [ldap, setLdap] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [ski_pass, setSkiPass] = useState<string>("bruhhhh");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
//   const handleScan = (ski_pass: string) => {
//     setSkiPass(ski_pass);
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (ldap && ldap.includes("@")) {
        alert("LDAP cannot contain '@'.");
        return;
      }
      if (!name || !ldap || !ski_pass || !location) {
        alert("All fields are required.");
        return;
      }

    try {
        if(name && ldap && ski_pass && location)
      {
        const response = await fetch('/api/racers', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            ldap: ldap,
            location: location,
            ski_pass: ski_pass,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
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
      }}
    } catch (error) {
      console.error("Error registering racer:", error);
      alert("An error occurred. Please try again." + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start bg-gray-50 px-4 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Registration</h1>

      {/* NFC Reader */}
      <NfcReader  />

      {/* Name Field */}
      <div className="mb-6 w-60">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
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
        <label htmlFor="ldap" className="block mb-2 text-sm font-medium text-gray-700">
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
        <p className="mb-4 text-sm font-medium text-gray-700">Choose Your Site</p>
        <div className="grid grid-cols-3 gap-3">
          {["ZH", "PO", "US", "DE"].map((location) => (
            <button
              key={location}
              onClick={() => {setLocation(location)}}
              className={`flex h-12 w-full items-center justify-center rounded-md ${location === location ? "bg-blue-600" : "bg-blue-400"} text-white hover:bg-sky-100 hover:text-blue-600`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

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
