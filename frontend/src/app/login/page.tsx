'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { ApiEnvelope, AuthUser } from '@/lib/types';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

type LoginData = {
  accessToken: string;
  user: AuthUser;
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('owner@vapeshop.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<ApiEnvelope<LoginData>>('/auth/login', {
        email,
        password,
      });

      const { accessToken, user } = response.data.data;
      setAuth(accessToken, user);
      router.replace('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed. Check your email and password.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-dark-bg">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5" />
      
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-dark-card border border-dark-border p-8 shadow-2xl shadow-black/20">
          {/* Logo / Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple-light shadow-lg shadow-accent-purple/25">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Sign In to Vape Shop</h1>
            <p className="mt-2 text-sm text-text-secondary">Inventory Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-secondary">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail size={18} className="text-text-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input-border bg-input-bg pl-11 pr-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock size={18} className="text-text-muted" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input-border bg-input-bg pl-11 pr-12 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button type="button" className="text-sm text-accent-purple hover:text-accent-purple-light transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-accent-red/10 border border-accent-red/20 px-4 py-3 text-sm text-accent-red">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-light px-4 py-3.5 font-semibold text-white shadow-lg shadow-accent-purple/25 transition-all hover:shadow-xl hover:shadow-accent-purple/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-text-muted">
            Demo credentials are pre-filled. Backend must be running on port 4000.
          </p>
        </div>
      </div>
    </main>
  );
}
