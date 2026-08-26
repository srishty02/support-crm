import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { ticketId } = params;

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_id', ticketId)
      .single();

    if (ticketError) throw ticketError;

    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true });

    if (notesError) throw notesError;

    const now = new Date();
    return NextResponse.json({
      ...ticket,
      overdue: ticket.status !== 'Closed' && new Date(ticket.due_by) < now,
      notes: notes || []
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { ticketId } = params;
    const body = await request.json();
    const { status, notes } = body;

    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('id')
      .eq('ticket_id', ticketId)
      .single();

    if (fetchError) throw fetchError;

    const updated_at = new Date().toISOString();

    if (status) {
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ status, updated_at })
        .eq('id', ticket.id);
      
      if (updateError) throw updateError;
    }

    if (notes) {
      const { error: noteError } = await supabase
        .from('notes')
        .insert([{
          ticket_id: ticket.id,
          note_text: notes
        }]);
        
      if (noteError) throw noteError;
    }

    return NextResponse.json({ success: true, updated_at });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
