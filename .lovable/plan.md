

# Adventure Holidays - Itinerary Management System

## Overview
A professional travel itinerary creation and management system with a 4-step wizard, keyword templates, and stunning PDF export functionality. Built with React, TypeScript, Tailwind CSS, and Firebase.

---

## Brand & Design
- **Colors**: Yellow/Gold (#FDB913) primary, Dark Navy (#0A1828) for PDF backgrounds
- **Typography**: Poppins font family throughout (300-700 weights)
- **Style**: Modern, professional, travel-focused with clean UI

---

## Core Features

### 1. Dashboard / Landing Page
- Adventure Holidays logo header
- **"+ Create Itinerary"** prominent yellow button
- **"Manage Keywords"** secondary button
- Search bar for filtering by client name, destination, or duration
- Data table with columns: Client Name (with itinerary code), Destination, Duration, Pax
- Action icons per row: View, Edit, Copy, Delete
- Sorted by most recent first

### 2. Itinerary Studio (4-Step Wizard)
**Fixed Header** with itinerary code display, Preview and Confirm & Save buttons

**Step 1 - Summary:**
- Consultant details (name, phone with +91)
- Quotation details (auto-generated number, date picker)
- Trip details (destination, duration, travel date, transport)
- Client details (name, group size)
- Custom headings section (add/remove dynamic sections)
- Pricing slots (multiple tiers with label, price, unit)

**Step 2 - Itinerary:**
- Day 0 toggle for pre-trip details
- Day cards with: keyword search, title, date, activities (bullet points)
- Add/delete days, auto-numbering
- Keyword auto-population from templates

**Step 3 - Details:**
- Two-column layout: Inclusions and Exclusions
- One item per line input format

**Step 4 - Policies:**
- Terms & Conditions (pre-populated, editable)
- Cancellation Policy (pre-populated, editable)
- Bank details (4 fields with company defaults)

### 3. Preview Page
- Full-screen preview of the complete itinerary
- Back to Dashboard button
- Edit button (returns to studio)
- Download PDF button
- Exact representation of final PDF output

### 4. PDF Generation
**Professional single-page PDF with:**
- Cover section with logo and client greeting
- Journey Overview grid (dates, destination, duration, pax, transport)
- Pricing section (yellow highlight box)
- Day-by-day experience breakdown
- Inclusions & Exclusions sections
- Consultant contact details
- Terms & Cancellation policies
- Social proof (Google rating, traveler stats)
- About Us and Call-to-Action sections
- Footer with full contact information

**Technical specs:**
- Poppins font embedded
- File naming: `[Code]-[Client]-[Destination]-[Duration]-[Pax].pdf`
- Optimized for under 5MB

### 5. Keyword Templates Management
- Add new template form (keyword + activities)
- Saved templates table with edit/delete
- Unique keyword validation
- Real-time search integration with Step 2

---

## Data Structure (Firebase)

**Itineraries Collection:**
- Auto-generated itinerary codes (AH26-DOM-FIT-001, etc.)
- All consultant, client, trip details
- Day plans, pricing slots, custom headings
- Inclusions, exclusions, policies, bank details
- Timestamps for created/updated

**Keywords Collection:**
- Unique keyword identifiers
- Array of activity strings
- Timestamps

---

## Key Functionality
- Auto-increment itinerary codes
- Real-time search filtering
- Auto-save drafts (debounced)
- Form validation with error handling
- Copy/duplicate itineraries
- Responsive design (mobile, tablet, desktop)
- Loading states and toast notifications
- Keyboard navigation support

---

## Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: Firebase Firestore
- **PDF**: jsPDF with Poppins font embedding
- **Forms**: React Hook Form + Zod validation
- **Fonts**: Google Fonts (Poppins)

