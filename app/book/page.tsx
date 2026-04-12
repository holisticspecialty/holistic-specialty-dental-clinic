'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Leaf, Clock, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateBookingForm, checkRateLimit, recordSubmission } from '@/lib/validation';

const SERVICES = [
  'General Consultation',
  'Teeth Whitening',
  'Dental Implants',
  'Orthodontics / Braces',
  'Biological Dentistry',
  'Root Canal (Biological)',
  'Ozone Therapy',
  'Mercury-Safe Amalgam Removal',
  'Pediatric Dentistry',
  'Cosmetic Dentistry',
  'Periodontal Treatment',
  'Emergency Dental Care',
];

const TIMES = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM',
  '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
  '4:30 PM', '5:00 PM',
];

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function BookPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    service: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Rate limit check
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setError(`Please wait ${rateCheck.waitSeconds} seconds before submitting again.`);
      setLoading(false);
      return;
    }

    // Validate all fields
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

    const { error: sbError } = await supabase
      .from('appointments')
      .insert([{
        name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        date: form.preferred_date,
        time: form.preferred_time,
        notes: form.message?.trim() || null,
        status: 'pending',
      }]);

    if (sbError) {
      setError('Something went wrong. Please try again or call us directly.');
      setLoading(false);
      return;
    }

    recordSubmission();
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand-primary" />
          </div>
          <h2 className="font-serif text-3xl text-brand-text mb-3">
            Appointment <span className="italic text-brand-accent">Requested</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thank you, <strong className="text-brand-text">{form.full_name}</strong>! We've received your booking request for{' '}
            <strong className="text-brand-text">{form.preferred_date}</strong> at{' '}
            <strong className="text-brand-text">{form.preferred_time}</strong>. Our team will confirm shortly via email or phone.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-primary/90 transition-colors"
          >
            Back to Home <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={STAGGER}>

          {/* Header */}
          <motion.div variants={FADE_UP} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">
              <Leaf className="w-3.5 h-3.5" /> BOOK YOUR VISIT
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-brand-text leading-tight mb-4">
              Schedule an <br />
              <span className="italic text-brand-accent">Appointment</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Fill in the form below and we'll confirm your appointment within 24 hours.
              For urgent needs, call us directly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Form */}
            <motion.div variants={FADE_UP} className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Full Name <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Dr. Selam Bekele"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Email Address <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="selam@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Phone Number <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Service Needed <span className="text-brand-accent">*</span>
                    </label>
                    <select
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm focus:outline-none focus:border-brand-primary transition-colors appearance-none"
                    >
                      <option value="" disabled>Select a service</option>
                      {SERVICES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Preferred Date <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      required
                      min={today}
                      value={form.preferred_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                      Preferred Time <span className="text-brand-accent">*</span>
                    </label>
                    <select
                      name="preferred_time"
                      required
                      value={form.preferred_time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm focus:outline-none focus:border-brand-primary transition-colors appearance-none"
                    >
                      <option value="" disabled>Select a time</option>
                      {TIMES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                    Additional Notes <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Any concerns, allergies, or special requests you'd like us to know..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-brand-primary text-white text-sm font-semibold rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : (
                    <>Request Appointment <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Sidebar info */}
            <motion.div variants={FADE_UP} className="space-y-6">
              <div className="bg-brand-surface rounded-2xl p-6 border border-gray-100">
                <h3 className="font-serif text-lg text-brand-text mb-4">Clinic Hours</h3>
                <div className="space-y-2 text-sm text-gray-500">
                  {[
                    ['Mon – Sat', '8:00 AM – 6:00 PM'],
                    ['Sunday', 'Closed'],
                  ].map(([day, hrs]) => (
                    <div key={day} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-brand-text">{day}</span>
                      <span>{hrs}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-primary rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Emergency Line</span>
                </div>
                <p className="text-xl font-serif font-bold mb-1">+251 11 XXX XXXX</p>
                <p className="text-xs opacity-70">Available for urgent dental care</p>
              </div>

              <div className="bg-brand-surface rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-text">What to Expect</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                    Confirmation within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                    Arrive 10 minutes early
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                    Bring any prior dental records
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                    Free consultation for new patients
                  </li>
                </ul>
              </div>

              <div className="bg-brand-surface rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-brand-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-text">Location</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Bole Road, Near Atlas Hotel<br />
                  Addis Ababa, Ethiopia
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
