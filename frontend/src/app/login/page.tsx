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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 bg-page-bg">
      {/* A single soft glow keeps the screen modern without visual clutter */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent-primary/15 blur-3xl" />

      <div className="relative flex w-full max-w-[400px] flex-col items-center">
        {/* Circular logo template (300 x 300) — outside the card. Replace with your own <img> */}
        <div className="mb-8 flex aspect-square w-full max-w-[150px] items-center justify-center rounded-full border border-dashed border-card-border bg-card-bg/50">
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted">Logo</span>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl bg-card-bg/80 backdrop-blur border border-card-border p-8 shadow-xl shadow-black/30">
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
                  className="w-full rounded-xl border border-input-border bg-input-bg pl-11 pr-4 py-3 text-text-primary placeholder-text-muted outline-none transition-all focus:border-input-focus focus:ring-2 focus:ring-input-focus/30"
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
                  className="w-full rounded-xl border border-input-border bg-input-bg pl-11 pr-12 py-3 text-text-primary placeholder-text-muted outline-none transition-all focus:border-input-focus focus:ring-2 focus:ring-input-focus/30"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-accent-primary to-accent-pink px-4 py-3.5 font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'LOG-IN'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
