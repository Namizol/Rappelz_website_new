import React, { useState, useEffect } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useTranslation } from '../hooks/useTranslation';
import { MessageSquare, Clock, User, CheckCircle, XCircle, Loader2, Filter, Send, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: 'technical' | 'account' | 'billing' | 'gameplay';
  status: 'open' | 'in_progress' | 'closed';
  admin_response: string | null;
  created_at: string;
  updated_at: string | null;
  user_email?: string;
}

export function AdminTickets({ language }: { language: string }) {
  const { t } = useTranslation(language);
  const { tickets, loading, fetchAllTickets, updateTicketStatus, deleteTicket } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, newStatus: 'in_progress' | 'closed') => {
    if (!adminResponse.trim()) {
      toast.error('Please provide a response before updating the ticket');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateTicketStatus(ticketId, newStatus, adminResponse);
      if (result.success) {
        toast.success(`Ticket ${newStatus === 'in_progress' ? 'marked in progress' : 'closed'} successfully`);
        setSelectedTicket(null);
        setAdminResponse('');
        await fetchAllTickets();
      } else {
        toast.error(result.error || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResponse = async (ticketId: string) => {
    if (!adminResponse.trim()) {
      toast.error('Please provide a response before sending');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) throw new Error('Ticket not found');

      const result = await updateTicketStatus(
        ticketId,
        ticket.status === 'open' ? 'in_progress' : ticket.status,
        adminResponse
      );

      if (result.success) {
        toast.success('Response sent successfully');
        setSelectedTicket(null);
        setAdminResponse('');
        await fetchAllTickets();
      } else {
        toast.error(result.error || 'Failed to send response');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteTicket(ticketId);
      if (result.success) {
        toast.success('Ticket deleted successfully');
        if (selectedTicket === ticketId) {
          setSelectedTicket(null);
          setAdminResponse('');
        }
      } else {
        toast.error(result.error || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const handleSelectTicket = (ticketId: string, currentResponse: string | null) => {
    setSelectedTicket(ticketId);
    setAdminResponse(currentResponse || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-black/30 border border-yellow-500/10 rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-black/30 rounded-lg p-6 border border-yellow-500/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{ticket.subject}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {ticket.user_email}
                  </span>
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
                  <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-500">
                    {ticket.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteTicket(ticket.id)}
                  className="text-red-500 hover:text-red-400 transition p-2"
                  title="Delete ticket"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/20 rounded p-4">
                <p className="text-gray-300">{ticket.message}</p>
              </div>

              {ticket.admin_response && (
                <div className="bg-yellow-500/5 rounded p-4 border border-yellow-500/10">
                  <p className="text-sm font-medium text-yellow-500 mb-2">Admin Response</p>
                  <p className="text-gray-300">{ticket.admin_response}</p>
                </div>
              )}

              {selectedTicket === ticket.id ? (
                <div className="space-y-4">
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full px-4 py-3 bg-black/30 border border-yellow-500/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-32 resize-none"
                  />
                  <div className="flex flex-wrap gap-2">
                    {/* Send Response Button */}
                    <button
                      onClick={() => handleSendResponse(ticket.id)}
                      disabled={isSubmitting || !adminResponse.trim()}
                      className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Send Response
                    </button>

                    {ticket.status !== 'closed' && (
                      <>
                        {ticket.status === 'open' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                            disabled={isSubmitting || !adminResponse.trim()}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <MessageSquare className="w-4 h-4" />
                            )}
                            Mark In Progress
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                          disabled={isSubmitting || !adminResponse.trim()}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Close Ticket
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedTicket(null);
                        setAdminResponse('');
                      }}
                      className="text-gray-400 hover:text-white transition px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                ticket.status !== 'closed' && (
                  <button
                    onClick={() => handleSelectTicket(ticket.id, ticket.admin_response)}
                    className="text-yellow-500 hover:text-yellow-400 transition flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {ticket.admin_response ? 'Update Response' : 'Respond'}
                  </button>
                )
              )}
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No tickets found
          </div>
        )}
      </div>
    </div>
  );
}