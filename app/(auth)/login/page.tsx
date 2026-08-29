'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2, User, Key, CheckCircle2 } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';

export default function LoginPage() {
  const router = useRouter();
  const { superiors, login, organization } = useCRM();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const result = await login(email, password);
    if (result.ok) {
      router.push('/dashboard');
    } else {
      setErrorMsg(result.error || 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  const handleSelectSuperior = (supEmail: string) => {
    setEmail(supEmail);
    setErrorMsg('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4 select-none">
      <div className="w-full max-w-lg space-y-6">
        {/* Official Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/10 p-1 border-2 border-amber-500/50 shadow-2xl">
              <img
                src="/brand/forgeconsultant-logo.png"
                alt="Forge Consultancy"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-amber-400 font-serif">
              FORGE CONSULTANCY
            </h1>
            <p className="text-xs font-mono text-amber-500/90 tracking-widest uppercase mt-0.5">
              ESTABLISHED {organization.established} • ENTERPRISE CRM
            </p>
          </div>
        </div>

        {/* Superiors Quick-Login Panel */}
        <div className="rounded-2xl border border-amber-500/30 bg-[var(--card)] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Recognized Leadership & Team Leads</span>
            </div>
            <span className="text-[10px] text-[var(--muted-foreground)]">1-Click Fast Fill</span>
          </div>

          <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">
            Click any leadership member to fill their official email ID:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {superiors.map((sup) => {
              const isSelected = email === sup.email;
              return (
                <button
                  key={sup.email}
                  type="button"
                  onClick={() => handleSelectSuperior(sup.email)}
                  className={`flex flex-col text-left p-2 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-xs'
                      : 'border-[var(--border)] bg-[var(--muted)]/50 text-[var(--foreground)] hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate">{sup.full_name}</span>
                    <span className="text-[9px] font-mono text-amber-400 bg-slate-900 px-1.5 py-0.2 rounded font-semibold">
                      {sup.employee_id}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)] truncate">{sup.designation}</span>
                  <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span className="text-amber-500/80 truncate">{sup.email}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
              Sign In with Official Credentials
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Authorized access for Forge Consultancy employees & practice leads
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">Official Email ID</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--foreground)]">Password / Token</label>
                <span className="text-[10px] font-mono text-amber-500">ID-Linked Secure Token</span>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-500 hover:to-amber-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating Role...' : 'Access Practice Workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Security & Organization Identity */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-[var(--muted-foreground)]">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
          <span>Forge Consultancy • Established 2024 • Secured by PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
}
