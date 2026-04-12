'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle, Calendar, Clock, User, Phone, Mail,
  MessageSquare, Leaf, ArrowRight, Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateBookingForm, checkRateLimit, recordSubmission } from '@/lib/validation';

/* ─── Data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  { id: 'exam',         en: 'Oral Examination',        am: 'የአፍ ምርመራ' },
  { id: 'general',      en: 'General Dentistry',      am: 'አጠቃላይ የጥርስ ሕክምና' },
  { id: 'cleaning',     en: 'Scaling & Cleaning',      am: 'የጥርስ ጽዳት' },
  { id: 'pediatric',    en: 'Pediatric Dentistry',    am: 'የሕፃናት የጥርስ ሕክምና' },
  { id: 'xray',         en: 'Modern X-Ray Service',    am: 'ዘመናዊ የራጅ አገልግሎት' },
  { id: 'lab',          en: 'Laboratory Service',      am: 'የላቦራቶሪ አገልግሎት' },
  { id: 'fillings',     en: 'Fillings',               am: 'የጥርስ መሙላት' },
  { id: 'crowns',       en: 'Crowns & Bridges',        am: 'ዘውድ እና ድልድይ' },
  { id: 'rootcanal',    en: 'Root Canal Treatment',    am: 'የስር ቦይ ሕክምና' },
  { id: 'implants',     en: 'Implant Service',         am: 'የጥርስ ንቅለ ተከላ' },
  { id: 'whitening',    en: 'Teeth Whitening',        am: 'ጥርስን ነጭ ማድረግ' },
  { id: 'invisible',    en: 'Invisible Brace',         am: 'የማይታይ የጥርስ ማስተካከያ' },
  { id: 'ortho',        en: 'Orthodontics',           am: 'የጥርስ ማስተካከል' },
  { id: 'veneers',      en: 'Veneers',                am: 'ቪኒየሮች' },
  { id: 'extraction',   en: 'Extraction',             am: 'ጥርስ መንቀል' },
  { id: 'periodontics', en: 'Periodontics',           am: 'የድድ ሕክምና' },
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

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', phone: '',
    service: '', preferred_date: '', preferred_time: '', message: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const selectedService = SERVICES.find(s => s.id === form.service);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setError(`Please wait ${rateCheck.waitSeconds}s before submitting again.`);
      setLoading(false);
      return;
    }

    const validationErrors = validateBookingForm({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      service: form.service,
      preferred_date: form.preferred_date,
      preferred_time: form.preferred_time,
      message: form.message,
    });
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      setError(firstError);
      setLoading(false);
      return;
    }

    try {
      const { error: dbError } = await supabase.from('appointments').insert([{
        name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: selectedService?.en || form.service,
        date: form.preferred_date,
        time: form.preferred_time,
        notes: form.message?.trim() || null,
        status: 'pending',
      }]);

      if (dbError) {
        setError(dbError.message || 'Database error. Please try again.');
        setLoading(false);
        return;
      }

      recordSubmission();
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ──────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <div className="h-1 bg-brand-primary w-full" />
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200/60 bg-brand-bg">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={36} height={36} />
            <span className="font-[family-name:var(--font-playfair)] text-brand-primary tracking-tight text-base">
              <span className="font-bold">HOLISTIC</span>{' '}
              <span className="italic text-brand-accent">SPECIALTY</span>
            </span>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-lg w-full text-center"
          >
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 200, damping: 18 }}
              className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-8 ring-8 ring-brand-primary/5"
            >
              <CheckCircle className="w-12 h-12 text-brand-primary" strokeWidth={1.5} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-3"
            >
              Booking Received
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-serif text-5xl text-brand-text mb-5 leading-tight"
            >
              You&apos;re all set,<br />
              <span className="italic text-brand-primary">{form.full_name.split(' ')[0]}.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-gray-400 text-sm leading-relaxed mb-10"
            >
              Your appointment request for{' '}
              <strong className="text-brand-text">{selectedService?.en}</strong>{' '}
              on <strong className="text-brand-text">{form.preferred_date}</strong>{' '}
              at <strong className="text-brand-text">{form.preferred_time}</strong>{' '}
              has been received. We&apos;ll confirm within 24 hours.
            </motion.p>

            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-left mb-8 shadow-sm divide-y divide-gray-50"
            >
              {[
                { label: 'Service', value: selectedService?.en },
                { label: 'Date', value: form.preferred_date },
                { label: 'Time', value: form.preferred_time },
                { label: 'Contact', value: form.email },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{label}</span>
                  <span className="text-brand-text font-medium text-sm">{value}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white text-sm font-semibold rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
              >
                Back to Home <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Main Form ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Holistic Specialty Logo" width={36} height={36} />
            <span className="font-[family-name:var(--font-playfair)] text-brand-primary tracking-tight text-[1.05rem]">
              <span className="font-bold">HOLISTIC</span>{' '}
              <span className="italic text-brand-accent">SPECIALTY</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-text transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Close
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-14 pb-10 text-center"
          >
            <span className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold tracking-widest uppercase mb-5">
              <Leaf className="w-3.5 h-3.5" /> Book Your Visit
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-brand-text leading-tight mb-4">
              Schedule an{' '}
              <span className="italic text-brand-primary">Appointment</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Fill in the form below and we&apos;ll confirm your appointment within
              24 hours. For urgent needs, call us directly.
            </p>
          </motion.div>

          {/* Two-column layout */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-24">

              {/* ── LEFT: Form fields ──────────────────────────────── */}
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="lg:col-span-3 space-y-8"
              >

                {/* Section: Personal Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-6 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Full Name <span className="text-brand-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.full_name}
                        onChange={e => update('full_name', e.target.value)}
                        placeholder="e.g. Selam Bekele"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-brand-bg text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Email <span className="text-brand-accent">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => update('email', e.target.value)}
                          placeholder="selam@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-brand-bg text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Phone <span className="text-brand-accent">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={e => update('phone', e.target.value)}
                          placeholder="+251 9XX XXX XXX"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-brand-bg text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Service Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-6 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Choose a Service <span className="text-brand-accent">*</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SERVICES.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => update('service', s.id)}
                        className={`relative text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium leading-tight group ${
                          form.service === s.id
                            ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                            : 'border-gray-100 bg-brand-bg text-brand-text hover:border-brand-primary/40 hover:bg-brand-primary/5'
                        }`}
                      >
                        <span className="text-xs font-semibold">{s.en}</span>
                        {form.service === s.id && (
                          <motion.div
                            layoutId="service-check"
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section: Date & Time */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-6 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Date &amp; Time <span className="text-brand-accent">*</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date picker */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={form.preferred_date}
                        onChange={e => update('preferred_date', e.target.value)}
                        className="w-full border-2 border-gray-100 bg-brand-bg rounded-xl px-4 py-3.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
                      />
                      <p className="text-[10px] text-gray-300 mt-2 ml-1">Mon – Sat · Sunday closed</p>
                    </div>
                    {/* Time slots */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Preferred Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update('preferred_time', t)}
                            className={`py-2.5 text-[11px] font-bold rounded-xl border-2 transition-all ${
                              form.preferred_time === t
                                ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/20'
                                : 'border-gray-100 bg-brand-bg text-gray-500 hover:border-brand-accent/40 hover:text-brand-accent'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Additional Notes */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-6 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Additional Notes{' '}
                    <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
                  </h2>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Any allergies, concerns, or special requests you'd like us to know..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-brand-bg text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                  />
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── RIGHT: Sticky summary sidebar ─────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="lg:col-span-2 space-y-5"
              >
                {/* Booking summary card */}
                <div className="sticky top-[84px]">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">
                      Booking Summary
                    </h3>

                    <div className="space-y-4 mb-6">
                      {/* Service */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Service</p>
                          <p className="text-sm font-semibold text-brand-text">
                            {selectedService ? selectedService.en : <span className="text-gray-300 font-normal">Not selected</span>}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4 text-brand-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Date</p>
                          <p className="text-sm font-semibold text-brand-text">
                            {form.preferred_date || <span className="text-gray-300 font-normal">Not selected</span>}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-4 h-4 text-brand-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Time</p>
                          <p className="text-sm font-semibold text-brand-text">
                            {form.preferred_time || <span className="text-gray-300 font-normal">Not selected</span>}
                          </p>
                        </div>
                      </div>

                      {/* Patient */}
                      {form.full_name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Patient</p>
                            <p className="text-sm font-semibold text-brand-text">{form.full_name}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mb-6" />

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Confirm Booking
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-gray-300 text-center mt-4 leading-relaxed">
                      Our team will contact you within 24 hours to confirm your appointment.
                    </p>
                  </div>

                  {/* Clinic hours */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Clinic Hours</h3>
                    <div className="space-y-2">
                      {[
                        ['Mon – Sat', '8:00 AM – 6:00 PM'],
                        ['Sunday', 'Closed'],
                      ].map(([day, hrs]) => (
                        <div key={day} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
                          <span className="font-medium text-brand-text text-xs">{day}</span>
                          <span className={`text-xs ${hrs === 'Closed' ? 'text-red-400' : 'text-gray-400'}`}>{hrs}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
