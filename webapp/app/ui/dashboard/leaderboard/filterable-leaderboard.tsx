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
  const [filteredRunsWithRank, setFilteredRunsWithRank] = useState<any[]>(runsWithRank);
  const [filteredConsistencyWithRank, setFilteredConsistencyWithRank] = useState<any[]>(consistencyWithRank);

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [ldapSearch, setLdapSearch] = useState<string>("");

  useEffect(() => {
    let filtered = racers;

    if (selectedLocation) {
      filtered = filtered.filter(racer => racer.location === selectedLocation);
    }

    if (ldapSearch) {
      filtered = filtered.filter(racer => racer.ldap.toLowerCase().includes(ldapSearch.toLowerCase()));
    }

    const filteredRuns = runsWithRank.filter(run =>
      filtered.some(racer => racer.ski_pass === run.ski_pass)
    );
    setFilteredRunsWithRank(filteredRuns);

    const filteredConsistency = consistencyWithRank.filter(consistency =>
      filtered.some(racer => racer.racer_id === consistency.racer.racer_id)
    );
    setFilteredConsistencyWithRank(filteredConsistency);

  }, [selectedLocation, ldapSearch, racers, runsWithRank, consistencyWithRank]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Filter Runs</h2>
      <div className="flex space-x-4 mb-4">
        <select
          onChange={(e) => setSelectedLocation(e.target.value)}
          value={selectedLocation}
          className="p-2 border rounded"
        >
          <option value="">Select Site</option>
          <option value="ZH">ZH</option>
          <option value="PO">PO</option>
          <option value="US">US</option>
          <option value="DE">DE</option>
        </select>

        <input
          type="text"
          value={ldapSearch}
          onChange={(e) => setLdapSearch(e.target.value)}
          placeholder="Search by LDAP"
          className="p-2 border rounded"
        />
      </div>

      <p className="mt-2 rounded-md px-4 py-2 text-gray-700 italic">
        Filtered results based on selected criteria
      </p>

      <div className="overflow-x-auto">
        <LeaderboardTable run={filteredRunsWithRank} bruh={filteredConsistencyWithRank} />
      </div>
    </div>
  );
}
