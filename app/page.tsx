'use client';


import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
      <h1 className="text-3xl font-bold">Welcome to QR Attendance System</h1>
      <p className="text-lg">Please log in to continue</p>
      <Button onClick={() => router.push('/login')}>Go to Login</Button>
    </div>
  );
}