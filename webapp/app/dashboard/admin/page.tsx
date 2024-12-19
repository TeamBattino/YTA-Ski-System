'use client';

import React, { useState, useEffect } from 'react';
import { signOutAction } from '@/app/lib/actions/signOutAction';

export default function AdminPage() {
  const [viewMode, setViewMode] = useState<'runs' | 'racers' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedFields, setUpdatedFields] = useState<any>({});

  const fetchData = async (endpoint: string, query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${endpoint}?query=${query}`);
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

  useEffect(() => {
    if (viewMode) {
      fetchData(viewMode === 'racers' ? 'racers' : 'runs', '');
    }
  }, [viewMode]);

  const handleSearch = () => {
    if (viewMode) {
      fetchData(viewMode === 'racers' ? 'racers' : 'runs', searchQuery);
    }
  };

  const handleEditClick = (item: any) => {
    setSearchResult(item);
    setUpdatedFields({});
  };

  const handleAction = async (endpoint: string, action: string, body: any) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
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

  const handleFieldChange = (field: string, value: any) => {
    setUpdatedFields({ ...updatedFields, [field]: value });
  };

  const handleDelete = async (id: string | number, endpoint: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/${endpoint}?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete item: ${response.statusText}`);
        }

        alert('Item deleted successfully!');
        setSearchResult(null);
        fetchData(endpoint, '');
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const renderRacerForm = () => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">Edit Racer</h3>
      <input
        type="text"
        placeholder="Racer Name"
        value={updatedFields.name || searchResult.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        className="border px-3 py-2 rounded-md w-full mt-2"
      />
      <input
        type="text"
        placeholder="Location"
        value={updatedFields.location || searchResult.location}
        onChange={(e) => handleFieldChange('location', e.target.value)}
        className="border px-3 py-2 rounded-md w-full mt-2"
      />
      <input
        type="text"
        placeholder="Ski Pass"
        value={updatedFields.ski_pass || searchResult.ski_pass}
        onChange={(e) => handleFieldChange('ski_pass', e.target.value)}
        className="border px-3 py-2 rounded-md w-full mt-2"
      />
      <input
        type="text"
        placeholder="LDAP"
        value={updatedFields.ldap || searchResult.ldap}
        onChange={(e) => handleFieldChange('ldap', e.target.value)}
        className="border px-3 py-2 rounded-md w-full mt-2"
      />
      <button
        onClick={() =>
          handleAction('racers', 'PUT', { ...searchResult, ...updatedFields })
        }
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Save Racer Changes
      </button>
    </div>
  );

  const renderTable = (data: any, type: 'racer' | 'run') => (
    <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
      <thead>
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">{type === 'racer' ? 'Name' : 'Duration'}</th>
          <th className="border p-2">{type === 'racer' ? 'Ski Pass' : 'Ski Pass'}</th>
          <th className="border p-2">{type === 'racer' ? 'Location' : 'Start time'}</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={`${item.racer_id || item.run_id}_${item.name || item.duration}`}>
            <td className="border p-2">{item.racer_id || item.run_id}</td>
            <td className="border p-2">{item.name || item.duration}</td>
            <td className="border p-2">{item.ski_pass}</td>
            <td className="border p-2">{item.location || item.start_time}</td>
            <td className="border p-2">
              <button
                onClick={() => handleEditClick(item)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.racer_id || item.run_id, viewMode === 'racers' ? 'racers' : 'runs')}
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Tools</h1>

      <div>
        <button
          onClick={() => setViewMode('racers')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Edit Racers
        </button>
        <button
          onClick={() => setViewMode('runs')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
        >
          Edit Runs
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder={viewMode === 'racers' ? 'Enter Racer Details' : 'Enter Run ID'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
        <button
          onClick={handleSearch}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {searchResult && !Array.isArray(searchResult) && viewMode === 'racers' && renderRacerForm()}
      {searchResult && !Array.isArray(searchResult) && viewMode === 'runs' && renderRunForm()}

      {searchResult && Array.isArray(searchResult) && renderTable(searchResult, viewMode === 'racers' ? 'racer' : 'run')}
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <p>ADMIN PAGE! Sign out if you want to go back</p>
        <form action={signOutAction}>
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
