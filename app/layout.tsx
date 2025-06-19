import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <Navbar />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}