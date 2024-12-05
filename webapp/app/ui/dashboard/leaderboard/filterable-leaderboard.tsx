'use client'

import React, { useState, useEffect } from "react";
import LeaderboardTable from "./leaderboard-table";

export default function FilterableLeaderboard({
  runsWithRank,
  consistencyWithRank,
  racers
}: {
  runsWithRank: any[];
  consistencyWithRank: any[];
  racers: any[];
}) {
  const [filteredRacers, setFilteredRacers] = useState<any[]>(racers);
  const [filteredRunsWithRank, setFilteredRunsWithRank] = useState<any[]>(runsWithRank);
  const [filteredConsistencyWithRank, setFilteredConsistencyWithRank] = useState<any[]>(consistencyWithRank);

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [ldapSearch, setLdapSearch] = useState<string>("");
  const [ldapSuggestions, setLdapSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Apply filters when either location or ldapSearch changes
    let filtered = racers;

    // Filter by location (site)
    if (selectedLocation) {
      filtered = filtered.filter(racer => racer.location === selectedLocation);
    }

    // Filter by LDAP search term
    if (ldapSearch) {
      filtered = filtered.filter(racer => racer.ldap.toLowerCase().includes(ldapSearch.toLowerCase()));
    }

    setFilteredRacers(filtered);

    // Filter runsWithRank based on filtered racers
    const filteredRuns = runsWithRank.filter(run =>
      filtered.some(racer => racer.ski_pass === run.ski_pass)
    );
    setFilteredRunsWithRank(filteredRuns);

    // Filter consistencyWithRank based on filtered racers
    const filteredConsistency = consistencyWithRank.filter(consistency =>
      filtered.some(racer => racer.racer_id === consistency.racer.racer_id)
    );
    setFilteredConsistencyWithRank(filteredConsistency);

  }, [selectedLocation, ldapSearch, racers, runsWithRank, consistencyWithRank]);

  // Update the suggestions as the user types in the LDAP search field
  useEffect(() => {
    if (ldapSearch) {
      const suggestions = racers.filter(racer =>
        racer.ldap.toLowerCase().includes(ldapSearch.toLowerCase())
      );
      setLdapSuggestions(suggestions);
    } else {
      setLdapSuggestions([]); // Clear suggestions when there's no input
    }
  }, [ldapSearch, racers]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Filter Racers</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Site filter dropdown */}
        <select
          onChange={(e) => setSelectedLocation(e.target.value)}
          value={selectedLocation}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">Select Site</option>
          <option value="ZH">ZH</option>
          <option value="PO">PO</option>
          <option value="US">US</option>
          <option value="DE">DE</option>
        </select>

        {/* LDAP search input */}
        <div className="relative flex justify-center py-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <input
            type="text"
            value={ldapSearch}
            onChange={(e) => setLdapSearch(e.target.value)}
            placeholder="Search by LDAP"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {ldapSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-md max-h-60 overflow-y-auto z-10">
              <ul>
                {ldapSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.racer_id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setLdapSearch(suggestion.ldap); // Select the suggestion
                      setLdapSuggestions([]); // Clear suggestions
                    }}
                  >
                    {suggestion.ldap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 rounded-md px-4 py-2 text-gray-700 italic">
        Filtered results based on selected criteria
      </p>

      {/* Display the filtered leaderboard table */}
      <div className="overflow-x-auto">
        <LeaderboardTable run={filteredRunsWithRank} bruh={filteredConsistencyWithRank} />
      </div>
    </div>
  );
}
