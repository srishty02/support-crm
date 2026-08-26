'use client';

import { useState } from 'react';
import { format } from 'date-fns';

export default function NotesThread({ ticketId, notes: initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNote.trim() })
      });

      if (!res.ok) throw new Error('Failed to add note');
      
      // Optimistically add note to UI
      const optimisticNote = {
        id: crypto.randomUUID(),
        note_text: newNote.trim(),
        created_at: new Date().toISOString()
      };
      
      setNotes([...notes, optimisticNote]);
      setNewNote('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notes & History</h3>
      
      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No notes yet.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">{note.note_text}</div>
              <div className="mt-2 text-xs text-gray-500">
                {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddNote} className="mt-6">
        <label htmlFor="note" className="sr-only">Add a note</label>
        <div className="mt-1">
          <textarea
            id="note"
            name="note"
            rows={3}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
            placeholder="Type your note here..."
          />
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={loading || !newNote.trim()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  );
}
