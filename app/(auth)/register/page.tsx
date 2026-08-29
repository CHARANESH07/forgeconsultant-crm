'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, IdCard } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useCRM();
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    const result = await register({ fullName: name, email, password, employeeId });
    if (result.ok) {
      router.push('/dashboard');
    } else {
      setErrorMsg(result.error || 'Registration failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/brand/forgeconsultant-logo.svg"
              alt="ForgeConsultant CRM"
              className="h-10 w-auto object-contain dark:brightness-110"
            />
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Create a high-performance advisory practice workspace
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Get Started</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Set up your consulting team on ForgeConsultant CRM
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">Official Employee ID</label>
              <div className="relative mt-1">
                <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  required
                  placeholder="FC-XX"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">Work Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  required
                  placeholder="rahul@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400 font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Practice Workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[var(--muted-foreground)]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-amber-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
