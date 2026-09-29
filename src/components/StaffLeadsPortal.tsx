import React, { useState, useEffect } from 'react';
import { 
  getLeads, 
  updateLeadStatus, 
  updateLeadNotes, 
  deleteLead, 
  resetDemoLeads, 
  exportLeadsToCSV, 
  saveLead,
  FormSubmission 
} from '../services/leadsStore';
import { 
  Search, 
  Filter, 
  Download, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  FileSpreadsheet, 
  RefreshCw, 
  Check, 
  Edit3, 
  Tag, 
  ShieldCheck,
  ChevronRight,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';

interface StaffLeadsPortalProps {
  onBackToHome: () => void;
  onNavigateToCosmetic: () => void;
}

export const StaffLeadsPortal: React.FC<StaffLeadsPortalProps> = ({ 
  onBackToHome, 
  onNavigateToCosmetic 
}) => {
  const [leads, setLeads] = useState<FormSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cosmetic' | 'general' | 'quiz'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<FormSubmission | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // --- Staff Authentication & Passcode Gate ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nimma_staff_auth') === 'true' || 
           localStorage.getItem('nimma_staff_auth_remember') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [currentPwInput, setCurrentPwInput] = useState('');
  const [newPwInput, setNewPwInput] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState(false);
  const [changePwError, setChangePwError] = useState<string | null>(null);

  const getStoredPassword = () => {
    return localStorage.getItem('nimma_custom_staff_pw') || 'Nimma@12';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredPassword();
    const cleanInput = passwordInput.trim();
      setIsAuthenticated(true);
      sessionStorage.setItem('nimma_staff_auth', 'true');
      if (rememberMe) {
        localStorage.setItem('nimma_staff_auth_remember', 'true');
      }
      setAuthError(null);
    } else {
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nimma_staff_auth');
    localStorage.removeItem('nimma_staff_auth_remember');
    setPasswordInput('');
    setAuthError(null);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredPassword();
      setChangePwError('Current password is incorrect.');
      return;
    }
    if (newPwInput.trim().length < 4) {
      setChangePwError('New passcode must be at least 4 characters.');
      return;
    }
    localStorage.setItem('nimma_custom_staff_pw', newPwInput.trim());
    setChangePwSuccess(true);
    setChangePwError(null);
    setTimeout(() => {
      setShowChangePwModal(false);
      setChangePwSuccess(false);
      setCurrentPwInput('');
      setNewPwInput('');
    }, 1500);
  };

  // New Lead manual entry state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newService, setNewService] = useState('Porcelain Veneers Consultation');
  const [newType, setNewType] = useState<'cosmetic' | 'general'>('cosmetic');
  const [newDoctor, setNewDoctor] = useState('Dr. Abhishek Reddy Nimma');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newNotes, setNewNotes] = useState('');

  const loadLeads = () => {
    setLeads(getLeads());
  };

  useEffect(() => {
    loadLeads();
    const handleUpdate = () => loadLeads();
    window.addEventListener('nimma_leads_updated', handleUpdate);
    return () => window.removeEventListener('nimma_leads_updated', handleUpdate);
  }, []);

  // Filtered leads
  const filteredLeads = leads.filter(lead => {
    // Type filter
    if (selectedFilter !== 'all' && lead.type !== selectedFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && lead.status !== statusFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = lead.patientName.toLowerCase().includes(q);
      const matchPhone = lead.phone.toLowerCase().includes(q);
      const matchService = lead.service.toLowerCase().includes(q);
      const matchId = lead.id.toLowerCase().includes(q);
      return matchName || matchPhone || matchService || matchId;
    }
    return true;
  });

  const handleStatusChange = (id: string, newStatus: FormSubmission['status']) => {
    updateLeadStatus(id, newStatus);
    loadLeads();
  };

  const handleSaveNote = (id: string) => {
    updateLeadNotes(id, tempNote);
    setEditingNotesId(null);
    loadLeads();
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to remove this submission record?')) {
      deleteLead(id);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
      loadLeads();
    }
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPhone) return;

    const newLeadItem: FormSubmission = {
      id: `NIMMA-${Math.floor(100000 + Math.random() * 900000)}`,
      type: newType,
      patientName: newPatientName,
      phone: newPhone,
      email: newEmail || undefined,
      service: newService,
      doctor: newDoctor,
      date: newDate || new Date().toISOString().slice(0, 10),
      timeSlot: newTime,
      status: 'new',
      notes: newNotes,
      createdAt: new Date().toISOString(),
      source: 'Front Desk Manual Entry'
    };

    saveLead(newLeadItem);
    setShowAddModal(false);
    // Reset form
    setNewPatientName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
    loadLeads();
  };

  const copyPatientInfo = (lead: FormSubmission) => {
    const text = `Nimma Dental Lead:\nID: ${lead.id}\nPatient: ${lead.patientName}\nPhone: ${lead.phone}\nService: ${lead.service}\nPreferred: ${lead.date} at ${lead.timeSlot}\nStatus: ${lead.status.toUpperCase()}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(lead.id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const cosmeticCount = leads.filter(l => l.type === 'cosmetic' || l.type === 'quiz').length;
  const generalCount = leads.filter(l => l.type === 'general').length;
  const newCount = leads.filter(l => l.status === 'new').length;

  // --- RESTRICTED LOGIN PASSCODE GATE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between pt-24 pb-12 px-6 relative overflow-hidden">
        {/* Soft background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#EE1D23]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with back buttons */}
        <div className="max-w-md mx-auto w-full flex items-center justify-between mb-8 z-10">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Main Website
          </button>
          <button
            onClick={onNavigateToCosmetic}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-red-300 hover:text-red-200 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all border border-red-500/30"
          >
            <Sparkles className="w-4 h-4 text-[#EE1D23]" />
            Cosmetic VIP
          </button>
        </div>

        {/* Login Security Card */}
        <div className="max-w-md mx-auto w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex p-4 rounded-3xl bg-[#EE1D23]/20 text-[#EE1D23] border border-[#EE1D23]/30 shadow-inner mb-1">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#EE1D23]">
                Restricted Clinical Portal
              </span>
              <h2 className="text-2xl font-display font-medium text-white italic mt-1">
                Staff Authentication
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Please enter your clinic staff passcode to manage patient appointment bookings, smile inquiries, and diagnostic records.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-300 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                Staff Passcode / Front-Desk PIN
              </label>
              <div className="relative">
                <input
                  required
                  autoFocus
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter staff passcode..."
                  className="w-full bg-slate-900/90 border border-slate-600 focus:border-[#EE1D23] focus:ring-2 focus:ring-[#EE1D23]/20 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all pr-11 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-600 text-[#EE1D23] focus:ring-0 w-4 h-4 bg-slate-900"
                />
                <span>Remember session on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#EE1D23] hover:bg-[#EE1D23]/90 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Unlock Staff Portal
            </button>
          </form>


        {/* Footer info */}
        <div className="max-w-md mx-auto w-full text-center text-[11px] text-slate-500 mt-6 z-10">
          Nimma's Dental Hospital & Cosmetic Smile Studio • Staff Security Management
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 pt-20">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Main Clinic
            </button>
            <button
              onClick={onNavigateToCosmetic}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#EE1D23] bg-red-50 hover:bg-red-100 rounded-xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#EE1D23]" />
              Cosmetic Page
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-lg md:text-xl font-black text-slate-900 font-sans tracking-tight">
                  Clinic Form Submissions & Patient Leads Portal
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Live repository for all online appointments, cosmetic consultations, and quiz evaluations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Manual Entry
            </button>
            <button
              onClick={exportLeadsToCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm"
              title="Download CSV for Excel / Google Sheets"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => {
                if (confirm('Reset sample demo leads? This refreshes example submissions.')) {
                  resetDemoLeads();
                  loadLeads();
                }
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
              title="Reload / Reset Sample Leads"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {/* Security Passcode & Logout Controls */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2.5 ml-1">
              <button
                onClick={() => setShowChangePwModal(true)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
                title="Change Staff Access Passcode"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                title="Lock & Log out of Staff Portal"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Informational Answer Box: "Where does the filled form can be viewed?" */}
        <div className="bg-gradient-to-r from-red-50 via-white to-slate-50 border border-red-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE1D23] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#EE1D23] uppercase tracking-[0.2em] font-mono">
                  Clinic Front Desk Guide
                </span>
                <h2 className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
                  Where All Patient Form Submissions Are Stored & Handled
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                  Every time a patient fills the <strong>General Care Scheduler</strong>, the <strong>Cosmetic VIP Consultation Form</strong>, or the <strong>Interactive Smile Assessment Quiz</strong>, it instantly arrives here in real-time. Front desk staff can call or WhatsApp patients with one click, update their booking status, write clinical notes, and export all records to Excel/CSV.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Storage Engine</p>
                <p className="text-xs font-bold text-slate-800">Persistent Local Sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">
              <span>Total Submissions</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 font-sans">{leads.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">All captured records</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-center text-[#EE1D23] text-xs font-bold uppercase tracking-wider font-mono">
              <span>Cosmetic Inquiries</span>
              <Sparkles className="w-4 h-4 text-[#EE1D23]" />
            </div>
            <p className="text-3xl font-black text-[#EE1D23] mt-2 font-sans">{cosmeticCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">High-value aesthetic leads</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">
              <span>General Bookings</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 font-sans">{generalCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Routine clinical visits</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
            <div className="flex justify-between items-center text-amber-600 text-xs font-bold uppercase tracking-wider font-mono">
              <span>Action Required</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-amber-600 mt-2 font-sans">{newCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Uncontacted new patients</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, phone, service, or ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EE1D23]/20 focus:bg-white transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New (Uncontacted)</option>
                <option value="contacted">Contacted</option>
                <option value="consultation_scheduled">Consultation Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Inquiries ({leads.length})
            </button>
            <button
              onClick={() => setSelectedFilter('cosmetic')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'cosmetic'
                  ? 'bg-[#EE1D23] text-white shadow-xs'
                  : 'bg-red-50 text-[#EE1D23] hover:bg-red-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Cosmetic VIP ({leads.filter(l => l.type === 'cosmetic').length})
            </button>
            <button
              onClick={() => setSelectedFilter('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'quiz'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Smile Quiz Leads ({leads.filter(l => l.type === 'quiz').length})
            </button>
            <button
              onClick={() => setSelectedFilter('general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'general'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              General Appointments ({generalCount})
            </button>
          </div>
        </div>

        {/* Lead List / Table */}
        <div className="space-y-4">
          {filteredLeads.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No submissions matching criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or reset the filters to display patient inquiries.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLeads.map((lead) => {
                const isCosmetic = lead.type === 'cosmetic' || lead.type === 'quiz';
                const whatsappMsg = encodeURIComponent(
                  `Namaste ${lead.patientName}! This is from Nimma's Dental Clinic, Kamareddy regarding your appointment request for ${lead.service} on ${lead.date} (${lead.timeSlot}). We are pleased to confirm your slot.`
                );
                const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

                return (
                  <div
                    key={lead.id}
                    className={`bg-white rounded-3xl p-6 border transition-all hover:shadow-md ${
                      lead.status === 'new' 
                        ? 'border-amber-300 ring-2 ring-amber-100' 
                        : isCosmetic 
                          ? 'border-red-100' 
                          : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                          {lead.id}
                        </span>

                        {isCosmetic ? (
                          <span className="bg-red-50 text-[#EE1D23] border border-red-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {lead.type === 'quiz' ? 'Smile Quiz Assessment' : 'Cosmetic VIP Lead'}
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            General Clinic Booking
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          Status:
                        </span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as FormSubmission['status'])}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            lead.status === 'new'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : lead.status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : lead.status === 'consultation_scheduled'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : lead.status === 'completed'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="new">🟡 New Lead</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="consultation_scheduled">🟢 Scheduled</option>
                          <option value="completed">⚪ Completed</option>
                          <option value="cancelled">🔴 Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid md:grid-cols-12 gap-6 py-5">
                      {/* Patient & Contact Info */}
                      <div className="md:col-span-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <h3 className="font-bold text-slate-900 text-base">{lead.patientName}</h3>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-slate-600 pl-6">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{lead.phone}</span>
                            <button
                              onClick={() => copyPatientInfo(lead)}
                              className="text-[10px] text-slate-400 hover:text-slate-700 underline"
                            >
                              {copySuccess === lead.id ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          {lead.email && <span className="text-slate-500">{lead.email}</span>}
                          <span className="text-[10px] text-slate-400 font-mono mt-1">Source: {lead.source}</span>
                        </div>
                      </div>

                      {/* Treatment & Time */}
                      <div className="md:col-span-4 space-y-2">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                          Requested Treatment & Slot
                        </p>
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {lead.service}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#EE1D23]" />
                            {lead.date}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#EE1D23]" />
                            {lead.timeSlot}
                          </span>
                        </div>
                        {lead.doctor && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            Practitioner: <strong className="text-slate-700">{lead.doctor}</strong>
                          </p>
                        )}
                      </div>

                      {/* Extra Marketing Data / Quiz Results */}
                      <div className="md:col-span-4 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                          Patient Goal & Details
                        </p>
                        {lead.details?.smileGoal ? (
                          <p className="text-xs text-slate-800 font-medium italic">
                            "{lead.details.smileGoal}"
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 italic">Standard clinic booking inquiry</p>
                        )}

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {lead.details?.promoCode && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <Tag className="w-3 h-3" />
                              {lead.details.promoCode}
                            </span>
                          )}
                          {lead.details?.budgetEstimate && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold">
                              Est: {lead.details.budgetEstimate}
                            </span>
                          )}
                          {lead.details?.shadeGoal && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                              Shade: {lead.details.shadeGoal}
                            </span>
                          )}
                          {lead.details?.urgency && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                              {lead.details.urgency}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Staff Notes & Actions */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Notes Section */}
                      <div className="flex-1">
                        {editingNotesId === lead.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="Write staff follow-up note..."
                              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#EE1D23]"
                            />
                            <button
                              onClick={() => handleSaveNote(lead.id)}
                              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1.5 text-xs text-slate-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="font-bold text-slate-400 font-mono text-[10px] uppercase">Notes:</span>
                            <span className="text-slate-700 italic">
                              {lead.notes || 'No follow-up notes yet.'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingNotesId(lead.id);
                                setTempNote(lead.notes || '');
                              }}
                              className="text-slate-400 hover:text-slate-800 ml-1"
                              title="Edit Note"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick Communication Actions */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        >
                          View Ticket
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Inspection Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#EE1D23] uppercase tracking-[0.2em] font-mono">Official Patient Record</span>
                <h3 className="font-display italic text-2xl text-slate-900 mt-0.5">{selectedLead.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Patient Name:</span>
                  <span className="font-bold text-slate-900">{selectedLead.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Phone Number:</span>
                  <span className="font-bold text-slate-900">{selectedLead.phone}</span>
                </div>
                {selectedLead.email && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">Email:</span>
                    <span>{selectedLead.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Category:</span>
                  <span className="uppercase font-bold text-[#EE1D23]">{selectedLead.type}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Treatment:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedLead.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Clinician:</span>
                  <span className="font-bold text-slate-900">{selectedLead.doctor || 'Any Specialist'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Slot Timing:</span>
                  <span className="font-bold text-slate-900">{selectedLead.date} at {selectedLead.timeSlot}</span>
                </div>
              </div>

              {selectedLead.details?.smileGoal && (
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
                  <p className="text-[10px] uppercase font-bold text-[#EE1D23] font-mono">Smile Goals / Details</p>
                  <p className="text-xs text-slate-800 mt-1 italic">{selectedLead.details.smileGoal}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Print Ticket
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#EE1D23] uppercase tracking-[0.2em] font-mono">
                  Front Desk Logging
                </span>
                <h3 className="font-bold text-lg text-slate-900">Record Walk-in / Phone Inpatient</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4 pt-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient Full Name</label>
                <input
                  required
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email (Optional)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'cosmetic' | 'general')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  >
                    <option value="cosmetic">Cosmetic Dentistry</option>
                    <option value="general">General Dental Care</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Doctor</label>
                  <select
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  >
                    <option value="Dr. Abhishek Reddy Nimma">Dr. Abhishek Reddy</option>
                    <option value="Dr. Kranthi Nimma">Dr. Kranthi Nimma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treatment Procedure</label>
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. Porcelain Veneers, Teeth Whitening, RCT"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preferred Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Initial Reception Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes from initial conversation..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#EE1D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EE1D23]/90 shadow-md shadow-red-500/20"
                >
                  Record Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CHANGE STAFF PASSCODE MODAL */}
      {showChangePwModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-red-50 text-[#EE1D23]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Change Staff Passcode</h3>
                  <p className="text-[11px] text-slate-500">Update clinic credentials for portal access</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChangePwModal(false);
                  setChangePwError(null);
                  setChangePwSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {changePwSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Passcode Updated Successfully!</h4>
                <p className="text-xs text-slate-500">Your new staff passcode is now active on this device.</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {changePwError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {changePwError}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Current Passcode
                  </label>
                  <input
                    required
                    type="password"
                    value={currentPwInput}
                    onChange={(e) => setCurrentPwInput(e.target.value)}
                    placeholder="Enter current passcode..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    New Passcode (Min 4 chars)
                  </label>
                  <input
                    required
                    type="text"
                    value={newPwInput}
                    onChange={(e) => setNewPwInput(e.target.value)}
                    placeholder="e.g. nimma2026, clinic123, 88851"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePwModal(false);
                      setChangePwError(null);
                    }}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#EE1D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EE1D23]/90 shadow-md"
                  >
                    Save Passcode
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
