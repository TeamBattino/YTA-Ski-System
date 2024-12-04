import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div>
        <p>haiii</p>
        <Link href="/dashboard/registration">
          <button>Enter</button>
        </Link>
        <Link href="/dashboard/login">
          <button>Admin</button>
        </Link>
      </div>
    </main>
  );
}
