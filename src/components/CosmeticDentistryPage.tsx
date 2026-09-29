import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Clock, 
  Calendar, 
  Phone, 
  Sliders, 
  Tag, 
  ChevronRight, 
  Smile, 
  Eye, 
  Zap, 
  Percent, 
  CreditCard, 
  FileSpreadsheet, 
  Gift, 
  HeartHandshake,
  MessageCircle,
  Camera,
  Check
} from 'lucide-react';
import { saveLead, FormSubmission } from '../services/leadsStore';
import caseVeneersBefore from '../assets/images/case_veneers_before.jpg';
import caseVeneersAfter from '../assets/images/case_veneers_after.jpg';
import caseWhiteningBefore from '../assets/images/case_whitening_before.jpg';
import caseWhiteningAfter from '../assets/images/case_whitening_after.jpg';
import caseOrthoBefore from '../assets/images/case_ortho_before.jpg';
import caseOrthoAfter from '../assets/images/case_ortho_after.jpg';
import drAbhishekImg from '../assets/images/dr_abhishek_portrait_1790654546044.jpg';
import drKranthiImg from '../assets/images/dr_kranthi_portrait_1790654560360.jpg';

interface CosmeticDentistryPageProps {
  onBackToHome: () => void;
  onOpenStaffPortal: () => void;
}

export const CosmeticDentistryPage: React.FC<CosmeticDentistryPageProps> = ({
  onBackToHome,
  onOpenStaffPortal
}) => {
  // --- STATE FOR QUIZ / ASSESSMENT ---
  const [quizStep, setQuizStep] = useState(1);
  const [quizGoal, setQuizGoal] = useState('');
  const [quizTimeline, setQuizTimeline] = useState('');
  const [quizShade, setQuizShade] = useState('BL1 Hollywood White');
  const [quizName, setQuizName] = useState('');
  const [quizPhone, setQuizPhone] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizVoucherCode, setQuizVoucherCode] = useState('');

  // --- STATE FOR INTERACTIVE SHADE SIMULATOR ---
  const [activeShadeIndex, setActiveShadeIndex] = useState(3); // 0=A3, 1=A2, 2=A1, 3=BL1

  const shades = [
    { code: 'A3', name: 'Natural Warm', desc: 'Standard untreated tooth shade with yellow undertones', brightness: '65%', color: '#f5edd6' },
    { code: 'A2', name: 'Clean Natural', desc: 'Typical healthy adult enamel shade after routine polish', brightness: '78%', color: '#faf4e4' },
    { code: 'A1', name: 'Pearl Brilliant', desc: 'Brightest natural human tooth shade. Subtle, luminous & clean', brightness: '90%', color: '#fdfbf2' },
    { code: 'BL1', name: 'Hollywood Bleach', desc: 'Celebrity porcelain shade with max radiance & translucent depth', brightness: '100%', color: '#ffffff' },
  ];

  // --- STATE FOR FINANCING EMI CALCULATOR ---
  const [treatmentBudget, setTreatmentBudget] = useState(65000);
  const [tenureMonths, setTenureMonths] = useState(12);

  const calculateEMI = (amount: number, months: number) => {
    return Math.round(amount / months);
  };

  // --- STATE FOR VIP BOOKING FORM ---
  const [selectedService, setSelectedService] = useState('Handcrafted Porcelain Veneers');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Abhishek Reddy Nimma');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:30 AM');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [smileNotes, setSmileNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState('');

  // --- STATE FOR REAL PATIENT TRANSFORMATIONS SHOWCASE ---
  const [heroComparisonState, setHeroComparisonState] = useState<'after' | 'before'>('after');
  const [caseViews, setCaseViews] = useState<Record<string, 'after' | 'before'>>({
    veneers: 'after',
    whitening: 'after',
    ortho: 'after'
  });

  // Auto-apply promo from package buttons
  const handleSelectPackage = (packageName: string, promo: string) => {
    setSelectedService(packageName);
    setPromoCodeInput(promo);
    const formElement = document.getElementById('vip-consult-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit VIP Consultation
  const handleVIPFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const newId = `NIMMA-CS${Math.floor(1000 + Math.random() * 9000)}`;
    const submission: FormSubmission = {
      id: newId,
      type: 'cosmetic',
      patientName,
      phone: patientPhone,
      email: patientEmail || undefined,
      service: selectedService,
      doctor: selectedDoctor,
      date: preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      timeSlot: preferredTime,
      status: 'new',
      notes: `Cosmetic consultation request. Promo: ${promoCodeInput || 'None'}. Notes: ${smileNotes || 'None'}`,
      createdAt: new Date().toISOString(),
      source: 'Cosmetic VIP Consultation Page',
      details: {
        smileGoal: smileNotes || 'Cosmetic aesthetic improvement',
        promoCode: promoCodeInput || undefined,
        budgetEstimate: `₹${treatmentBudget.toLocaleString('en-IN')}`,
        shadeGoal: shades[activeShadeIndex].name
      }
    };

    saveLead(submission);
    setSubmittedLeadId(newId);
    setFormSuccess(true);
  };

  // Submit Quiz Lead
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizName || !quizPhone) return;

    const voucher = `SMILE-VOUCHER-${Math.floor(100 + Math.random() * 900)}`;
    const newId = `NIMMA-QZ${Math.floor(1000 + Math.random() * 9000)}`;

    const submission: FormSubmission = {
      id: newId,
      type: 'quiz',
      patientName: quizName,
      phone: quizPhone,
      service: quizGoal || 'Custom Smile Makeover Blueprint',
      doctor: 'Dr. Abhishek Reddy Nimma',
      date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      timeSlot: '11:00 AM',
      status: 'new',
      notes: `Smile Quiz completed. Goal: ${quizGoal}. Timeline: ${quizTimeline}. Desired Shade: ${quizShade}`,
      createdAt: new Date().toISOString(),
      source: 'Virtual Smile Assessment Quiz',
      details: {
        smileGoal: quizGoal,
        promoCode: voucher,
        shadeGoal: quizShade,
        urgency: quizTimeline
      }
    };

    saveLead(submission);
    setQuizVoucherCode(voucher);
    setQuizSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 pt-20 selection:bg-red-100 selection:text-[#EE1D23]">
      
      {/* Top Marketing Sticky Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 text-white text-xs py-2.5 px-4 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-[#EE1D23] text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              FESTIVE CAMPAIGN
            </span>
            <span className="text-white/90 text-xs">
              Complimentary 3D Digital Smile Mockup + 25% Off Laser Whitening this month
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold">
            <button
              onClick={onOpenStaffPortal}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors uppercase tracking-wider font-mono"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Staff Leads Portal (View Submissions)
            </button>
            <span className="text-white/20">|</span>
            <a href="tel:8885166165" className="flex items-center gap-1 text-white/80 hover:text-white">
              <Phone className="w-3 h-3 text-[#EE1D23]" />
              88851 66165
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-red-50/40 via-white to-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-[#EE1D23] text-xs font-bold font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              COSMETIC DENTISTRY & SMILE DESIGN CENTER
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-slate-900 leading-[1.15] tracking-tight">
              Crafting <span className="italic font-normal text-[#EE1D23]">Million-Dollar</span> Smiles with Clinical Perfection.
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              From bespoke hand-layered porcelain veneers to 45-minute laser teeth whitening and invisible aligners. Kamareddy's premier aesthetic dental studio led by certified specialists Dr. Abhishek Reddy Nimma & Dr. Kranthi Nimma.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[#EE1D23] font-black text-xl font-sans block">1,200+</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Smiles Transformed</span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-slate-900 font-black text-xl font-sans block">10-Year</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Veneer Warranty</span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-emerald-600 font-black text-xl font-sans block">0% EMI</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">From ₹2,999/mo</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#smile-quiz"
                className="px-7 py-4 bg-[#EE1D23] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#EE1D23]/90 transition-all shadow-lg shadow-red-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                60-Sec Smile Assessment (Get ₹2,500 Voucher)
              </a>
              <a
                href="#vip-consult-form"
                className="px-7 py-4 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book VIP Consult
              </a>
            </div>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span><strong>4.9/5 Rating</strong> from 850+ verified patient reviews</span>
            </div>
          </div>

          {/* Right Visual Card: 3D Smile Transformation Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#EE1D23]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-[#EE1D23] uppercase tracking-[0.2em] font-bold">
                    Signature Treatment
                  </span>
                  <h3 className="text-xl font-display italic text-white mt-0.5">Digital Smile Design</h3>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono text-emerald-300">
                  Pre-Visualized
                </span>
              </div>

              {/* Interactive Clinical Transformation Showcase */}
              <div className="py-5 space-y-4">
                {/* Before / After Toggle Buttons */}
                <div className="flex items-center justify-center p-1 bg-white/10 rounded-2xl max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => setHeroComparisonState('before')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      heroComparisonState === 'before'
                        ? 'bg-red-500/80 text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Before: Chipped
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroComparisonState('after')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      heroComparisonState === 'after'
                        ? 'bg-[#EE1D23] text-white shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    After: Laminate
                  </button>
                </div>

                {/* Clinical Image Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[3/2] border border-white/10 shadow-lg group">
                  <img
                    src={
                      heroComparisonState === 'after'
                        ? caseVeneersAfter
                        : caseVeneersBefore
                    }
                    alt={
                      heroComparisonState === 'after'
                        ? 'After Seamless Laminate Crowns'
                        : 'Before Chipped & Uneven Edges'
                    }
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[10px] font-bold font-mono tracking-wider shadow-md whitespace-nowrap border border-white/10">
                    {heroComparisonState === 'after' ? 'Seamless Laminate Crowns' : 'Chipped & Uneven Edges'}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                    Verified Outcome
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <p className="text-white font-bold text-xs">E-Max Handcrafted Porcelain Laminates</p>
                  <p className="text-white/60 text-[11px]">Conservative 0.3mm preparation • 100% natural translucency</p>
                </div>
              </div>

              {/* Patient mini review */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span className="font-bold text-[11px]">Sneha R. (Wedding Makeover)</span>
                  <span className="text-emerald-400 font-mono text-[9px]">VERIFIED CASE</span>
                </div>
                <p className="text-[11px] text-white/60 italic leading-relaxed">
                  "I was conscious of my front teeth gap and chipped edges for years. Dr. Abhishek and Dr. Kranthi designed my smile in 3D first. The laminate crowns look completely natural!"
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/50 text-[10px] uppercase font-mono">100% Pain-Free Protocol</span>
                <a href="#vip-consult-form" className="text-[#EE1D23] font-bold hover:underline flex items-center gap-1">
                  Book Aesthetic Consult <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING IDEA 1: Interactive Virtual Smile Assessment Quiz */}
      <section id="smile-quiz" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#EE1D23] text-xs font-bold font-mono tracking-widest uppercase">
              <Gift className="w-3.5 h-3.5" />
              Interactive Lead Magnet
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-slate-900">
              60-Second <span className="italic text-[#EE1D23] font-normal">Smile Assessment</span> & Blueprint
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Answer 3 quick questions about your smile aspirations. Get an instant personalized diagnostic plan plus a <strong>₹2,500 Consultation Voucher</strong>.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-200 relative overflow-hidden">
            {!quizSubmitted ? (
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#EE1D23] text-white text-xs font-bold flex items-center justify-center">
                      {quizStep}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {quizStep === 1 && '1. Primary Smile Enhancement Goal'}
                      {quizStep === 2 && '2. Your Timeline / Occasion'}
                      {quizStep === 3 && '3. Desired Smile Shade'}
                      {quizStep === 4 && '4. Claim Your Smile Blueprint & Voucher'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">Step {quizStep} of 4</span>
                </div>

                {/* Step 1: Smile Goal */}
                {quizStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">What would you love to improve most?</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Close Gaps & Spaces', desc: 'Fix midline or uneven spacing with veneers or bonding' },
                        { title: 'Brighter, Whiter Teeth', desc: 'Remove stubborn yellow/tea stains with Zoom 4 Laser' },
                        { title: 'Straighten Crooked Teeth', desc: 'Fix overlapping teeth without visible metal braces' },
                        { title: 'Fix Chipped or Worn Teeth', desc: 'Restore chipped edges and youthful tooth contours' },
                        { title: 'Reduce Gummy Smile', desc: 'Gentle laser sculpting for balanced gum-to-tooth ratio' },
                        { title: 'Full Bridal / Complete Makeover', desc: 'Total smile rejuvenation for a grand life event' }
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => setQuizGoal(item.title)}
                          className={`p-4 rounded-2xl text-left border transition-all ${
                            quizGoal === item.title
                              ? 'bg-red-50/80 border-[#EE1D23] ring-2 ring-red-200 text-slate-900'
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <p className="font-bold text-xs text-slate-900">{item.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Timeline */}
                {quizStep === 2 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">What is your target timeline or special occasion?</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Wedding or Engagement (1-3 months)', badge: 'Priority Rush' },
                        { title: 'Important Job / Career Milestone', badge: 'High Impact' },
                        { title: 'Milestone Birthday / Social Event', badge: 'Occasion' },
                        { title: 'General Self-Confidence & Daily Glow', badge: 'Lifestyle' }
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => setQuizTimeline(item.title)}
                          className={`p-5 rounded-2xl text-left border transition-all ${
                            quizTimeline === item.title
                              ? 'bg-red-50/80 border-[#EE1D23] ring-2 ring-red-200 text-slate-900'
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="text-[9px] font-mono font-bold text-[#EE1D23] uppercase tracking-wider block mb-1">
                            {item.badge}
                          </span>
                          <p className="font-bold text-xs text-slate-900">{item.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Desired Shade */}
                {quizStep === 3 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select your preferred brightness target:</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { shade: 'BL1 Hollywood Bleach', desc: 'Maximum radiance & celebrity brightness' },
                        { shade: 'A1 Pearl Natural White', desc: 'Brightest natural organic shade' },
                        { shade: 'B1 Soft Aesthetic Glow', desc: 'Subtle, discreet rejuvenation' }
                      ].map((item) => (
                        <button
                          key={item.shade}
                          type="button"
                          onClick={() => setQuizShade(item.shade)}
                          className={`p-4 rounded-2xl text-center border transition-all ${
                            quizShade === item.shade
                              ? 'bg-red-50/80 border-[#EE1D23] ring-2 ring-red-200'
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-slate-200 shadow-inner bg-white flex items-center justify-center font-black text-xs text-slate-700">
                            {item.shade.slice(0, 3)}
                          </div>
                          <p className="font-bold text-xs text-slate-900">{item.shade}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Contact Form */}
                {quizStep === 4 && (
                  <form onSubmit={handleQuizSubmit} className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-[#EE1D23]" />
                        <div>
                          <p className="font-bold text-xs text-slate-900">₹2,500 Consultation Voucher Ready</p>
                          <p className="text-[10px] text-slate-600">Enter your details to generate your official clinic pass.</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-[#EE1D23] bg-white px-3 py-1 rounded-lg border border-red-200">
                        SMILE-QUIZ-2500
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Full Name</label>
                        <input
                          required
                          type="text"
                          value={quizName}
                          onChange={(e) => setQuizName(e.target.value)}
                          placeholder="e.g. Sravan Reddy"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Mobile Number</label>
                        <input
                          required
                          type="tel"
                          value={quizPhone}
                          onChange={(e) => setQuizPhone(e.target.value)}
                          placeholder="e.g. 98490 12345"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!quizName || !quizPhone}
                      className="w-full py-4 bg-[#EE1D23] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#EE1D23]/90 transition-all shadow-md shadow-red-500/20 disabled:opacity-50"
                    >
                      Generate My Smile Blueprint & Voucher Now
                    </button>
                  </form>
                )}

                {/* Quiz Step Navigation */}
                {quizStep < 4 && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    {quizStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setQuizStep(prev => prev - 1)}
                        className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                      >
                        Back
                      </button>
                    ) : <div />}

                    <button
                      type="button"
                      onClick={() => {
                        if (quizStep === 1 && !quizGoal) return;
                        if (quizStep === 2 && !quizTimeline) return;
                        setQuizStep(prev => prev + 1);
                      }}
                      disabled={(quizStep === 1 && !quizGoal) || (quizStep === 2 && !quizTimeline)}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-40"
                    >
                      Next Step
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Success Screen for Quiz */
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-display italic text-slate-900">Smile Assessment Blueprint Generated!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your inquiry has been submitted and registered with Nimma's Dental Clinic.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-400">Voucher Code:</span>
                    <span className="text-[#EE1D23] font-black">{quizVoucherCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Goal:</span>
                    <span className="font-bold text-slate-900">{quizGoal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="font-bold text-slate-900">{quizTimeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Shade:</span>
                    <span className="font-bold text-slate-900">{quizShade}</span>
                  </div>
                </div>

                {/* Direct answer to user's question: "where does the filled form can be viewed" */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto space-y-2">
                  <p className="text-xs font-bold text-emerald-900">
                    👩‍⚕️ Front Desk Reception Record Created
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    This filled form has been saved into the clinic leads system. Clinic staff can view and manage it right now in the Staff Portal.
                  </p>
                  <button
                    onClick={onOpenStaffPortal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all mt-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Open Staff Leads Portal to View
                  </button>
                </div>

                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizStep(1);
                    setQuizGoal('');
                    setQuizTimeline('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline block mx-auto"
                >
                  Restart Assessment Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REAL PATIENT CLINICAL TRANSFORMATIONS (BEFORE & AFTER GALLERY) */}
      <section id="transformations-gallery" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#EE1D23] bg-red-50 px-4 py-1.5 rounded-full inline-block">
              Clinical Case Documentation
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light text-slate-900">
              Real Patient <span className="italic font-normal text-[#EE1D23]">Smile Transformations</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Authentic macro dental photography from cases treated by Dr. Abhishek Reddy Nimma and Dr. Kranthi Nimma. Toggle between Before & After to inspect the clinical craftsmanship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* CASE 1: PORCELAIN VENEERS */}
            <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Case Top Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EE1D23]">
                    Case 01 • Veneers & Crowns
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-bold uppercase">
                    5-Day Result
                  </span>
                </div>

                {/* Before / After Toggle Buttons */}
                <div className="flex p-1 bg-slate-200/80 rounded-2xl mb-4">
                  <button
                    type="button"
                    onClick={() => setCaseViews(prev => ({ ...prev, veneers: 'before' }))}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      caseViews.veneers === 'before'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before: Chipped
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseViews(prev => ({ ...prev, veneers: 'after' }))}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      caseViews.veneers === 'after'
                        ? 'bg-[#EE1D23] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    After: Laminate
                  </button>
                </div>

                {/* Image Showcase */}
                <div className="relative rounded-2xl overflow-hidden aspect-[3/2] border border-slate-200 shadow-inner mb-4 bg-slate-900">
                  <img
                    src={
                      caseViews.veneers === 'after'
                        ? caseVeneersAfter
                        : caseVeneersBefore
                    }
                    alt="Porcelain Veneers Case"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[10px] font-bold font-mono tracking-wider shadow-md whitespace-nowrap border border-white/10">
                    {caseViews.veneers === 'after' ? 'Seamless Laminate Crowns' : 'Chipped & Uneven Edges'}
                  </div>
                </div>

                <h3 className="font-display italic text-lg text-slate-900 mb-1">
                  Handcrafted Porcelain Laminates
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Restored fractured front central incisors with natural light-transmitting E-Max ceramics. Zero visible margins.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {['0.3mm Micro-Prep', 'Digital CAD/CAM', '10-Yr Guarantee'].map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-600 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage('Handcrafted Porcelain Veneers', 'VENEER-VIP')}
                className="w-full py-3 bg-slate-900 hover:bg-[#EE1D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Book Porcelain Veneers <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CASE 2: LASER TEETH WHITENING */}
            <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Case Top Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EE1D23]">
                    Case 02 • Laser Whitening
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-bold uppercase">
                    45-Min Result
                  </span>
                </div>

                {/* Before / After Toggle Buttons */}
                <div className="flex p-1 bg-slate-200/80 rounded-2xl mb-4">
                  <button
                    type="button"
                    onClick={() => setCaseViews(prev => ({ ...prev, whitening: 'before' }))}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      caseViews.whitening === 'before'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before: Stained
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseViews(prev => ({ ...prev, whitening: 'after' }))}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      caseViews.whitening === 'after'
                        ? 'bg-[#EE1D23] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    After: 8-Shades
                  </button>
                </div>

                {/* Image Showcase */}
                <div className="relative rounded-2xl overflow-hidden aspect-[3/2] border border-slate-200 shadow-inner mb-4 bg-slate-900">
                  <img
                    src={
                      caseViews.whitening === 'after'
                        ? caseWhiteningAfter
                        : caseWhiteningBefore
                    }
                    alt="Laser Teeth Whitening Case"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[10px] font-bold font-mono tracking-wider shadow-md whitespace-nowrap border border-white/10">
                    {caseViews.whitening === 'after' ? '8-Shade Lighter Brilliance' : 'Heavy Coffee & Tea Stains'}
                  </div>
                </div>

                <h3 className="font-display italic text-lg text-slate-900 mb-1">
                  Zoom 4 Power Laser Whitening
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Eliminated deeply set coffee, tea, and tobacco stains in a single clinical session with desensitizing dental barriers.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {['Cold Blue LED', 'Enamel Shielded', 'Zero Sensitivity'].map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-600 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage('Zoom 4 In-Office Laser Whitening', 'WHITEN-GLOW')}
                className="w-full py-3 bg-slate-900 hover:bg-[#EE1D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Book Laser Whitening <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CASE 3: INVISIBLE ALIGNERS */}
            <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Case Top Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EE1D23]">
                    Case 03 • Orthodontic Arch
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-bold uppercase">
                    Non-Extraction
                  </span>
                </div>

                {/* Before / After Toggle Buttons */}
                <div className="flex p-1 bg-slate-200/80 rounded-2xl mb-4">
                  <button
                    type="button"
                    onClick={() => setCaseViews(prev => ({ ...prev, ortho: 'before' }))}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      caseViews.ortho === 'before'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before: Crowded
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseViews(prev => ({ ...prev, ortho: 'after' }))}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      caseViews.ortho === 'after'
                        ? 'bg-[#EE1D23] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    After: Aligned
                  </button>
                </div>

                {/* Image Showcase */}
                <div className="relative rounded-2xl overflow-hidden aspect-[3/2] border border-slate-200 shadow-inner mb-4 bg-slate-900">
                  <img
                    src={
                      caseViews.ortho === 'after'
                        ? caseOrthoAfter
                        : caseOrthoBefore
                    }
                    alt="Invisible Aligners Case"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[10px] font-bold font-mono tracking-wider shadow-md whitespace-nowrap border border-white/10">
                    {caseViews.ortho === 'after' ? 'Perfect Aesthetic Arch' : 'Crowded & Misaligned Teeth'}
                  </div>
                </div>

                <h3 className="font-display italic text-lg text-slate-900 mb-1">
                  NimmaClear Invisible Aligners
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Corrected severe lower crowding and rotated upper front incisors in 7 months without metallic brackets or pain.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {['Itero 3D Scanned', 'Virtually Invisible', 'Free Retainers'].map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-600 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage('NimmaClear Invisible Aligners', 'ALIGN-VIP')}
                className="w-full py-3 bg-slate-900 hover:bg-[#EE1D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Book Aligner Scan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING IDEA 2: Interactive Smile Shade Comparison & Simulator */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#EE1D23]">
              Visual Shade Simulator
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-slate-900">
              Find Your Ideal <span className="italic font-normal text-[#EE1D23]">Aesthetic Shade</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Compare clinical shade guide tabs. See how precision whitening or veneers elevate your smile radiance.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Shade Selection Buttons */}
            <div className="lg:col-span-5 space-y-3">
              {shades.map((shade, idx) => (
                <button
                  key={shade.code}
                  onClick={() => setActiveShadeIndex(idx)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    activeShadeIndex === idx
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-[#EE1D23]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center font-black text-xs"
                      style={{ backgroundColor: shade.color, color: idx === 3 ? '#000' : '#444' }}
                    >
                      {shade.code}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{shade.name}</p>
                      <p className={`text-[10px] mt-0.5 ${activeShadeIndex === idx ? 'text-white/70' : 'text-slate-500'}`}>
                        {shade.desc}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold font-mono ${activeShadeIndex === idx ? 'text-[#EE1D23]' : 'text-slate-400'}`}>
                    {shade.brightness}
                  </span>
                </button>
              ))}
            </div>

            {/* Visual Preview Canvas */}
            <div className="lg:col-span-7 bg-slate-900 text-white p-8 rounded-[3rem] border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#EE1D23] font-bold">
                  Simulated Enamel Radiance
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {shades[activeShadeIndex].code} - {shades[activeShadeIndex].brightness} Lumens
                </span>
              </div>

              {/* Dynamic Teeth Graphic that lights up based on shade */}
              <div className="py-12 text-center">
                <div 
                  className="w-64 h-32 mx-auto rounded-[3rem] p-4 flex items-center justify-center gap-2 border-4 transition-all duration-500 shadow-2xl"
                  style={{
                    backgroundColor: shades[activeShadeIndex].color,
                    borderColor: activeShadeIndex === 3 ? '#EE1D23' : '#cbd5e1',
                    boxShadow: activeShadeIndex === 3 ? '0 0 35px rgba(238, 29, 35, 0.4)' : '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Row of teeth smile mockup */}
                  {[0.9, 1.1, 1.25, 1.25, 1.1, 0.9].map((scale, i) => (
                    <div
                      key={i}
                      className="w-7 h-16 rounded-b-2xl border border-slate-300/40 bg-white/95 shadow-sm transform transition-transform duration-300"
                      style={{
                        transform: `scaleY(${scale})`,
                        backgroundColor: shades[activeShadeIndex].color
                      }}
                    />
                  ))}
                </div>

                <div className="mt-6 space-y-1">
                  <p className="text-sm font-bold text-white">
                    {shades[activeShadeIndex].name} ({shades[activeShadeIndex].code})
                  </p>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    Achievable via: {activeShadeIndex >= 2 ? 'In-Office Zoom Laser Whitening or Porcelain Veneers' : 'Airflow Stain Polish & Routine Scaling'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/40 text-[10px] font-mono">Custom Digital Shade Matcher</span>
                <button
                  onClick={() => {
                    setSelectedService(`Teeth Whitening (${shades[activeShadeIndex].code} Goal)`);
                    const formElement = document.getElementById('vip-consult-form');
                    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#EE1D23] font-bold hover:underline"
                >
                  Book Shade Consultation →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING IDEA 3: Limited-Time Signature Cosmetic Packages */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#EE1D23]">
              Curated Transformation Bundles
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-slate-900">
              Limited-Time <span className="italic font-normal text-[#EE1D23]">Cosmetic Packages</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Transparent, all-inclusive pricing with zero surprises. Choose a package below to lock in promotional rates and instant booking priority.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Package 1 */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-red-100 text-[#EE1D23] text-[10px] font-black uppercase tracking-wider rounded-full font-mono">
                  SPECIAL OCCASION
                </span>
                <h3 className="font-display italic text-2xl text-slate-900">The Bridal & Groom Glow</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Engineered specifically for couples and wedding parties seeking photo-ready brightness with zero sensitivity.
                </p>

                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">₹11,999</span>
                    <span className="text-sm text-slate-400 line-through">₹16,500</span>
                    <span className="text-xs font-bold text-emerald-600">(Save 28%)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Single 45-Minute In-Clinic Session</span>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-slate-700">
                  {[
                    'Philips Zoom 4 Advanced Laser Whitening',
                    'Swiss Airflow Prophylaxis (Stain Cleanse)',
                    'Fluoride Enamel Gloss Desensitizer',
                    'Complimentary Couple Smile Analysis',
                    'Home Maintenance Touch-Up Gel Kit'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPackage('The Bridal & Groom Glow', 'BRIDAL-GLOW-28')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Claim Bridal Package
                </button>
              </div>
            </div>

            {/* Package 2 (Featured) */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl border-2 border-[#EE1D23] flex flex-col justify-between relative transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#EE1D23] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-md font-mono">
                MOST POPULAR • SIGNATURE
              </div>

              <div className="space-y-4 pt-2">
                <span className="px-3 py-1 bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full font-mono">
                  10-YEAR WARRANTY
                </span>
                <h3 className="font-display italic text-2xl text-white">Hollywood Smile Veneers</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Permanent ultra-thin porcelain veneers handcrafted in master dental labs. Flawless shape, color, and symmetry.
                </p>

                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">₹3,499<span className="text-sm font-normal text-white/60">/mo</span></span>
                    <span className="text-xs font-bold text-emerald-400">0% No-Cost EMI</span>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono block mt-0.5">Total plan customized to upper smile line</span>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-white/80">
                  {[
                    'Handcrafted 0.3mm Porcelain / E.max Veneers',
                    'Complimentary 3D Digital Smile Mockup (₹3,000 Free)',
                    'Official 10-Year Clinical Warranty Certificate',
                    'Zero Pain Computerized Anesthesia Protocol',
                    'Custom Night Guard & Lifetime Annual Polish'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#EE1D23] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPackage('Hollywood Smile Veneers', 'VENEER-VIP-0EMI')}
                  className="w-full py-3.5 bg-[#EE1D23] hover:bg-[#EE1D23]/90 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/30"
                >
                  Claim Veneers Package & 3D Scan
                </button>
              </div>
            </div>

            {/* Package 3 */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-full font-mono">
                  ZERO METAL WIRES
                </span>
                <h3 className="font-display italic text-2xl text-slate-900">NimmaClear Invisible Aligners</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Transparent medical-grade aligners that straighten crooked or crowded teeth invisibly. Remove to eat & brush freely.
                </p>

                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">₹2,850<span className="text-sm font-normal text-slate-400">/mo</span></span>
                    <span className="text-xs font-bold text-purple-600">Flexible EMI</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Free 3D Intraoral Digital Scanning</span>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-slate-700">
                  {[
                    'Full Intraoral 3D Digital Scan (Worth ₹3,000 Free)',
                    '3D Video Animation of Your Exact Tooth Movement',
                    'Complete Set of Invisible Aligners',
                    'Remote Tele-Dentistry Monitoring by Dr. Kranthi',
                    'Free Retainers After Treatment Included'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPackage('NimmaClear Invisible Aligners', 'ALIGNER-SCAN-FREE')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Claim Aligners Special
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING IDEA 4: 0% Interest EMI & Budget Financing Calculator */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#EE1D23]">
              Transparent Patient Financing
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-slate-900">
              0% Interest <span className="italic font-normal text-[#EE1D23]">EMI Calculator</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your dream smile shouldn't wait. Split your cosmetic treatment into affordable zero-interest monthly installments.
            </p>
          </div>

          <div className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estimated Treatment Investment
                </label>
                <span className="text-2xl font-black text-slate-900 font-sans">
                  ₹{treatmentBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="250000"
                step="5000"
                value={treatmentBudget}
                onChange={(e) => setTreatmentBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EE1D23]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>₹15,000 (Laser Whitening)</span>
                <span>₹80,000 (Veneers / Aligners)</span>
                <span>₹2,50,000 (Full Smile Rebuild)</span>
              </div>
            </div>

            {/* Tenure Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Repayment Months (0% No-Cost Interest)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[3, 6, 12, 18].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTenureMonths(m)}
                    className={`py-3 rounded-2xl text-center border font-bold text-xs transition-all ${
                      tenureMonths === m
                        ? 'bg-[#EE1D23] text-white border-[#EE1D23] shadow-md shadow-red-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Your Zero-Interest Monthly Installment
                </span>
                <p className="text-3xl sm:text-4xl font-black text-[#EE1D23] font-sans mt-0.5">
                  ₹{calculateEMI(treatmentBudget, tenureMonths).toLocaleString('en-IN')}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Zero processing fee • Instant paperless approval in 10 minutes</p>
              </div>

              {/* Partner Badges */}
              <div className="flex flex-wrap sm:flex-col gap-2 text-right">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Financing Partners:</span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-700">Bajaj Finserv</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-700">HDFC Healthcare</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-700">PineLabs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING IDEA 5: The 3 Nimma Cosmetic Guarantees */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#EE1D23]">
              Peace of Mind
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-white">
              The <span className="italic font-normal text-[#EE1D23]">Nimma Smile</span> Guarantees
            </h2>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              We stand behind every restoration with written clinical warranties and strict medical standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE1D23]/20 text-[#EE1D23] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display italic text-xl text-white">10-Year Porcelain Warranty</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                All handcrafted E.max and ceramic veneers come with an official 10-year warranty covering chipping, staining, and debonding.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE1D23]/20 text-[#EE1D23] flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display italic text-xl text-white">100% Pain-Free Protocol</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Computerized slow-delivery anesthesia and micro-laser technology ensure you feel zero pain or needle anxiety during cosmetic sculpting.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE1D23]/20 text-[#EE1D23] flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-display italic text-xl text-white">3D Preview Before We Begin</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                You will preview, test, and approve your new smile in realistic 3D mockup models before any permanent work is started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIP COSMETIC CONSULTATION BOOKING FORM (Answers "where does the filled form can be viewed") */}
      <section id="vip-consult-form" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#EE1D23]">
              Direct Clinical Registration
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light text-slate-900">
              Book Your <span className="italic font-normal text-[#EE1D23]">VIP Smile Consultation</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Schedule your 1-on-1 aesthetic diagnosis with Dr. Abhishek Reddy Nimma & Dr. Kranthi Nimma. Receive personal attention and zero-waiting priority.
            </p>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-200 relative overflow-hidden">
            {/* Aesthetic Specialists Profile Banner */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8 p-4 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100/90">
                <img 
                  src={drAbhishekImg}
                  alt="Dr. Abhishek Reddy Nimma" 
                  className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-white shadow-sm ring-1 ring-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-display italic text-sm text-slate-900 font-medium">Dr. Abhishek Reddy Nimma</h4>
                  <p className="text-[10px] font-bold text-[#EE1D23] uppercase tracking-wider">Facial Aesthetics & Implants</p>
                  <span className="text-[10px] text-slate-500 font-sans">BDS, MDS • Consultant Surgeon</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100/90">
                <img 
                  src={drKranthiImg} 
                  alt="Dr. Kranthi Nimma" 
                  className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-white shadow-sm ring-1 ring-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-display italic text-sm text-slate-900 font-medium">Dr. Kranthi Nimma</h4>
                  <p className="text-[10px] font-bold text-[#EE1D23] uppercase tracking-wider">Periodontics & Smile Design</p>
                  <span className="text-[10px] text-slate-500 font-sans">BDS, MDS • Aesthetic Specialist</span>
                </div>
              </div>
            </div>

            {!formSuccess ? (
              <form onSubmit={handleVIPFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Selected Treatment Category
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                    >
                      <option value="Handcrafted Porcelain Veneers">Handcrafted Porcelain Veneers</option>
                      <option value="The Bridal & Groom Glow">The Bridal & Groom Glow (Whitening Package)</option>
                      <option value="Zoom 4 In-Office Laser Whitening">Zoom 4 In-Office Laser Whitening</option>
                      <option value="NimmaClear Invisible Aligners">NimmaClear Invisible Aligners</option>
                      <option value="Direct Composite Artistic Bonding">Direct Composite Artistic Bonding</option>
                      <option value="Laser Gum Sculpting (Gummy Smile)">Laser Gum Sculpting (Gummy Smile)</option>
                      <option value="Full Mouth Cosmetic Reconstruction">Full Mouth Cosmetic Reconstruction</option>
                    </select>
                  </div>

                  {/* Doctor Choice */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Specialist Preference
                    </label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                    >
                      <option value="Dr. Abhishek Reddy Nimma">Dr. Abhishek Reddy Nimma (Maxillofacial / Implants)</option>
                      <option value="Dr. Kranthi Nimma">Dr. Kranthi Nimma (Periodontist / Gum Aesthetics)</option>
                      <option value="Best Available Aesthetic Specialist">Best Available Aesthetic Specialist</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Patient Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Sneha Reddy"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="e.g. 98490 12345"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="sneha@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Time Slot */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Morning)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="06:30 PM">06:30 PM (Evening)</option>
                    </select>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Promo / Campaign Voucher
                    </label>
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="e.g. BRIDAL-GLOW-28"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 uppercase font-mono font-bold focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Smile Concerns */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    What would you like the doctors to focus on? (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={smileNotes}
                    onChange={(e) => setSmileNotes(e.target.value)}
                    placeholder="Tell us about upcoming events, previous dental work, or specific aesthetic concerns..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!patientName || !patientPhone}
                  className="w-full py-4 bg-[#EE1D23] hover:bg-[#EE1D23]/90 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/25 disabled:opacity-50"
                >
                  Confirm & Reserve VIP Cosmetic Slot
                </button>
              </form>
            ) : (
              /* Success Screen */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-3xl font-display italic text-slate-900">VIP Consultation Registered!</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono font-bold">
                    Booking Reference: <span className="text-[#EE1D23]">{submittedLeadId}</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-6 text-left max-w-md mx-auto space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-400">PATIENT:</span>
                    <span className="font-bold text-slate-900">{patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PROCEDURE:</span>
                    <span className="font-bold text-slate-900">{selectedService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DOCTOR:</span>
                    <span className="font-bold text-slate-900">{selectedDoctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SLOT:</span>
                    <span className="font-bold text-slate-900">{preferredDate || 'Upcoming Date'} at {preferredTime}</span>
                  </div>
                  {promoCodeInput && (
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-400">PROMO CODE:</span>
                      <span className="font-bold text-emerald-600">{promoCodeInput}</span>
                    </div>
                  )}
                </div>

                {/* THE EXPLICIT ANSWER TO USER'S QUESTION: "where does the filled form can be viewed" */}
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl max-w-md mx-auto text-left space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Clinic Reception Form Synchronized!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    <strong>Where can this filled form be viewed?</strong> It is saved to the persistent Clinic Leads Database. Front desk staff or doctors can view, call, or message this patient from the <strong>Staff Leads Portal</strong>.
                  </p>
                  <button
                    onClick={onOpenStaffPortal}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Open Staff Leads Portal to View This Submission
                  </button>
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setFormSuccess(false);
                      setPatientName('');
                      setPatientPhone('');
                      setPatientEmail('');
                      setSmileNotes('');
                    }}
                    className="px-6 py-3 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-wider"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={onBackToHome}
                    className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-slate-800"
                  >
                    Return to Main Clinic
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Floating Quick Link to Staff Portal */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenStaffPortal}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-2xl border border-white/20 transition-all hover:scale-105"
          title="Where filled forms can be viewed"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#EE1D23]" />
          <span>Staff Portal (View Leads)</span>
        </button>
      </div>
    </div>
  );
};
