'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, CheckCircle, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateBookingForm, checkRateLimit, recordSubmission } from '@/lib/validation';

const SERVICES = [
  { id: 'cosmetic',      en: 'Cosmetic Dentistry',      am: 'የውበት ጥርስ ሕክምና' },
  { id: 'implants',      en: 'Dental Implants',          am: 'የጥርስ ተክሎች' },
  { id: 'orthodontics',  en: 'Orthodontics / Braces',    am: 'ኦርቶዶንቲክስ / ብሬስ' },
  { id: 'general',       en: 'General Care',             am: 'አጠቃላይ ሕክምና' },
  { id: 'whitening',     en: 'Teeth Whitening',          am: 'የጥርስ ማፅዳት' },
  { id: 'rootcanal',     en: 'Root Canal',               am: 'ሥር ቦይ ሕክምና' },
  { id: 'cleaning',      en: 'Dental Cleaning',          am: 'የጥርስ ንጽህና' },
  { id: 'emergency',     en: 'Emergency Care',           am: 'አስቸኳይ ሕክምና' },
  { id: 'ozone',         en: 'Ozone Therapy',            am: 'ኦዞን ሕክምና' },
  { id: 'amalgam',       en: 'Mercury-Safe Removal',     am: 'ሜርኩሪ-ምን ማስወገጃ' },
  { id: 'pediatric',     en: 'Pediatric Dentistry',      am: 'የሕፃናት ጥርስ ሕክምና' },
  { id: 'consultation',  en: 'Consultation',             am: 'ምክክር' },
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

    try {
      const { error: dbError } = await supabase.from('appointments').insert([{
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: SERVICES.find(s => s.id === form.service)?.en || form.service,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        message: form.message?.trim() || null,
        status: 'pending',
      }]);
      if (dbError) throw dbError;
      recordSubmission();
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

  const selectedService = SERVICES.find(s => s.id === form.service);

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <div className="h-[3px] bg-brand-primary w-full" />
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200/60 bg-brand-bg">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={36} height={36} />
            <span className="font-[family-name:var(--font-playfair)] text-brand-primary tracking-tight text-base">
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
            <p
              className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-3"
              data-en="Booking Received"
              data-am="ቀጠሮ ተቀብሏል"
            >
              Booking Received
            </p>
            <h1 className="font-serif text-5xl text-brand-text mb-6 leading-tight">
              <span
                data-en={`You're all set,`}
                data-am={`ሁሉም ዝግጁ ነው,`}
              >
                You&apos;re all set,
              </span>
              <br />
              <span className="italic text-brand-primary">{form.full_name.split(' ')[0]}.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              <span
                data-en={`Your request for`}
                data-am={`የቀጠሮ ጥያቄዎ ለ`}
              >
                Your request for
              </span>{' '}
              <strong className="text-brand-text">{selectedService?.en}</strong>{' '}
              <span data-en="on" data-am="በቀን">on</span>{' '}
              <strong className="text-brand-text">{form.preferred_date}</strong>{' '}
              <span data-en="at" data-am="ሰዓት">at</span>{' '}
              <strong className="text-brand-text">{form.preferred_time}</strong>{' '}
              <span
                data-en="has been received. We'll confirm within 24 hours."
                data-am="ደርሷል። በ24 ሰዓት ውስጥ እናረጋግጣለን።"
              >
                has been received. We&apos;ll confirm within 24 hours.
              </span>
            </p>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left mb-8 space-y-3">
              {[
                ['Service', 'አገልግሎት', selectedService?.en],
                ['Date', 'ቀን', form.preferred_date],
                ['Time', 'ሰዓት', form.preferred_time],
                ['Contact', 'አድራሻ', form.email],
              ].map(([label, labelAm, val]) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                  <span
                    className="text-gray-400 text-xs uppercase tracking-wider font-medium"
                    data-en={label}
                    data-am={labelAm}
                  >
                    {label}
                  </span>
                  <span className="text-brand-text font-medium">{val}</span>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-brand-primary font-medium hover:opacity-70 transition-opacity"
              data-en="← Back to website"
              data-am="← ወደ ድረ-ገጽ ተመለስ"
            >
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
            <span className="font-[family-name:var(--font-playfair)] text-brand-primary tracking-tight text-[1.05rem]">
              <span className="font-bold">HOLISTIC</span>{' '}
              <span className="italic text-brand-accent">SPECIALTY</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-text transition-colors"
            data-en="Close"
            data-am="ዝጋ"
          >
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
                <p
                  className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-5"
                  data-en="Step 1 of 3"
                  data-am="ደረጃ 1 ከ 3"
                >
                  Step 1 of 3
                </p>
                <h1
                  className="font-serif text-5xl md:text-[4rem] text-brand-text mb-14 leading-tight"
                  data-en="Choose a Service."
                  data-am="አገልግሎት ይምረጡ።"
                >
                  Choose a Service.
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
                  {SERVICES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => update('service', s.id)}
                      data-en={s.en}
                      data-am={s.am}
                      className={`text-left px-5 py-5 border-2 rounded-xl transition-all duration-200 text-sm font-medium leading-tight ${
                        form.service === s.id
                          ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                          : 'border-gray-200 bg-white text-brand-text hover:border-brand-primary/50'
                      }`}
                    >
                      {s.en}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goTo(2)}
                  disabled={!form.service}
                  data-en="Continue"
                  data-am="ቀጥል"
                  className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${
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
                <p
                  className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-5"
                  data-en="Step 2 of 3"
                  data-am="ደረጃ 2 ከ 3"
                >
                  Step 2 of 3
                </p>
                <h1
                  className="font-serif text-5xl md:text-[4rem] text-brand-text mb-14 leading-tight"
                  data-en="Pick Your Time."
                  data-am="ሰዓትዎን ይምረጡ።"
                >
                  Pick Your Time.
                </h1>
                <div className="grid md:grid-cols-2 gap-12 mb-14">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">
                      <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                      <span data-en="Select Date" data-am="ቀን ይምረጡ">Select Date</span>
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={form.preferred_date}
                      onChange={e => update('preferred_date', e.target.value)}
                      className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    <p
                      className="text-xs text-gray-300 mt-2 ml-1"
                      data-en="Mon – Sat · Sunday closed"
                      data-am="ሰኞ – ቅዳሜ · እሁድ ዝግ"
                    >
                      Mon – Sat · Sunday closed
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">
                      <Clock className="w-3.5 h-3.5 text-brand-accent" />
                      <span data-en="Select Time" data-am="ሰዓት ይምረጡ">Select Time</span>
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
                    data-en="Back"
                    data-am="ተመለስ"
                    className="px-8 py-4 border-2 border-gray-200 text-brand-text text-xs font-bold tracking-widest uppercase rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => goTo(3)}
                    disabled={!form.preferred_date || !form.preferred_time}
                    data-en="Continue"
                    data-am="ቀጥል"
                    className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${
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
                <p
                  className="text-xs font-bold tracking-widest uppercase text-brand-accent mb-5"
                  data-en="Step 3 of 3"
                  data-am="ደረጃ 3 ከ 3"
                >
                  Step 3 of 3
                </p>
                <h1
                  className="font-serif text-5xl md:text-[4rem] text-brand-text mb-10 leading-tight"
                  data-en="Your Details."
                  data-am="የእርስዎ መረጃ።"
                >
                  Your Details.
                </h1>

                {/* Summary */}
                <div className="bg-white border border-gray-100 rounded-2xl px-7 py-5 mb-8 flex flex-wrap gap-8">
                  {[
                    ['Service', 'አገልግሎት', selectedService?.en],
                    ['Date', 'ቀን', form.preferred_date],
                    ['Time', 'ሰዓት', form.preferred_time],
                  ].map(([label, labelAm, val]) => (
                    <div key={label}>
                      <p
                        className="text-[10px] font-bold tracking-widest uppercase text-gray-300 mb-1"
                        data-en={label}
                        data-am={labelAm}
                      >
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-brand-text">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                      <User className="w-3 h-3" />
                      <span data-en="Full Name *" data-am="ሙሉ ስም *">Full Name *</span>
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={e => update('full_name', e.target.value)}
                      data-placeholder-en="Your full name"
                      data-placeholder-am="ሙሉ ስምዎን ያስገቡ"
                      placeholder="Your full name"
                      className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                      <Phone className="w-3 h-3" />
                      <span data-en="Phone Number *" data-am="ስልክ ቁጥር *">Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      data-placeholder-en="+251 9XX XXX XXX"
                      data-placeholder-am="+251 9XX XXX XXX"
                      placeholder="+251 9XX XXX XXX"
                      className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                    <Mail className="w-3 h-3" />
                    <span data-en="Email Address *" data-am="ኢሜይል አድራሻ *">Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    data-placeholder-en="your@email.com"
                    data-placeholder-am="your@email.com"
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-200 bg-white rounded-xl px-5 py-4 text-sm text-brand-text placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="mb-10">
                  <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                    <MessageSquare className="w-3 h-3" />
                    <span data-en="Additional Notes" data-am="ተጨማሪ ማስታወሻዎች">Additional Notes</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    data-placeholder-en="Any special concerns or questions..."
                    data-placeholder-am="ማንኛውም ልዩ ጥያቄዎች ወይም አስተያየቶች..."
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
                    data-en="Back"
                    data-am="ተመለስ"
                    className="px-8 py-4 border-2 border-gray-200 text-brand-text text-xs font-bold tracking-widest uppercase rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.full_name || !form.email || !form.phone || loading}
                    className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${
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
                        <span data-en="Submitting..." data-am="እየተላከ ነው...">Submitting...</span>
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span data-en="Confirm Booking" data-am="ቀጠሮ ያረጋግጡ">Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
                <p
                  className="text-[11px] text-gray-300 mt-5"
                  data-en="Our team will contact you within 24 hours to confirm your appointment."
                  data-am="ቡድናችን ቀጠሮዎን ለማረጋገጥ በ24 ሰዓት ውስጥ ያነጋግርዎታል።"
                >
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
