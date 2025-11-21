"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import SignIn from '@/components/sign-in';

export default function Login() {
  const [username, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
            username: username,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Login successful!");
          setName("");
          setPassword("");
          redirect('/dashboard/admin');
        } else {
          alert("Login failed. Please try again." + response.statusText);
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
        *This page is only meant for admin users. If you are not an admin, please
        proceed to another page of the Ski-App.
      </p>
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Admin Login</h1>

     <SignIn />
    </div>
  );
}
