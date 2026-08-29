'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
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
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Reset Password</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Enter your work email address to receive password recovery instructions.
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4" /> Password reset link sent
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Check your inbox at <strong className="text-[var(--foreground)]">{email}</strong> for instructions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--foreground)]">Work Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-xs text-amber-500 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
