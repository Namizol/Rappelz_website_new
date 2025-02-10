import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, HelpCircle, Book, Send, Loader2, ChevronDown, Lock, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import { LoadingSpinner } from './LoadingSpinner';

interface SupportTicket {
  subject: string;
  message: string;
  category: 'technical' | 'account' | 'billing' | 'gameplay';
}

export function SupportPage({ language, onOpenAuth }: { language: string; onOpenAuth: () => void }) {
  const { t } = useTranslation(language);
  const { user } = useAuth();
  const { tickets, loading, createTicket, fetchUserTickets } = useTickets(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState<SupportTicket>({
    subject: '',
    message: '',
    category: 'technical',
  });

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('supportAccessRestricted')}</h2>
          <p className="text-gray-400 mb-6">{t('pleaseLoginToAccessSupport')}</p>
          <button
            onClick={onOpenAuth}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            {t('signInToAccess')}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createTicket(
        newTicket.subject,
        newTicket.message,
        newTicket.category
      );

      if (result.success) {
        setNewTicket({
          subject: '',
          message: '',
          category: 'technical',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">{t('supportCenter')}</h1>
          <p className="text-xl text-gray-300">{t('supportDescription')}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <QuickLink
              icon={<MessageCircle />}
              title={t('submitTicket')}
              description={t('submitTicketDesc')}
            />
            <QuickLink
              icon={<Book />}
              title={t('knowledgeBase')}
              description={t('knowledgeBaseDesc')}
            />
            <QuickLink
              icon={<HelpCircle />}
              title={t('faq')}
              description={t('faqDesc')}
            />
          </div>

          {/* Existing Tickets */}
          {loading ? (
            <div className="flex justify-center my-8">
              <LoadingSpinner size={40} />
            </div>
          ) : tickets.length > 0 ? (
            <div className="bg-black/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-yellow-500/10">
              <h2 className="text-2xl font-bold mb-6">{t('yourTickets')}</h2>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-black/30 rounded-lg p-6 border border-yellow-500/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{ticket.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' :
                            ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTicket(activeTicket === ticket.id ? null : ticket.id)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${
                          activeTicket === ticket.id ? 'rotate-180' : ''
                        }`} />
                      </button>
                    </div>

                    {activeTicket === ticket.id && (
                      <div className="space-y-4">
                        <div className="bg-black/30 rounded p-4">
                          <p className="text-gray-300">{ticket.message}</p>
                        </div>
                        {ticket.admin_response && (
                          <div className="bg-yellow-500/5 rounded p-4 border border-yellow-500/10">
                            <p className="text-sm font-medium text-yellow-500 mb-2">{t('adminResponse')}</p>
                            <p className="text-gray-300">{ticket.admin_response}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* New Ticket Form */}
          <div className="bg-black/50 rounded-2xl p-8 backdrop-blur-sm border border-yellow-500/10">
            <h2 className="text-2xl font-bold mb-6">{t('submitNewTicket')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-yellow-500/10 rounded-lg opacity-75 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  {t('category')}
                </label>
                <select
                  id="category"
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as SupportTicket['category'] })}
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="technical">{t('technical')}</option>
                  <option value="account">{t('account')}</option>
                  {/* <option value="billing">{t('billing')}</option>*/}
                  <option value="gameplay">{t('gameplay')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t('subject')}
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={t('enterSubject')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('message')}
                </label>
                <textarea
                  id="message"
                  required
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-32 resize-none"
                  placeholder={t('enterMessage')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('submitTicket')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-black/50 p-6 rounded-xl border border-yellow-500/10 hover:border-yellow-500/30 transition-all">
      <div className="text-yellow-500 mb-4 w-12 h-12">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}