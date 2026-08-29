'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { CommandPalette } from './command-palette';
import { QuickCreateModal } from './quick-create-modal';

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthReady, isAuthenticated, dataError } = useCRM();

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
            Restoring session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-amber-500/30 selection:text-amber-400">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar />

        {dataError && (
          <div className="flex items-center gap-2 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{dataError}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[var(--background)]">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette />
      <QuickCreateModal />
    </div>
  );
}
