import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, CheckCircle2, Circle, Clock, Plus, X, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface NotificationMessage {
  id: number;
  sender_name: string;
  content: string;
  created_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  notification_type: string;
  messages: NotificationMessage[];
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New States for Compose & Filter
  const [filter, setFilter] = useState('All');
  const [isComposing, setIsComposing] = useState(false);
  const [composeTitle, setComposeTitle] = useState('');
  const [composeMessage, setComposeMessage] = useState('');

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchNotifications = async () => {
    try {
      const endpoint = isAdminView 
        ? 'http://localhost:8000/api/users/notifications/?all=true'
        : 'http://localhost:8000/api/users/notifications/';
      const response = await axios.get(endpoint, { withCredentials: true });
      
      setNotifications(response.data);
      
      // Update selected notification or select the first one if none is selected
      setSelectedNotification(current => {
        if (current) {
          const updated = response.data.find((n: Notification) => n.id === current.id);
          return updated || current;
        }
        if (response.data.length > 0) {
          return response.data[0];
        }
        return null;
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      const endpoint = user?.is_superuser 
        ? `http://localhost:8000/api/users/notifications/${id}/mark_read/?all=true`
        : `http://localhost:8000/api/users/notifications/${id}/mark_read/`;
        
      await axios.post(endpoint, {}, { withCredentials: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      if (selectedNotification?.id === id) {
        setSelectedNotification({ ...selectedNotification, is_read: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedNotification) return;
    try {
      const endpoint = isAdminView 
        ? `http://localhost:8000/api/users/notifications/${selectedNotification.id}/reply/?all=true`
        : `http://localhost:8000/api/users/notifications/${selectedNotification.id}/reply/`;
        
      await axios.post(endpoint, {
        content: replyText
      }, { withCredentials: true });
      
      setReplyText('');
      toast.success('Reply sent!');
      fetchNotifications(); // Refresh to get the new message
    } catch (err) {
      toast.error('Failed to send reply');
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!composeTitle.trim() || !composeMessage.trim()) return;
    try {
      await axios.post('http://localhost:8000/api/users/notifications/', {
        title: composeTitle,
        message: composeMessage,
        notification_type: 'SYSTEM',
        user: user?.id
      }, { withCredentials: true });
      toast.success('Message sent successfully!');
      setComposeTitle('');
      setComposeMessage('');
      setIsComposing(false);
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    }
  };

  // Group identical notifications for all users to prevent inbox clutter
  const displayNotifications = (() => {
    const grouped = new Map<string, Notification & { groupCount?: number }>();
    const result: Array<Notification & { groupCount?: number }> = [];
    
    for (const n of notifications) {
      // If it has replies, it's an active thread, always show independently
      if (n.messages && n.messages.length > 0) {
        result.push(n);
        continue;
      }
      
      const sig = `${n.title.trim()}|${n.message.trim()}`;
      if (grouped.has(sig)) {
        const existing = grouped.get(sig);
        existing.groupCount = (existing.groupCount || 1) + 1;
      } else {
        const copy = { ...n, groupCount: 1 };
        grouped.set(sig, copy);
        result.push(copy);
      }
    }
    
    // Modify titles for grouped broadcasts
    return result.map(n => {
      if (n.groupCount > 1) {
        if (isAdminView) {
          return { ...n, title: `[Broadcast] ${n.title} (Sent to ${n.groupCount} users)` };
        } else {
          return { ...n, title: `${n.title} (${n.groupCount})` };
        }
      }
      return n;
    });
  })();

  const filteredNotifications = [...displayNotifications].filter(n => {
    if (filter === 'Unread') return !n.is_read;
    return true;
  }).sort((a, b) => {
    if (a.is_read === b.is_read) return 0;
    return a.is_read ? 1 : -1;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="h-auto md:h-full flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in-[0.98] duration-500">
      
      {/* INBOX LIST (Left Sidebar) */}
      <div className="w-full md:w-1/3 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm flex flex-col overflow-hidden h-[400px] md:h-full shrink-0">
        <div className="p-4 border-b border-white/50 bg-white/40 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell size={20} className="text-indigo-500" />
            Inbox
          </h2>
          <div className="flex items-center gap-2">
             <select 
               value={filter} 
               onChange={(e) => setFilter(e.target.value)}
               className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20"
             >
               <option value="All">All</option>
               <option value="Unread">Unread</option>
             </select>
             {!isAdminView && (
               <button onClick={() => { setIsComposing(true); setSelectedNotification(null); }} className="bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                 <Plus size={16} />
               </button>
             )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm font-medium">No notifications yet.</div>
          ) : (
            filteredNotifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => {
                  setIsComposing(false);
                  setSelectedNotification(notif);
                  if (!notif.is_read) handleMarkAsRead(notif.id);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  !isComposing && selectedNotification?.id === notif.id 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : notif.is_read 
                      ? 'hover:bg-white/80 text-slate-700' 
                      : 'bg-indigo-50 text-indigo-900 border border-indigo-100 hover:bg-indigo-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {notif.is_read ? <CheckCircle2 size={16} className={!isComposing && selectedNotification?.id === notif.id ? 'text-indigo-200' : 'text-slate-400'} /> : <Circle size={16} className="text-indigo-500 fill-indigo-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate text-sm">{notif.title}</h4>
                    <p className={`text-xs mt-1 line-clamp-2 ${!isComposing && selectedNotification?.id === notif.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <div className={`text-[10px] mt-2 flex items-center gap-1 font-bold ${!isComposing && selectedNotification?.id === notif.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      <Clock size={10} />
                      {new Date(notif.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* READING & REPLY PANE (Right Side) */}
      <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm flex flex-col overflow-hidden h-[500px] md:h-full">
        {isComposing ? (
           <div className="p-6 h-full flex flex-col bg-white/40">
             <div className="border-b border-white/50 pb-4 mb-4 flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-900">New Message</h2>
               <button onClick={() => { setIsComposing(false); if(notifications.length > 0) setSelectedNotification(notifications[0]); }} className="text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
             </div>
             <div className="space-y-5 flex-1">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Subject</label>
                 <input value={composeTitle} onChange={e => setComposeTitle(e.target.value)} type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" placeholder="What is this about?" />
               </div>
               <div className="flex-1 flex flex-col min-h-[200px]">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Message</label>
                 <div className="relative flex-1 flex flex-col">
                   <textarea value={composeMessage} onChange={e => setComposeMessage(e.target.value)} className="w-full flex-1 bg-white border border-slate-200 rounded-xl pl-4 pr-4 py-3 pb-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all" placeholder="Type your message here..."></textarea>
                   <button
                     onClick={() => {
                       const input = document.createElement('input');
                       input.type = 'file';
                       input.accept = 'image/*';
                       input.onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onloadend = () => {
                             const base64 = reader.result as string;
                             setComposeMessage(prev => prev + (prev ? '\n\n' : '') + `[ATTACHMENT:${file.name}:${base64}]`);
                           };
                           reader.readAsDataURL(file);
                         }
                       };
                       input.click();
                     }}
                     className="absolute bottom-3 left-3 text-slate-400 hover:text-indigo-500 transition-colors p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white shadow-sm"
                     title="Attach Image/Screenshot"
                   >
                     <Paperclip size={18} />
                   </button>
                 </div>
               </div>
             </div>
             <div className="pt-6 mt-2 border-t border-white/50 flex justify-end">
               <button onClick={handleSendMessage} disabled={!composeTitle.trim() || !composeMessage.trim()} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transform hover:-translate-y-0.5">
                 <Send size={18} /> Send Message
               </button>
             </div>
           </div>
        ) : selectedNotification ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/50 bg-white/40">
              <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedNotification.title}</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Clock size={12} />
                {new Date(selectedNotification.created_at).toLocaleString()}
              </div>
            </div>

            {/* Thread History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {/* Original Notification Message */}
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="flex items-center gap-2 mb-1 pl-1">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">System</span>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl rounded-tl-sm text-slate-700 text-sm leading-relaxed">
                  {selectedNotification.message.split(/(\[ATTACHMENT:[^:]+:data:image\/[^;]+;base64,[^\]]+\])/).map((part, idx) => {
                    if (part.startsWith('[ATTACHMENT:')) {
                      const match = part.match(/\[ATTACHMENT:([^:]+):(.+)\]/);
                      if (match) {
                        return (
                          <div key={idx} className="mt-2 mb-2">
                            <div className="text-xs opacity-70 mb-1 font-mono">{match[1]}</div>
                            <img src={match[2]} alt={match[1]} className="max-w-full h-auto rounded-lg shadow-sm border border-black/10 max-h-[300px] object-contain bg-white/10" />
                          </div>
                        );
                      }
                    }
                    return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
                  })}
                </div>
              </div>

              {/* Replies */}
              {[...(selectedNotification.messages || [])].reverse().map(msg => {
                const isMe = msg.sender_name === user?.username;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isMe ? 'ml-auto' : ''} max-w-[80%]`}>
                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'pr-1' : 'pl-1'}`}>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{msg.sender_name}</span>
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                    }`}>
                      {msg.content.split(/(\[ATTACHMENT:[^:]+:data:image\/[^;]+;base64,[^\]]+\])/).map((part, idx) => {
                        if (part.startsWith('[ATTACHMENT:')) {
                          const match = part.match(/\[ATTACHMENT:([^:]+):(.+)\]/);
                          if (match) {
                            return (
                              <div key={idx} className="mt-2 mb-2">
                                <div className="text-xs opacity-70 mb-1 font-mono">{match[1]}</div>
                                <img src={match[2]} alt={match[1]} className="max-w-full h-auto rounded-lg shadow-sm border border-black/10 max-h-[300px] object-contain bg-white/10" />
                              </div>
                            );
                          }
                        }
                        return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <div className="p-4 bg-white/40 border-t border-white/50">
              <div className="flex gap-2">
                <div className="relative flex-1 flex items-center">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    placeholder="Type a reply..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            setReplyText(prev => prev + (prev ? ' ' : '') + `[ATTACHMENT:${file.name}:${base64}]`);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="absolute left-3 text-slate-400 hover:text-indigo-500 transition-colors p-1"
                    title="Attach Image/Screenshot"
                  >
                    <Paperclip size={18} />
                  </button>
                </div>
                <button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="bg-indigo-600 text-white px-5 rounded-xl font-bold flex items-center justify-center transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Bell size={48} className="mb-4 opacity-20" />
            <p className="font-medium text-sm">Select a notification to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
