"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Play, X, ChevronRight, ChevronDown, Plus, Star, Facebook, Instagram, Linkedin, Youtube, CheckCircle2, Calendar, Clock, User, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import Image from 'next/image';
import { event } from '@/lib/analytics';
import { 
  servicesList, servicesGrid, lovelyPatients, doctors, 
  testimonials, transformations, equipment, gallery, stats, faqs, blogs 
} from './data';

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const ToothIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 22c-2.5 0-4.5-2-4.5-4.5S7 12 7 10c0-2.5 2-4.5 4.5-4.5h1c2.5 0 4.5 2 4.5 4.5s1.5 7.5-1 7.5c-2.5 0-4.5-2-4.5-4.5" />
    <path d="M14 22c2.5 0 4.5-2 4.5-4.5S17 12 17 10c0-2.5-2-4.5-4.5-4.5h-1c-2.5 0-4.5 2-4.5 4.5s-1.5 7.5 1 7.5c2.5 0 4.5-2 4.5-4.5" />
  </svg>
);

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 ${className}`} />
);

const PatientCard = ({ p, i, row }: { p: typeof lovelyPatients[0], i: number, row: number }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div key={`row${row}-${i}`} className="w-[240px] sm:w-[300px] md:w-[350px] mx-4 bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col items-center text-center shrink-0 hover:bg-white/10 transition-colors">
      <div className="relative w-16 h-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full overflow-hidden mb-4 sm:mb-6 border-2 border-[#004de6]/50">
        {isLoading && <Skeleton className="absolute inset-0 rounded-full" />}
        <Image 
          src={p.img} 
          alt={p.name} 
          fill 
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
          onLoad={() => setIsLoading(false)}
          loading="lazy" 
        />
      </div>
      <div className="flex gap-1 text-yellow-500 mb-3 sm:mb-4">
        {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
      </div>
      <p className="text-white/80 italic mb-4 sm:mb-6 flex-grow text-xs sm:text-sm md:text-base leading-relaxed">&quot;{p.text}&quot;</p>
      <h4 className="font-medium text-sm sm:text-base md:text-lg">{p.name}</h4>
    </div>
  );
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState(servicesList[0].img);
  const [selectedService, setSelectedService] = useState<typeof servicesGrid[0] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showContactPage, setShowContactPage] = useState(false);
  const [bookingService, setBookingService] = useState<string>("General Checkup");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: bookingService,
    date: '',
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Sync formData.service when bookingService changes (e.g. from service grid)
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, service: bookingService }));
  }, [bookingService]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value) error = 'Name is required';
      else if (value.length < 2) error = 'Name must be at least 2 characters';
    } else if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
    } else if (name === 'phone') {
      if (!value) error = 'Phone number is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(value)) error = 'Invalid phone number (min 10 digits)';
    } else if (name === 'date') {
      if (!value) error = 'Date is required';
      else {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) error = 'Date cannot be in the past';
      }
    } else if (name === 'time') {
      if (!value) error = 'Time is required';
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      // Track successful appointment booking
      event({
        action: 'appointment_booking',
        category: 'engagement',
        label: formData.service,
        value: 1
      });
      setIsSubmitted(true);
    } else {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  };

  if (showContactPage) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-white text-black font-sans selection:bg-[#004de6] selection:text-white"
      >
        {/* Navbar for Contact Page */}
        <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 md:py-5">
          <div className="relative inline-block cursor-pointer" onClick={() => setShowContactPage(false)}>
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-white">ShineSmile</span>
            <svg className="absolute -bottom-2 md:-bottom-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-28 text-white" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M10 10 Q 50 25 90 10" />
            </svg>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => setShowContactPage(false)} className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition cursor-pointer text-white">
              <div className="w-9 h-5 md:w-10 md:h-6 bg-white/30 rounded-full p-1 flex items-center justify-end">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
              </div>
              <span className="font-medium text-sm md:text-base hidden xs:block">Back</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 text-center overflow-hidden bg-[#050505] text-white min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#004de6]/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 md:mb-10 leading-tight"
            >
              Get in Touch with<br/>ShineSmile
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              Have questions or need to schedule an appointment? Contact us today, and our friendly team will assist you with all your dental needs.
            </motion.p>
          </div>
        </section>

        {/* Form & Branches Section */}
        <section className="py-24 md:py-40 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 md:gap-24">
            {/* Form */}
            <div className="lg:w-3/5">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="bg-white p-8 sm:p-12 md:p-20 rounded-[2rem] md:rounded-[2.5rem] text-center flex flex-col items-center h-full justify-center border border-gray-100 shadow-2xl shadow-black/[0.03]"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-[#004de6]/10 rounded-full flex items-center justify-center mb-6 md:mb-10">
                    <CheckCircle2 size={32} className="text-[#004de6] md:hidden" />
                    <CheckCircle2 size={48} className="text-[#004de6] hidden md:block" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-medium mb-4 md:mb-6 tracking-tight">Request Sent Successfully!</h3>
                  <p className="text-base md:text-xl text-gray-500 mb-8 md:mb-12 max-w-md leading-relaxed">Thank you for reaching out. Our team will contact you shortly to confirm your appointment details.</p>
                  <button 
                    onClick={() => { setIsSubmitted(false); setShowContactPage(false); }} 
                    className="bg-[#004de6] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-medium text-base md:text-lg hover:bg-[#003bb3] transition-all shadow-xl shadow-[#004de6]/20 hover:-translate-y-1 active:scale-[0.98]"
                  >
                    Return to Home
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6 md:space-y-8 bg-white p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-black/[0.03] border border-gray-100" onSubmit={handleSubmit} noValidate>
                  <div className="mb-6 md:mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-2 md:mb-3">Book Your Appointment</h2>
                    <p className="text-sm sm:text-base text-gray-500">Fill out the form below and we&apos;ll get back to you shortly.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Your Name</label>
                      <div className="relative group">
                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.name && touched.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#004de6]'}`} size={18} />
                        <input 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          type="text" 
                          className={`w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border transition-all bg-white hover:border-gray-300 focus:outline-none ${errors.name && touched.name ? 'border-red-500 ring-4 ring-red-500/5' : 'border-gray-100 focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5'}`} 
                          placeholder="John Doe" 
                        />
                      </div>
                      {errors.name && touched.name && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.name}</motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#004de6]'}`} size={18} />
                        <input 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          type="email" 
                          className={`w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border transition-all bg-white hover:border-gray-300 focus:outline-none ${errors.email && touched.email ? 'border-red-500 ring-4 ring-red-500/5' : 'border-gray-100 focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5'}`} 
                          placeholder="john@example.com" 
                        />
                      </div>
                      {errors.email && touched.email && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.email}</motion.p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.phone && touched.phone ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#004de6]'}`} size={18} />
                        <input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          type="tel" 
                          className={`w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border transition-all bg-white hover:border-gray-300 focus:outline-none ${errors.phone && touched.phone ? 'border-red-500 ring-4 ring-red-500/5' : 'border-gray-100 focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5'}`} 
                          placeholder="+1 (555) 000-0000" 
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.phone}</motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Service</label>
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#004de6] transition-colors pointer-events-none">
                          <CheckCircle2 size={18} />
                        </div>
                        <select 
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className="w-full pl-12 md:pl-14 pr-12 py-4 md:py-5 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5 transition-all bg-white hover:border-gray-300 appearance-none cursor-pointer text-sm md:text-base"
                        >
                          <option value="General Checkup">General Checkup</option>
                          {servicesGrid.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#004de6] transition-colors" size={18} />
                      </div>
                    </div>
                  </div>
 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Preferred Date</label>
                      <div className="relative group">
                        <Calendar className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.date && touched.date ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#004de6]'}`} size={18} />
                        <input 
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          type="date" 
                          className={`w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border transition-all bg-white hover:border-gray-300 focus:outline-none ${errors.date && touched.date ? 'border-red-500 ring-4 ring-red-500/5' : 'border-gray-100 focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5'}`} 
                        />
                      </div>
                      {errors.date && touched.date && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.date}</motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Preferred Time</label>
                      <div className="relative group">
                        <Clock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.time && touched.time ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#004de6]'}`} size={18} />
                        <input 
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          type="time" 
                          className={`w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border transition-all bg-white hover:border-gray-300 focus:outline-none ${errors.time && touched.time ? 'border-red-500 ring-4 ring-red-500/5' : 'border-gray-100 focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5'}`} 
                        />
                      </div>
                      {errors.time && touched.time && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.time}</motion.p>
                      )}
                    </div>
                  </div>
 
                  <div>
                    <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 md:mb-3 ml-1">Additional Notes</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-5 top-6 text-gray-400 group-focus-within:text-[#004de6] transition-colors" size={18} />
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        rows={4} 
                        className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#004de6] focus:ring-4 focus:ring-[#004de6]/5 transition-all bg-white hover:border-gray-300 resize-none text-sm md:text-base" 
                        placeholder="Any specific concerns or questions?"
                      ></textarea>
                    </div>
                  </div>
                  
                  <button type="submit" className="bg-[#004de6] text-white px-8 md:px-10 py-4 md:py-6 rounded-full font-medium text-lg md:text-xl hover:bg-[#003bb3] hover:shadow-2xl hover:shadow-[#004de6]/40 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 w-full group">
                    Confirm Appointment <ArrowUpRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>

            {/* Branches */}
            <div className="lg:w-2/5 flex flex-col gap-8 md:gap-10">
              <div className="bg-white p-6 sm:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-black/[0.03] border border-gray-100">
                <h3 className="text-xl md:text-2xl font-medium mb-6 md:mb-8 text-[#004de6] flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#004de6]/10 rounded-full flex items-center justify-center">
                    <MapPin size={18} className="md:w-5 md:h-5" />
                  </div>
                  Downtown Clinic
                </h3>
                <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Address</label>
                      <p className="text-sm md:text-base text-gray-600">123 Dental Way, Suite 100<br/>New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Phone</label>
                      <p className="text-sm md:text-base text-gray-600">+1 (212) 555-0123</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Email</label>
                      <p className="text-sm md:text-base text-gray-600">downtown@shinesmile.com</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-40 md:h-48 rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src="https://maps.google.com/maps?q=Empire+State+Building&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    title="Downtown Clinic Map"
                  ></iframe>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-black/[0.03] border border-gray-100">
                <h3 className="text-xl md:text-2xl font-medium mb-6 md:mb-8 text-[#004de6] flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#004de6]/10 rounded-full flex items-center justify-center">
                    <MapPin size={18} className="md:w-5 md:h-5" />
                  </div>
                  Westside Studio
                </h3>
                <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Address</label>
                      <p className="text-sm md:text-base text-gray-600">456 Smile Avenue, Bldg B<br/>New York, NY 10002</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Phone</label>
                      <p className="text-sm md:text-base text-gray-600">+1 (212) 555-0456</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Email</label>
                      <p className="text-sm md:text-base text-gray-600">westside@shinesmile.com</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-40 md:h-48 rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src="https://maps.google.com/maps?q=Chelsea+Market&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    title="Westside Studio Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[#050505] text-white py-20 md:py-40 px-4 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ToothIcon className="w-[400px] h-[400px] md:w-[800px] md:h-[800px]" />
          </div>
          <FadeIn className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-medium mb-12 md:mb-24 text-center tracking-tight">What Our Patients Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }}
                  className="bg-white/5 border border-white/10 p-6 md:p-7 rounded-3xl flex flex-col backdrop-blur-sm"
                >
                  <div className="flex gap-1 text-yellow-500 mb-5 md:mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-white/80 italic mb-6 md:mb-8 flex-grow leading-relaxed text-sm md:text-base">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3 md:gap-4 mt-auto">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10">
                      <Image src={t.img} alt={t.name} fill className="object-cover" loading="lazy" />
                    </div>
                    <div>
                      <div className="font-medium text-sm md:text-base">{t.name}</div>
                      <div className="text-xs md:text-sm text-[#004de6]">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Footer */}
        <footer className="relative bg-[#020408] text-white pt-24 md:pt-56 pb-12 px-4 md:px-16 lg:px-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_50%,#004de6_0%,transparent_60%)] opacity-40 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,#004de6_0%,transparent_40%)] opacity-10 pointer-events-none"></div>
          <FadeIn className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20 md:mb-40">
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Contact Us</h4>
                <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                  <li className="flex items-start gap-3 md:gap-4">
                    <MapPin size={18} className="text-[#004de6] shrink-0 mt-1" />
                    <span>Rammurthy nagar, Bangalore-560016</span>
                  </li>
                  <li className="flex items-center gap-3 md:gap-4">
                    <Phone size={18} className="text-[#004de6] shrink-0" />
                    <span>+00 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-3 md:gap-4">
                    <Mail size={18} className="text-[#004de6] shrink-0" />
                    <span>yourId@gmail.com</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Help</h4>
                <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                  <li><a href="#" className="hover:text-[#004de6] transition-colors">Style Guide</a></li>
                  <li><a href="#" className="hover:text-[#004de6] transition-colors">License</a></li>
                  <li><a href="#" className="hover:text-[#004de6] transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Cms</h4>
                <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                  <li><a href="#" className="hover:text-[#004de6] transition-colors">Service Detail</a></li>
                  <li><a href="#" className="hover:text-[#004de6] transition-colors">Blog Detail</a></li>
                  <li><a href="#" className="hover:text-[#004de6] transition-colors">Doctor Detail</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Other Pages</h4>
                <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                  <li><a href="/privacy-policy" className="hover:text-[#004de6] transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms-conditions" className="hover:text-[#004de6] transition-colors">Terms & Conditions</a></li>
                  <li><a href="/protected" className="hover:text-[#004de6] transition-colors">Protected page</a></li>
                  <li><a href="/404-test" className="hover:text-[#004de6] transition-colors">404 Page</a></li>
                </ul>
              </div>
            </div>

            {/* Marquee Buttons Row */}
            <div className="relative overflow-hidden mb-16 md:mb-20 py-4">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                {[...Array(10)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => { setBookingService("General Checkup"); setShowContactPage(false); }}
                    className="mx-3 md:mx-4 bg-white text-black px-6 py-4 md:px-12 md:py-6 rounded-full font-medium text-lg md:text-2xl lg:text-3xl flex items-center gap-3 md:gap-4 hover:scale-105 transition-transform shadow-2xl shadow-white/5 whitespace-nowrap"
                  >
                    Book Appointment Now <ArrowUpRight size={24} className="w-5 h-5 md:w-8 md:h-8" />
                  </button>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#020408] to-transparent pointer-events-none z-10"></div>
              <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#020408] to-transparent pointer-events-none z-10"></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 md:pt-10 text-xs md:text-sm text-gray-500 gap-6 md:gap-8">
              <p className="text-center md:text-left">2025 ShineSmile. All rights reserved. Powered by <a href="#" className="underline hover:text-white transition-colors">codexankit</a></p>
              <div className="flex gap-6 md:gap-8">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Facebook size={20} className="md:w-6 md:h-6" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Instagram size={20} className="md:w-6 md:h-6" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Linkedin size={20} className="md:w-6 md:h-6" /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Youtube size={20} className="md:w-6 md:h-6" /></a>
              </div>
            </div>
          </FadeIn>

          {/* Big Watermark */}
          <div className="mt-16 md:mt-20 flex justify-center w-full pointer-events-none select-none">
            <h1 className="text-[18vw] md:text-[15vw] font-bold leading-none text-white/5 tracking-tighter whitespace-nowrap">
              SHINESMILE
            </h1>
          </div>
        </footer>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#004de6] selection:text-white">
      {/* Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#004de6] text-white flex flex-col items-center justify-center"
          >
            <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 flex items-center gap-2 text-xl hover:opacity-70 transition">
              <X size={32} /> Close
            </button>
            <motion.nav 
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
              }}
              className="flex flex-col items-center gap-8 text-4xl md:text-7xl font-medium tracking-tight"
            >
              {[
                { name: 'Home', href: '#', action: () => setMenuOpen(false) },
                { name: 'About Us', href: '#about', action: () => setMenuOpen(false) },
                { name: 'Services', href: '#services', action: () => setMenuOpen(false) },
                { name: 'Gallery', href: '#gallery', action: () => setMenuOpen(false) },
                { name: 'Contact Us', href: '#', action: () => { setMenuOpen(false); setShowContactPage(true); } },
              ].map((link, i) => (
                <motion.a
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 60 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  href={link.href}
                  onClick={(e) => {
                    if (link.name === 'Contact Us') e.preventDefault();
                    link.action();
                  }}
                  className="hover:opacity-70 transition"
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-black rounded-3xl p-6 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl md:text-4xl font-medium text-[#004de6]">{selectedService.title}</h2>
                <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X size={24} />
                </button>
              </div>
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
                <Image src={selectedService.img} alt={selectedService.title} fill className="object-cover" loading="lazy" />
              </div>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{selectedService.desc}</p>
              
              <h3 className="text-2xl font-medium mb-4">Step-by-Step Process</h3>
              <div className="space-y-4 mb-8">
                {[
                  'Initial Consultation & Examination',
                  'Personalized Treatment Planning',
                  'Professional Procedure Execution',
                  'Post-Treatment Care & Follow-up'
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#004de6] shrink-0" />
                    <span className="text-gray-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => { 
                  setBookingService(selectedService.title);
                  setSelectedService(null); 
                  setShowContactPage(true); 
                }} 
                className="w-full bg-[#004de6] text-white py-4 rounded-full font-medium text-lg hover:bg-[#003bb3] transition-colors flex items-center justify-center gap-2"
              >
                Book an Appointment <ArrowUpRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 md:py-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-sm">
        <div className="relative inline-block">
          <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-white">ShineSmile</span>
          <svg className="absolute -bottom-2 md:-bottom-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-28 text-white" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M10 10 Q 50 25 90 10" />
          </svg>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => { setBookingService("General Checkup"); setShowContactPage(true); }} className="hidden xl:flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-200 transition group text-sm">
            Book Appointment <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <button onClick={() => setMenuOpen(true)} className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition cursor-pointer">
            <div className="w-10 h-5 md:w-11 md:h-6 bg-white/30 rounded-full p-1 flex items-center">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-medium text-white text-sm md:text-base hidden sm:block">Menu</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-16 md:pt-40 md:pb-28 px-4 sm:px-10 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1920&auto=format&fit=crop" alt="Smile Background" fill className="object-cover opacity-30 mix-blend-luminosity" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]"></div>
        </div>
        <FadeIn className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight leading-[1.1] mb-8 md:mb-16">
            Brighten Your<br/>Smile with Expert<br/>Dental Care!
          </h1>
          <button onClick={() => { setBookingService("General Checkup"); setShowContactPage(true); }} className="group rounded-full border border-white/40 px-6 py-4 md:px-14 md:py-7 flex items-center gap-3 md:gap-4 mx-auto hover:bg-white hover:text-black transition-all duration-300 text-lg md:text-2xl lg:text-3xl font-medium">
            Book Appointment <ArrowUpRight size={24} className="w-6 h-6 md:w-9 md:h-9 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </FadeIn>
      </section>

      {/* Services List with Hover Image */}
      <section id="services" className="bg-[#004de6] text-white grid grid-cols-1 xl:grid-cols-2 overflow-hidden">
        <div className="flex flex-col">
          <div className="px-4 md:px-16 lg:px-24 py-10 md:py-16 border-b border-white/20">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-medium tracking-tight">Dental Services</h2>
          </div>
          <div className="flex flex-col">
            {servicesList.map((s, i) => (
              <motion.div 
                key={i} 
                onMouseEnter={() => setHoveredService(s.img)}
                className="group grid grid-cols-1 md:grid-cols-[60px_1fr_auto] items-center border-b border-white/20 hover:bg-white hover:text-[#004de6] transition-colors duration-300 p-6 md:p-12 lg:p-16 xl:p-20 cursor-pointer gap-4 md:gap-12"
              >
                <div className="flex items-center gap-4 md:block">
                  <div className="text-xs md:text-base opacity-60 group-hover:opacity-100 font-mono">{s.id}</div>
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium md:hidden tracking-tight">{s.title}</div>
                </div>
                <div className="hidden md:block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight">{s.title}</div>
                <div className="flex justify-start md:justify-end">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setBookingService(s.title);
                      setShowContactPage(true); 
                    }}
                    className="px-6 py-3 md:px-10 md:py-5 rounded-full border border-current hover:bg-[#004de6] hover:text-white hover:border-[#004de6] transition-all duration-300 flex items-center gap-2 whitespace-nowrap text-xs md:text-lg lg:text-xl w-full sm:w-fit justify-center font-medium"
                  >
                    Book Appointment <ArrowUpRight size={18} className="md:w-6 md:h-6" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[300px] md:min-h-[400px] xl:min-h-full hidden xl:block overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredService}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, zIndex: -1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image src={hoveredService} alt="Service" fill className="object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#004de6]/80 to-transparent opacity-50 mix-blend-multiply"></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white text-black py-24 md:py-40 px-6 md:px-16 lg:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-medium mb-12 md:mb-24 tracking-tight">ShineSmile Effect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
            {stats.map((s, i) => (
              <div key={i} className="border-t border-black/10 pt-6 md:pt-8">
                <div className="text-xs md:text-sm text-gray-400 mb-4 md:mb-10">0{i + 1}</div>
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-[#004de6] mb-4 tracking-tighter flex items-start">
                  {s.value.replace(/[^0-9]/g, '')}
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-1 md:mt-2">{s.value.replace(/[0-9]/g, '')}</span>
                </div>
                <div className="text-base md:text-xl font-medium mb-2 md:mb-3 text-[#004de6]">{s.label}</div>
                <div className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">{s.desc}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Lovely Patients (Enhanced Marquee) */}
      <section className="bg-[#050505] text-white py-24 md:py-40 overflow-hidden relative">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 md:mb-28 px-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium mb-6 md:mb-10 tracking-tight">Lovely Patients</h2>
            <p className="max-w-3xl text-white/70 text-base sm:text-lg md:text-xl leading-relaxed">Real smiles from our wonderful patients who trusted us with their dental care.</p>
          </div>
          
          <div className="relative flex flex-col gap-12 w-full">
            {/* Row 1 */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...lovelyPatients, ...lovelyPatients].map((p, i) => (
                <PatientCard key={`row1-${i}`} p={p} i={i} row={1} />
              ))}
            </div>
            
            {/* Row 2 */}
            <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
              {[...lovelyPatients.slice().reverse(), ...lovelyPatients.slice().reverse()].map((p, i) => (
                <PatientCard key={`row2-${i}`} p={p} i={i} row={2} />
              ))}
            </div>
            
            {/* Gradient Overlays */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none"></div>
          </div>
        </FadeIn>
      </section>

      {/* Doctors */}
      <section className="bg-white text-black py-20 md:py-40 px-4 md:px-16 lg:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-24 gap-6 md:gap-8">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-medium tracking-tight">Expert Experience Doctors</h2>
            <button className="flex items-center gap-2 border border-black/20 rounded-full px-6 py-3 md:px-8 md:py-4 hover:bg-black hover:text-white transition-colors whitespace-nowrap font-medium text-base md:text-lg">
              View All Doctors <ArrowUpRight size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {doctors.map((d, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 mb-4 md:mb-6">
                  <Image src={d.img} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-1 md:mb-2">{d.name}</h3>
                <p className="text-[#004de6] font-medium text-sm md:text-base">{d.role}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Services Grid (Learn More) */}
      <section className="bg-[#004de6] text-white py-20 md:py-40 px-4 md:px-8 lg:px-16 xl:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12 md:mb-28">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-medium mb-4 md:mb-10 tracking-tight">Dental Services for Your<br/>Perfect Smile</h2>
            <p className="max-w-4xl text-white/80 text-sm sm:text-lg md:text-xl px-4 leading-relaxed">At ShineSmile, we offer a wide range of dental services, from routine check-ups to advanced treatments, ensuring your smile stays healthy and bright.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {servicesGrid.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-[#003bb3] p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl sm:rounded-[3rem] hover:bg-white hover:text-[#004de6] transition-all duration-500 group cursor-pointer flex flex-col h-full shadow-2xl shadow-black/10"
                onClick={() => setSelectedService(s)}
              >
                <div className="text-5xl md:text-6xl lg:text-7xl font-light opacity-30 mb-6 md:mb-10 group-hover:opacity-10 transition-opacity">{s.id}</div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 md:mb-6 tracking-tight leading-tight">{s.title}</h3>
                <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-8 md:mb-12 flex-grow leading-relaxed line-clamp-4">{s.desc}</p>
                <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-start sm:items-center xl:items-start 2xl:items-center justify-between gap-4 md:gap-6 mt-auto">
                  <button className="flex items-center gap-2 font-medium group-hover:translate-x-2 transition-transform text-base md:text-lg lg:text-xl">
                    Learn More <ChevronRight size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setBookingService(s.title);
                      setShowContactPage(true); 
                    }}
                    className="px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full border border-current hover:bg-[#004de6] hover:text-white hover:border-[#004de6] transition-all duration-300 flex items-center gap-2 text-xs md:text-sm lg:text-base font-medium whitespace-nowrap w-full sm:w-auto justify-center"
                  >
                    Book Appointment <ArrowUpRight size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Before / After Transformations */}
      <section className="bg-[#050505] text-white py-24 md:py-40 px-6 md:px-16 lg:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 md:mb-28">
            <h2 className="text-4xl md:text-5xl lg:text-8xl font-medium mb-6 md:mb-10 tracking-tight">Smile Transformations</h2>
            <p className="max-w-2xl text-white/70 text-lg md:text-xl px-4 leading-relaxed">See the real results of our expert dental care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {transformations.map((t, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h3 className="text-xl md:text-2xl font-medium text-center mb-2">{t.title}</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 relative border-r-2 border-white">
                      <Image src={t.before} alt="Before" fill className="object-cover" loading="lazy" />
                      <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium backdrop-blur-sm">Before</div>
                    </div>
                    <div className="w-1/2 relative">
                      <Image src={t.after} alt="After" fill className="object-cover" loading="lazy" />
                      <div className="absolute bottom-3 right-3 bg-[#004de6]/80 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium backdrop-blur-sm">After</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Equipment */}
      <section className="bg-white text-black py-24 md:py-40 px-6 md:px-16 lg:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium mb-6 tracking-tight">Advanced Equipment</h2>
            <p className="max-w-2xl text-gray-600 text-lg">We use the latest technology to ensure precise, comfortable, and effective treatments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {equipment.map((e, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 bg-gray-100">
                  <Image src={e.img} alt={e.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  
                  {/* Tooltip */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center backdrop-blur-sm">
                    <p className="text-white text-sm md:text-base leading-relaxed">
                      {e.desc}
                    </p>
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-3">{e.name}</h3>
                <p className="text-gray-600 leading-relaxed line-clamp-2">{e.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Testimonials */}
      <section className="bg-[#050505] text-white py-20 md:py-40 px-4 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <ToothIcon className="w-[400px] h-[400px] md:w-[800px] md:h-[800px]" />
        </div>
        <FadeIn className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-medium mb-12 md:mb-24 text-center tracking-tight">What Our Patients Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 p-6 md:p-7 rounded-3xl flex flex-col backdrop-blur-sm"
              >
                <div className="flex gap-1 text-yellow-500 mb-5 md:mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-white/80 italic mb-6 md:mb-8 flex-grow leading-relaxed text-sm md:text-base">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 md:gap-4 mt-auto">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10">
                    <Image src={t.img} alt={t.name} fill className="object-cover" loading="lazy" />
                  </div>
                  <div>
                    <div className="font-medium text-sm md:text-base">{t.name}</div>
                    <div className="text-xs md:text-sm text-[#004de6]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Gallery (20+ Images) */}
      <section id="gallery" className="bg-white text-black py-24 md:py-40 px-6 md:px-16 lg:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">Our Clinic Gallery</h2>
            <p className="max-w-2xl text-gray-600 text-lg">Take a tour of our state-of-the-art facilities and happy moments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {gallery.map((img, i) => (
              <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer">
                <Image 
                  src={img} 
                  alt={`Gallery image ${i + 1}`} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section className="bg-[#004de6] text-white py-24 md:py-40 px-6 md:px-16 lg:px-32">
        <FadeIn className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-medium mb-12 md:mb-24 tracking-tight">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-0">
            {faqs.map((f, i) => (
              <div 
                key={i} 
                className="border-b border-white/20 py-6 flex flex-col justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg lg:text-xl pr-8 font-medium">{f.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <Plus size={24} className="shrink-0" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p 
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="text-white/80 text-sm md:text-base leading-relaxed overflow-hidden"
                    >
                      {f.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Big CTA Section */}
      <section className="relative text-white py-32 md:py-56 px-6 md:px-16 lg:px-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1920&auto=format&fit=crop" alt="Smiling Patient" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#004de6]/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]"></div>
        </div>
        <FadeIn className="relative z-10 px-6 max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium mb-10 md:mb-16 tracking-tight leading-tight">Let&apos;s Create Your<br/>Perfect Smile</h2>
          <motion.button 
            onClick={() => { setBookingService("General Checkup"); setShowContactPage(true); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group rounded-full bg-white text-[#004de6] px-8 py-4 md:px-14 md:py-7 flex items-center gap-4 md:gap-6 text-xl md:text-3xl lg:text-4xl font-medium hover:shadow-2xl transition-all mx-auto"
          >
            Book Your Visit <ArrowUpRight size={32} className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </motion.button>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-[#020408] text-white pt-24 md:pt-56 pb-12 px-4 md:px-16 lg:px-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_50%,#004de6_0%,transparent_60%)] opacity-40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,#004de6_0%,transparent_40%)] opacity-10 pointer-events-none"></div>
        <FadeIn className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20 md:mb-40">
            <div className="space-y-8">
              <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Contact Us</h4>
              <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                <li className="grid grid-cols-[24px_1fr] gap-3 md:gap-4">
                  <MapPin size={18} className="text-[#004de6] shrink-0 mt-1" />
                  <span>Rammurthy nagar, Bangalore-560016</span>
                </li>
                <li className="grid grid-cols-[24px_1fr] gap-3 md:gap-4">
                  <Phone size={18} className="text-[#004de6] shrink-0" />
                  <span>+00 98765 43210</span>
                </li>
                <li className="grid grid-cols-[24px_1fr] gap-3 md:gap-4">
                  <Mail size={18} className="text-[#004de6] shrink-0" />
                  <span>yourId@gmail.com</span>
                </li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Help</h4>
              <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                <li><a href="#" className="hover:text-[#004de6] transition-colors">Style Guide</a></li>
                <li><a href="#" className="hover:text-[#004de6] transition-colors">License</a></li>
                <li><a href="#" className="hover:text-[#004de6] transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Cms</h4>
              <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                <li><a href="#" className="hover:text-[#004de6] transition-colors">Service Detail</a></li>
                <li><a href="#" className="hover:text-[#004de6] transition-colors">Blog Detail</a></li>
                <li><a href="#" className="hover:text-[#004de6] transition-colors">Doctor Detail</a></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-lg md:text-xl font-medium mb-6 md:mb-8">Other Pages</h4>
              <ul className="space-y-4 md:space-y-5 text-gray-400 text-xs md:text-sm lg:text-base">
                <li><a href="/privacy-policy" className="hover:text-[#004de6] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-conditions" className="hover:text-[#004de6] transition-colors">Terms & Conditions</a></li>
                <li><a href="/protected" className="hover:text-[#004de6] transition-colors">Protected page</a></li>
                <li><a href="/404-test" className="hover:text-[#004de6] transition-colors">404 Page</a></li>
              </ul>
            </div>
          </div>

          {/* Marquee Buttons Row */}
          <div className="relative overflow-hidden mb-16 md:mb-20 py-4">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...Array(10)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => { setBookingService("General Checkup"); setShowContactPage(true); }}
                  className="mx-3 md:mx-4 bg-white text-black px-6 py-4 md:px-14 md:py-8 rounded-full font-medium text-lg md:text-4xl flex items-center gap-3 md:gap-4 hover:scale-105 transition-transform shadow-2xl shadow-white/5 whitespace-nowrap"
                >
                  Book Appointment Now <ArrowUpRight size={28} className="w-5 h-5 md:w-8 md:h-8" />
                </button>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#020408] to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#020408] to-transparent pointer-events-none z-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center border-t border-white/10 pt-8 md:pt-10 text-xs md:text-sm text-gray-500 gap-6 md:gap-8">
            <p className="text-center md:text-left">2025 ShineSmile. All rights reserved. Powered by <a href="#" className="underline hover:text-white transition-colors">codexankit</a></p>
            <div className="flex gap-6 md:gap-8 justify-center md:justify-end">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Facebook size={20} className="md:w-6 md:h-6" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Instagram size={20} className="md:w-6 md:h-6" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Linkedin size={20} className="md:w-6 md:h-6" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#004de6] transition-all hover:scale-110"><Youtube size={20} className="md:w-6 md:h-6" /></a>
            </div>
          </div>
        </FadeIn>

        {/* Big Watermark */}
        <div className="mt-16 md:mt-20 flex justify-center w-full pointer-events-none select-none overflow-hidden">
          <h1 className="text-[15vw] font-bold leading-none text-white/5 tracking-tighter whitespace-nowrap">
            SHINESMILE
          </h1>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/919625654137" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          Chat with us!
        </span>
      </a>
    </div>
  );
}
