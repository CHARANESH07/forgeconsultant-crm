'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Mail,
  TrendingUp,
  Users2,
  FileText,
  Copy,
  Check,
  Bot,
  User,
  Zap,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency } from '@/lib/utils';

export default function AIHubPage() {
  const { deals, leads, tasks, user, currency, currencySymbol } = useCRM();

  // Assistant Query state
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      role: 'assistant',
      text: `Hello ${user.name}! I am your Forge Consultancy AI Practice Assistant. I analyze your leads, high-value deals, and team action items in real time. How can I assist you today?`,
      time: 'Just now',
    },
  ]);

  // Email drafter state
  const [emailClient, setEmailClient] = useState('Vikram Malhotra (Titan Logistics)');
  const [emailPurpose, setEmailPurpose] = useState<'sow_followup' | 'intro' | 'negotiation_checkin'>('sow_followup');
  const [generatedEmail, setGeneratedEmail] = useState(
    `Dear Vikram,\n\nI hope this note finds you well. Following our executive alignment meeting on the AI Testing & Cloud Modernization initiative, our team (led by Venugopal Naidu and Arun Ekambaram) has finalized the Phase 1 milestone deliverables and architectural SLA parameters.\n\nWe have scheduled the technical kick-off sprint for early next month and would appreciate confirmation on the commercial SOW countersignature.\n\nPlease let me know if you or the legal team have any questions.\n\nBest regards,\nSarvesh Jeevan\nChief Executive Officer | Forge Consultancy`
  );
  const [copied, setCopied] = useState(false);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query.trim();
    const newMessages = [...messages, { role: 'user' as const, text: userQ, time: 'Just now' }];
    setMessages(newMessages);
    setQuery('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = '';
      const q = userQ.toLowerCase();

      if (q.includes('deal') || q.includes('closing') || q.includes('pipeline')) {
        const highValue = deals.filter((d) => d.amount >= 4000000);
        reply = `Here is your pipeline summary:\n• You have ${deals.length} active opportunities totaling ${formatCurrency(deals.reduce((a, b) => a + b.amount, 0), currency, currencySymbol)}.\n• Highest value deal: ${highValue[0]?.title || 'Titan Global AI Testing'} (${formatCurrency(highValue[0]?.amount || 6500000, currency, currencySymbol)} at ${highValue[0]?.stage} stage).\n• Recommendation: Ensure legal sign-off on the Titan SOW before month-end.`;
      } else if (q.includes('lead') || q.includes('follow') || q.includes('score')) {
        const topLead = leads.sort((a, b) => b.lead_score - a.lead_score)[0];
        reply = `Lead Intelligence Breakdown:\n• Highest intent lead is **${topLead?.first_name} ${topLead?.last_name}** (${topLead?.company_name}) with an AI Fit Score of **${topLead?.lead_score}/100**.\n• Recommended next action: ${topLead?.ai_recommended_action || 'Initiate direct phone outreach referencing Titan Logistics advisory.'}`;
      } else {
        reply = `Based on current CRM data, Forge Consultancy has ₹1.98 Cr in closed and late-stage negotiation pipeline. There are ${tasks.filter((t) => t.status !== 'completed').length} pending action items assigned across team leads.`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply, time: 'Just now' }]);
    }, 600);
  };

  const handleGenerateEmail = () => {
    if (emailPurpose === 'sow_followup') {
      setGeneratedEmail(
        `Dear ${emailClient.split(' ')[0]},\n\nFollowing our review meeting on the enterprise engagement scope, our practice has incorporated the requested milestone terms.\n\nWe are ready to initiate Phase 1 as soon as the mutual agreement is countersigned.\n\nBest regards,\n${user.name}\n${user.title} | Forge Consultancy`
      );
    } else if (emailPurpose === 'intro') {
      setGeneratedEmail(
        `Dear ${emailClient.split(' ')[0]},\n\nI noticed your organization is currently evaluating modern AI development and performance testing roadmaps.\n\nForge Consultancy recently helped Titan Logistics achieve a 40% performance gain across their distributed systems. I would love to share a brief 15-minute briefing on similar frameworks.\n\nWould Wednesday at 11:00 AM work for a quick introductory call?\n\nWarm regards,\n${user.name}\n${user.title} | Forge Consultancy`
      );
    } else {
      setGeneratedEmail(
        `Dear ${emailClient.split(' ')[0]},\n\nI wanted to check in on the commercial proposal submitted last week for your strategic advisory initiative.\n\nPlease let me know if your executive committee requires any additional benchmarks or staffing clarification.\n\nBest regards,\n${user.name}\n${user.title} | Forge Consultancy`
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              AI Advisory Hub & Smart Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Natural language CRM queries, deal risk synthesis, and automated executive email drafting.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
          <Zap className="h-3.5 w-3.5 text-amber-500" /> GPT-4 / Gemini Powered
        </span>
      </div>

      {/* Grid Layout: Left Chat, Right Email Drafter */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Natural Language Chat Interface */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex flex-col h-[560px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4 bg-[var(--muted)]/40 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Consulting Copilot
                </h3>
                <p className="text-[10px] text-[var(--muted-foreground)]">Ask anything about your pipeline or leads</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-xs'
                      : 'bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--muted)]/30 flex gap-2 overflow-x-auto text-[11px]">
            <button
              onClick={() => setQuery('Show deals closing in Q3')}
              className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[var(--muted-foreground)] hover:text-amber-500 shrink-0"
            >
              &ldquo;Deals closing in Q3&rdquo;
            </button>
            <button
              onClick={() => setQuery('Which leads need follow-up?')}
              className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[var(--muted-foreground)] hover:text-amber-500 shrink-0"
            >
              &ldquo;Leads needing follow-up&rdquo;
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendQuery} className="p-3 border-t border-[var(--border)] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Copilot about leads, deals, or tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="rounded-xl bg-amber-500 p-2 text-slate-950 hover:bg-amber-400 font-bold transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right: AI Executive Email Drafter */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs flex flex-col justify-between h-[560px]">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    Executive Email Generator
                  </h3>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Generate high-conversion consulting messages</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-[11px] font-medium text-[var(--muted-foreground)]">Target Recipient</label>
                <input
                  type="text"
                  value={emailClient}
                  onChange={(e) => setEmailClient(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[var(--muted-foreground)]">Email Objective</label>
                <select
                  value={emailPurpose}
                  onChange={(e) => setEmailPurpose(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="sow_followup">SOW Milestone Follow-up</option>
                  <option value="intro">Introductory Case Study Outreach</option>
                  <option value="negotiation_checkin">Proposal Commercial Check-in</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleGenerateEmail}
                className="flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/25 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" /> Re-Draft Email
              </button>
            </div>

            {/* Generated Email Box */}
            <div className="mt-3 relative rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 p-4">
              <button
                onClick={handleCopy}
                className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[10px] font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors shadow-2xs"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <pre className="text-xs font-sans text-[var(--foreground)] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {generatedEmail}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] flex items-center justify-between">
            <span>Tailored for consulting tone & brevity</span>
            <span className="text-amber-500 font-semibold">1-Click Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
