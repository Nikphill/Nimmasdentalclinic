/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Smile,
  ChevronRight,
  ChevronDown,
  Star,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Award,
  Heart,
  Eye,
  Sliders,
  User,
  Activity,
  Train,
  Bus,
  Plus,
  Minus,
  Building2,
  Navigation,
  Info,
  FileSpreadsheet
} from 'lucide-react';

import { CosmeticDentistryPage } from './components/CosmeticDentistryPage';
import { StaffLeadsPortal } from './components/StaffLeadsPortal';
import { saveLead, getLeads } from './services/leadsStore';
import caseOrthoBefore from './assets/images/case_ortho_before.jpg';
import caseOrthoAfter from './assets/images/case_ortho_after.jpg';
import caseWhiteningBefore from './assets/images/case_whitening_before.jpg';
import caseWhiteningAfter from './assets/images/case_whitening_after.jpg';
import caseVeneersBefore from './assets/images/case_veneers_before.jpg';
import caseVeneersAfter from './assets/images/case_veneers_after.jpg';
import drAbhishekImg from './assets/images/dr_abhishek_portrait_1790654546044.jpg';
import drKranthiImg from './assets/images/dr_kranthi_portrait_1790654560360.jpg';
import clinicHeroImg from './assets/images/clinic_hero_image_1779109449064.png';

// --- SVGs & Brand Logos ---

const NimmaLogoIcon = ({ className = "w-10 h-10", fillClass = "fill-current" }: { className?: string; fillClass?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Dental Mirror (left) */}
    <path 
      d="M36 44 L22 28" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <ellipse 
      cx="18" 
      cy="24" 
      rx="9" 
      ry="5.5" 
      transform="rotate(-35 18 24)" 
      className={fillClass} 
    />
    
    {/* Dental Explorer Hook (right) */}
    <path 
      d="M42 42 C45 32, 47 25, 46.5 21 C46 17, 44 14, 44.5 10 C45 6, 48 4, 49 3.5 C49.5 3, 49 4.5, 48 5.5 C46.5 7.5, 45 10, 46 13.5 C47 17, 49.5 21, 50.5 27 L43 42" 
      className={fillClass}
    />
    
    {/* The Tooth Body */}
    <path 
      d="M34 45 
         C25 43, 22 54, 23 64 
         C24 74, 27 80, 27 88 
         C27 90, 29 91, 30 90 
         C32 87, 35 80, 38 78
         C41 76, 44 76, 47 78
         C50 80, 53 87, 55 90
         C56 91, 58 90, 58 88
         C58 80, 61 74, 62 64
         C63 54, 60 43, 51 45
         C47 46, 43 48, 43 48
         C43 48, 39 46, 34 45 Z" 
      className={fillClass} 
    />
    
    {/* White contour highlight on the left of tooth */}
    <path 
      d="M28 54 C25 58, 25 66, 26 71" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
  </svg>
);

const ToothIcon = NimmaLogoIcon;

// --- Subcomponents ---

// 1. Before/After Interactive Smile Comparison Slider
const BeforeAfterSlider = () => {
  const cases = [
    {
      id: 'ortho',
      title: 'Orthodontic Alignment',
      subtitle: 'Braces & Clear Aligners',
      beforeTip: 'Crowded & Misaligned Teeth',
      afterTip: 'Perfect Aesthetic Arch',
     	beforeImg: caseOrthoBefore,
     afterImg: caseOrthoAfter,
      desc: 'Achieved a beautiful symmetrical smile arch and corrected heavy diagnostic crowding within 14 months using premium custom alignments.'
    },
    {
      id: 'whitening',
      title: 'Laser Teeth Whitening',
      subtitle: 'Power Smile Design',
      beforeTip: 'Heavy Coffee & Tea Stains',
      afterTip: '8-Shade Lighter Brilliance',
      beforeImg: caseWhiteningBefore,
      afterImg: caseWhiteningAfter,
      desc: 'Removed deep enamel discoloration and dark extrinsic organic staining dynamically in a single 45-minute in-office session.'
    },
    {
      id: 'veneers',
      title: 'Cosmetic Veneers',
      subtitle: 'Serrated Crack Repair',
      beforeTip: 'Chipped & Uneven Edges',
      afterTip: 'Seamless Laminate Crowns',
      beforeImg: caseVeneersBefore,
      afterImg: caseVeneersAfter,
      desc: 'Designed ultra-thin, highly biocompatible porcelain veneers to seamlessly restore symmetry, chips, and anatomical gaps.'
    }
  ];

  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100 percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const activeCase = cases[activeCaseIdx];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <section className="py-24 bg-white border-t border-slate-100 relative">
      <div className="absolute top-0 left-0 w-32 h-32 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Visual Evidence</span>
          <h2 className="text-4xl md:text-5xl font-display font-light text-clinic-secondary leading-tight mb-4">
            Interactive Smile <span className="italic font-normal text-clinic-primary">Transformation</span>
          </h2>
          <p className="text-clinic-accent max-w-2xl mx-auto text-sm">
            Drag the slider sideways with your cursor or finger to compare the clinical transformations achieved in our modern practice.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Controls Side */}
          <div className="w-full lg:w-1/3 space-y-4">
            <h3 className="text-xs font-bold text-clinic-primary uppercase tracking-[0.25em] mb-4">Select Treatment Case</h3>
            <div className="space-y-3">
              {cases.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCaseIdx(idx);
                    setSliderPos(50);
                  }}
                  className={`w-full text-left p-5 rounded-3xl transition-all border ${
                    activeCaseIdx === idx 
                      ? 'bg-clinic-primary/5 border-clinic-primary/20 shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 border-transparent'
                  }`}
                >
                  <p className="text-xs font-bold text-clinic-primary uppercase tracking-wider mb-1">{c.subtitle}</p>
                  <p className="font-display font-semibold italic text-clinic-secondary text-lg">{c.title}</p>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-clinic-secondary uppercase tracking-widest mb-2">Case Summary</p>
              <p className="text-xs text-clinic-accent leading-relaxed">{activeCase.desc}</p>
            </div>
          </div>

          {/* Slider Side */}
          <div className="w-full lg:w-2/3">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => { isDragging.current = true; }}
              onTouchStart={() => { isDragging.current = true; }}
              className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl select-none cursor-ew-resize border-4 border-white"
            >
              {/* Before image */}
              <img 
                src={activeCase.beforeImg} 
                alt="Before treatment" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 bg-slate-900/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest leading-none">
                {activeCase.beforeTip}
              </div>

              {/* After image overlay container */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPos}%` }}
              >
                <img 
                  src={activeCase.afterImg} 
                  alt="After treatment" 
                  className="absolute inset-0 w-full h-full object-cover filter brightness-105"
                  style={{ width: containerRef.current?.getBoundingClientRect().width }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6 bg-clinic-primary/90 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest leading-none whitespace-nowrap">
                  {activeCase.afterTip}
                </div>
              </div>

              {/* Floating handle divider */}
              <div 
                className="absolute top-0 bottom-0 w-[4px] bg-white cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-clinic-primary text-white shadow-xl flex items-center justify-center border-4 border-white">
                  <Sliders className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 px-2 text-[10px] font-extrabold text-clinic-accent tracking-widest uppercase">
              <span>← Slide Left for Before</span>
              <span>Slide Right for After →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 2. Interactive Multi-Specialty Services Guide
const ServicesTabs = () => {
  const categories = [
    {
      id: 'general',
      name: 'General & Kids',
      badge: 'Family Wellness',
      items: [
        {
          title: 'Comprehensive Consultation',
          desc: 'Thorough evaluation of teeth, gums, oral tissue structure, and digital diagnostics to outline an accurate roadmap for oral health.',
          duration: '30 Mins',
          action: 'Select'
        },
        {
          title: 'Holistic Scaling & Cleaning',
          desc: 'Painless plaque, tartar, and stain removal with therapeutic polishing to safeguard gums against active periodontal infections.',
          duration: '45 Mins',
          action: 'Select'
        },
        {
          title: 'Pedodontics (Child Care)',
          desc: 'Compassionate dental care custom-molded for children, providing preventive sealants, cavity fills, and dental orientation in a relaxing environment.',
          duration: '40 Mins',
          action: 'Select'
        },
        {
          title: 'Fluoride Preventive Treatment',
          desc: 'Strengthens developing tooth enamel with active chemical shield application to arrest early microscopic caries.',
          duration: '15 Mins',
          action: 'Select'
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Surgery & Implants',
      badge: 'Precision Restorations',
      items: [
        {
          title: 'Maxillofacial Implants & Lasers',
          desc: 'High-end bio-compatible titanium fixtures embedded with soft-tissue surgical lasers for immediate stability and virtually painless recovery.',
          duration: '60 Mins',
          action: 'Select'
        },
        {
          title: 'Micro-Endodontics (Root Canal)',
          desc: 'State-of-the-art diagnostic root canal treatments designed to gently treat deep nerve infections and securely salvage natural teeth structure.',
          duration: '50 Mins',
          action: 'Select'
        },
        {
          title: 'Maxillofacial Orthosurgeries',
          desc: 'Advanced corrective jaw surgery, wisdom tooth extractions, and cyst removals performed with masterclass clinical care by Dr. Abhishek Reddy.',
          duration: '90 Mins',
          action: 'Select'
        },
        {
          title: 'Laser Crown Lengthening',
          desc: 'Using soft tissue laser systems to sculpt correct contours of the gum margin cleanly before placing restorative crowns.',
          duration: '45 Mins',
          action: 'Select'
        }
      ]
    },
    {
      id: 'aesthetic',
      name: 'Cosmetics & Braces',
      badge: 'Smile Architecture',
      items: [
        {
          title: 'Cosmetic Smile Designing',
          desc: 'A complete custom makeover planning layout utilizing high-end porcelain veneers, crowns, and composite reshaping for an elegant, photogenic arch.',
          duration: '2-3 Sessions',
          action: 'Select'
        },
        {
          title: 'Orthodontics & Clear Aligners',
          desc: 'Discreet correction of crowding, overlapping teeth, and bite issues with premium, transparent, invisible Invisalign series.',
          duration: 'Monthly Checks',
          action: 'Select'
        },
        {
          title: 'Laser Teeth Whitening',
          desc: 'Accelerated oxygenating gel activated by standard cosmetic laser light to erase decades of coffee, tea, and tobacco stains safely.',
          duration: '45 Mins',
          action: 'Select'
        },
        {
          title: 'Aesthetic Dental Jewellery',
          desc: 'Painless, zero-drill attachment of certified crystal diamonds onto tooth surfaces for an ultra-chic, playful sparkle.',
          duration: '20 Mins',
          action: 'Select'
        }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState('general');
  const activeData = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section id="services" className="py-24 bg-clinic-secondary text-white rounded-t-[60px] relative z-20 -mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-mono">Expertise Classification</span>
            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight">
              Clinical <span className="italic text-clinic-primary">Specialties</span>
            </h2>
            <p className="text-white/60 max-w-xl text-sm mt-3">
              We offer comprehensive, sterile clinical systems optimized to cater to distinct age brackets and structural restorative needs.
            </p>
          </div>

          {/* Tabs switch */}
          <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-3xl border border-white/10 self-start">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all uppercase ${
                  activeTab === cat.id 
                    ? 'bg-clinic-primary text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="mb-10 flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-3xl w-fit">
          <span className="bg-clinic-primary/20 text-clinic-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {activeData.badge}
          </span>
          <span className="text-xs text-white/80">Premium quality protocols guaranteed for all standard treatments.</span>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {activeData.items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/10 transition-all hover:border-clinic-primary/30 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-display italic text-white group-hover:text-clinic-primary transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase text-white/70">
                      <Clock className="w-3 h-3 text-clinic-primary" />
                      {item.duration}
                    </div>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-6">{item.desc}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
                  <span className="text-[10px] font-extrabold text-clinic-primary uppercase tracking-widest">Sterile Clinical Protocol</span>
                  <a
                    href="#contact"
                    className="flex items-center gap-2 text-xs font-bold text-white hover:text-clinic-primary transition-colors cursor-pointer group/btn"
                  >
                    <span>Instant Booking</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform text-clinic-primary" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// 3. Step-by-Step Interactive Appointment Suite (Instant Concierge)
const AppointmentConcierge = ({ onOpenStaffPortal }: { onOpenStaffPortal?: () => void }) => {
  const servicesList = [
    'General Checkup & Consultation',
    'Laser Teeth Whitening',
    'Root Canal Therapy (RCT)',
    'Orthodontics & Invisible Aligners',
    'Dental Implants & Lasers',
    'Pedodontics (Child Dentistry)'
  ];

  const doctorsList = [
    {
      name: 'Dr. Abhishek Reddy Nimma',
      title: 'Consultant Oral & Maxillofacial Surgeon',
     img: drAbhishekImg
    },
    {
      name: 'Dr. Kranthi Nimma',
      title: 'Consultant Periodontist & Smile Specialist',
      img: drKranthiImg
    }
  ];

  const timeSlots = [
    '09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '04:30 PM', '06:00 PM', '07:30 PM'
  ];

  // Booking Form States
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [appointmentID, setAppointmentID] = useState('');

  // Generate dynamic date options (Next 7 working days, excluding sundays)
  const [availableDates, setAvailableDates] = useState<{ raw: string; label: string; day: string }[]>([]);

  useEffect(() => {
    const dates = [];
    const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let current = new Date();
    let count = 0;
    while (count < 8) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0) { // No Sunday
        const rawDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        const dayName = daysArr[current.getDay()];
        const formatted = `${current.getDate()} ${monthsArr[current.getMonth()]}`;
        dates.push({ raw: rawDate, label: formatted, day: dayName });
        count++;
      }
    }
    setAvailableDates(dates);
  }, []);

  const handleNextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedDoctor) return;
    if (step === 3 && (!selectedDate || !selectedTimeSlot)) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const triggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) return;
    
    // Create random unique appointment reference
    const randId = 'NIMMA-' + Math.floor(100000 + Math.random() * 900000);
    setAppointmentID(randId);

    // Save lead into persistent clinic database
    saveLead({
      id: randId,
      type: 'general',
      patientName: fullName,
      phone: phoneNumber,
      email: emailAddress || undefined,
      service: selectedService || 'General Dental Consultation',
      doctor: selectedDoctor || 'Any Available Practitioner',
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: 'new',
      notes: 'Submitted via General Care Booking Concierge',
      createdAt: new Date().toISOString(),
      source: 'Online Care Booking Concierge'
    });

    setFormSubmitted(true);
  };

  const resetConcierge = () => {
    setStep(1);
    setSelectedService('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setFullName('');
    setPhoneNumber('');
    setEmailAddress('');
    setFormSubmitted(false);
  };

  return (
    <section id="contact" className="py-24 bg-clinic-bg overflow-hidden relative border-t border-slate-100">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
        {/* Left Side Content Info */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-mono">Real-time Scheduler</span>
            <h2 className="text-4xl md:text-5xl font-display font-light text-clinic-secondary leading-tight italic">
              Care Booking <span className="font-normal text-clinic-primary underline decoration-clinic-primary/20 underline-offset-8">Concierge</span>
            </h2>
            <p className="text-clinic-accent text-sm mt-4 leading-relaxed max-w-sm">
              Schedule your appointment directly with our medical practitioners instantly. Select your service, coordinate timelines, and secure your digital ticket confirmation.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Phone, text: '88851 66165', sub: 'Urgent Call Consultations (9am - 8pm)' },
              { icon: Mail, text: 'care@nimmasdental.com', sub: 'Secure Electronic Enquiries' },
              { icon: MapPin, text: 'Beside Kaveri Udipi Hotel, Kamareddy', sub: 'Premium State Hospital Annex' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 text-clinic-secondary group">
                <div className="bg-white p-3 rounded-2xl shadow-md border border-clinic-primary/10 group-hover:scale-105 transition-transform duration-300">
                  <item.icon className="w-5 h-5 text-clinic-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-clinic-secondary">{item.text}</p>
                  <p className="text-[10px] font-extrabold text-clinic-accent uppercase tracking-wider mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white rounded-3xl border border-clinic-primary/10 flex items-start gap-4 shadow-sm max-w-sm">
            <ShieldCheck className="w-8 h-8 text-clinic-primary shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-clinic-secondary uppercase tracking-wider">Sterile Code Standards</h4>
              <p className="text-[11px] text-clinic-accent leading-relaxed mt-1">
                Your medical bookings strictly conform with hospital health safeguards and HIPAA clinical criteria.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Instant Interactive Form Container */}
        <div className="lg:col-span-7 bg-white relative rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-10">
          
          <AnimatePresence mode="wait">
            {!formSubmitted ? (
              <motion.div 
                key="booking-flow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Visual Step Marker */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-clinic-primary text-white text-xs font-bold flex items-center justify-center">
                      {step}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-clinic-secondary">
                      {step === 1 && 'Select Your Service'}
                      {step === 2 && 'Choose Doctor Specialty'}
                      {step === 3 && 'Schedule Date & Hour'}
                      {step === 4 && 'Add Patient Contact'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Step {step} of 4</span>
                </div>

                {/* STEP 1: SELECT SERVICE */}
                {step === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-clinic-accent uppercase tracking-widest mb-3">Which treatment category fits your needs?</p>
                    <div className="grid sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {servicesList.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setSelectedService(srv)}
                          className={`p-4 rounded-2xl text-left border text-xs font-medium transition-all ${
                            selectedService === srv 
                              ? 'bg-clinic-primary/5 border-clinic-primary/30 text-clinic-secondary ring-2 ring-clinic-primary/20' 
                              : 'bg-slate-50 border-transparent hover:bg-slate-100 text-clinic-accent'
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: CHOOSE PRACTITIONER */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-clinic-accent uppercase tracking-widest">Select preferred practitioner priority:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {doctorsList.map((doc) => (
                        <button
                          key={doc.name}
                          type="button"
                          onClick={() => setSelectedDoctor(doc.name)}
                          className={`p-5 rounded-3xl text-left border transition-all flex flex-col gap-3 relative ${
                            selectedDoctor === doc.name 
                              ? 'bg-clinic-primary/5 border-clinic-primary/30 ring-2 ring-clinic-primary/20' 
                              : 'bg-slate-50 border-transparent hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={doc.img} 
                              alt={doc.name} 
                              className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-white shadow-sm ring-1 ring-slate-200/80 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-display italic text-sm text-clinic-secondary">{doc.name}</p>
                              <p className="text-[9px] font-bold text-clinic-primary uppercase tracking-widest mt-0.5">{doc.name.includes('Abhishek') ? 'Oral & Maxillofacial Surgeon' : 'Periodontist & Smile Specialist'}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {/* Flex option or next doctor */}
                    <button 
                      type="button" 
                      onClick={() => setSelectedDoctor('Any Available Practitioner')}
                      className={`w-full p-4 text-center rounded-2xl text-xs font-semibold uppercase tracking-wider border ${
                        selectedDoctor === 'Any Available Practitioner'
                          ? 'bg-clinic-primary/5 border-clinic-primary/30 text-clinic-secondary'
                          : 'bg-slate-50 border-transparent text-clinic-accent hover:bg-slate-100'
                      }`}
                    >
                      Allocate Best Available Clinician
                    </button>
                  </div>
                )}

                {/* STEP 3: SCHEDULE TIMING */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-clinic-accent uppercase tracking-widest mb-3">Priority Date:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {availableDates.map((dt) => (
                          <button
                            key={dt.raw}
                            type="button"
                            onClick={() => setSelectedDate(dt.raw)}
                            className={`p-3 rounded-2xl text-center border transition-all flex flex-col items-center justify-center ${
                              selectedDate === dt.raw 
                                ? 'bg-clinic-primary text-white border-clinic-primary shadow-md' 
                                : 'bg-slate-50 border-transparent hover:bg-slate-100'
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase ${selectedDate === dt.raw ? 'text-white/80' : 'text-slate-400'}`}>
                              {dt.day.substring(0, 3)}
                            </span>
                            <span className="text-xs font-bold mt-1">{dt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-clinic-accent uppercase tracking-widest mb-3">Preferred Time Slot:</p>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((ts) => (
                          <button
                            key={ts}
                            type="button"
                            onClick={() => setSelectedTimeSlot(ts)}
                            className={`px-4 py-2 text-xs rounded-full border transition-all ${
                              selectedTimeSlot === ts 
                                ? 'bg-clinic-secondary text-white border-clinic-secondary shadow' 
                                : 'bg-slate-50 border-transparent text-clinic-accent hover:bg-slate-100'
                            }`}
                          >
                            {ts}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONTACT DETAILS */}
                {step === 4 && (
                  <form onSubmit={triggerSubmit} className="space-y-4">
                    <p className="text-xs font-bold text-clinic-accent uppercase tracking-widest mb-2">Final Patient Registration Details:</p>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-clinic-secondary uppercase tracking-[0.2em] ml-1">Full Identity Name</label>
                      <input 
                        required
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Vijay Kumar" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-clinic-primary/20 focus:bg-white transition-all" 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-clinic-secondary uppercase tracking-[0.2em] ml-1">Indian Mobile Number</label>
                        <input 
                          required
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 98765 44321" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-clinic-primary/20 focus:bg-white transition-all" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-clinic-secondary uppercase tracking-[0.2em] ml-1">Email Coordinates (Optional)</label>
                        <input 
                          type="email" 
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="vijay@example.com" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-clinic-primary/20 focus:bg-white transition-all" 
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-clinic-accent leading-relaxed">
                      By submitting your slot booking, you authorize Nimma's Clinical Care services to coordinate calls or reminders dynamically to finalize clinical seat allocation.
                    </p>

                    <button 
                      type="submit"
                      disabled={!fullName || !phoneNumber}
                      className="w-full bg-clinic-primary text-white py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-clinic-primary/90 transition-all shadow-lg shadow-clinic-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Authenticate & Instantly Register Appointment
                    </button>
                  </form>
                )}

                {/* Navigation Actions for Wizard */}
                {step < 4 && (
                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="w-1/3 py-3 border border-slate-200 text-slate-500 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={(step === 1 && !selectedService) || (step === 2 && !selectedDoctor) || (step === 3 && (!selectedDate || !selectedTimeSlot))}
                      className="flex-1 py-3 bg-clinic-secondary text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-clinic-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue to Next Step
                    </button>
                  </div>
                )}

              </motion.div>
            ) : (
              <motion.div 
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center border-4 border-emerald-100 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="font-display italic text-2xl text-clinic-secondary">Appointment Recieved!</h3>
                  <p className="text-xs text-clinic-accent tracking-widest uppercase font-extrabold mt-1">Nimma's Clinical Seat Confirmed</p>
                </div>

                {/* Virtual Ticket */}
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-6 text-left space-y-4 max-w-sm mx-auto font-mono text-xs text-slate-700">
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-3">
                    <span className="text-clinic-secondary font-sans font-bold">NIMMA'S CLINIC TICKET</span>
                    <span className="text-clinic-primary font-bold">{appointmentID}</span>
                  </div>

                  <div className="space-y-1.5 font-bold">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal uppercase">Patient:</span>
                      <span className="text-slate-900">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal uppercase">Doctor:</span>
                      <span className="text-slate-900">{selectedDoctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal uppercase">Treatment:</span>
                      <span className="text-slate-900 text-right max-w-[200px] truncate">{selectedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal uppercase">Schedule:</span>
                      <span className="text-clinic-primary">{selectedDate} @ {selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-normal uppercase">Mobile:</span>
                      <span className="text-slate-900">{phoneNumber}</span>
                    </div>
                  </div>

                  <div className="text-center pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-sans tracking-wide">
                    Our dental coordinator will call you to secure slot validation. Bring this digital ticket.
                  </div>
                </div>

                {/* Direct answer to where the filled form can be viewed */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 max-w-sm mx-auto text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Logged in Clinic Reception Leads System</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    <strong>Where can this filled form be viewed?</strong> This appointment is stored live in the <strong>Staff Leads Portal</strong> where receptionists and doctors manage patient consultations.
                  </p>
                  {onOpenStaffPortal && (
                    <button
                      type="button"
                      onClick={onOpenStaffPortal}
                      className="w-full mt-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      View in Staff Leads Portal
                    </button>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <button 
                    type="button"
                    onClick={resetConcierge}
                    className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Schedule Another Session
                  </button>
                  <a
                    href="#"
                    className="px-6 py-3 bg-clinic-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Back to Top
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

// 4. Navbar Component
interface NavbarProps {
  activePage: 'home' | 'cosmetic' | 'staff-portal';
  onNavigate: (page: 'home' | 'cosmetic' | 'staff-portal') => void;
  leadsCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, leadsCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (activePage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Credentials', href: '#technology' },
    { name: 'Practitioners', href: '#team' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Location Map', href: '#location-guide' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || activePage !== 'home' ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <NimmaLogoIcon className="w-12 h-12 text-clinic-primary transition-transform duration-300 group-hover:scale-105" fillClass="fill-clinic-primary" />
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-black tracking-tight text-clinic-primary font-sans leading-none">NIMMA'S</span>
            <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-[#111827] font-sans mt-1">DENTAL CLINIC</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 uppercase tracking-wider text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors duration-200 cursor-pointer ${
              activePage === 'home'
                ? 'text-clinic-primary font-black underline underline-offset-8 decoration-2'
                : 'text-clinic-accent hover:text-clinic-primary'
            }`}
          >
            Main Clinic
          </button>

          {/* Dedicated Cosmetic Dentistry Page Link */}
          <button
            onClick={() => onNavigate('cosmetic')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activePage === 'cosmetic'
                ? 'bg-[#EE1D23] text-white shadow-md shadow-red-500/25 ring-2 ring-red-300'
                : 'bg-red-50 text-[#EE1D23] hover:bg-red-100 border border-red-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cosmetic Dentistry</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-widest ${
              activePage === 'cosmetic' ? 'bg-white/20 text-white' : 'bg-red-100 text-[#EE1D23]'
            }`}>
              VIP
            </span>
          </button>

          {activePage === 'home' && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="text-clinic-accent hover:text-clinic-primary transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}

          {/* Where filled forms can be viewed: Staff Leads Portal */}
          <button
            onClick={() => onNavigate('staff-portal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activePage === 'staff-portal'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Clinic Staff: View All Submitted Forms"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#EE1D23]" />
            <span>Staff Portal</span>
            <span className="bg-[#EE1D23] text-white rounded-full text-[10px] font-mono font-black px-1.5 py-0.2">
              {leadsCount}
            </span>
          </button>

          <button
            onClick={() => {
              if (activePage === 'cosmetic') {
                const el = document.getElementById('vip-consult-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (activePage === 'home') {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="bg-clinic-primary text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest hover:bg-clinic-secondary transition-colors duration-300 shadow-lg shadow-clinic-primary/15 cursor-pointer"
          >
            BOOK CONSULT
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden text-clinic-secondary p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl lg:hidden p-6"
          >
            <div className="flex flex-col gap-3 uppercase tracking-wider text-xs font-bold">
              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-3 rounded-xl ${activePage === 'home' ? 'bg-slate-100 text-[#EE1D23]' : 'text-slate-700'}`}
              >
                Main Clinic Home
              </button>

              <button
                onClick={() => {
                  onNavigate('cosmetic');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-3 rounded-xl flex items-center justify-between ${
                  activePage === 'cosmetic' ? 'bg-[#EE1D23] text-white' : 'bg-red-50 text-[#EE1D23]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Cosmetic Dentistry Page
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">VIP</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('staff-portal');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-3 rounded-xl flex items-center justify-between ${
                  activePage === 'staff-portal' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#EE1D23]" />
                  Staff Leads Portal (View Forms)
                </span>
                <span className="bg-[#EE1D23] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {leadsCount}
                </span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="text-slate-700 hover:text-clinic-primary py-2 px-3"
                >
                  {link.name}
                </a>
              ))}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (activePage === 'cosmetic') {
                    const el = document.getElementById('vip-consult-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleLinkClick('#contact');
                  }
                }}
                className="bg-clinic-primary text-white px-5 py-3.5 rounded-full text-center text-xs font-bold tracking-widest block mt-2"
              >
                BOOK APPOINTMENT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// 5. Hero Component
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={clinicHeroImg}
          alt="Modern Dental Clinic"
          className="w-full h-full object-cover opacity-[0.04]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white"></div>
        {/* Abstract red circles */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-clinic-primary/10 text-clinic-primary rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              State of the Art Dental Clinic
            </span>
            
            <h1 className="text-5xl md:text-7xl font-display font-light text-clinic-secondary leading-[1.1] mb-8">
              We bring your <br/>
              <span className="italic font-normal text-clinic-primary text-6xl md:text-8xl">Healthy Smiles</span> <br/>
              to professional reality.
            </h1>
            
            <p className="text-sm md:text-base text-clinic-accent mb-10 max-w-xl leading-relaxed">
              Experience the highest criteria of clinical multi-specialty expertise at Nimma's Dental Clinic. We combine dental innovations with maximum diagnostic sterilization controls.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center">
              <a 
                href="#contact"
                className="bg-clinic-primary text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest text-center hover:bg-clinic-secondary hover:scale-105 shadow-xl shadow-clinic-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Book Free Visit</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="flex -space-x-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-clinic-primary text-white flex items-center justify-center text-[10px] font-bold shadow-sm">N</div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">D</div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-rose-100 text-clinic-primary flex items-center justify-center text-[10px] font-bold shadow-sm">C</div>
                </div>
                <div>
                  <span className="text-xs text-clinic-secondary font-black tracking-wider uppercase block leading-none">1,500+ Smile Designs</span>
                  <span className="text-[10px] text-clinic-accent font-bold uppercase tracking-widest">In Kamareddy District</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-clinic-primary/10 to-transparent"></div>
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800&h=1000" 
                alt="Smiling healthy patient" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Float Badge 1 */}
            <div className="absolute -top-6 -right-6 bg-white border border-slate-100 p-5 rounded-3xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Safe Facility</p>
                <p className="text-xs font-bold text-clinic-secondary mt-1">100% Sterile Clinicians</p>
              </div>
            </div>

            {/* Float Badge 2 */}
            <div className="absolute -bottom-6 -left-6 bg-clinic-secondary border border-white/5 p-5 rounded-3xl shadow-xl flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-clinic-primary text-white rounded-full flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest leading-none">Clinical Award</p>
                <p className="text-xs font-bold text-white mt-1">Certified Specialists</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Absolute background graphics */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <a href="#about" className="flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#111827]">Read Ethos</span>
          <ChevronDown className="w-4 h-4 text-clinic-primary" />
        </a>
      </div>
    </section>
  );
};

// 6. About Component (Our Vision & Ethos)
const About = () => {
  const ethosPillars = [
    { 
      title: 'Family-Centric Compassion', 
      desc: 'We treat every patient like our own family. Clear transparent diagnoses, empathetic listening, and zero unnecessary treatments.',
      icon: Heart
    },
    { 
      title: 'Sterile Hospital Safeguards', 
      desc: 'Multi-stage medical sterilization with high-pressure autoclaves and sterile barrier protocols for every procedure.',
      icon: ShieldCheck
    },
    { 
      title: 'High-Precision Diagnostics', 
      desc: 'Digital intraoral cameras and ultra-low radiation digital radiography ensure complete clinical transparency.',
      icon: Eye
    },
    { 
      title: 'Pain-Free Laser Care', 
      desc: 'Advanced soft-tissue dental lasers that eliminate traumatic vibrations, needle stress, and post-op swelling.',
      icon: Sparkles
    }
  ];

  return (
    <section id="about" className="py-24 bg-slate-50/80 overflow-hidden relative border-t border-slate-100">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block font-mono">
            Our Vision & Ethos
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-light text-clinic-secondary leading-tight">
            We Treat You Like <span className="italic text-clinic-primary font-normal">Family</span>, Not Just a Case Code.
          </h2>
          <p className="text-sm md:text-base text-clinic-accent mt-5 leading-relaxed">
            At Nimma's Dental Clinic, we pride ourselves on establishing a benchmark of superior restorative and aesthetic oral healthcare. Led by Dr. Abhishek Reddy Nimma and Dr. Kranthi Nimma, our clinical philosophy pairs dental innovation with deep, compassionate patient comfort.
          </p>
        </div>

        {/* 4 Core Ethos Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ethosPillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white p-7 rounded-[2rem] border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-clinic-primary/30"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-clinic-primary/10 text-clinic-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-clinic-primary group-hover:text-white transition-all">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display italic text-lg text-clinic-secondary mb-2 group-hover:text-clinic-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout & Action Bar */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-sm text-clinic-secondary">Personalized Dental Treatment Plans</h4>
            <p className="text-xs text-clinic-accent">
              Schedule your consultation with Dr. Abhishek Reddy Nimma & Dr. Kranthi Nimma in Kamareddy.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a 
              href="#contact"
              className="bg-clinic-primary hover:bg-clinic-secondary text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Instant Appointment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// 7. Technology Component
const Technology = () => {
  const tech = [
    { 
      title: 'Digital X-Rays', 
      icon: ShieldCheck, 
      detail: 'Ultra-low radiation imaging system providing high-resolution diagnosis in seconds.' 
    },
    { 
      title: 'Intraoral Video Scans', 
      icon: Eye, 
      detail: 'Live high-def structural camera mapping detailing exact visual diagnostics for transparent care.' 
    },
    { 
      title: 'Painless Laser Systems', 
      icon: Sparkles, 
      detail: 'Soft tissue diode lasers for zero-pain gum reshaping and minimal bleeding restorations.' 
    },
    { 
      title: 'Invisalign 3D Printing', 
      icon: Smile, 
      detail: 'Precision diagnostic arch scanners replacing messy, uncomfortable, traditional clay setups.' 
    },
  ];

  return (
    <section id="technology" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <ToothIcon className="absolute -top-10 -right-10 w-96 h-96 transform rotate-12" />
        <ToothIcon className="absolute -bottom-10 -left-10 w-64 h-64 transform -rotate-12" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-mono">Precision Diagnostics</span>
          <h2 className="text-4xl md:text-5xl font-display font-light text-clinic-secondary leading-tight mb-4">
            Clinical <span className="italic font-normal text-clinic-primary">Innovations</span>
          </h2>
          <p className="text-clinic-accent max-w-2xl mx-auto text-sm">
            We invest in certified medical technology to safeguard patient health, minimize recovery intervals, and ensure maximum diagnostic transparency.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tech.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-clinic-primary/20 transition-all hover:shadow-xl group"
            >
              <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow border border-slate-100 group-hover:scale-110 transition-transform">
                <item.icon className="text-clinic-primary w-5 h-5" />
              </div>
              <h3 className="text-lg font-display italic text-clinic-secondary mb-3 group-hover:text-clinic-primary transition-colors">{item.title}</h3>
              <p className="text-clinic-accent text-xs leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7.5. Interactive Clinic Landmark Map
const ClinicLocationMap = () => {
  type LandmarkId = 'bus_stand' | 'railway_station' | 'nizam_sagar';
  
  const [activeLandmark, setActiveLandmark] = useState<LandmarkId>('bus_stand');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [transitMode, setTransitMode] = useState<'car' | 'auto' | 'foot'>('car');

  const landmarks = {
    bus_stand: {
      id: 'bus_stand',
      name: 'Kamareddy New Bus Stand',
      distance: '1.1 km',
      eta: { car: '4 mins', auto: '6 mins', foot: '14 mins' },
      coords: { x: 320, y: 80 },
      transitInfo: 'The main regional road transit artery situated on the highway corridor.',
      steps: [
        'Proceed southwards away from the main Bus Stand exits onto Nizam Sagar highway path.',
        'Follow standard bypass signage towards the town marketplace crossing.',
        'Swerve gently at the Kaveri Udipi Hotel signboard; the dental clinic entrance is adjacent.'
      ]
    },
    railway_station: {
      id: 'railway_station',
      name: 'Kamareddy Railway Station',
      distance: '1.4 km',
      eta: { car: '5 mins', auto: '7 mins', foot: '18 mins' },
      coords: { x: 340, y: 300 },
      transitInfo: 'Major railway junction serving regional Secunderabad and Nizamabad rails.',
      steps: [
        'Exit the railway platforms and head west onto Station Road.',
        'Maintain a straight heading towards the central commercial core.',
        'Approach Kaveri Udipi Hotel adjacent to the main building; we are situated in the same annex.'
      ]
    },
    nizam_sagar: {
      id: 'nizam_sagar',
      name: 'Nizam Sagar Chowrasta',
      distance: '0.6 km',
      eta: { car: '2 mins', auto: '3 mins', foot: '7 mins' },
      coords: { x: 90, y: 150 },
      transitInfo: 'Active regional highway hub linking central bazaar streets to Nizam Sagar.',
      steps: [
        'Drive eastwards from the main Chowrasta chowk towards the town civil hospital path.',
        'Find the direct service roadway lane turning towards the hotel district.',
        'Spot Nimma’s Dental Clinic right next to Kaveri Udipi Hotel compound.'
      ]
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  // Focus calculations for CSS transform centering on clinic (200, 230)
  const mapCenter = { x: 200, y: 230 };
  const transformStyle = {
    transform: `scale(${zoomLevel}) translate(${zoomLevel > 1 ? (mapCenter.x - mapCenter.x * zoomLevel) / zoomLevel : 0}px, ${zoomLevel > 1 ? (mapCenter.y - mapCenter.y * zoomLevel) / zoomLevel : 0}px)`,
    transformOrigin: `${mapCenter.x}px ${mapCenter.y}px`,
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <section id="location-guide" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-clinic-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-mono">Central Access Blueprint</span>
          <h2 className="text-4xl md:text-5xl font-display font-light text-clinic-secondary leading-tight mb-4 italic">
            Kamareddy <span className="font-normal text-clinic-primary">Transit Hub Navigator</span>
          </h2>
          <p className="text-clinic-accent max-w-2xl mx-auto text-sm">
            We are conveniently located directly adjacent to the popular <strong>Kaveri Udipi Hotel</strong> in central Kamareddy. 
            Click on any landmark below to map a glowing route with interactive step-by-step directions.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column - Landmark selector & directions */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="space-y-6">
              <h3 className="text-lg font-display italic text-clinic-secondary border-b border-slate-100 pb-4">
                1. Select Landmark Startpoint
              </h3>
              
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(landmarks) as Array<LandmarkId>).map((key) => {
                  const item = landmarks[key];
                  const isActive = activeLandmark === key;
                  return (
                    <button
                      key={key}
                      id={`landmark-selector-${key}`}
                      onClick={() => setActiveLandmark(key)}
                      className={`text-left p-4 rounded-2xl flex items-center justify-between border transition-all ${
                        isActive
                          ? 'bg-clinic-primary/10 border-clinic-primary text-clinic-secondary shadow-sm font-semibold'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 text-clinic-accent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-clinic-primary text-white' : 'bg-white text-clinic-accent shadow-sm'}`}>
                          {key === 'railway_station' ? <Train className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{item.name}</p>
                          <p className="text-[10px] text-clinic-accent font-medium mt-0.5">{item.distance} away</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${isActive ? 'bg-clinic-primary text-white' : 'bg-white text-clinic-accent border border-slate-100'}`}>
                          {item.eta.car}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle Container - Detailed Route Guideline */}
            <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-clinic-accent flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-clinic-primary animate-pulse" />
                  Route Dashboard
                </span>
                
                {/* Transit Modality Toggle */}
                <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                  {([
                    { mode: 'car', label: 'Car/Taxi' },
                    { mode: 'auto', label: 'Auto' },
                    { mode: 'foot', label: 'Walk' }
                  ] as const).map(item => (
                    <button
                      key={item.mode}
                      onClick={() => setTransitMode(item.mode)}
                      className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-md transition-all ${
                        transitMode === item.mode
                          ? 'bg-clinic-primary text-white shadow-sm font-black'
                          : 'text-clinic-accent hover:bg-slate-50 font-bold'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dist & Time stats large callout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-[9px] uppercase tracking-wider text-clinic-accent font-mono">Transit Distance</p>
                  <p className="text-lg font-bold text-clinic-secondary mt-0.5">{landmarks[activeLandmark].distance}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-[9px] uppercase tracking-wider text-clinic-accent font-mono">Estimated Duration</p>
                  <p className="text-lg font-bold text-clinic-primary mt-0.5">{landmarks[activeLandmark].eta[transitMode]}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-clinic-secondary leading-relaxed font-medium">
                  {landmarks[activeLandmark].transitInfo}
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-3.5 mt-2">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-clinic-accent">Navigational Steps</p>
                {landmarks[activeLandmark].steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs text-clinic-accent leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-clinic-primary shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </div>
                    <p className="text-[11px] leading-relaxed mt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 bg-clinic-primary/5 p-4 rounded-2xl border border-clinic-primary/10">
              <Info className="w-4.5 h-4.5 text-clinic-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-clinic-accent leading-relaxed">
                <strong>Precise Address:</strong> Beside Kaveri Udipi Hotel, bypass junction corridor, Kamareddy, Telangana 503111. Ample car & two-wheel valet style parking is open 24/7.
              </p>
            </div>
          </div>

          {/* Right Column - Interactive Map Layout */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm relative min-h-[500px]">
            
            {/* Map Header Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 z-10 shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-clinic-primary" />
                <span className="text-xs font-bold text-clinic-secondary uppercase tracking-wider font-mono">
                  Vector Map Canvas (Kamareddy Central)
                </span>
                <span className="bg-emerald-500 text-white rounded-full text-[8px] font-extrabold px-2 py-0.5 tracking-wider uppercase animate-pulse shrink-0">
                  Interactive Live
                </span>
              </div>
              
              {/* Floating Map Zoom Toolbar */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-white rounded-lg text-clinic-accent transition-colors shrink-0 cursor-pointer"
                  title="Zoom Out"
                  disabled={zoomLevel === 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-clinic-secondary px-1.5 font-mono">
                  {zoomLevel.toFixed(1)}x
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-white rounded-lg text-clinic-accent transition-colors shrink-0 cursor-pointer"
                  title="Zoom In"
                  disabled={zoomLevel === 2.5}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <button
                  onClick={handleResetZoom}
                  className="text-[9px] font-extrabold uppercase px-2 py-1 hover:bg-white rounded-lg text-clinic-accent transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Interactive Vector SVG Canvas body */}
            <div className="grow relative overflow-hidden rounded-[2rem] bg-[#FAFAFA] border border-slate-100 my-4 flex items-center justify-center shadow-inner min-h-[360px] cursor-grab active:cursor-grabbing">
              
              {/* SVG Grid Vector Element */}
              <svg 
                viewBox="0 0 400 380" 
                className="w-full h-full select-none"
              >
                <g style={transformStyle}>
                  {/* Subtle Background Accent Street Grids */}
                  <defs>
                    <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="#E2E8F0" />
                    </pattern>
                    <linearGradient id="clinic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EE1D23" />
                      <stop offset="100%" stopColor="#990B0F" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill whole coordinates with dot matrix */}
                  <rect width="400" height="380" fill="url(#dot-grid)" opacity="0.6" />

                  {/* DRAW BASE ROADS (SUBTLE OUTLINES) */}
                  {/* NH44 Highway (National Highway Bypass) running along the left vertically */}
                  <path 
                    d="M 60 -20 L 60 400" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="28" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 60 -20 L 60 400" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="18" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 60 -20 L 60 400" 
                    fill="none" 
                    stroke="#FFFFFF" 
                    strokeWidth="2" 
                    strokeDasharray="6, 6" 
                    strokeLinecap="round" 
                  />

                  {/* Nizam Sagar Road running from Chowrasta (90, 150) to Central Crossing (200, 180) */}
                  <path 
                    d="M 60 150 L 200 150 L 200 230" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="20" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M 60 150 L 200 150 L 200 230" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />

                  {/* Railway Station Marg Road representing connection from (340, 300) to (200, 230) */}
                  <path 
                    d="M 340 300 L 260 300 L 260 230 L 200 230" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M 340 300 L 260 300 L 260 230 L 200 230" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />

                  {/* Clock Tower Central Ganj Market Road (210, 60) down to (200, 150) */}
                  <path 
                    d="M 210 60 L 210 150 L 200 150" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M 210 60 L 210 150 L 200 150" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />

                  {/* Main Bus Stand Entrance Parkway from (320, 80) down to Ganj crossing at (210, 80) */}
                  <path 
                    d="M 320 80 L 210 80" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 320 80 L 210 80" 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                  />

                  {/* Clinical Hotspot Lane (Kaveri Udipi Annex Road) */}
                  <path 
                    d="M 200 150 L 200 270" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 200 150 L 200 270" 
                    fill="none" 
                    stroke="#94A3B8" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                  />


                  {/* DYNAMICALLY ANIMATED ROUTE HIGHLIGHT OVERLAY (ACTIVE ROUTE) */}
                  {/* 1. Bus Stand Route Highlighter */}
                  {activeLandmark === 'bus_stand' && (
                    <motion.path 
                      key="route_bus"
                      d="M 320 80 L 210 80 L 210 150 L 200 150 L 200 230" 
                      fill="none" 
                      stroke="#EE1D23" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      strokeDasharray="10 6"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                    />
                  )}

                  {/* 2. Railway Route Highlighter */}
                  {activeLandmark === 'railway_station' && (
                    <motion.path 
                      key="route_rail"
                      d="M 340 300 L 260 300 L 260 230 L 200 230" 
                      fill="none" 
                      stroke="#EE1D23" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      strokeDasharray="10 6"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                    />
                  )}

                  {/* 3. Nizam Sagar Route Highlighter */}
                  {activeLandmark === 'nizam_sagar' && (
                    <motion.path 
                      key="route_nizam"
                      d="M 90 150 L 200 150 L 200 230" 
                      fill="none" 
                      stroke="#EE1D23" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      strokeDasharray="10 6"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                    />
                  )}



                  {/* TEXT OVERLAY & STREET LABELS */}
                  <text x="60" y="200" transform="rotate(-90 60 200)" fill="#64748B" fontSize="9" fontWeight="900" letterSpacing="0.2em" textAnchor="middle">
                    NH44 BYPASS HIGHWAY
                  </text>
                  <text x="140" y="142" fill="#64748B" fontSize="8" fontWeight="800" letterSpacing="0.1em" textAnchor="middle">
                    NIZAM SAGAR RD
                  </text>
                  <text x="290" y="292" fill="#64748B" fontSize="8" fontWeight="800" letterSpacing="0.1em" textAnchor="middle">
                    STATION RD
                  </text>
                  <text x="215" y="110" transform="rotate(90 215 110)" fill="#64748B" fontSize="8" fontWeight="800" letterSpacing="0.1em" textAnchor="middle">
                    GANJ BAZAR ST
                  </text>


                  {/* HOVERABLE & CLICKABLE LANDMARK DOTS */}
                  {/* 1. Bus Stand Marker */}
                  <g 
                    className="cursor-pointer group" 
                    onClick={() => setActiveLandmark('bus_stand')}
                  >
                    <circle cx="320" cy="80" r="16" fill="rgba(15, 23, 42, 0.04)" className="hover:scale-125 transition-transform" />
                    <circle cx="320" cy="80" r="11" fill="white" stroke="#0F172A" strokeWidth="2.5" />
                    <circle cx="320" cy="80" r="5" fill={activeLandmark === 'bus_stand' ? '#EE1D23' : '#64748B'} className="transition-colors" />
                    {/* Pulsing Highlight ring for current selection */}
                    {activeLandmark === 'bus_stand' && (
                      <circle cx="320" cy="80" r="14" fill="none" stroke="#EE1D23" strokeWidth="1.5" opacity="0.8">
                        <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>

                  {/* 2. Railway Station Marker */}
                  <g 
                    className="cursor-pointer group" 
                    onClick={() => setActiveLandmark('railway_station')}
                  >
                    <circle cx="340" cy="300" r="16" fill="rgba(15, 23, 42, 0.04)" className="hover:scale-125 transition-transform" />
                    <circle cx="340" cy="300" r="11" fill="white" stroke="#0F172A" strokeWidth="2.5" />
                    <circle cx="340" cy="300" r="5" fill={activeLandmark === 'railway_station' ? '#EE1D23' : '#64748B'} className="transition-colors" />
                    {activeLandmark === 'railway_station' && (
                      <circle cx="340" cy="300" r="14" fill="none" stroke="#EE1D23" strokeWidth="1.5" opacity="0.8">
                        <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>

                  {/* 3. Nizam Sagar Chowrasta Marker */}
                  <g 
                    className="cursor-pointer group" 
                    onClick={() => setActiveLandmark('nizam_sagar')}
                  >
                    <circle cx="90" cy="150" r="16" fill="rgba(15, 23, 42, 0.04)" className="hover:scale-125 transition-transform" />
                    <circle cx="90" cy="150" r="11" fill="white" stroke="#0F172A" strokeWidth="2.5" />
                    <circle cx="90" cy="150" r="5" fill={activeLandmark === 'nizam_sagar' ? '#EE1D23' : '#64748B'} className="transition-colors" />
                    {activeLandmark === 'nizam_sagar' && (
                      <circle cx="90" cy="150" r="14" fill="none" stroke="#EE1D23" strokeWidth="1.5" opacity="0.8">
                        <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>




                  {/* KAVERI UDIPI HOTEL COMPANION BUILDING (THE CLUSTERING LANDMARK) */}
                  <g transform="translate(155, 222)">
                    {/* Background outline representing building */}
                    <rect x="0" y="0" width="30" height="18" rx="4" fill="white" stroke="#475569" strokeWidth="1.5" />
                    <rect x="0" y="0" width="30" height="5" rx="1" fill="#475569" />
                    {/* Text block for Kaveri Udipi */}
                    <text x="15" y="13" fill="#1E293B" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.05em">UDIPI</text>
                  </g>


                  {/* PREMIUM CLINICAL PIN AT THE FOCUS POINT (NIMMA'S DENTAL CLINIC) */}
                  <g transform="translate(200, 230)" className="cursor-pointer">
                    {/* Glow waves radiating from center */}
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#EE1D23" strokeWidth="1" opacity="0.3">
                      <animate attributeName="r" values="10;32;10" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Solid Pin Tear Drop Shape */}
                    <path 
                      id="clinical-pin-drop"
                      d="M 0 0 C -12 -12, -14 -28, 0 -36 C 14 -28, 12 -12, 0 0 Z" 
                      fill="url(#clinic-gradient)" 
                      stroke="#FFFFFF" 
                      strokeWidth="2.5" 
                      className="filter drop-shadow-md"
                    />

                    {/* White micro tooth icon in center of pin */}
                    <path 
                      d="M -3.5 -26 C -5 -25, -6 -23, -6 -21 C -6 -18, -4.5 -16, -4.5 -16 C -3.5 -13, -3 -12, -2 -12 C -1 -12, -1 -13, 0 -13 C 1 -13, 1 -12, 2 -12 C 3 -12, 3.5 -13, 4.5 -16 C 4.5 -16, 6 -18, 6 -21 C 6 -23, 5 -25, 3.5 -26 C 1.5 -27.5, 0 -26.5, 0 -26.5 C 0 -26.5, -1.5 -27.5, -3.5 -26 Z" 
                      fill="#FFFFFF" 
                      transform="scale(0.85) translate(0, -5)"
                    />
                    
                    {/* Glow core target ring */}
                    <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                  </g>
                </g>
              </svg>

              {/* Float Legend Badge on Map */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center text-[10px] text-clinic-accent shadow-sm gap-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 bg-clinic-primary rounded-full inline-block animate-ping"></span>
                  <span className="text-clinic-secondary font-mono tracking-wide">NIMMA'S DENTAL CLINIC</span>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> Landmarks
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-clinic-primary rounded-xs inline-block"></span> Glowing Route
                  </span>
                </div>
              </div>
            </div>

            {/* Micro details panel below canvas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[11px] text-clinic-accent gap-2 shrink-0">
              <span className="font-semibold text-clinic-secondary">
                Currently tracking: {landmarks[activeLandmark].name}
              </span>
              <a 
                href="https://maps.google.com/?q=Nimma's+Dental+Clinic+Beside+Kaveri+Udipi,Kamareddy" 
                target="_blank" 
                rel="noreferrer"
                className="text-clinic-primary font-extrabold uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Open Google Maps App ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 8. Team Practitioners
const Team = () => {
  const doctors = [
    {
      name: 'Dr. Abhishek Reddy Nimma',
      role: 'Consultant Oral & Maxillofacial Surgeon',
     image: drAbhishekImg,
      credentials: 'BDS, MDS • Oral & Maxillofacial Surgery',
      experience: '12+ Years Clinical Experience',
      badge: 'Hospital Surgical Lead',
      specialty: 'Maxillofacial, Trauma, Digital Guided Implants & Complex Extractions',
      bio: 'Board-registered clinical surgeon renowned for gentle micro-surgical procedures, full-arch titanium implants, and advanced maxillofacial rehabilitation conforming to strict sterile protocols.'
    },
    {
      name: 'Dr. Kranthi Nimma',
      role: 'Consultant Periodontist & Aesthetic Specialist',
      image: drKranthiImg,
      credentials: 'BDS, MDS • Periodontology & Smile Architecture',
      experience: '10+ Years Dedicated Care',
      badge: 'Chief Aesthetic Specialist',
      specialty: 'Advanced Gum Health, Bone Regeneration & Handcrafted Smile Makeovers',
      bio: 'Expert clinical practitioner dedicated to active periodontal therapies, minimally invasive laser gum contouring, bespoke cosmetic porcelain veneers, and pain-free preventative maintenance.'
    }
  ];

  return (
    <section id="team" className="py-24 bg-slate-50/70 border-t border-slate-100 relative overflow-hidden">
      {/* Soft atmospheric background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-clinic-primary/5 via-rose-500/5 to-slate-200/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block font-mono">Board Certified Practitioners</span>
          <h2 className="text-4xl md:text-5xl font-display font-light text-clinic-secondary mb-4 italic">
            Meet Our <span className="text-clinic-primary font-normal not-italic">Clinical Directors</span>
          </h2>
          <p className="text-clinic-accent max-w-2xl mx-auto text-sm leading-relaxed">
            Our surgical and periodontal directors bring high academic distinctions, hospital-grade precision, and compassionate patient care to every treatment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-2xl hover:border-clinic-primary/20 transition-all duration-500 group flex flex-col justify-between"
            >
              <div>
                {/* Doctor Portrait Container with Studio Framing & Aesthetic Glow */}
                <div className="relative mb-6 overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-100 shadow-md">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full aspect-[4/5] object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Aesthetic Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none"></div>

                  {/* Top Status & Accreditation Pills */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-slate-800 text-[9px] font-black uppercase tracking-wider">{doc.experience}</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-clinic-secondary/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <span className="text-clinic-primary text-[8px] font-black uppercase tracking-widest">{doc.badge}</span>
                  </div>

                  {/* Aesthetic Bottom Portrait Tag */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <p className="text-[10px] font-mono tracking-widest text-clinic-primary uppercase font-bold">{doc.credentials}</p>
                    <p className="text-xl font-display italic text-white leading-tight mt-0.5">{doc.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-clinic-primary"></span>
                  <p className="text-clinic-primary font-extrabold text-[11px] uppercase tracking-[0.2em]">{doc.role}</p>
                </div>

                <div className="bg-slate-50/90 p-4 rounded-2xl mb-4 border border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-clinic-secondary">Core Clinical Focus:</p>
                  <p className="text-xs text-clinic-accent font-medium leading-relaxed mt-1">{doc.specialty}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{doc.bio}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Online Slots Available
                </span>
                <a 
                  href="#contact"
                  className="bg-clinic-primary hover:bg-clinic-secondary text-white px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book Consultation
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 9. FAQ Section
const FAQ = () => {
  const faqs = [
    {
      q: "What credentials support your multi-specialty diagnostics?",
      a: "Our chief doctors, Dr. Abhishek Reddy and Dr. Kranthi Nimma, are board-registered specialists holding advanced pediatric surgery, clinical orthosurgeries, and periodontic credentials. We conform with standardized hospital-grade medical sterilization and healthcare guidelines."
    },
    {
      q: "Where is the clinic located in Kamareddy?",
      a: "We are located beside Kaveri Udipi Hotel, Kamareddy, Telangana. The location contains state of the art diagnostic tools and ample standard car parking for dental families."
    },
    {
      q: "What parameters coordinate a painless laser restoration?",
      a: "Our clinic utilizes soft tissue diode lasers. This tech allows us to sterilize pockets and carve gums cleanly, completely bypassing conventional high-pressure needles, swelling, or scalpels."
    },
    {
      q: "Do you offer diagnostic checkups for children?",
      a: "Absolutely. Our Pedodontics program provides customized, friendly, non-threatening orientations for children to build clinical trust while shielding dynamic dental structures."
    },
    {
      q: "Do you offer emergency dental trauma services?",
      a: "Yes. Dr. Abhishek Reddy Nimma coordinates maxillofacial trauma surgery and urgent tooth extractions. For emergencies, please call us directly at 88851 66165 immediately."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-mono">Knowledge Base</span>
          <h2 className="text-4xl font-display font-light text-clinic-secondary italic mb-4">Patient FAQ</h2>
          <p className="text-clinic-accent text-sm">Review typical operational guidelines and diagnostic protocols.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-100 last:border-0 pb-4">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className={`text-lg font-display italic transition-colors ${openIdx === i ? 'text-clinic-primary font-normal' : 'text-clinic-secondary font-light'}`}>
                  {faq.q}
                </span>
                <div className={`p-1.5 rounded-full transition-all ${openIdx === i ? 'bg-clinic-primary text-white rotate-180' : 'bg-slate-50 text-clinic-accent group-hover:bg-clinic-primary/10'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-clinic-accent text-xs leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 10. Patient Reviews
const Reviews = () => {
  const reviews = [
    {
      text: "The orthodontist alignment here worked marvels. The painless laser procedures resolved my gum issue in minutes. Absolutely standard setting!",
      author: "Rajesh Goud",
      rating: 5,
      date: "Kamareddy"
    },
    {
      text: "Nimma's is by far the cleanest clinic. Dr. Kranthi explained the pediatric hygiene parameters beautifully for my daughter. Highly trustworthy.",
      author: "Srilatha Rao",
      rating: 5,
      date: "Telangana"
    },
    {
      text: "Dr. Abhishek Reddy handled my dental implant extraction with zero swelling. Truly painless, quick, and structured. Great customer orientation.",
      author: "Anwaruddin Md",
      rating: 5,
      date: "Nizamabad"
    }
  ];

  return (
    <section id="reviews" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <span className="text-clinic-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-mono">Patient Voice</span>
            <h2 className="text-4xl font-display font-light text-clinic-secondary italic mb-4">Dental Success Stories</h2>
            <p className="text-clinic-accent max-w-xl text-sm">
              We focus on building long-standing medical relationships. Here is review feedback from actual local families.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-white px-5 py-3 rounded-full border border-slate-100 shadow-sm text-xs font-bold font-mono">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-clinic-primary fill-clinic-primary" />)}
            <span className="text-clinic-secondary tracking-wider ml-1 uppercase">4.9/5 RATED</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <p className="text-clinic-secondary font-display text-lg italic leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4 text-[10px] uppercase tracking-widest font-extrabold text-slate-400 font-mono">
                <span className="text-clinic-secondary">{review.author}</span>
                <span>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 11. Cosmetic Spotlight Banner for Home Page
const CosmeticSpotlightBanner = ({ onExploreCosmetic }: { onExploreCosmetic: () => void }) => {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-[#151a30] to-slate-900 text-white py-10 border-y border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-3xl bg-[#EE1D23] text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-[#EE1D23] uppercase tracking-[0.2em]">New Dedicated Studio</span>
              <span className="bg-white/10 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">0% EMI Available</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display italic text-white mt-0.5">
              Looking for Porcelain Veneers, Laser Whitening, or Clear Aligners?
            </h3>
            <p className="text-xs text-white/70 max-w-2xl mt-1 leading-relaxed">
              Explore our brand new <strong>Cosmetic Dentistry & Smile Design</strong> page featuring an interactive 60-second smile assessment quiz, shade simulator, and limited-time festive packages!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExploreCosmetic}
            className="px-6 py-3.5 bg-[#EE1D23] hover:bg-[#EE1D23]/90 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/25 flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Cosmetic Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// 12. Footer Component
const Footer = ({ onNavigate }: { onNavigate?: (page: 'home' | 'cosmetic' | 'staff-portal') => void }) => {
  return (
    <footer className="bg-clinic-secondary text-white py-20 rounded-t-[50px] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <NimmaLogoIcon className="w-14 h-14 text-clinic-primary" fillClass="fill-clinic-primary" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight text-clinic-primary font-sans leading-none">NIMMA'S</span>
                <span className="text-xs font-bold tracking-widest text-white font-sans mt-0.5">DENTAL CLINIC</span>
              </div>
            </div>
            <p className="text-white/60 max-w-sm leading-relaxed text-xs">
              Exceptional, certified multi-speciality diagnosis and treatments covering implants, cosmetic aligners, endodontics, and sterilization controls.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs uppercase tracking-widest font-mono font-extrabold text-[#EE1D23]">
              <span className="w-2.5 h-2.5 bg-clinic-primary rounded-full animate-ping"></span>
              <span>Accepting New Dental Families</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-display italic text-lg mb-6 text-clinic-primary">Practices & Pages</h4>
            <ul className="space-y-3.5 text-white/50 text-xs">
              {onNavigate && (
                <li>
                  <button 
                    onClick={() => onNavigate('cosmetic')} 
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-white/80 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#EE1D23]" />
                    <span>Cosmetic Dentistry Studio (New)</span>
                  </button>
                </li>
              )}
              {onNavigate && (
                <li>
                  <button 
                    onClick={() => onNavigate('staff-portal')} 
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-amber-300 font-bold"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                    <span>Staff Portal (View Form Submissions)</span>
                  </button>
                </li>
              )}
              <li><a href="#services" className="hover:text-white transition-colors">Micro-Endodontics (RCT)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Maxillofacial Implants</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Child Oral Pedodontics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display italic text-lg mb-6 text-clinic-primary">Credentials</h4>
            <ul className="space-y-3.5 text-white/50 text-xs text-slate-400">
              <li>FDA Standard Sterilization</li>
              <li>Beside Kaveri Udipi, Kamareddy</li>
              <li>Dr. Abhishek Reddy Nimma</li>
              <li>Dr. Kranthi Nimma</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">
          <p>© 2026 Nimma's Dental Clinic. Masterclass Medical Care.</p>
          <div className="flex items-center gap-4">
            {onNavigate && (
              <button 
                onClick={() => onNavigate('staff-portal')}
                className="text-[#EE1D23] hover:underline normal-case font-medium tracking-normal text-xs"
              >
                Reception Staff: View Submitted Forms →
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-clinic-primary rounded-full"></div>
              <span>Your Trusted Clinic</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'cosmetic' | 'staff-portal'>('home');
  const [leadsCount, setLeadsCount] = useState<number>(0);

  const updateCount = () => {
    setLeadsCount(getLeads().length);
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#cosmetic' || hash === '#cosmetic-dentistry') {
        setCurrentPage('cosmetic');
      } else if (hash === '#portal' || hash === '#staff-portal' || hash === '#leads') {
        setCurrentPage('staff-portal');
      } else if (hash === '' || hash === '#home') {
        setCurrentPage('home');
      }
    };

    handleHash();
    updateCount();

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('nimma_leads_updated', updateCount);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('nimma_leads_updated', updateCount);
    };
  }, []);

  const navigateTo = (page: 'home' | 'cosmetic' | 'staff-portal') => {
    setCurrentPage(page);
    if (page === 'cosmetic') {
      window.location.hash = '#cosmetic';
    } else if (page === 'staff-portal') {
      window.location.hash = '#staff-portal';
    } else {
      window.location.hash = '#home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-clinic-primary/20 selection:text-clinic-primary tooth-pattern antialiased">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <Navbar 
        activePage={currentPage} 
        onNavigate={navigateTo} 
        leadsCount={leadsCount} 
      />

      <main>
        {currentPage === 'staff-portal' && (
          <StaffLeadsPortal 
            onBackToHome={() => navigateTo('home')}
            onNavigateToCosmetic={() => navigateTo('cosmetic')}
          />
        )}

        {currentPage === 'cosmetic' && (
          <CosmeticDentistryPage 
            onBackToHome={() => navigateTo('home')}
            onOpenStaffPortal={() => navigateTo('staff-portal')}
          />
        )}

        {currentPage === 'home' && (
          <>
            <Hero />
            <CosmeticSpotlightBanner onExploreCosmetic={() => navigateTo('cosmetic')} />
            <About />
            <Technology />
            <ServicesTabs />
            <BeforeAfterSlider />
            <Team />
            <Reviews />
            <FAQ />
            <AppointmentConcierge onOpenStaffPortal={() => navigateTo('staff-portal')} />
            <ClinicLocationMap />
          </>
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
