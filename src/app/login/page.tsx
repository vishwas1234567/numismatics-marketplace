'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    
    // Simulate auth check by searching localStorage dummy user lists 
    // Wait, the prompt says "If email/password exist in localStorage -> login success".
    // Since we don't have a backend we'll simulate it by checking a generic 'users' key.
    
    const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = storedUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      login({ id: user.id, name: user.name, email: user.email, role: user.role || 'buyer' });
      router.push('/profile');
    } else if (email === 'dhanush@example.com' && password === 'password') {
      // Fallback dummy user based on instructions
      login({ id: 'user_1', name: 'Dhanush', email: 'dhanush@example.com', role: 'both' });
      router.push('/profile');
    } else {
      setError('Invalid credentials. Please register if you do not have an account.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Or{' '}
          <Link href="/register" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-950 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-zinc-200 dark:border-zinc-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900/30">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-zinc-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-zinc-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
