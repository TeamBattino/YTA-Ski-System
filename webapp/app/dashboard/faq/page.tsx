export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-start bg-gray-50 px-4 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Guide & FAQ</h1>
      
      {/* Step-by-Step Guide */}
      <div className="w-full max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Step-by-Step Guide</h2>
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between rounded-md bg-blue-400 px-4 py-2 text-white">
            Step 1: Register Yourself
          </summary>
          <p className="mt-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700">
            Visit the registration page, scan your NFC ticket with your Android device, and enter your name and other details.
          </p>
        </details>
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between rounded-md bg-blue-400 px-4 py-2 text-white">
            Step 2: Scan Your Ticket at the Start
          </summary>
          <p className="mt-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700">
            Go to the start of the track, scan your NFC ticket, and wait for the display to give you the go-ahead.
          </p>
        </details>
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between rounded-md bg-blue-400 px-4 py-2 text-white">
            Step 3: Start Racing!
          </summary>
          <p className="mt-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700">
            Once the display says you’re ready, race down the track and enjoy the ride!
          </p>
        </details>
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between rounded-md bg-blue-400 px-4 py-2 text-white">
            Step 4: Check Your Results
          </summary>
          <p className="mt-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700">
            After your race, visit our website to see your time. Compare it with other participants and aim to beat your best!
          </p>
        </details>
      </div>

      {/* Fun Facts */}
      <div className="w-full max-w-3xl mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Fun Facts</h2>
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between rounded-md bg-blue-400 px-4 py-2 text-white">
            Was this system really built by apprentices?
          </summary>
          <p className="mt-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700">
            Yes, the entire project was designed and developed by enthusiastic apprentices in the YT feed ads Team
          </p>
        </details>
      </div>
    </div>
  );
}
