"use client";

import React, { useState } from "react";

export default function Admin() {
  const [username, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!username || !password) {
      alert("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (username) {
        const response = await fetch("/api/admin", {
          method: "POST",
          body: JSON.stringify({
            name: username,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Registration successful!");
          setName("");
          setAuthenticated(true);
        } else {
          alert("Registration failed. Please try again." + response.statusText);
          setAuthenticated(false);
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
      <p>
        This page is only meant for admin users. If you are not an admin, please
        proceed to another page of the Ski-App.
      </p>
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Admin Login</h1>

      {/* Name Field */}
      <div className="mb-6 w-60">
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your username"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Password Field */}
      <div className="mb-6 w-60">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
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
