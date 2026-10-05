/**
 * Seed data for HelpDesk Nepal
 * Designed specifically for colleges, offices, schools, and IT departments in Nepal.
 */

export const INITIAL_USERS = [
  {
    id: "usr-001",
    name: "Er. Bikram Adhikari",
    email: "admin@helpdesknepal.com",
    role: "admin",
    roleTitle: "IT Director & Infrastructure Lead",
    department: "Information Technology",
    organization: "Sagarmatha Engineering College",
    phone: "+977 9841234567",
    location: "Lalitpur (Sanepa)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-01-15T09:00:00.000Z",
  },
  {
    id: "usr-002",
    name: "Suman Shrestha",
    email: "technician@helpdesknepal.com",
    role: "technician",
    roleTitle: "Senior Systems & Network Technician",
    department: "Technical Support Operations",
    organization: "HelpDesk Nepal Central Hub",
    phone: "+977 9851098765",
    location: "Kathmandu (New Baneshwor)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    specialty: "Network & Hardware Infrastructure",
    assignedTicketsCount: 4,
    status: "active",
    createdAt: "2025-02-01T10:30:00.000Z",
  },
  {
    id: "usr-003",
    name: "Priya Sharma",
    email: "user@helpdesknepal.com",
    role: "user",
    roleTitle: "Computer Lab Coordinator",
    department: "Department of Computer Science",
    organization: "Sagarmatha Engineering College",
    phone: "+977 9860123987",
    location: "Kathmandu (Maitighar)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-03-10T11:15:00.000Z",
  },
  {
    id: "usr-004",
    name: "Ramesh Karki",
    email: "ramesh.karki@himalcement.com.np",
    role: "user",
    roleTitle: "Accounts Manager",
    department: "Finance & Accounts",
    organization: "Himal Cement Industries",
    phone: "+977 9845012345",
    location: "Chitwan (Bharatpur-10)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-04-12T08:00:00.000Z",
  },
  {
    id: "usr-005",
    name: "Anjali Thapa",
    email: "anjali.thapa@ku.edu.np",
    role: "user",
    roleTitle: "Assistant Professor",
    department: "Civil & Environmental Studies",
    organization: "Kathmandu University Affiliated Institute",
    phone: "+977 9813245678",
    location: "Bhaktapur (Suryabinayak)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-05-18T14:20:00.000Z",
  },
  {
    id: "usr-006",
    name: "Sunil Gurung",
    email: "sunil.gurung@pokharait.org.np",
    role: "technician",
    roleTitle: "Field Support Engineer (Western Region)",
    department: "Regional Field Support",
    organization: "Pokhara ICT Solutions",
    phone: "+977 9806543210",
    location: "Pokhara (New Road)",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    specialty: "Optical Fiber & Wireless Mikrotik",
    assignedTicketsCount: 3,
    status: "active",
    createdAt: "2025-06-01T09:45:00.000Z",
  },
  {
    id: "usr-007",
    name: "Deepa Bhattarai",
    email: "deepa.b@helpdesknepal.com",
    role: "technician",
    roleTitle: "Software & Cloud Systems Specialist",
    department: "Technical Support Operations",
    organization: "HelpDesk Nepal Central Hub",
    phone: "+977 9849887766",
    location: "Lalitpur (Pulchowk)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    specialty: "Email, Windows Server & Active Directory",
    assignedTicketsCount: 2,
    status: "active",
    createdAt: "2025-06-15T11:00:00.000Z",
  },
];

export const INITIAL_DEVICES = [
  {
    id: "DEV-KTM-001",
    name: "Lab-3 Dell OptiPlex 7090",
    type: "Desktop",
    brand: "Dell",
    model: "OptiPlex 7090 MT",
    serialNumber: "SN-DEL-984210",
    ipAddress: "192.168.10.45",
    macAddress: "00:1A:2B:3C:4D:5E",
    location: "Kathmandu (Maitighar Lab 3)",
    assignedUser: "Priya Sharma",
    status: "Active",
    os: "Windows 11 Pro 23H2",
    processor: "Intel Core i7-11700, 16GB RAM, 512GB NVMe",
    purchaseDate: "2024-03-15",
    warrantyUntil: "2027-03-15",
    notes: "Primary computer science student workstation in Lab 3.",
  },
  {
    id: "DEV-KTM-002",
    name: "Main Core Router Mikrotik CCR1036",
    type: "Router",
    brand: "MikroTik",
    model: "CCR1036-12G-4S",
    serialNumber: "MT-CCR-881920",
    ipAddress: "192.168.1.1",
    macAddress: "4C:5E:0C:88:A1:02",
    location: "Kathmandu (Central Server Room, Baneshwor)",
    assignedUser: "Er. Bikram Adhikari",
    status: "Active",
    os: "RouterOS v7.14",
    processor: "Tilera 36 Core, 4GB RAM",
    purchaseDate: "2023-08-10",
    warrantyUntil: "2026-08-10",
    notes: "Handles dual ISP failover between WorldLink and NTC Fiber.",
  },
  {
    id: "DEV-KTM-003",
    name: "Admin HP LaserJet Enterprise M608",
    type: "Printer",
    brand: "HP",
    model: "LaserJet Enterprise M608dn",
    serialNumber: "HP-PRN-552199",
    ipAddress: "192.168.1.50",
    macAddress: "D4:C9:EF:12:34:56",
    location: "Kathmandu (Finance & Exam Admin Block)",
    assignedUser: "Ramesh Karki",
    status: "Maintenance",
    os: "HP FutureSmart Firmware v5.7",
    processor: "Network Monochrome Laser",
    purchaseDate: "2023-11-20",
    warrantyUntil: "2025-11-20",
    notes: "Paper jam sensor intermittent fault; pending roller cleaning.",
  },
  {
    id: "DEV-LAL-004",
    name: "Engineering Lab Cisco Catalyst 2960X",
    type: "Switch",
    brand: "Cisco",
    model: "WS-C2960X-48TS-L",
    serialNumber: "FOC2241S99A",
    ipAddress: "192.168.10.2",
    macAddress: "00:27:0D:7C:11:80",
    location: "Lalitpur (Pulchowk Tech Block 2)",
    assignedUser: "Suman Shrestha",
    status: "Active",
    os: "Cisco IOS 15.2(7)E7",
    processor: "48 Gigabit Ports + 4 SFP",
    purchaseDate: "2023-05-12",
    warrantyUntil: "2026-05-12",
    notes: "Configured with VLAN 10 (Students), VLAN 20 (Faculty), VLAN 30 (VoIP).",
  },
  {
    id: "DEV-LAL-005",
    name: "Dell PowerEdge R740 Server",
    type: "Server",
    brand: "Dell",
    model: "PowerEdge R740 2U",
    serialNumber: "SN-SRV-2023-881",
    ipAddress: "192.168.1.10",
    macAddress: "24:6E:96:AA:BB:CC",
    location: "Lalitpur (Data Center Room)",
    assignedUser: "Er. Bikram Adhikari",
    status: "Active",
    os: "Ubuntu Server 24.04 LTS",
    processor: "Dual Xeon Silver 4210R, 64GB ECC, 4x2TB RAID 10",
    purchaseDate: "2023-01-20",
    warrantyUntil: "2028-01-20",
    notes: "Hosts college Moodle LMS, internal student portal, and local backup repository.",
  },
  {
    id: "DEV-PKR-006",
    name: "Pokhara Branch Lenovo ThinkPad T14",
    type: "Laptop",
    brand: "Lenovo",
    model: "ThinkPad T14 Gen 4",
    serialNumber: "PF-388291X",
    ipAddress: "192.168.20.15",
    macAddress: "8C:85:90:54:32:10",
    location: "Pokhara (New Road Office)",
    assignedUser: "Sunil Gurung",
    status: "Active",
    os: "Windows 11 Pro",
    processor: "AMD Ryzen 7 PRO 7840U, 32GB RAM",
    purchaseDate: "2024-01-10",
    warrantyUntil: "2027-01-10",
    notes: "Assigned to regional support engineer for mobile diagnostics.",
  },
  {
    id: "DEV-BKT-007",
    name: "Library AP UniFi 6 Pro",
    type: "Access Point",
    brand: "Ubiquiti",
    model: "U6-Pro",
    serialNumber: "UBNT-U6P-99011",
    ipAddress: "192.168.1.120",
    macAddress: "68:D7:9A:88:77:66",
    location: "Bhaktapur (Central Library 2nd Floor)",
    assignedUser: "Anjali Thapa",
    status: "Active",
    os: "UniFi OS v6.6.65",
    processor: "Wi-Fi 6 Dual-Band MIMO",
    purchaseDate: "2024-05-02",
    warrantyUntil: "2026-05-02",
    notes: "Peak traffic during exams: ~120 concurrent student devices.",
  },
  {
    id: "DEV-CHT-008",
    name: "Chitwan Factory Desktop HP ProDesk 400",
    type: "Desktop",
    brand: "HP",
    model: "ProDesk 400 G7 SFF",
    serialNumber: "HP-PD-400-CHT",
    ipAddress: "192.168.5.12",
    macAddress: "E0:D5:5E:21:43:65",
    location: "Chitwan (Bharatpur Weighbridge)",
    assignedUser: "Ramesh Karki",
    status: "Offline",
    os: "Windows 10 Pro 22H2",
    processor: "Intel Core i5-10500, 8GB RAM, 256GB SSD",
    purchaseDate: "2022-09-18",
    warrantyUntil: "2025-09-18",
    notes: "Reported unexpected shutdown during recent load shedding.",
  },
  {
    id: "DEV-KTM-009",
    name: "Backup Cisco Catalyst 2960",
    type: "Switch",
    brand: "Cisco",
    model: "WS-C2960-24TT-L",
    serialNumber: "FOC1902M123",
    ipAddress: "192.168.1.200",
    macAddress: "00:1E:F7:99:88:77",
    location: "Kathmandu (Store Room)",
    assignedUser: "Suman Shrestha",
    status: "Retired",
    os: "Cisco IOS 12.2",
    processor: "24 FastEthernet + 2 Gigabit Uplink",
    purchaseDate: "2018-04-10",
    warrantyUntil: "2021-04-10",
    notes: "Decommissioned 100Mbps switch kept for lab disaster recovery.",
  },
  {
    id: "DEV-BRT-010",
    name: "Biratnagar Branch Canon imageRUNNER 2625i",
    type: "Printer",
    brand: "Canon",
    model: "imageRUNNER 2625i MFP",
    serialNumber: "CN-IR-2625-BRT",
    ipAddress: "192.168.30.25",
    macAddress: "70:85:C2:33:44:55",
    location: "Biratnagar (Main Admin Office)",
    assignedUser: "Priya Sharma",
    status: "Active",
    os: "Canon Multi-function System",
    processor: "A3 Monochrome MFP Network Scanner/Copier",
    purchaseDate: "2024-02-14",
    warrantyUntil: "2027-02-14",
    notes: "Connected to branch subnet for shared scanning and printing.",
  }
];

export const INITIAL_TICKETS = [
  {
    id: "HDN-2026-0001",
    subject: "Subnet 192.168.10.0/24 Student Lab Gateway Unreachable",
    description: "Students in Computer Lab 3 cannot connect to the internet or the internal Moodle server. Gateway 192.168.10.1 returns Destination Host Unreachable. The switch link light is flashing amber.",
    category: "Network",
    priority: "Critical",
    status: "In Progress",
    location: "Kathmandu (Maitighar Lab 3)",
    deviceId: "DEV-KTM-001",
    deviceName: "Lab-3 Dell OptiPlex 7090",
    userId: "usr-003",
    userName: "Priya Sharma",
    userEmail: "user@helpdesknepal.com",
    assignedTechnicianId: "usr-002",
    assignedTechnicianName: "Suman Shrestha",
    estimatedCost: 1500,
    currency: "NPR",
    createdAt: "2026-10-03T09:15:00.000Z",
    updatedAt: "2026-10-04T07:20:00.000Z",
    resolvedAt: null,
    resolutionNotes: "",
    timeline: [
      {
        id: "evt-001",
        type: "created",
        title: "Ticket Created",
        description: "Priya Sharma reported gateway failure in Maitighar Lab 3.",
        author: "Priya Sharma",
        timestamp: "2026-10-03T09:15:00.000Z",
      },
      {
        id: "evt-002",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Ticket assigned to Suman Shrestha (Senior Network Technician).",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-10-03T09:30:00.000Z",
      },
      {
        id: "evt-003",
        type: "investigation",
        title: "Technician Started Investigation",
        description: "Suman Shrestha arrived at Lab 3. Tested patch panel connections and checked VLAN 10 trunk on Cisco 2960X switch.",
        author: "Suman Shrestha",
        timestamp: "2026-10-03T10:15:00.000Z",
      },
      {
        id: "evt-004",
        type: "troubleshooting",
        title: "Troubleshooting Performed",
        description: "Found damaged RJ-45 patch cord between rack distribution switch and Port 12. Re-crimping CAT6 cable and testing loopback.",
        author: "Suman Shrestha",
        timestamp: "2026-10-04T07:20:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-001",
        author: "Priya Sharma",
        authorRole: "user",
        text: "Please prioritize this as the second year software engineering lab starts at 11:00 AM.",
        timestamp: "2026-10-03T09:20:00.000Z",
        isInternal: false,
      },
      {
        id: "cmt-002",
        author: "Suman Shrestha",
        authorRole: "technician",
        text: "Checked port 12 on the switch. It seems the uplink patch cable was crimped poorly and has broken pins. I am replacing it with a factory molded patch cord right now.",
        timestamp: "2026-10-04T07:22:00.000Z",
        isInternal: false,
      },
      {
        id: "cmt-003",
        author: "Suman Shrestha",
        authorRole: "technician",
        text: "Internal note: If problem persists, we may need to replace the modular keystone jack in wall plate 3B.",
        timestamp: "2026-10-04T07:25:00.000Z",
        isInternal: true,
      }
    ]
  },
  {
    id: "HDN-2026-0002",
    subject: "Finance Department HP LaserJet Repeated Paper Jam Error 13.00",
    description: "The HP LaserJet M608 in the Accounts section keeps displaying Error 13.00 (Paper Jam in Tray 2) even when no paper is stuck. Billing invoices for Dashain audit cannot be printed.",
    category: "Printer",
    priority: "High",
    status: "Waiting for User",
    location: "Kathmandu (Finance & Exam Admin Block)",
    deviceId: "DEV-KTM-003",
    deviceName: "Admin HP LaserJet Enterprise M608",
    userId: "usr-004",
    userName: "Ramesh Karki",
    userEmail: "ramesh.karki@himalcement.com.np",
    assignedTechnicianId: "usr-002",
    assignedTechnicianName: "Suman Shrestha",
    estimatedCost: 3500,
    currency: "NPR",
    createdAt: "2026-10-02T11:00:00.000Z",
    updatedAt: "2026-10-03T16:00:00.000Z",
    resolvedAt: null,
    resolutionNotes: "",
    timeline: [
      {
        id: "evt-101",
        type: "created",
        title: "Ticket Created",
        description: "Ramesh Karki reported HP printer error 13.00.",
        author: "Ramesh Karki",
        timestamp: "2026-10-02T11:00:00.000Z",
      },
      {
        id: "evt-102",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Assigned to Suman Shrestha.",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-10-02T11:30:00.000Z",
      },
      {
        id: "evt-103",
        type: "troubleshooting",
        title: "Troubleshooting Performed",
        description: "Cleaned rubber pick-up rollers with isopropyl alcohol. Observed paper tray dampness due to recent rainy weather.",
        author: "Suman Shrestha",
        timestamp: "2026-10-03T15:45:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-101",
        author: "Suman Shrestha",
        authorRole: "technician",
        text: "Cleaned the pick-up rollers. The paper currently loaded in Tray 2 appears damp from monsoon humidity. Please test with a freshly opened dry ream of 80 GSM paper and confirm if the error recurs.",
        timestamp: "2026-10-03T16:00:00.000Z",
        isInternal: false,
      }
    ]
  },
  {
    id: "HDN-2026-0003",
    subject: "Kathmandu University Affiliated Moodle Login Failure via EduID",
    description: "Faculty and students cannot authenticate into college LMS portal. The Single Sign-On throws 'Invalid SAML 2.0 Response signature' after password input.",
    category: "Account/Login",
    priority: "Critical",
    status: "Resolved",
    location: "Bhaktapur (Suryabinayak)",
    deviceId: "DEV-LAL-005",
    deviceName: "Dell PowerEdge R740 Server",
    userId: "usr-005",
    userName: "Anjali Thapa",
    userEmail: "anjali.thapa@ku.edu.np",
    assignedTechnicianId: "usr-007",
    assignedTechnicianName: "Deepa Bhattarai",
    estimatedCost: 0,
    currency: "NPR",
    createdAt: "2026-09-28T08:30:00.000Z",
    updatedAt: "2026-09-28T14:45:00.000Z",
    resolvedAt: "2026-09-28T14:45:00.000Z",
    resolutionNotes: "Identity Provider SSL certificate had expired at midnight. Generated and installed renewed X.509 SAML signing certificate, synced NTP server time with Nepal Standard Time (time.gov.np), and cleared SimpleSAMLphp cache.",
    timeline: [
      {
        id: "evt-201",
        type: "created",
        title: "Ticket Created",
        description: "Anjali Thapa reported university SSO login failure.",
        author: "Anjali Thapa",
        timestamp: "2026-09-28T08:30:00.000Z",
      },
      {
        id: "evt-202",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Assigned to Deepa Bhattarai (Systems & Cloud Specialist).",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-09-28T08:45:00.000Z",
      },
      {
        id: "evt-203",
        type: "investigation",
        title: "Technician Started Investigation",
        description: "Inspected Apache auth logs and SAML assertions on PowerEdge server.",
        author: "Deepa Bhattarai",
        timestamp: "2026-09-28T09:15:00.000Z",
      },
      {
        id: "evt-204",
        type: "troubleshooting",
        title: "Troubleshooting Performed",
        description: "Re-keyed SAML certificate, configured chrony for Nepal NTP, restarted authentication daemon.",
        author: "Deepa Bhattarai",
        timestamp: "2026-09-28T13:30:00.000Z",
      },
      {
        id: "evt-205",
        type: "resolved",
        title: "Issue Resolved",
        description: "Verified successful logins with 10 test student accounts. System running normally.",
        author: "Deepa Bhattarai",
        timestamp: "2026-09-28T14:45:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-201",
        author: "Deepa Bhattarai",
        authorRole: "technician",
        text: "The SSO certificate has been renewed and synchronized with official Nepal Standard Time servers. All faculty and students can now log in normally.",
        timestamp: "2026-09-28T14:45:00.000Z",
        isInternal: false,
      }
    ]
  },
  {
    id: "HDN-2026-0004",
    subject: "Pokhara Branch Office Wi-Fi Dropping Every 15 Minutes",
    description: "Staff at Pokhara New Road office report that laptops frequently disconnect from 'HelpDesk-Pokhara-5G' and get an APIPA IP (169.254.x.x).",
    category: "Internet",
    priority: "Medium",
    status: "Open",
    location: "Pokhara (New Road)",
    deviceId: "DEV-PKR-006",
    deviceName: "Pokhara Branch Lenovo ThinkPad T14",
    userId: "usr-003",
    userName: "Priya Sharma",
    userEmail: "user@helpdesknepal.com",
    assignedTechnicianId: "usr-006",
    assignedTechnicianName: "Sunil Gurung",
    estimatedCost: 1200,
    currency: "NPR",
    createdAt: "2026-10-04T05:30:00.000Z",
    updatedAt: "2026-10-04T05:30:00.000Z",
    resolvedAt: null,
    resolutionNotes: "",
    timeline: [
      {
        id: "evt-301",
        type: "created",
        title: "Ticket Created",
        description: "Priya Sharma submitted ticket regarding intermittent Wi-Fi drops.",
        author: "Priya Sharma",
        timestamp: "2026-10-04T05:30:00.000Z",
      },
      {
        id: "evt-302",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Assigned to Sunil Gurung (Western Region Field Engineer).",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-10-04T06:00:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-301",
        author: "Sunil Gurung",
        authorRole: "technician",
        text: "I will visit the New Road office after lunch with a Wi-Fi spectrum analyzer to inspect 2.4GHz / 5GHz channel interference and DHCP lease duration.",
        timestamp: "2026-10-04T06:10:00.000Z",
        isInternal: false,
      }
    ]
  },
  {
    id: "HDN-2026-0005",
    subject: "Suspected Phishing Email Impersonating Nepal Rastra Bank",
    description: "Finance staff received an email with attachment 'NRB-Compliance-Tax-Update.zip.exe' claiming to require immediate bank account verification.",
    category: "Cybersecurity",
    priority: "Critical",
    status: "In Progress",
    location: "Chitwan (Bharatpur-10)",
    deviceId: "DEV-CHT-008",
    deviceName: "Chitwan Factory Desktop HP ProDesk 400",
    userId: "usr-004",
    userName: "Ramesh Karki",
    userEmail: "ramesh.karki@himalcement.com.np",
    assignedTechnicianId: "usr-007",
    assignedTechnicianName: "Deepa Bhattarai",
    estimatedCost: 2000,
    currency: "NPR",
    createdAt: "2026-10-04T04:10:00.000Z",
    updatedAt: "2026-10-04T06:45:00.000Z",
    resolvedAt: null,
    resolutionNotes: "",
    timeline: [
      {
        id: "evt-401",
        type: "created",
        title: "Ticket Created",
        description: "Urgent security alert submitted by Ramesh Karki.",
        author: "Ramesh Karki",
        timestamp: "2026-10-04T04:10:00.000Z",
      },
      {
        id: "evt-402",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Assigned to Deepa Bhattarai.",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-10-04T04:20:00.000Z",
      },
      {
        id: "evt-403",
        type: "troubleshooting",
        title: "Security Quarantine Performed",
        description: "Extracted email headers. Origin IP 185.220.101.5 (Tor Exit Node). Quarantined sender domain at firewall and purged email from all employee inboxes.",
        author: "Deepa Bhattarai",
        timestamp: "2026-10-04T05:00:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-401",
        author: "Deepa Bhattarai",
        authorRole: "technician",
        text: "DO NOT open or double-click the attachment. Running endpoint scan on Ramesh's machine right now to confirm zero execution.",
        timestamp: "2026-10-04T04:25:00.000Z",
        isInternal: false,
      }
    ]
  },
  {
    id: "HDN-2026-0006",
    subject: "Windows 11 BSOD Kernel Security Check Failure on Lab 2 PCs",
    description: "Three Dell PCs in Civil Engineering CAD Lab crash with Blue Screen of Death immediately after opening AutoCAD 2025. Crash dump points to graphics driver nvlddmkm.sys.",
    category: "Operating System",
    priority: "High",
    status: "Assigned",
    location: "Lalitpur (Pulchowk)",
    deviceId: "DEV-LAL-004",
    deviceName: "Engineering Lab Cisco Catalyst 2960X",
    userId: "usr-005",
    userName: "Anjali Thapa",
    userEmail: "anjali.thapa@ku.edu.np",
    assignedTechnicianId: "usr-002",
    assignedTechnicianName: "Suman Shrestha",
    estimatedCost: 2800,
    currency: "NPR",
    createdAt: "2026-10-03T14:00:00.000Z",
    updatedAt: "2026-10-03T14:30:00.000Z",
    resolvedAt: null,
    resolutionNotes: "",
    timeline: [
      {
        id: "evt-501",
        type: "created",
        title: "Ticket Created",
        description: "Anjali Thapa reported CAD computer BSOD crashes.",
        author: "Anjali Thapa",
        timestamp: "2026-10-03T14:00:00.000Z",
      },
      {
        id: "evt-502",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Assigned to Suman Shrestha.",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-10-03T14:30:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-501",
        author: "Suman Shrestha",
        authorRole: "technician",
        text: "This is a known conflict with the recent Windows 11 23H2 optional update and NVIDIA studio drivers. Will use DDU (Display Driver Uninstaller) in safe mode and reinstall WHQL certified drivers.",
        timestamp: "2026-10-03T15:00:00.000Z",
        isInternal: false,
      }
    ]
  },
  {
    id: "HDN-2026-0007",
    subject: "DNS Resolution Failure for Nepal Government .gov.np Portals",
    description: "Internal workstations cannot resolve nagarikapp.gov.np, dohs.gov.np, or moecdc.gov.np. Default DNS 192.168.1.1 forwards to local caching server which appears hung.",
    category: "Network",
    priority: "High",
    status: "Resolved",
    location: "Kathmandu (New Baneshwor)",
    deviceId: "DEV-KTM-002",
    deviceName: "Main Core Router Mikrotik CCR1036",
    userId: "usr-003",
    userName: "Priya Sharma",
    userEmail: "user@helpdesknepal.com",
    assignedTechnicianId: "usr-002",
    assignedTechnicianName: "Suman Shrestha",
    estimatedCost: 800,
    currency: "NPR",
    createdAt: "2026-09-30T10:00:00.000Z",
    updatedAt: "2026-09-30T12:30:00.000Z",
    resolvedAt: "2026-09-30T12:30:00.000Z",
    resolutionNotes: "Flushed DNS cache on MikroTik CCR router (`/ip dns cache flush`). Added secondary upstream DNS 202.70.72.3 (Nepal Telecom DNS) and 1.1.1.1 (Cloudflare) with DNS over HTTPS (DoH) fallback.",
    timeline: [
      {
        id: "evt-601",
        type: "created",
        title: "Ticket Created",
        description: "Priya Sharma reported inability to open .gov.np portals.",
        author: "Priya Sharma",
        timestamp: "2026-09-30T10:00:00.000Z",
      },
      {
        id: "evt-602",
        type: "assigned",
        title: "Assigned to Technician",
        description: "Assigned to Suman Shrestha.",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-09-30T10:15:00.000Z",
      },
      {
        id: "evt-603",
        type: "troubleshooting",
        title: "Troubleshooting Performed",
        description: "Diagnosed stale DNS records in MikroTik router cache. Updated upstream forwarders.",
        author: "Suman Shrestha",
        timestamp: "2026-09-30T11:45:00.000Z",
      },
      {
        id: "evt-604",
        type: "resolved",
        title: "Issue Resolved",
        description: "Verified nslookup nagarikapp.gov.np resolves in 14ms across all VLANs.",
        author: "Suman Shrestha",
        timestamp: "2026-09-30T12:30:00.000Z",
      },
      {
        id: "evt-605",
        type: "closed",
        title: "Ticket Closed",
        description: "Ticket verified and closed by IT Administrator.",
        author: "Er. Bikram Adhikari",
        timestamp: "2026-10-01T09:00:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-601",
        author: "Er. Bikram Adhikari",
        authorRole: "admin",
        text: "Clean resolution. Router DNS cache TTLs have been tuned to prevent stale records.",
        timestamp: "2026-10-01T09:00:00.000Z",
        isInternal: false,
      }
    ]
  },
  {
    id: "HDN-2026-0008",
    subject: "Setup Institutional Microsoft 365 Email on Mobile Devices",
    description: "New faculty members at Kathmandu University institute need guidance setting up official @ku.edu.np Outlook email and 2-Factor Authentication on Android/iOS.",
    category: "Email",
    priority: "Low",
    status: "Closed",
    location: "Bhaktapur (Suryabinayak)",
    deviceId: "DEV-BKT-007",
    deviceName: "Library AP UniFi 6 Pro",
    userId: "usr-005",
    userName: "Anjali Thapa",
    userEmail: "anjali.thapa@ku.edu.np",
    assignedTechnicianId: "usr-007",
    assignedTechnicianName: "Deepa Bhattarai",
    estimatedCost: 0,
    currency: "NPR",
    createdAt: "2026-09-25T13:00:00.000Z",
    updatedAt: "2026-09-26T10:00:00.000Z",
    resolvedAt: "2026-09-26T10:00:00.000Z",
    resolutionNotes: "Provided step-by-step PDF manual and assisted 4 teachers in-person to register Microsoft Authenticator with SMS fallback on Nepal Ncell/NTC numbers.",
    timeline: [
      {
        id: "evt-701",
        type: "created",
        title: "Ticket Created",
        description: "Anjali Thapa requested email setup assistance.",
        author: "Anjali Thapa",
        timestamp: "2026-09-25T13:00:00.000Z",
      },
      {
        id: "evt-702",
        type: "resolved",
        title: "Issue Resolved",
        description: "Assisted faculty members with Microsoft 365 configuration.",
        author: "Deepa Bhattarai",
        timestamp: "2026-09-26T10:00:00.000Z",
      },
      {
        id: "evt-703",
        type: "closed",
        title: "Ticket Closed",
        description: "Confirmed resolution with user.",
        author: "Deepa Bhattarai",
        timestamp: "2026-09-26T10:15:00.000Z",
      }
    ],
    comments: [
      {
        id: "cmt-701",
        author: "Anjali Thapa",
        authorRole: "user",
        text: "Thank you for the prompt assistance and Nepali guide!",
        timestamp: "2026-09-26T10:10:00.000Z",
        isInternal: false,
      }
    ]
  }
];

export const INITIAL_KB_ARTICLES = [
  {
    id: "kb-001",
    title: "Internet Not Working & Default Gateway Unreachable",
    category: "Internet problems",
    tags: ["network", "internet", "gateway", "dhcp", "ping"],
    readTime: "4 min read",
    author: "Suman Shrestha",
    updatedAt: "2026-10-02",
    summary: "Comprehensive step-by-step diagnostic workflow for restoring network and internet connectivity on institutional Windows/Linux machines.",
    symptoms: [
      "Yellow exclamation triangle or globe icon on system tray",
      "'No Internet, Secured' status in Wi-Fi settings",
      "Browser displays ERR_INTERNET_DISCONNECTED or DNS_PROBE_FINISHED_NO_INTERNET",
      "Pinging local gateway results in 'Request timed out' or 'Destination host unreachable'"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Physical Layer Check",
        instruction: "Ensure the Ethernet RJ-45 cable is firmly clicked into the NIC port and switch/wall plate. Look for steady green link LEDs and intermittent amber activity LEDs. If using Wi-Fi, ensure the physical airplane mode switch is OFF.",
      },
      {
        step: 2,
        title: "Check Local IP Configuration via CLI",
        instruction: "Open Windows Command Prompt (cmd) or PowerShell as Administrator and run `ipconfig /all`. Check if IPv4 address begins with `169.254.x.x` (APIPA automatic private IP indicating DHCP failure). If so, release and renew DHCP lease.",
        command: "ipconfig /release\nipconfig /renew"
      },
      {
        step: 3,
        title: "Ping Default Gateway",
        instruction: "Identify your Default Gateway IP from `ipconfig` (typically 192.168.1.1, 192.168.10.1, or 10.0.0.1) and send 4 ICMP echo packets.",
        command: "ping -n 4 192.168.1.1"
      },
      {
        step: 4,
        title: "Test Public IP & DNS Connectivity",
        instruction: "If the default gateway responds with 0% packet loss, ping a reliable public IP (Google Public DNS 8.8.8.8 or Cloudflare 1.1.1.1). If public IP works but web pages don't load, test DNS resolution directly.",
        command: "ping 8.8.8.8\nnslookup google.com 8.8.8.8"
      },
      {
        step: 5,
        title: "Flush DNS Resolver Cache & Reset Winsock Catalog",
        instruction: "Corrupted local socket catalogs or DNS resolver records can prevent outbound TCP connections. Reset network stack and restart computer.",
        command: "ipconfig /flushdns\nnetsh winsock reset\nnetsh int ip reset"
      },
      {
        step: 6,
        title: "Restart Network Adapter Interface",
        instruction: "Disable and re-enable your Ethernet or Wi-Fi network interface card.",
        command: "powershell -Command \"Restart-NetAdapter -Name 'Ethernet'\""
      },
      {
        step: 7,
        title: "Contact Network Administrator / Nepal ISP NOC",
        instruction: "If the router WAN light is red/orange or optical LOS light is flashing red on your Nepal Telecom / WorldLink / Vianet fiber ONU (Nokia/Huawei), raise a ticket with HelpDesk Nepal with your optical RX power reading."
      }
    ]
  },
  {
    id: "kb-002",
    title: "Wi-Fi Connected But No Internet Access",
    category: "Wi-Fi problems",
    tags: ["wifi", "wireless", "dhcp", "apipa", "wpa2"],
    readTime: "3 min read",
    author: "Sunil Gurung",
    updatedAt: "2026-10-01",
    summary: "Fix Wi-Fi connection issues when device connects to Access Point SSID but cannot load web portals or obtain valid IP.",
    symptoms: [
      "Device shows full Wi-Fi signal bars but no data transfer",
      "Captive portal login page does not pop up automatically",
      "Smartphone or laptop drops connection every few minutes"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Forget Network and Reconnect",
        instruction: "Windows: Settings > Network & Internet > Wi-Fi > Manage known networks > Select network > Forget. Reconnect and enter WPA2/WPA3 pre-shared key."
      },
      {
        step: 2,
        title: "Trigger Captive Portal Page",
        instruction: "In colleges or public Wi-Fi zones, open a new browser tab in incognito mode and navigate to `http://neverssl.com` or `http://192.168.88.1` to force the Mikrotik/UniFi hotspot login page."
      },
      {
        step: 3,
        title: "Check for Wi-Fi Channel Frequency Interference",
        instruction: "Dense 2.4 GHz spectrum in Kathmandu commercial areas often experiences co-channel interference. Prefer 5GHz or 6GHz SSIDs ('Campus-5G') whenever possible."
      },
      {
        step: 4,
        title: "Disable Random MAC / MAC Randomization",
        instruction: "If your institution uses MAC-based authentication or bandwidth queues, disable 'Use randomized MAC' in phone/laptop Wi-Fi settings for the campus network."
      }
    ]
  },
  {
    id: "kb-003",
    title: "Network Printer Offline or Print Spooler Stuck",
    category: "Printer problems",
    tags: ["printer", "hp", "canon", "spooler", "paperjam"],
    readTime: "5 min read",
    author: "Suman Shrestha",
    updatedAt: "2026-09-29",
    summary: "How to resolve network printer offline status, stuck print queues, and paper pick-up sensor faults on HP and Canon office MFPs.",
    symptoms: [
      "Printer status displays 'Offline' in Windows Devices and Printers",
      "Documents sent to printer stay indefinitely in 'Printing' or 'Spooling' state",
      "Repeated paper jam warnings without visible paper in feed tray"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Verify Printer IP & Ping Connectivity",
        instruction: "Print a Configuration Page from the printer physical display panel (Reports > Network Summary). Note the IPv4 address (e.g. 192.168.1.50) and test ping from your workstation.",
        command: "ping 192.168.1.50"
      },
      {
        step: 2,
        title: "Clear Windows Print Spooler Queue via CLI",
        instruction: "Stop the print spooler service, purge stuck .SHD and .SPL spool files from the system folder, and restart the spooler.",
        command: "net stop spooler\ndel /Q /F /S \"%systemroot%\\System32\\Spool\\Printers\\*.*\"\nnet start spooler"
      },
      {
        step: 3,
        title: "Disable SNMP Status Monitoring on Standard TCP/IP Port",
        instruction: "Windows Printer Properties > Ports tab > Select TCP/IP Port > Configure Port > Uncheck 'SNMP Status Enabled'. (Mismatched SNMP community names often falsely mark working printers as offline)."
      },
      {
        step: 4,
        title: "Inspect Paper Tray & Roller Moisture",
        instruction: "In humid Nepal weather, paper sheets can stick together causing Tray 2 pickup failures. Fan the paper ream before loading, and clean pick-up rollers with a lint-free cloth moistened with isopropyl alcohol."
      }
    ]
  },
  {
    id: "kb-004",
    title: "Windows BSOD & Boot Loop Troubleshooting",
    category: "Windows problems",
    tags: ["windows", "bsod", "crash", "chkdsk", "sfc"],
    readTime: "6 min read",
    author: "Deepa Bhattarai",
    updatedAt: "2026-09-27",
    summary: "Systematic diagnosis of Blue Screen of Death (BSOD) stop codes, driver conflicts, and corrupted system files on Windows 10/11.",
    symptoms: [
      "Unexpected blue screen with stop code (IRQL_NOT_LESS_OR_EQUAL, CRITICAL_PROCESS_DIED)",
      "PC reboots continuously during Windows loading spinner",
      "Random freezes under heavy CAD or programming workloads"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Boot into Safe Mode with Networking",
        instruction: "Hold Shift while clicking Restart on the Windows sign-in screen. Go to Troubleshoot > Advanced options > Startup Settings > Restart > Press 5 for Safe Mode with Networking."
      },
      {
        step: 2,
        title: "Run System File Checker (SFC) and DISM Repair",
        instruction: "Scan for corrupted Windows operating system binaries and repair using component store.",
        command: "DISM /Online /Cleanup-Image /RestoreHealth\nsfc /scannow"
      },
      {
        step: 3,
        title: "Check Storage Disk Health (CHKDSK)",
        instruction: "Verify NTFS file system integrity and bad clusters on system drive C:.",
        command: "chkdsk C: /f /r"
      },
      {
        step: 4,
        title: "Review Crash Dump using WhoCrashed or WinDbg",
        instruction: "Check minidump files in `C:\\Windows\\Minidump` to pinpoint the offending `.sys` kernel driver (common culprits: graphics, network NIC, or antivirus filter drivers)."
      }
    ]
  },
  {
    id: "kb-005",
    title: "Domain Login & Account Lockout Troubleshooting",
    category: "Login problems",
    tags: ["activedirectory", "login", "password", "lockout", "kerberos"],
    readTime: "3 min read",
    author: "Er. Bikram Adhikari",
    updatedAt: "2026-09-25",
    summary: "Resolve Active Directory account lockouts, cached credential conflicts, and Kerberos time skew errors.",
    symptoms: [
      "'The referenced account is currently locked out and may not be logged on to'",
      "'The trust relationship between this workstation and the primary domain failed'",
      "'Time differences between client and server exceed Kerberos threshold'"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Verify System Clock vs Domain Controller NTP",
        instruction: "Kerberos authentication fails if client clock differs by more than 5 minutes from Domain Controller. Resync Windows Time service with domain NTP.",
        command: "w32tm /resync /force"
      },
      {
        step: 2,
        title: "Clear Saved Windows Credential Manager Entries",
        instruction: "Old passwords cached in Windows Credential Manager can repeatedly trigger bad logon attempts, locking the user account. Open Control Panel > Credential Manager > Windows Credentials > Remove expired credentials."
      },
      {
        step: 3,
        title: "Unlock Account in Active Directory Users & Computers",
        instruction: "Technician/Admin action: Open ADUC > Find user > Properties > Account tab > Check 'Unlock account' > Apply."
      }
    ]
  },
  {
    id: "kb-006",
    title: "Institutional Email IMAP/SMTP & Outlook Configuration",
    category: "Email problems",
    tags: ["email", "outlook", "imap", "smtp", "m365", "gmail"],
    readTime: "4 min read",
    author: "Deepa Bhattarai",
    updatedAt: "2026-09-22",
    summary: "Correct port numbers, encryption protocols, and app password requirements for college and office email setups in Microsoft Outlook and Thunderbird.",
    symptoms: [
      "Outlook continuously prompts for password popup",
      "Outgoing emails stuck in Outbox with 0x800CCC0E error",
      "IMAP server certificate security warning"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Verify Standard Mail Server Ports",
        instruction: "Incoming IMAP: Port 993 (SSL/TLS). Incoming POP3: Port 995 (SSL/TLS). Outgoing SMTP: Port 465 (SSL) or Port 587 (STARTTLS). Never use unencrypted Port 25."
      },
      {
        step: 2,
        title: "Generate App-Specific Password for 2FA Accounts",
        instruction: "If your institution uses Google Workspace or Microsoft 365 with Multi-Factor Authentication, generate a 16-character App Password for desktop Outlook clients."
      },
      {
        step: 3,
        title: "Rebuild Outlook OST/PST Data File",
        instruction: "Run Microsoft Inbox Repair Tool (`scanpst.exe`) located in `C:\\Program Files\\Microsoft Office\\root\\Office16`."
      }
    ]
  },
  {
    id: "kb-007",
    title: "High CPU/RAM Usage & Slow Computer Optimization",
    category: "Slow computer",
    tags: ["performance", "cpu", "ram", "taskmanager", "cleanup"],
    readTime: "4 min read",
    author: "Suman Shrestha",
    updatedAt: "2026-09-20",
    summary: "Practical techniques to identify resource hogs, disable unnecessary startup apps, and optimize Windows 10/11 office workstations.",
    symptoms: [
      "Task Manager shows 100% Disk or 100% CPU usage constantly",
      "Computer takes more than 3 minutes to boot up",
      "Mouse cursor lags and applications show '(Not Responding)'"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Identify Top Resource Consuming Processes",
        instruction: "Open Task Manager (`Ctrl + Shift + Esc`) > Processes tab > Click CPU, Memory, and Disk column headers to sort by heaviest consumer."
      },
      {
        step: 2,
        title: "Disable Non-Essential Startup Apps",
        instruction: "In Task Manager > Startup apps tab > Disable high-impact apps (e.g. Torrent clients, gaming launchers, duplicate cloud sync utilities)."
      },
      {
        step: 3,
        title: "Clean Temporary Files & Prefetch",
        instruction: "Purge Windows Temp folder and user AppData temporary cache.",
        command: "del /q/f/s %TEMP%\\*\ncleanmgr /sagerun:1"
      },
      {
        step: 4,
        title: "Verify Storage Drive Type (SSD vs HDD)",
        instruction: "If the workstation runs on a mechanical 5400 RPM hard drive, upgrading to a 2.5\" SATA or M.2 NVMe SSD is the single most cost-effective performance upgrade in Nepal (approx. Rs. 2,500 for 256GB)."
      }
    ]
  },
  {
    id: "kb-008",
    title: "DNS Resolution Troubleshooting & Nepal ISP Public DNS",
    category: "DNS problems",
    tags: ["dns", "nepaltelecom", "worldlink", "cloudflare", "flushdns"],
    readTime: "3 min read",
    author: "Suman Shrestha",
    updatedAt: "2026-09-18",
    summary: "Resolve domain lookup delays and configure fast, redundant public DNS resolvers in Nepal.",
    symptoms: [
      "Can ping IP addresses (e.g. 8.8.8.8) but cannot open websites by domain name",
      "Local government .gov.np portals take unusually long to load",
      "DNS_PROBE_FINISHED_NXDOMAIN in Chrome"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Flush Local DNS Resolver Cache",
        instruction: "Clear stored DNS records on the client machine.",
        command: "ipconfig /flushdns"
      },
      {
        step: 2,
        title: "Recommended DNS Servers for Nepal",
        instruction: "Primary: 1.1.1.1 (Cloudflare Anycast - Fastest in Nepal).\nSecondary: 8.8.8.8 (Google Public DNS).\nNepal Telecom DNS: 202.70.72.3 / 202.70.72.4 (Good for domestic .np TLD routing)."
      },
      {
        step: 3,
        title: "Test Resolution via Specific Server",
        instruction: "Query domain resolution directly against Cloudflare DNS.",
        command: "nslookup helpdesknepal.com 1.1.1.1"
      }
    ]
  },
  {
    id: "kb-009",
    title: "IP Address Conflict Resolution in Local LAN",
    category: "IP configuration problems",
    tags: ["ipconflict", "dhcp", "staticip", "arp"],
    readTime: "3 min read",
    author: "Er. Bikram Adhikari",
    updatedAt: "2026-09-15",
    summary: "How to locate and resolve 'Windows has detected an IP address conflict' error in college and office subnets.",
    symptoms: [
      "System balloon popup warning: 'There is an IP address conflict with another system on the network'",
      "Intermittent network dropouts every time another computer powers on"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Identify Conflicting MAC Address using ARP",
        instruction: "Find which device MAC is claiming the conflicting IP address.",
        command: "arp -a | findstr \"192.168.1.\""
      },
      {
        step: 2,
        title: "Reserve DHCP Pool vs Static IP Range",
        instruction: "Ensure static IPs assigned to printers, cameras, and servers are OUTSIDE the router's active DHCP pool range (e.g. Static: .2 - .50, DHCP Pool: .100 - .250)."
      },
      {
        step: 3,
        title: "Switch Client to DHCP Automatic Allocation",
        instruction: "Open ncpa.cpl > Right click Ethernet adapter > Properties > IPv4 > Select 'Obtain an IP address automatically'."
      }
    ]
  },
  {
    id: "kb-010",
    title: "Software Installation & Windows Installer Error 1603",
    category: "Software installation problems",
    tags: ["installer", "msi", "error1603", "permissions", "vcredist"],
    readTime: "4 min read",
    author: "Deepa Bhattarai",
    updatedAt: "2026-09-12",
    summary: "Resolve MSI installation aborts, Visual C++ runtime dependency errors, and antivirus false-positive blocks.",
    symptoms: [
      "'Fatal error during installation. Error code 1603'",
      "'The program can't start because MSVCP140.dll is missing from your computer'",
      "Installation rolls back at 90% progress"
    ],
    troubleshootingSteps: [
      {
        step: 1,
        title: "Run as Administrator",
        instruction: "Right-click the `.exe` or `.msi` setup file and select 'Run as administrator' to grant elevated UAC privileges."
      },
      {
        step: 2,
        title: "Install All-in-One Microsoft Visual C++ Redistributables",
        instruction: "Most modern office and engineering software require VC++ 2015-2022 runtimes (both x86 and x64 architectures)."
      },
      {
        step: 3,
        title: "Temporarily Whitelist in Windows Defender",
        instruction: "Check Windows Defender Security Center > Virus & threat protection > Protection history to ensure custom institutional setup files were not quarantined."
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-001",
    title: "New Critical Ticket Created",
    message: "Ticket HDN-2026-0005: Suspected Phishing Email in Chitwan office requires urgent review.",
    type: "critical",
    read: false,
    timestamp: "2026-10-04T04:10:00.000Z",
    link: "/tickets/HDN-2026-0005",
  },
  {
    id: "notif-002",
    title: "Ticket Status Updated to In Progress",
    message: "Suman Shrestha started troubleshooting Ticket HDN-2026-0001 (Lab 3 Gateway).",
    type: "status",
    read: false,
    timestamp: "2026-10-04T07:20:00.000Z",
    link: "/tickets/HDN-2026-0001",
  },
  {
    id: "notif-003",
    title: "Ticket Assigned",
    message: "Ticket HDN-2026-0004 (Pokhara Wi-Fi) assigned to Sunil Gurung.",
    type: "assign",
    read: true,
    timestamp: "2026-10-04T06:00:00.000Z",
    link: "/tickets/HDN-2026-0004",
  },
  {
    id: "notif-004",
    title: "Ticket Resolved",
    message: "Ticket HDN-2026-0003: Moodle SSO Login Failure resolved by Deepa Bhattarai.",
    type: "success",
    read: true,
    timestamp: "2026-09-28T14:45:00.000Z",
    link: "/tickets/HDN-2026-0003",
  },
  {
    id: "notif-005",
    title: "Device Maintenance Flagged",
    message: "Admin HP LaserJet Enterprise M608 in Finance Block marked for Maintenance.",
    type: "warning",
    read: true,
    timestamp: "2026-10-02T11:30:00.000Z",
    link: "/devices",
  }
];

export const NEPAL_LOCATIONS = [
  "Kathmandu (Maitighar)",
  "Kathmandu (New Baneshwor)",
  "Kathmandu (Putalisadak)",
  "Kathmandu (Thamel)",
  "Kathmandu (Dillibazar)",
  "Kathmandu (Kirtipur)",
  "Lalitpur (Pulchowk)",
  "Lalitpur (Kupondole)",
  "Lalitpur (Jawalakhel)",
  "Lalitpur (Sanepa)",
  "Bhaktapur (Suryabinayak)",
  "Bhaktapur (Lokanthali)",
  "Pokhara (New Road)",
  "Pokhara (Lakeside)",
  "Chitwan (Bharatpur-10)",
  "Biratnagar (Main Road)",
  "Butwal (Traffic Chowk)",
  "Dharan (Bhanuchowk)",
  "Nepalgunj (Surkhet Road)"
];

export const TICKET_CATEGORIES = [
  "Hardware",
  "Software",
  "Network",
  "Internet",
  "Printer",
  "Email",
  "Account/Login",
  "Cybersecurity",
  "Operating System",
  "Other"
];

export const TICKET_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

export const TICKET_STATUSES = [
  "Open",
  "Assigned",
  "In Progress",
  "Waiting for User",
  "Resolved",
  "Closed"
];

export const DEVICE_TYPES = [
  "Desktop",
  "Laptop",
  "Printer",
  "Router",
  "Switch",
  "Server",
  "Access Point",
  "Other"
];

export const DEVICE_STATUSES = [
  "Active",
  "Maintenance",
  "Offline",
  "Retired"
];
