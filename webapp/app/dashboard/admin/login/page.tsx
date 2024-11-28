export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-start bg-gray-50 px-4 pt-8">
      {/* Überschrift */}
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Admin Login</h1>

      {/* Benutzername Eingabefeld */}
      <div className="mb-6 w-60">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Username here"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Passwort Eingabefeld */}
      <div className="mb-6 w-60">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password here"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Login Button */}
      <button className="w-60 rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600">
        Login
      </button>
    </div>
  );
}
