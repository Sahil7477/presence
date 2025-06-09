import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow px-6 py-4 mb-6">
      <ul className="flex gap-6 text-lg font-medium">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/admin">Admin</Link></li>
        <li><Link href="/student">Student</Link></li>
        <li><Link href="/scanner">Scanner</Link></li>
      </ul>
    </nav>
  );
}
