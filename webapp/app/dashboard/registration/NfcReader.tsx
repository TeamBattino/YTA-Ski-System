"use client";
import React, { useState } from "react";

function NfcReader() {
  const [message, setMessage] = useState<string>("");

  const Scan = async () => {
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
        };
      } catch (error) {
        console.log(`Error! Scan failed to start: ${error}.`);
        setMessage("Error starting NFC scan. Try again!");
      }
    } else {
      console.log("NFC is not supported on this device.");
      setMessage("NFC is not supported on this device.\nPlease use Chrome on an Android device.");
  }
  
  };

  return (
    <div className="flex flex-col items-center mb-6 w-60">
      <button
        onClick={Scan}
        className="w-full rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600"
      >
        Scan Card with Phone
      </button>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default NfcReader;
