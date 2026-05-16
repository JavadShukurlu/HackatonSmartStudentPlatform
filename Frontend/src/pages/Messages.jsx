import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { mockConversations } from '../api/mockData';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/formatters';

/** Messages page — split-panel Chat UI with conversation list and message thread. */
const Messages = () => {
  const { user } = useAuth();
  const [loading, setLoading]   = useState(true);
  const [convos, setConvos]     = useState([]);
  const [active, setActive]     = useState(null);
  const [text, setText]         = useState('');
  const bottomRef               = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConvos(mockConversations.map((c) => ({ ...c, messages: [...c.messages] })));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (active) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active, convos]);

  const activeConvo = convos.find((c) => c.id === active);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || !active) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id === active
          ? {
              ...c,
              lastMessage: trimmed,
              lastAt: new Date().toISOString(),
              messages: [
                ...c.messages,
                { id: `msg_${Date.now()}`, from: 'me', text: trimmed, at: new Date().toISOString() },
              ],
            }
          : c
      )
    );
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const markRead = (id) =>
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));

  const selectConvo = (id) => {
    setActive(id);
    markRead(id);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Messages</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Chat with students and teachers.</p>
      </div>

      <div className="card overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* ── Left panel: conversation list ── */}
        <div className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-3 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : convos.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No conversations" description="No messages yet." />
            ) : (
              <ul>
                {convos.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => selectConvo(c.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition
                        ${active === c.id
                          ? 'bg-brand-50 dark:bg-brand-500/10 border-r-2 border-brand-500'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar name={c.user.fullName} size="sm" />
                        {c.unread && (
                          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${c.unread ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'}`}>
                          {c.user.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{c.lastMessage}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Right panel: message thread ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {!active ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a conversation from the list to start chatting."
              />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-800">
                <Avatar name={activeConvo?.user.fullName ?? ''} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {activeConvo?.user.fullName}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{activeConvo?.user.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {activeConvo?.messages.map((msg) => {
                  const isMe = msg.from === 'me';
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && <Avatar name={activeConvo.user.fullName} size="sm" />}
                      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <p className="text-[10px] text-slate-400 px-1">{formatDateTime(msg.at)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
                <input
                  className="input-base"
                  placeholder="Type a message… (Enter to send)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button
                  onClick={send}
                  disabled={!text.trim()}
                  className="shrink-0 grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white
                             hover:bg-brand-700 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
