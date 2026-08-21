import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  Bot, 
  ArrowRight, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  ShieldCheck,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { safeFetchJson } from '../src/utils/safeApi';

interface ChatMessage {
  id?: string;
  sender: 'visitor' | 'admin' | 'bot';
  senderName?: string;
  content: string;
  timestamp: string;
}

interface PreChatFormData {
  name: string;
  phone: string;
  email: string;
  description: string;
}

export const AIChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminOnline, setAdminOnline] = useState<boolean>(true);

  // Pre-chat form fields
  const [formData, setFormData] = useState<PreChatFormData>({
    name: '',
    phone: '',
    email: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Check admin presence status
  useEffect(() => {
    const checkPresence = async () => {
      try {
        const data = await safeFetchJson<any>('/api/live-chats/presence');
        if (data) {
          setAdminOnline(data.isOnline ?? true);
        }
      } catch {}
    };
    checkPresence();
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('openSalesChat', handleOpenChat);
    return () => window.removeEventListener('openSalesChat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && !hasStartedChat && !isMinimized) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, hasStartedChat, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (hasStartedChat) {
      scrollToBottom();
    }
  }, [messages, isLoading, hasStartedChat]);

  // Poll for admin replies if session exists
  useEffect(() => {
    if (!sessionId || !hasStartedChat) return;

    const interval = setInterval(async () => {
      try {
        const data = await safeFetchJson<any>(`/api/live-chats/${sessionId}`);
        if (data && data.messages && Array.isArray(data.messages)) {
          const mapped: ChatMessage[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender || 'visitor',
            senderName: m.senderName,
            content: m.content,
            timestamp: m.timestamp || new Date().toISOString()
          }));

          // Only update if message count differs
          setMessages(prev => {
            if (prev.length !== mapped.length) {
              return mapped;
            }
            return prev;
          });
        }
      } catch (err) {
        // silent fail on poll
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, hasStartedChat]);

  // Handle server-side Gemini AI response generation as assistant
  const generateAIResponse = async (userMessage: string, currentHistory: ChatMessage[], userLeadData: PreChatFormData, currentChatId?: string) => {
    setIsLoading(true);
    try {
      if (currentChatId) {
        const botReply = await safeFetchJson<any>(`/api/live-chats/${currentChatId}/assistant-reply`, {
          method: 'POST',
          body: JSON.stringify({ message: userMessage })
        });
        if (botReply && botReply.content) {
          const newBotMsg: ChatMessage = {
            id: botReply.id,
            sender: 'bot',
            senderName: botReply.senderName || 'Academic AI Assistant',
            content: botReply.content,
            timestamp: botReply.timestamp || new Date().toISOString()
          };
          setMessages(prev => [...prev, newBotMsg]);
          return;
        }
      }

      // Fallback message
      const fallbackMsg: ChatMessage = {
        sender: 'bot',
        senderName: 'Academic AI Assistant',
        content: `Thank you for reaching out, ${userLeadData.name || 'Author'}. Our editorial team has received your message and will assist you shortly. You can also explore our Author Guidelines or submit your manuscript directly at /submit.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const fallbackMsg: ChatMessage = {
        sender: 'bot',
        senderName: 'Support Assistant',
        content: "Thank you for your message. Our editorial support team has received your inquiry and will reply directly in this window or via your email.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };


  // Submit Pre-Chat Form and Begin Chat
  const handleBeginChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setFormErrors({ name: 'Please enter your name to begin chat.' });
      return;
    }

    setFormErrors({});
    setHasStartedChat(true);

    const greetingMessage = `Hello ${trimmedName}! I'm the Academic Publishing Support Representative. How can I assist you with your manuscript, journal hosting, or author submission today?`;

    const initialMessages: ChatMessage[] = [{
      sender: 'bot',
      senderName: 'Support Representative',
      content: greetingMessage,
      timestamp: new Date().toISOString()
    }];

    // Create session in backend
    let activeChatId: string | null = null;
    try {
      const data = await safeFetchJson<any>('/api/live-chats', {
        method: 'POST',
        body: JSON.stringify({
          visitorName: trimmedName,
          visitorEmail: formData.email.trim(),
          visitorPhone: formData.phone.trim(),
          initialDescription: formData.description.trim(),
          pageUrl: window.location.pathname,
          pageTitle: document.title
        })
      });

      if (data && data.session?.id) {
        activeChatId = data.session.id;
        setSessionId(activeChatId);
      }
    } catch (err) {
      console.error('Error creating live chat backend session:', err);
    }

    if (formData.description.trim()) {
      const initialUserInquiry = formData.description.trim();
      const updatedMessages: ChatMessage[] = [
        ...initialMessages,
        {
          sender: 'visitor',
          senderName: trimmedName,
          content: initialUserInquiry,
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(updatedMessages);

      // Send initial description as visitor message to backend
      if (activeChatId) {
        safeFetchJson(`/api/live-chats/${activeChatId}/messages`, {
          method: 'POST',
          body: JSON.stringify({
            sender: 'visitor',
            senderName: trimmedName,
            content: initialUserInquiry
          })
        }).catch(() => {});
      }

      generateAIResponse(initialUserInquiry, initialMessages, formData, activeChatId || undefined);
    } else {
      setMessages(initialMessages);
    }
  };

  // Send a new message during active chat
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMsg: ChatMessage = {
      sender: 'visitor',
      senderName: formData.name.trim() || 'Visitor',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    // Post to backend live chat session
    if (sessionId) {
      safeFetchJson(`/api/live-chats/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          sender: 'visitor',
          senderName: formData.name.trim() || 'Visitor',
          content: userMessage
        })
      }).catch(() => {});
    }

    await generateAIResponse(userMessage, messages, formData, sessionId || undefined);
  };

  // Reset chat session to pre-chat form
  const handleResetChat = () => {
    setHasStartedChat(false);
    setSessionId(null);
    setMessages([]);
    setInput('');
    setFormErrors({});
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden mb-4 flex flex-col transition-all duration-300 ${
              isMinimized ? 'w-72 h-14' : 'w-[410px] h-[620px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)]'
            }`}
          >
            {/* Header */}
            <div className="bg-brand-navy p-4 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-brand-action rounded-full shrink-0">
                  <Headphones size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-tight truncate">
                    {hasStartedChat && formData.name.trim() 
                      ? `Representative (${formData.name.trim()})` 
                      : 'Live Editorial Support'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${adminOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
                    <span className="text-[10px] text-white/70 uppercase font-black tracking-widest font-mono">
                      {adminOnline ? 'Editorial Support Online' : 'AI Assistant Active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {hasStartedChat && !isMinimized && (
                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded transition-colors cursor-pointer"
                    title="Start New Inquiry"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded transition-colors cursor-pointer"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded transition-colors cursor-pointer"
                  title="Close Chat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Content area - hidden when minimized */}
            {!isMinimized && (
              <>
                {/* PRE-CHAT INQUIRY FORM (Shown before chat begins) */}
                {!hasStartedChat ? (
                  <div className="flex-grow overflow-y-auto p-6 bg-slate-50 flex flex-col justify-between">
                    <div>
                      {/* Top Prompt Instruction */}
                      <div className="mb-5 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-brand-navy font-bold text-sm mb-1">
                          <MessageSquare size={16} className="text-brand-action" />
                          <span>Start a Live Conversation</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Fields marked with an <span className="text-red-500 font-bold">*</span> are required.
                        </p>
                      </div>

                      {/* Inquiry Form */}
                      <form id="pre-chat-form" onSubmit={handleBeginChat} className="space-y-4">
                        {/* NAME * */}
                        <div>
                          <label className="block text-[11px] font-black text-brand-navy uppercase tracking-wider mb-1.5">
                            NAME <span className="text-red-500 font-bold">*</span>
                          </label>
                          <input
                            ref={nameInputRef}
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (formErrors.name) setFormErrors({});
                            }}
                            placeholder="Enter your name"
                            className={`w-full bg-white border ${
                              formErrors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand-action'
                            } rounded px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-action/20 transition-all font-medium`}
                            required
                          />
                          {formErrors.name && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">{formErrors.name}</p>
                          )}
                        </div>

                        {/* PHONE */}
                        <div>
                          <label className="block text-[11px] font-black text-brand-navy uppercase tracking-wider mb-1.5">
                            PHONE
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter your phone number"
                            className="w-full bg-white border border-slate-300 focus:border-brand-action rounded px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-action/20 transition-all font-medium"
                          />
                        </div>

                        {/* EMAIL */}
                        <div>
                          <label className="block text-[11px] font-black text-brand-navy uppercase tracking-wider mb-1.5">
                            EMAIL
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full bg-white border border-slate-300 focus:border-brand-action rounded px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-action/20 transition-all font-medium"
                          />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                          <label className="block text-[11px] font-black text-brand-navy uppercase tracking-wider mb-1.5">
                            DESCRIPTION
                          </label>
                          <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your inquiry..."
                            className="w-full bg-white border border-slate-300 focus:border-brand-action rounded px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-action/20 transition-all font-medium resize-none leading-relaxed"
                          />
                        </div>
                      </form>
                    </div>

                    {/* Begin Chat Submit Button */}
                    <div className="pt-4 border-t border-slate-200 mt-4">
                      <button
                        type="submit"
                        form="pre-chat-form"
                        className="w-full py-3 bg-brand-action hover:bg-brand-navy text-white font-bold text-xs uppercase tracking-widest rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>Begin Chat</span>
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-2.5">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span>Confidential scholarly inquiry support</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ACTIVE LIVE CHAT VIEW */
                  <>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50">
                      {messages.map((m, i) => {
                        const isUser = m.sender === 'visitor';
                        const isAdmin = m.sender === 'admin';
                        const isBot = m.sender === 'bot';

                        return (
                          <motion.div
                            initial={{ opacity: 0, x: isUser ? 10 : -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={m.id || i}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                isUser 
                                  ? 'bg-brand-action text-white' 
                                  : isAdmin 
                                  ? 'bg-brand-navy text-brand-action' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {isUser ? <User size={13} /> : isAdmin ? <ShieldCheck size={13} /> : <Sparkles size={13} />}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 mb-0.5 px-0.5">
                                  <span className="text-[10px] font-bold text-gray-700">
                                    {isUser ? 'You' : isAdmin ? `${m.senderName || 'Editorial Support'} (Admin)` : 'AI Assistant'}
                                  </span>
                                  {isAdmin && (
                                    <span className="inline-flex items-center gap-0.5 px-1 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                      <CheckCircle2 size={8} /> Verified Staff
                                    </span>
                                  )}
                                </div>
                                <div className={`p-3 rounded shadow-xs text-xs leading-relaxed ${
                                  isUser 
                                    ? 'bg-brand-navy text-white rounded-tr-none' 
                                    : isAdmin
                                    ? 'bg-white border-2 border-brand-action/40 text-brand-navy font-medium rounded-tl-none'
                                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                }`}>
                                  {m.content}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-2.5 max-w-[85%] items-center">
                            <div className="w-7 h-7 rounded-full bg-brand-navy text-brand-action flex items-center justify-center animate-pulse">
                              <Sparkles size={13} />
                            </div>
                            <div className="p-2.5 bg-white border border-slate-200 rounded shadow-xs">
                              <Loader2 size={15} className="animate-spin text-brand-action" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-4 bg-white border-t border-slate-100">
                      <div className="mb-2.5 flex flex-wrap gap-1">
                        {["Talk to editor", "Open Access APCs", "Submit Manuscript", "Review Status"].map(tag => (
                          <button 
                            key={tag}
                            type="button"
                            onClick={() => setInput(tag)}
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 hover:bg-brand-action hover:text-white rounded transition-all cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <textarea
                          rows={2}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder="Type your question..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs pr-11 focus:outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action/20 transition-all resize-none font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={!input.trim() || isLoading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-action text-white rounded hover:bg-brand-navy transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title="Send Message"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="flex items-center gap-3 bg-brand-navy text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-brand-action transition-all group border-2 border-white cursor-pointer"
        title="Open Live Chat"
      >
        <div className="relative">
          <MessageSquare size={22} />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-action rounded-full border-2 border-brand-navy"></div>
        </div>
        <span className="font-bold text-xs tracking-wide">Live Chat</span>
      </motion.button>
    </div>
  );
};
