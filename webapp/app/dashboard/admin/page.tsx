import { signOut } from '@/auth';
export default function Page() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <p>ADMIN PAGE! sign out if you want to go back</p>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
    </div>
  );
  }