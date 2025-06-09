'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = (role: 'admin' | 'student') => {
    router.push(`/${role}`);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-3xl font-bold">Login Page</h1>
      <p className="text-lg">Select your role to continue</p>
      <div className="flex space-x-4">
        <Button onClick={() => handleLogin('admin')}>Login as Admin</Button>
        <Button onClick={() => handleLogin('student')}>Login as Student</Button>
      </div>
    </div>
  );
}