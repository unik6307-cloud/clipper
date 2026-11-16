'use client';

import React, { useState } from 'react';
import { Send, MessageSquare, ShieldCheck, User } from 'lucide-react';

export default function CreatorMessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Jordan Rivera (Lead Video Editor)',
      role: 'PRODUCTION_TEAM',
      text: 'Hi Sarah! We have finished formatting the first two clips from Ep 42 with kinetic typography overlays. Please check the Studio preview.',
      time: 'Yesterday at 3:45 PM',
    },
    {
      id: 'm2',
      sender: 'Taylor Brooks (Quality Reviewer)',
      role: 'QA_TEAM',
      text: 'Audio normalization meets strict -14 LUFS standard and speech transcriptions have been verified 100% accurate. Ready for your sign-off.',
      time: 'Yesterday at 5:12 PM',
    },
    {
      id: 'm3',
      sender: 'Sarah Lin (You)',
      role: 'CREATOR',
      text: 'Thanks Jordan and Taylor! Just approved Clip 1 and committed placement to @TechSparks on YouTube Shorts.',
      time: 'Today at 10:15 AM',
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        id: `m_${Date.now()}`,
        sender: 'Sarah Lin (You)',
        role: 'CREATOR',
        text: input,
        time: 'Just now',
      },
    ]);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Communications</h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct scoped communications between your organization and the Clipper production & QA team.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[520px] overflow-hidden">
        {/* Messages Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Campaign: Episode 42 AI Infrastructure</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">Production Channel</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => {
            const isMe = m.role === 'CREATOR';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-lg ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isMe
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-300'
                  }`}
                >
                  {m.sender[0]}
                </div>
                <div className="space-y-1">
                  <div className={`text-[10px] text-slate-400 ${isMe ? 'text-right' : ''}`}>
                    <span className="font-semibold text-slate-300 mr-2">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to the internal production & QA team..."
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
