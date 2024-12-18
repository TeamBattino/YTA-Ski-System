'use client';

import React, { useState } from 'react';

export default function AdminPage() {
  // separati Zustände für jede Sektion
  const [replaceSkiPassQuery, setReplaceSkiPassQuery] = useState('');
  const [deleteRaceQuery, setDeleteRaceQuery] = useState('');
  const [deletePeopleQuery, setDeletePeopleQuery] = useState('');
  
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSkiPass, setNewSkiPass] = useState(''); 

  const handleSearch = async (endpoint: string, query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/${endpoint}?query=${query}`);//muss arangiere, api endpoints entweder erstelle oder alti verwende. han jetzt nur mal die als platzhalter gno.
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (endpoint: string, action: string, body?: any) => {
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {//dasselbe da und bi de andere
        method: action,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Action failed: ${response.statusText}`);
      }

      alert('Action completed successfully!');
      setSearchResult(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Tools</h1>

      {/* Replace Ski Cards */}
      <div>
        <h2 className="text-xl font-semibold">Replace Ski Cards</h2>
        <input
          type="text"
          placeholder="Enter Ski Pass ID"
          value={replaceSkiPassQuery}
          onChange={(e) => setReplaceSkiPassQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
        <button
          onClick={() => handleSearch('racers', replaceSkiPassQuery)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search Racer
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {searchResult && (
          <div className="mt-4">
            <p>Racer Name: {searchResult.name}</p>
            <input
              type="text"
              placeholder="Enter New Ski Pass"
              value={newSkiPass} 
              onChange={(e) => setNewSkiPass(e.target.value)}
              className="border px-3 py-2 rounded-md w-full mt-2"
            />
            <button
              onClick={() =>
                handleAction('racers', 'PUT', { ...searchResult, ski_pass: newSkiPass })
              }
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Replace Ski Pass
            </button>
          </div>
        )}
      </div>

      {/* Delete Race */}
      <div>
        <h2 className="text-xl font-semibold">Delete Race</h2>
        <input
          type="text"
          placeholder="Enter Run ID"
          value={deleteRaceQuery}
          onChange={(e) => setDeleteRaceQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
        <button
          onClick={() => handleSearch('runs', deleteRaceQuery)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search Run
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {searchResult && (
          <div className="mt-4">
            <p>Run ID: {searchResult.run_id}</p>
            <button
              onClick={() => handleAction('runs', 'DELETE', { run_id: searchResult.run_id })}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Race
            </button>
          </div>
        )}
      </div>

      {/* Delete People */}
      <div>
        <h2 className="text-xl font-semibold">Delete People</h2>
        <input
          type="text"
          placeholder="Enter Ski Pass ID"
          value={deletePeopleQuery}
          onChange={(e) => setDeletePeopleQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
        <button
          onClick={() => handleSearch('racers', deletePeopleQuery)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search Racer
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {searchResult && (
          <div className="mt-4">
            <p>Racer Name: {searchResult.name}</p>
            <button
              onClick={() =>
                handleAction('racers', 'DELETE', { ski_pass: searchResult.ski_pass })
              }
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Racer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
