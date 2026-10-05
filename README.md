# 🇳🇵 HelpDesk Nepal

**A Modern IT Service & Help-Desk Management Platform for Nepal**  
*Tailored for Colleges, Universities, Schools, Corporate Offices, and IT Departments across Nepal.*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nepal Standard Time](https://img.shields.io/badge/Timezone-NST_(UTC%2B5:45)-crimson)]()
[![Currency](https://img.shields.io/badge/Currency-NPR_(Rs.)-emerald)]()

---

## 📌 Executive Summary

**HelpDesk Nepal (HDN)** is a production-grade, responsive IT Service Management (ITSM) web application designed to solve common IT infrastructure challenges faced by academic institutions, administrative hubs, and businesses in Nepal.

Unlike typical academic CRUD exercises, HelpDesk Nepal follows enterprise ITSM principles:
- **Real-World Incident Lifecycle**: Automated chronological event tracking (*Reported &rarr; Dispatched &rarr; Under Investigation &rarr; Troubleshooting &rarr; Resolved &rarr; Verified/Closed*).
- **Asset-Linked Diagnostics**: Direct correlation between support tickets and physical hardware assets (desktops, Cisco switches, MikroTik core routers, HP printers, GPON ONUs).
- **Nepal-Specific Context**: Native support for Nepalese Rupee (NPR / Rs.), Nepal Standard Time (NST / UTC+5:45), local ISP diagnostics (Nepal Telecom, WorldLink, Vianet), and multi-city dispatch across Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Biratnagar, and beyond.

---

## ✨ Key Capabilities & Modules

### 1. 👥 Multi-Role Access Control (RBAC)
The application provides distinct user experiences tailored to three key organizational roles:

| Role | Primary Capabilities | Typical User |
| :--- | :--- | :--- |
| **Administrator** | Full system visibility, ticket dispatching & reassignments, user & technician management, device lifecycle tracking, knowledge base moderation, and SLA audit reports. | IT Director / Head of Infrastructure |
| **Technician** | Workload queue, ticket status transitions, internal technician diagnostic notes, troubleshooting logs, device specs inspection, and knowledge base search. | Field Support Engineer / Network Admin |
| **User / Requester** | Ticket creation, personal incident tracking, public comment thread, status timeline visibility, and self-service knowledge base access. | College Faculty, Student, Office Staff |

> **⚡ Quick Demo Switcher**: A persistent 1-click role switcher is embedded in the top navigation bar and login page, enabling instant evaluation across roles without needing repeated credential entry.

---

### 2. 📊 Executive IT Operations Dashboard
Dynamic dashboard aggregating live metrics directly from the data layer:
- **8 KPI Cards**: Total Tickets, Open Tickets, In Progress, Resolved, Critical Incidents, Average Resolution Time (e.g. `4.2h`), Active Technicians, and Registered Assets.
- **Monthly Volume & Resolution Chart**: Visual comparison of incidents logged vs. resolved across 6 months.
- **Priority SLA Distribution**: Color-coded breakdown with proportional progress indicators.
- **Category Breakdown**: Incident volume categorized by Network, Hardware, Software, Printer, OS, etc.
- **Live Incident Stream**: Recent tickets with quick-navigation links and SLA badges.

---

### 3. 🎫 Incident & Ticket Management (`/tickets`, `/tickets/new`, `/tickets/:id`)
- **Automated Readable IDs**: Formatted systematically as `HDN-YYYY-XXXX` (e.g., `HDN-2026-0001`).
- **Standardized Categories**: Hardware, Software, Network, Internet, Printer, Email, Account/Login, Cybersecurity, Operating System, Other.
- **4 Priority Levels**: `Low`, `Medium`, `High`, and animated `Critical` with priority indicators.
- **6-Stage Lifecycle**: `Open`, `Assigned`, `In Progress`, `Waiting for User`, `Resolved`, and `Closed`.
- **Event Audit Timeline**: Every status update, technician dispatch, and troubleshooting step is timestamped and recorded into an immutable timeline log.
- **Discussion Thread**: Supports public user/tech replies as well as **Private Internal Notes** (visible only to staff).
- **CSV Data Export**: 1-click export of filtered tickets to `.csv` format.
- **Estimated Service Cost**: Budget tracking in Nepalese Rupees (e.g. `Rs. 2,500`).

---

### 4. 💻 IT Asset & Fleet Management (`/devices`)
Complete hardware and network asset inventory:
- **Device Attributes**: Device ID (e.g., `DEV-KTM-001`), Device Name, Type, Brand, Model, Serial Number, IPv4 Address, MAC Address, Physical Location, Assigned Custodian, and Operational Status.
- **Hardware Types**: Desktop, Laptop, Network Printer, Core Router, Managed Switch, Physical Server, Wi-Fi 6 Access Point.
- **Operational Statuses**: `Active` (Online), `Maintenance`, `Offline` (Down), and `Retired`.
- **Asset Filtering & Search**: Instant lookup by IP, MAC, serial number, hostname, or user.

---

### 5. 📚 IT Knowledge Base & SOPs (`/knowledge-base`, `/knowledge-base/:id`)
A searchable IT knowledge base built to reduce repetitive support tickets:
- **Practical SOPs**:
  1. *Internet Not Working & Default Gateway Unreachable*
  2. *Wi-Fi Connected But No Internet Access (Captive Portal & Interference)*
  3. *Network Printer Offline & Print Spooler Stuck*
  4. *Windows BSOD & Boot Loop Troubleshooting (`sfc /scannow`, `DISM`)*
  5. *Domain Login & Active Directory Account Lockout*
  6. *Institutional Email IMAP/SMTP & Outlook Configuration*
  7. *High CPU/RAM Usage & Slow Computer Optimization*
  8. *DNS Resolution Delays & Nepal Public DNS Setup*
  9. *IP Address Conflict Resolution in Local LAN*
  10. *Software Installation & Windows Installer Error 1603*
- **Interactive Features**: Copy-to-clipboard for CLI commands (`ipconfig /flushdns`, `ping 8.8.8.8`, `net stop spooler`), symptom checklists, helpfulness rating, and fallback ticket creation.

---

### 6. 🌐 Network Engineering Diagnostics (`/network-tools`)
Essential standalone utility suite for network administrators in Nepal:
- **RFC-Compliant IPv4 Subnet Calculator**:
  - Input: CIDR notation (`192.168.1.0/24`, `10.10.0.0/16`, `172.16.50.0/26`).
  - Computes: Network Address, Broadcast Address, First Usable Host, Last Usable Host, Usable/Total Host Counts, Subnet Mask, Wildcard Mask, IP Class, and Scope.
  - Visual subnet allocation bar and quick CIDR presets (`/24`, `/25`, `/26`, `/27`, `/28`, `/29`, `/30`).
  - Binary representations for both IP address and Subnet Mask.
- **IP Address Inspector**:
  - Dotted-decimal inspection, 32-bit integer, hexadecimal, and Reverse DNS PTR (`.in-addr.arpa`).
  - Nepal ISP routing context (Nepal Telecom NTC, WorldLink, Vianet, Huawei/Nokia GPON defaults, MikroTik RouterOS defaults).
  - Simulated non-intrusive ICMP echo (ping) tester.
- **Reference Cheat Sheet**:
  - Nepal ISP DNS directory (NTC, WorldLink, Cloudflare Anycast, Google Public).
  - Standard enterprise IT port numbers (SSH 22, HTTP 80, HTTPS 443, DNS 53, RDP 3389, SMB 445).

---

### 7. 📈 SLA Performance & Audit Reports (`/reports`)
- **Audit-Ready Presentation**: Clean typography and official letterhead layout with signature blocks.
- **Time Filtering**: Filter by *Last 7 Days*, *Last 30 Days*, *This Quarter (90 Days)*, or *All-Time Cumulative*.
- **Metrics Computed**: Incident volume, resolution percentage, active backlog, critical outages, and total estimated repair cost in NPR.
- **Print Optimization**: Native `@media print` stylesheets hide navigation and sidebar to produce clean PDF audits.

---

### 8. 🔔 Notification & Toast System
- Header notification panel with badge indicators for unread alerts.
- Automated notification triggers when tickets are created, assigned, escalated, or commented on.
- Mark all as read and clear all functions.
- Toast banners for instant user feedback on create, update, and delete actions.

---

## 🔐 Demo Credentials

Use any of the pre-configured accounts below (or click the corresponding button on the login screen):

| Role | Email | Password | Pre-Assigned Profile |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@helpdesknepal.com` | `admin123` *(any non-empty)* | Er. Bikram Adhikari (IT Director) |
| **Technician** | `technician@helpdesknepal.com` | `demo123` *(any non-empty)* | Suman Shrestha (Field Support Specialist) |
| **User / Requester** | `user@helpdesknepal.com` | `demo123` *(any non-empty)* | Priya Sharma (Computer Lab Coordinator) |

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 (Functional Components & React Hooks only)
- **Language**: JavaScript (ES2022+ / JSX — pure JS implementation, no TypeScript dependencies)
- **Build System**: Vite 8 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 with custom typography (`Plus Jakarta Sans` & `JetBrains Mono`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)
- **Data Layer**: Clean Service-Oriented Architecture (SOA) powered by `localStorage` persistence with seed initialization and event synchronization.

---

## 📁 Project Structure

```text
helpdesk-nepal/
├── index.html                   # HTML entry point with Nepal metadata & web fonts
├── metadata.json                # Project manifest & capability declarations
├── package.json                 # Project dependencies and execution scripts
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
├── src/
│   ├── App.jsx                  # Main application routing & protected route guards
│   ├── main.jsx                 # React root DOM mount
│   ├── index.css                # Tailwind imports, custom scrollbars & @media print styles
│   │
│   ├── assets/                  # Static assets and icons
│   │
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.jsx              # Search, role switcher, notifications & profile
│   │       ├── Sidebar.jsx             # Responsive navigation with role-based links
│   │       ├── TicketStatusBadge.jsx   # Color-coded ticket lifecycle badges
│   │       ├── PriorityBadge.jsx       # Low, Medium, High, and Critical SLA badges
│   │       ├── Modal.jsx               # Accessible dialog container
│   │       ├── ConfirmDialog.jsx       # Destructive action confirmation modal
│   │       ├── EmptyState.jsx          # Reusable zero-state presentation
│   │       └── LoadingSpinner.jsx      # Loading indicators
│   │
│   ├── context/
│   │   ├── AuthContext.jsx             # Authentication state & 1-click role switcher
│   │   └── ToastContext.jsx            # Toast alerts provider
│   │
│   ├── data/
│   │   └── seedData.js                 # Realistic seed data (Nepal users, assets, tickets, SOPs)
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx              # Responsive app frame with Sidebar and Navbar
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx               # Demo login with 1-click role buttons
│   │   ├── DashboardPage.jsx           # 8 KPI cards, SVG charts, and recent activity
│   │   ├── TicketsPage.jsx             # Searchable ticket table, filters & CSV export
│   │   ├── NewTicketPage.jsx           # Ticket creation form with Nepal location presets
│   │   ├── TicketDetailPage.jsx         # Full event timeline, comments & tech notes
│   │   ├── DevicesPage.jsx             # Asset inventory with IP/MAC and status tracking
│   │   ├── KnowledgeBasePage.jsx       # Searchable IT knowledge base
│   │   ├── KnowledgeDetailPage.jsx     # Step-by-step SOP with copyable commands
│   │   ├── NetworkToolsPage.jsx        # IPv4 Subnet Calculator & IP Inspector
│   │   ├── UsersPage.jsx               # User account administration (Admin only)
│   │   ├── TechniciansPage.jsx         # Field technician workload management (Admin only)
│   │   ├── ReportsPage.jsx             # SLA metrics & print-optimized audit report
│   │   ├── SettingsPage.jsx            # Nepal regional settings & factory reset
│   │   └── NotFoundPage.jsx            # 404 fallback page
│   │
│   ├── services/
│   │   ├── storage.js                  # LocalStorage layer with event dispatching
│   │   ├── ticketService.js            # Ticket CRUD, SLA stats & timeline operations
│   │   ├── deviceService.js            # IT asset inventory operations & stats
│   │   ├── kbService.js                # Knowledge base queries & search algorithms
│   │   ├── authService.js              # Authentication, users & technician roster
│   │   └── notificationService.js      # System notifications management
│   │
│   └── utils/
│       ├── formatters.js               # NPR currency formatting & Nepal date helpers
│       └── networkCalculator.js        # Pure RFC-compliant bitwise IPv4 subnet math
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or `20.x` recommended)
- `npm` (version `9.x` or higher)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/helpdesk-nepal.git
   cd helpdesk-nepal
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled static assets will be output to the `dist/` directory.

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🔄 Data Architecture & Future Backend Integration

HelpDesk Nepal is engineered with a **Service-Oriented Architecture (SOA)**. All data access is mediated through clean service modules:

```text
React Components (UI) ──> Context Layer ──> Services (ticketService, deviceService, etc.) ──> Storage Layer
```

To transition this frontend prototype into a full-stack production application:
1. Replace `storage.js` with an HTTP client (e.g. `axios` or native `fetch`).
2. Point endpoints to a REST or GraphQL backend (Node.js/Express, Python/FastAPI, or Go).
3. Connect to a relational database (PostgreSQL, Cloud SQL) using the existing schemas defined in `src/data/seedData.js`.
4. Swap the demo login mechanism for JSON Web Tokens (JWT) or OAuth 2.0.

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute this software for personal, academic, or commercial purposes.

---

## 👨‍💻 Author & Contributions

Built for IT operations teams, colleges, and students across Nepal.  
Contributions, feature suggestions, and bug reports are welcome via GitHub Issues and Pull Requests.
