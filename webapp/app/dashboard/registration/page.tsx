export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-start bg-gray-50 px-4 pt-8">
      {/* Überschrift */}
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Registration</h1>

      {/* Scan Card Button */}
      <button className="mb-6 w-60 rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600">
        Scan Card with Phone
      </button>

      {/* Name Eingabefeld */}
      <div className="mb-6 w-60">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Altersgruppe auswählen */}
      <div className="mb-6 w-60">
        <p className="mb-4 text-sm font-medium text-gray-700">Choose Your Age Group</p>
        <div className="grid grid-cols-3 gap-3">
          {["18-25", "26-35", "36-45", "46-55", "56-65", "65+"].map((ageGroup) => (
            <button
              key={ageGroup}
              className="flex h-12 w-full items-center justify-center rounded-md bg-blue-400 text-white hover:bg-sky-100 hover:text-blue-600"
            >
              {ageGroup}
            </button>
          ))}
        </div>
      </div>

      {/* Register Button */}
      <button className="w-60 rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-sky-100 hover:text-blue-600">
        Register
      </button>
    </div>
  );
}
