"use client";

import React from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex h-screen flex-col items-center justify-start bg-gray-50 px-4 pt-8">
      <p>
        *This page is only meant for admin users. If you are not an admin,
        please proceed to another page of the Ski-App.
      </p>
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Admin Login</h1>

      <button
        onClick={() => signIn("google", { redirectTo: "/dashboard/admin" })}
      >
        Sign in With Google
      </button>
    </div>
  );
}
