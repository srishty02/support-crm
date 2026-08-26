import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { addHours } from 'date-fns';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, subject, description, priority = 'Medium' } = body;

    let hoursToAdd = 24;
    if (priority === 'High') hoursToAdd = 4;
    if (priority === 'Low') hoursToAdd = 72;
    
    const due_by = addHours(new Date(), hoursToAdd).toISOString();

    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        customer_name,
        customer_email,
        subject,
        description,
        priority,
        due_by,
        status: 'Open'
      }])
      .select('ticket_id, created_at, due_by')
      .single();

    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const priority = searchParams.get('priority');

    let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }
    if (priority && priority !== 'All') {
      query = query.eq('priority', priority);
    }
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,ticket_id.ilike.%${search}%,customer_email.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    const now = new Date();
    const tickets = data.map(ticket => ({
      ...ticket,
      overdue: ticket.status !== 'Closed' && new Date(ticket.due_by) < now
    }));

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
