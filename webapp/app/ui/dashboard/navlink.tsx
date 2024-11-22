'use client';

import Link from "next/link";
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { FaUserPlus, FaQuestion, FaLock, FaFlagCheckered } from 'react-icons/fa';

export default function NavLink() {
  const pathname = usePathname();

  const links = [
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: <FaFlagCheckered /> },
    { name: 'Registration', href: '/dashboard/registration', icon: <FaUserPlus /> },
    { name: 'Faq', href: '/dashboard/faq', icon: <FaQuestion /> },
    { name: 'Admin', href: '/dashboard/admin/login', icon: <FaLock /> },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            'flex items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-sky-100 text-blue-600': pathname === link.href, // Highlight active link
            }
          )}
        >
          {/* Show icon on mobile (hidden on desktop) */}
          <span className="md:hidden text-2xl">{link.icon}</span>

          {/* Show text on desktop (hidden on mobile) */}
          <p className="hidden md:block">{link.name}</p>
        </Link>
      ))}
    </>
  );
}
