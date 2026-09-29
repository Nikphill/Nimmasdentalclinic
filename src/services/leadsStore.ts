/**
 * Persistent Leads & Appointment Submissions Store for Nimma's Dental Clinic
 * Handles storage, synchronization, export, and status management for all patient forms.
 */

export interface FormSubmission {
  id: string;
  type: 'cosmetic' | 'general' | 'quiz';
  patientName: string;
  phone: string;
  email?: string;
  service: string;
  doctor?: string;
  date: string;
  timeSlot: string;
  status: 'new' | 'contacted' | 'consultation_scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  source: string;
  details?: {
    smileGoal?: string;
    concerns?: string[];
    budgetEstimate?: string;
    promoCode?: string;
    shadeGoal?: string;
    urgency?: string;
    specialRequests?: string;
  };
}

const STORAGE_KEY = "nimma_dental_leads_v2";

// Realistic sample submissions so clinic staff can test the portal immediately
const INITIAL_DEMO_LEADS: FormSubmission[] = [
  {
    id: "NIMMA-CS7841",
    type: "cosmetic",
    patientName: "Sneha Reddy",
    phone: "+91 98490 12845",
    email: "sneha.reddy@example.com",
    service: "Handcrafted Porcelain Veneers (6 Upper Teeth)",
    doctor: "Dr. Abhishek Reddy Nimma",
    date: "2026-10-04",
    timeSlot: "04:30 PM",
    status: "new",
    notes: "Wedding in November 2026. Interested in 0% EMI financing and 3D digital smile preview.",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    source: "Cosmetic VIP Consultation Form",
    details: {
      smileGoal: "Close midline gap & brighten smile for upcoming wedding",
      concerns: ["Midline gap", "Slight discoloration"],
      promoCode: "BRIDAL-GLOW-30",
      budgetEstimate: "₹85,000",
      urgency: "Within 3 weeks"
    }
  },
  {
    id: "NIMMA-QZ9024",
    type: "quiz",
    patientName: "Karthik Varma",
    phone: "+91 97032 55419",
    email: "karthik.v@example.com",
    service: "NimmaClear Invisible Aligners",
    doctor: "Dr. Kranthi Nimma",
    date: "2026-10-06",
    timeSlot: "11:30 AM",
    status: "contacted",
    notes: "Sent digital smile assessment report via WhatsApp. Requested morning appointment.",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    source: "Virtual Smile Assessment Quiz",
    details: {
      smileGoal: "Straighten lower crowding without visible metal braces",
      concerns: ["Crowded teeth", "Overbite"],
      promoCode: "SMILE-QUIZ-2500",
      shadeGoal: "A1 Pearl White",
      urgency: "Next available slot"
    }
  },
  {
    id: "NIMMA-GN4392",
    type: "general",
    patientName: "M. Anji Rao",
    phone: "+91 94401 88723",
    email: "anji.rao@example.com",
    service: "Root Canal Therapy (Micro-RCT)",
    doctor: "Dr. Abhishek Reddy Nimma",
    date: "2026-10-03",
    timeSlot: "09:30 AM",
    status: "consultation_scheduled",
    notes: "Patient complaining of mild sensitivity in upper molar. Scheduled for digital X-ray.",
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    source: "General Care Concierge",
    details: {
      urgency: "Mild discomfort"
    }
  },
  {
    id: "NIMMA-CS5519",
    type: "cosmetic",
    patientName: "Priyanka Goud",
    phone: "+91 88975 66201",
    email: "priyanka.goud@example.com",
    service: "Zoom 4 In-Office Laser Teeth Whitening",
    doctor: "Dr. Kranthi Nimma",
    date: "2026-10-05",
    timeSlot: "02:30 PM",
    status: "new",
    notes: "Looking for single-sitting whitening before corporate conference.",
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    source: "Cosmetic Special Package (Zoom 4)",
    details: {
      smileGoal: "Instant bright smile boost (4-6 shades)",
      promoCode: "ZOOM-FESTIVE-25",
      budgetEstimate: "₹12,500"
    }
  }
];

export function getLeads(): FormSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
      return INITIAL_DEMO_LEADS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
    return INITIAL_DEMO_LEADS;
  } catch (err) {
    console.error("Error reading leads from storage:", err);
    return INITIAL_DEMO_LEADS;
  }
}

export function saveLead(lead: FormSubmission): FormSubmission {
  try {
    const existing = getLeads();
    const updated = [lead, ...existing.filter(item => item.id !== lead.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Broadcast event across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nimma_leads_updated', { detail: lead }));
    }
    return lead;
  } catch (err) {
    console.error("Error saving lead:", err);
    return lead;
  }
}

export function updateLeadStatus(id: string, status: FormSubmission['status']): void {
  try {
    const leads = getLeads();
    const updated = leads.map(item => item.id === id ? { ...item, status } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nimma_leads_updated'));
    }
  } catch (err) {
    console.error("Error updating lead status:", err);
  }
}

export function updateLeadNotes(id: string, notes: string): void {
  try {
    const leads = getLeads();
    const updated = leads.map(item => item.id === id ? { ...item, notes } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nimma_leads_updated'));
    }
  } catch (err) {
    console.error("Error updating lead notes:", err);
  }
}

export function deleteLead(id: string): void {
  try {
    const leads = getLeads();
    const updated = leads.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nimma_leads_updated'));
    }
  } catch (err) {
    console.error("Error deleting lead:", err);
  }
}

export function resetDemoLeads(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nimma_leads_updated'));
    }
  } catch (err) {
    console.error("Error resetting leads:", err);
  }
}

/**
 * Generate CSV data and trigger download for reception Excel / Sheets import
 */
export function exportLeadsToCSV(): void {
  const leads = getLeads();
  const headers = [
    "Lead ID",
    "Date Submitted",
    "Type",
    "Patient Name",
    "Phone",
    "Email",
    "Requested Treatment",
    "Doctor",
    "Preferred Date",
    "Preferred Time",
    "Status",
    "Source",
    "Promo Code",
    "Staff Notes"
  ];

  const escapeCSV = (str: string = "") => {
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = leads.map(l => [
    escapeCSV(l.id),
    escapeCSV(new Date(l.createdAt).toLocaleString()),
    escapeCSV(l.type.toUpperCase()),
    escapeCSV(l.patientName),
    escapeCSV(l.phone),
    escapeCSV(l.email || ""),
    escapeCSV(l.service),
    escapeCSV(l.doctor || "Any"),
    escapeCSV(l.date),
    escapeCSV(l.timeSlot),
    escapeCSV(l.status.toUpperCase()),
    escapeCSV(l.source),
    escapeCSV(l.details?.promoCode || ""),
    escapeCSV(l.notes || "")
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Nimmas_Dental_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
