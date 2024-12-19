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
    const [isReplacingSkipass, setIsReplacingSkipass] = useState(false);
    const [newSkipass, setNewSkipass] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [confirmReplace, setConfirmReplace] = useState(false);


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
                setNewSkipass(String(serialNumber).replaceAll(':', '').toLowerCase());
                setConfirmReplace(true)
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
        setIsReplacingSkipass(false);
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
             fetchData(endpoint, '')
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

    const handleReplaceSkipass = async (item: any) => {
        setIsReplacingSkipass(true);
        setSearchResult(item)
    };

    const handleConfirmReplaceSkipass = async () => {
        if (confirmReplace && newSkipass && searchResult && searchResult.racer_id) {
          try {
            await handleAction('racers', 'PUT', { ...searchResult, ski_pass: newSkipass });
            setMessage("Skipass replaced successfully!");
            setNewSkipass("")
            setConfirmReplace(false)
            setIsReplacingSkipass(false)
          } catch (error: any) {
            console.error("Error replacing skipass:", error);
            setMessage(`Error: ${error.message}`);
          }
        }else{
            setMessage("Error replacing skipass: Scan a new ski pass first!")
        }
      };
    
    const handleCancelReplaceSkipass = () => {
        setIsReplacingSkipass(false);
        setNewSkipass("");
        setConfirmReplace(false);
        setMessage("")
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
                        <td className="border p-2 flex space-x-2">
                        <button
                            onClick={() => handleEditClick(item)}
                            className="flex-1 bg-yellow-500 text-white px-2 py-1 rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleReplaceSkipass(item)}
                            className="flex-1 bg-blue-500 text-white px-2 py-1 rounded-md"
                          >
                            Replace Skipass
                            </button>
                            <button
                                onClick={() => handleDelete(item.racer_id || item.run_id, viewMode === 'racers' ? 'racers' : 'runs')}
                                className="flex-1 bg-red-500 text-white px-2 py-1 rounded-md"
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
        <div className="relative flex flex-col space-y-6 p-6">
            {/* Logout Button in Top Right */}
            <div className="absolute top-4 right-4">
                <form action={signOutAction}>
                    <button className="flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                        <div>Sign Out</div>
                    </button>
                </form>
            </div>

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
            
          {searchResult && isReplacingSkipass && (
        <div className="mt-4 p-4 border rounded shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-2">Replace Ski Pass for {searchResult.name}</h3>
          <button
          onClick={handleScan}
          className="w-full rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600"
        >
          Scan New Card
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
          {confirmReplace && <div className="flex mt-4 space-x-2">
            <button onClick={handleConfirmReplaceSkipass} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md">Confirm Replace</button>
            <button onClick={handleCancelReplaceSkipass} className="flex-1 bg-gray-300  px-4 py-2 rounded-md">Cancel</button>
            </div>}
        </div>
      )}


            {searchResult && !Array.isArray(searchResult) && viewMode === 'racers' && !isReplacingSkipass && renderRacerForm()}
            {searchResult && !Array.isArray(searchResult) && viewMode === 'runs' && renderRunForm()}

            {searchResult && Array.isArray(searchResult) && renderTable(searchResult, viewMode === 'racers' ? 'racer' : 'run')}
        </div>
    );
}

function renderRunForm() {
    return (
      <div className="mt-4">
          <h3 className="text-xl font-semibold">Edit Run</h3>
          {/* Add your Run form fields here */}
          <input
              type="text"
              placeholder="Duration"
              //   value={updatedFields.duration || searchResult.duration}
              //   onChange={(e) => handleFieldChange('duration', e.target.value)}
              className="border px-3 py-2 rounded-md w-full mt-2"
          />
           <input
              type="text"
              placeholder="Start Time"
              //   value={updatedFields.start_time || searchResult.start_time}
              //   onChange={(e) => handleFieldChange('start_time', e.target.value)}
              className="border px-3 py-2 rounded-md w-full mt-2"
          />
          <button
              // onClick={() =>
              //     handleAction('runs', 'PUT', { ...searchResult, ...updatedFields })
              // }
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
          >
              Save Run Changes
          </button>
      </div>
  )
}