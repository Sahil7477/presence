'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Reset previous messages

    if (!email || !password) {
      setMessage({ text: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage({ text: error.message, type: 'error' });
          return;
        }
        setMessage({ text: 'Login successful!', type: 'success' });
        router.push('/admin');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage({ text: error.message, type: 'error' });
          return;
        }
        setMessage({ text: 'Account created. Please check your email.', type: 'success' });
        setIsLogin(true);
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <Card className="w-full max-w-md bg-zinc-900 border border-zinc-700 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isLogin ? 'Admin Login' : 'Admin Signup'}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
            </div>
            {message && (
              <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
            <p
              onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
              className="text-sm text-slate-400 hover:underline cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
