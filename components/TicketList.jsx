'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import PriorityBadge from './PriorityBadge';
import SearchBar from './SearchBar';
import StatusFilter from './StatusFilter';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'All') params.append('status', status);

      try {
        const res = await fetch(`/api/tickets?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-96 flex gap-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="w-full sm:w-48 flex gap-4 items-center">
          <StatusFilter value={status} onChange={setStatus} />
          <Link href="/tickets/new" className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            + New Ticket
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No tickets found.</div>
      ) : (
        <>
          <div className="hidden sm:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-blue-600 sm:pl-6">
                      <Link href={`/tickets/${ticket.ticket_id}`}>{ticket.ticket_id}</Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{ticket.subject}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.customer_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <PriorityBadge priority={ticket.priority} />
                      {ticket.overdue && (
                        <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white shadow rounded-lg p-4 flex flex-col space-y-3 border border-gray-200">
                <div className="flex justify-between items-start">
                  <Link href={`/tickets/${ticket.ticket_id}`} className="text-sm font-medium text-blue-600">
                    {ticket.ticket_id}
                  </Link>
                  <span className="text-xs text-gray-500">{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                <div className="text-sm text-gray-500">{ticket.customer_name}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                    {ticket.status}
                  </span>
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.overdue && (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
