✈️ Travel Itinerary Maker

A modern, full-stack web application to create, manage, and download professional travel itineraries as PDF. Built with a focus on SaaS-level UI/UX, featuring glassmorphism effects, interactive dashboards, and instant PDF generation.


🚀 Tech Stack

| Category          | Technology                           |
| ----------------- | ------------------------------------ |
| **Frontend**      | React 19 (Vite)                      |
| **Styling**       | Tailwind CSS v4 (Modern Flex & Grid) |
| **Icons**         | Lucide React                         |
| **Notifications** | React Hot Toast                      |
| **Database**      | Supabase (PostgreSQL)                |
| **PDF Engine**    | html2pdf.js                          |


✨ Key Features

✅ Modern Dashboard: Card-based grid layout with hover effects and price badges.

✅ Smart Forms: Real-time validation (prevents negative numbers) and floating labels.

✅ Interactive Timeline: Visual day-by-day itinerary builder.

✅ Instant PDF: Hidden off-screen rendering to generate high-quality PDFs without a backend.

✅ Toast Notifications: Professional success/error popups instead of browser alerts.

✅ CRUD Operations: Create, Read, Update, and Delete itineraries seamlessly.

✅ Responsive: Fully optimized for Mobile and Desktop.



📂 Project Structure

src/
├── components/
│   ├── CustomerForm.jsx    # Form with validation logic
│   ├── DayList.jsx         # Timeline container
│   ├── DayItem.jsx         # Individual day card
│   ├── Navbar.jsx          # Glassmorphism header
│   ├── Footer.jsx          # Simple footer
│   └── PdfTemplate.jsx     # Hidden print layout for PDF generation
├── pages/
│   ├── CreateItinerary.jsx # New trip creation flow
│   ├── SavedItineraries.jsx# Dashboard grid view
│   └── EditItinerary.jsx   # Edit / Save Copy logic
├── lib/
│   └── supabaseClient.js   # Database connection
├── App.jsx                 # Routing & Toaster setup
└── main.jsx




⚙️ Local Setup

1. Clone the repository

git clone <your-repo-url>
cd travel-itinerary


2. Install Dependencies

npm install


3. Configure Environment Variables Create a .env file in the root directory:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key


4. Run the Project

npm run dev


🗄️ Supabase Database Setup

Go to your Supabase SQL Editor and run this query to set up the table:

-- 1. Create Table
create table itineraries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  customer_name text not null,
  details jsonb,        -- Stores hotel, vehicle, persons, etc.
  itinerary jsonb,      -- Stores array of days (title, desc)
  total_cost numeric    -- Used for dashboard sorting
);

-- 2. Enable Row Level Security (RLS)
alter table itineraries enable row level security;

-- 3. Add Policy (Allow Public Read/Write for Demo)
create policy "Enable all access" 
on itineraries for all 
using (true) 
with check (true);


👨‍💻 Developer

Aditya Maheshwari 📧 Email: amaheshwari819@gmail.com

💻 Specialization: Full Stack Development (React, Node, Supabase)

Note: This project uses html2pdf.js with a hidden React component (PdfTemplate) to ensure the downloaded PDF looks different (print-friendly) from the web UI.