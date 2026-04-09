'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, CheckCircle, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SERVICES = [
  { id: 'cosmetic', label: 'Cosmetic Dentistry' },
  { id: 'implants', label: 'Dental Implants' },
  { id: 'orthodontics', label: 'Orthodontics / Braces' },
  { id: 'general', label: 'General Care' },
  { id: 'whitening', label: 'Teeth Whitening' },
  { id: 'rootcanal', label: 'Root Canal' },
  { id: 'cleaning', label: 'Dental Cleaning' },
  { id: 'emergency', label: 'Emergency Care' },
  { id: 'ozone', label: 'Ozone Therapy' },
  { id: 'amalgam', label: 'Mercury-Safe Removal' },
  { id: 'pediatric', label: 'Pediatric Dentistry' },
  { id: 'consultation', label: 'Consultation' },
];

const TIME_SLOTS = [
  '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM',
  '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM',
  '4:30 PM', '5:00 PM', '5:30 PM',
];

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', phone: '',
    service: '', preferred_date: '', preferred_time: '', message: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const progress = (step / 3) * 100;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('appointments').insert([{
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        service: SERVICES.find(s => s.id === form.service)?.label || form.service,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        message: form.message || null,
        status: 'pending',
      }]);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50, transition: { duration: 0.25 } }),
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <div className="h-[3px] bg-brand-primary w-full" />
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200/60 bg-brand-bg">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={36} height={36} />
            <span className="font-serif text-brand-primary tracking-tight text-base">
              <span className="font-bold">HOLISTIC</span>{' '}
              <span className="italic text-brand-accent">SPECIALTY</span>
            </span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg"
          >
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-brand-primary" />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-3">Booking Received</p>
            <h1 className="font-serif text-5xl text-brand-text mb-6 leading-tight">
              You&apos;re all set,<br />
              <span className="italic text-brand-primary">{form.full_name.split(' ')[0]}.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Your request for <strong className="text-brand-text">{SERVICES.find(s => s.id === form.service)?.label}</strong> on{' '}
              <strong className="text-brand-text">{form.preferred_date}</strong> at{' '}
              <strong className="text-brand-text">{form.preferred_time}</strong> has been received.
              We&apos;ll confirm within 24 hours.
            </p>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left mb-8 space-y-3">
              {[
                ['Service', SERVICES.find(s => s.id === form.service)?.label],
                ['Date', form.preferred_date],
                ['Time', form.preferred_time],
                ['Contact', form.email],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-medium">{label}</span>
                  <span className="text-brand-text font-medium">{val}</span>
                </div>
              ))}
            </div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-primary font-medium hover:opacity-70 transition-opacity">
              ← Back to website
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Progress bar */}
      <div className="h-[3px] bg-gray-100 w-full fixed top-0 z-50">
        <motion.div
          className="h-full bg-brand-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-[3px] left-0 right-0 z-40 bg-brand-bg/95 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-8 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Holistic Specialty Logo" width={36} height={36} />
            <span className="font-serif text-brand-primary tracking-tight text-[1.05rem]">
              <span className="font-bold">HOLISTIC</span>{' '}
              <span className="italic text-brand-accent">SPECIALTY</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-text transition-colors">
            <X className="w-3.5 h-3.5" /> Close
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-[71px] overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 pt-14 pb-20">
          <AnimatePresence mode="wait" custom={dir}>

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-5">Step 1 of 3</p>
                <h1 className="font-serif text-5xl md:text-[4rem] text-brand-text mb-14 leading-tight">
                  Choose a Service.
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
                  {SERVICES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => update('service', s.id)}
                      className={`text-left px-5 py-5 border-2 rounded-xl transition-all duration-200 text-sm font-medium leading-tight ${
                        form.service === s.id
                          ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                          : 'border-gray-200 bg-white text-brand-text hover:border-brand-primary/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goTo(2)}
                  disabled={!form.service}
                  className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                    form.service
                      ? 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/25'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-5">Step 2 of 3</p>
                <h1 className="font-serif text-5xl md:text-[4rem] text-brand-text mb-14 leading-tight">
                  Pick Your Time.
                </h1>
                <div className="grid md:grid-cols-2 gap-12 mb-14">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">
                      <Calendar className="w-3.5 h-3.5 text-brand-accent" /> Select Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={form.preferred_date}
                      onChange={e => update('preferred_date', e.target.value)}
                      className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    <p className="text-xs text-gray-300 mt-2 ml-1">Mon – Sat · Sunday closed</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">
                      <Clock className="w-3.5 h-3.5 text-brand-accent" /> Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(t => (
                        <button
                          key={t}
                          onClick={() => update('preferred_time', t)}
                          className={`py-3 text-xs font-semibold rounded-xl border-2 transition-all ${
                            form.preferred_time === t
                              ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-brand-primary/40 hover:text-brand-primary'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => goTo(1)}
                    className="px-8 py-4 border-2 border-gray-200 text-brand-text text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => goTo(3)}
                    disabled={!form.preferred_date || !form.preferred_time}
                    className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                      form.preferred_date && form.preferred_time
                        ? 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/25'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-5">Step 3 of 3</p>
                <h1 className="font-serif text-5xl md:text-[4rem] text-brand-text mb-10 leading-tight">
                  Your Details.
                </h1>

                {/* Summary */}
                <div className="bg-white border border-gray-100 rounded-2xl px-7 py-5 mb-8 flex flex-wrap gap-8">
                  {[
                    ['Service', SERVICES.find(s => s.id === form.service)?.label],
                    ['Date', form.preferred_date],
                    ['Time', form.preferred_time],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-300 mb-1">{label}</p>
                      <p className="text-sm font-semibold text-brand-text">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                      <User className="w-3 h-3" /> Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={e => update('full_name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                      <Phone className="w-3 h-3" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                    <Mail className="w-3 h-3" /> Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="mb-10">
                  <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                    <MessageSquare className="w-3 h-3" /> Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Any special concerns or questions..."
                    className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="mb-5 text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => goTo(2)}
                    className="px-8 py-4 border-2 border-gray-200 text-brand-text text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.full_name || !form.email || !form.phone || loading}
                    className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                      form.full_name && form.email && form.phone && !loading
                        ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <><CheckCircle className="w-4 h-4" /> Confirm Booking</>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-300 mt-5">
                  Our team will contact you within 24 hours to confirm your appointment.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
