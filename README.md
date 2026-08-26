# Support CRM

This is a Support CRM built with Next.js 14, Tailwind CSS, and Supabase for the Datastraw "AI + Tech Intern" assessment.

## Tech Stack
- **Frontend & API**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Supabase
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
4. Run the following SQL script in your Supabase SQL editor to create the database schema:

```sql
create sequence if not exists ticket_seq start 1;

create table tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_id text unique not null default ('TKT-' || lpad(nextval('ticket_seq')::text, 3, '0')),
  customer_name text not null,
  customer_email text not null,
  subject text not null,
  description text not null,
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Closed')),
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  due_by timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  note_text text not null,
  created_at timestamptz not null default now()
);
```

5. Run `npm run dev` to start the development server.

## API Endpoints

- `POST /api/tickets`: Create a new ticket. Computes SLA (`due_by`) based on priority.
- `GET /api/tickets`: Retrieve all tickets. Supports `status`, `priority`, and `search` query parameters. Computes `overdue` status.
- `GET /api/tickets/[ticketId]`: Retrieve a specific ticket and its notes.
- `PUT /api/tickets/[ticketId]`: Update a ticket's status or add a new note.
