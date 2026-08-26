'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import PriorityBadge from '@/components/PriorityBadge';
import NotesThread from '@/components/NotesThread';

export default function TicketDetail() {
  const params = useParams();
  const ticketId = params.ticketId;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`);
        if (!res.ok) throw new Error('Ticket not found');
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="text-center py-12 text-red-500">Ticket not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          &larr; Back to Tickets
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {ticket.ticket_id}: {ticket.subject}
              </h3>
              <PriorityBadge priority={ticket.priority} />
              {ticket.overdue && (
                <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 border border-red-200">
                  Overdue
                </span>
              )}
            </div>
            <p className="max-w-2xl text-sm text-gray-500">
              Created on {format(new Date(ticket.created_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status:</label>
            <select
              id="status"
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="text-sm border-gray-300 rounded-md py-1 pl-2 pr-8 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.customer_name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.customer_email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">SLA Due By</dt>
              <dd className="mt-1 text-sm text-gray-900">{format(new Date(ticket.due_by), 'MMM d, yyyy h:mm a')}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">{format(new Date(ticket.updated_at), 'MMM d, yyyy h:mm a')}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{ticket.description}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <NotesThread ticketId={ticket.ticket_id} notes={ticket.notes} />
        </div>
      </div>
    </main>
  );
}
