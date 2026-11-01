# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**StudioSpace** is a high-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians. Studio owners and hosts can list their creative spaces—ranging from photography cyc walls and cinema sound stages to podcast lounges, music recording suites, and art workshops. Fellow creators can discover, filter, inspect dynamic availability, and reserve studio slots with transparent pricing and real-time booking management.

- **Client GitHub Repository**: [https://github.com/tuhin-2006/StudioSpace-Client](https://github.com/tuhin-2006/StudioSpace-Client)
- **Server GitHub Repository**: [https://github.com/tuhin-2006/StudioSpace-Server](https://github.com/tuhin-2006/StudioSpace-Server)
- **Live Website URL**: [https://studiospace-client.vercel.app](https://studiospace-client.vercel.app) *(Deployable on Vercel)*

---

## 🌟 Key Features (Minimum 5 Core Highlights)
1. **Interactive Hero Studio Slider & Curated Discovery**: Multi-slide dynamic carousel with custom category cards (Photo Studios, Sound Stages, Podcast Rooms, Music Suites, Art Workshops) allowing instant filtered searches.
2. **Double-Booking Collision Prevention Guard (Challenge 2)**: Integrated real-time booking modal verifying overlapping time windows against confirmed reservations in MongoDB before committing slots.
3. **Enterprise HTTPOnly Cookie Authentication (Challenge 1)**: JWT credentials safely stored in HTTPOnly cookies across all mutations (`POST`, `PATCH`, `DELETE`) with smooth, non-bouncing session restoration on reload of any private route.
4. **Fluid Dark & Light Mode System Synchronization (Challenge 3)**: System-wide theme toggle powered by `next-themes` and Tailwind CSS with local persistence and zero-flicker rendering.
5. **PDF Booking Invoice & Receipt Generator (Optional Differentiator)**: Downloadable client-side PDF invoices created via `jspdf` containing itemized hours, hourly rates, security deposits, and invoice IDs.
6. **Creator Wishlist System (Optional Differentiator)**: Heart toggle on workspace cards allowing creators to bookmark favorite studios with MongoDB persistence.
7. **Strict Input Validations & Custom Modals**: Password rules enforced (>= 6 chars, uppercase, lowercase); modern `Sonner` toasts and custom deletion dialogs with zero default browser `alert` or `confirm` usage.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner (Modern Toast Notification System)
- **Theming**: Next-Themes (Dark/Light mode)
- **PDF Generation**: jsPDF
- **State & Auth**: React Context API with HTTPOnly JWT Cookie integration

---

## 🔑 Examiner Test Credentials
- **Email**: `examiner@studiospace.io`
- **Password**: `Test1234`
- *(Or use the 1-click "Auto-fill" button on the Login page)*

---

## 🚀 Local Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tuhin-2006/StudioSpace-Client.git
   cd StudioSpace-Client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

4. **Run the Next.js development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```
