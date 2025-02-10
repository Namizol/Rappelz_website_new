import { useState } from 'react';
import { supabase } from '../lib/supabase';
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

export function useTickets(userId?: string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTickets = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: ticketsError } = await supabase
        .from('ticket_details')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tickets';
      console.error('Error fetching tickets:', message);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: ticketsError } = await supabase
        .from('ticket_details')
        .select('*')
        .order('status', { ascending: true })
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tickets';
      console.error('Error fetching tickets:', message);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (subject: string, message: string, category: Ticket['category']) => {
    if (!userId) {
      const error = 'User ID is required';
      toast.error(error);
      return { success: false, error };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: userId,
          subject,
          message,
          category,
          status: 'open'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state
      setTickets(prev => [data, ...prev]);
      
      toast.success('Ticket created successfully');
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create ticket';
      console.error('Error creating ticket:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status'], adminResponse: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('support_tickets')
        .update({
          status,
          admin_response: adminResponse,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...data } : ticket
      ));

      toast.success('Ticket updated successfully');
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update ticket';
      console.error('Error updating ticket:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId);

      if (deleteError) throw deleteError;

      // Update local state
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));

      toast.success('Ticket deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete ticket';
      console.error('Error deleting ticket:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return {
    tickets,
    loading,
    error,
    fetchUserTickets,
    fetchAllTickets,
    createTicket,
    updateTicketStatus,
    deleteTicket,
  };
}