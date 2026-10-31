# 🎫 Support CRM

A full-stack customer support ticketing system. Support agents can create tickets, set a priority, search and filter the queue, update ticket status and keep internal notes on every ticket.

🔗 **Live Demo:** [https://support-crm-1ths-69fdkdes9-srishty-kumaris-projects.vercel.app/](https://support-crm-1ths-69fdkdes9-srishty-kumaris-projects.vercel.app/)

---

## ✨ Features

- 🎟️ Create tickets with customer name, email, subject, description and priority
- ⏱️ Automatic SLA deadline based on priority: **High = 4 hours, Medium = 24 hours, Low = 72 hours**
- 🚨 Tickets that pass their deadline without being closed are flagged as **overdue**
- 🔄 Ticket status workflow: **Open → In Progress → Closed**
- 🔍 Search by customer name, email, ticket ID or subject
- 🎛️ Filter the ticket list by status and priority
- 📝 Add notes to a ticket and view its full history on the ticket page

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| Utilities | date-fns, Lucide React |
| Deployment | Vercel |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets` | Create a ticket and calculate its SLA deadline (`due_by`) from priority |
| `GET` | `/api/tickets` | List tickets. Supports `status`, `priority` and `search` query parameters and returns an `overdue` flag |
| `GET` | `/api/tickets/[ticketId]` | Get one ticket along with its notes |
| `PUT` | `/api/tickets/[ticketId]` | Update a ticket's status or add a note |

## 🗄️ Database Schema

Run this SQL in the Supabase SQL editor:

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

## 🚀 Run Locally

```bash
git clone https://github.com/srishty02/support-crm.git
cd support-crm
npm install
```

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Start the development server:

```bash
npm run dev
```

## 👩‍💻 Author

**Srishty Kumari**
[LinkedIn](https://www.linkedin.com/in/srishty-kumari-14b56b272/) · [GitHub](https://github.com/srishty02) · srishty0208@gmail.com
