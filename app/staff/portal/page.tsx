'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  LogOut, Calendar, Clock, User, Phone, Mail,
  RefreshCw, CheckCircle, XCircle, AlertCircle, Leaf
} from 'lucide-react';
import { supabase, type Appointment } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const ROW = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function StaffPortalPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffEmail, setStaffEmail] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      router.push('/staff');
      return false;
    }
    setStaffEmail(user.email ?? '');
    return true;
  }, [router]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setAppointments(data as Appointment[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth().then(ok => { if (ok) fetchAppointments(); });

    // Real-time subscription
    const channel = supabase
      .channel('appointments-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [checkAuth, fetchAppointments]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/staff');
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    setUpdating(id);
    await supabase.from('appointments').update({ status }).eq('id', id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setUpdating(null);
  };

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={36} height={36} className="w-9 h-9" />
            <div>
              <span className="font-[family-name:var(--font-playfair)] text-[1rem] text-brand-primary font-bold">HOLISTIC</span>{' '}
              <span className="font-[family-name:var(--font-playfair)] text-[1rem] italic text-brand-accent">SPECIALTY</span>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest -mt-0.5">Staff Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-500 hover:text-brand-primary transition-colors border border-gray-200 rounded-full hover:border-brand-primary">
              ← Home
            </Link>
            <button onClick={fetchAppointments} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
            <span className="hidden sm:block text-xs text-gray-400">{staffEmail}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors border border-gray-200 rounded-full hover:border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-2xl p-5 text-left border transition-all ${filter === s
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                  : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className={`text-2xl font-bold font-serif mb-1 ${filter === s ? 'text-white' : 'text-brand-text'}`}>
                {counts[s]}
              </div>
              <div className={`text-xs capitalize font-medium ${filter === s ? 'text-white/70' : 'text-gray-400'}`}>
                {s === 'all' ? 'Total Bookings' : `${s.charAt(0).toUpperCase() + s.slice(1)}`}
              </div>
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-brand-text">Appointments</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filter === 'all' ? 'All bookings' : `Showing ${filter}`} · {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live updates on
          </div>
        </div>

        {/* Table / Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="w-6 h-6 text-brand-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {filter === 'all' ? '' : filter} appointments yet.</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="show" variants={STAGGER} className="space-y-3">
            {filtered.map(apt => {
              const cfg = STATUS_CONFIG[apt.status];
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={apt.id}
                  variants={ROW}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Patient info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-text text-sm">{apt.full_name}</p>
                          <p className="text-xs text-gray-400">Booked {formatDate(apt.created_at)}</p>
                        </div>
                        <span className={`ml-auto sm:ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail className="w-3.5 h-3.5 text-gray-300" />
                          <span className="truncate">{apt.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-300" />
                          {apt.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-gray-300" />
                          {apt.preferred_date}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-300" />
                          {apt.preferred_time}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-primary/5 text-brand-primary rounded-full text-[11px] font-medium">
                          <Leaf className="w-3 h-3" /> {apt.service}
                        </span>
                        {apt.message && (
                          <span className="inline-block px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full text-[11px] border border-gray-100 truncate max-w-[200px]">
                            Note: {apt.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {apt.status !== 'confirmed' && (
                        <button
                          disabled={updating === apt.id}
                          onClick={() => updateStatus(apt.id, 'confirmed')}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm
                        </button>
                      )}
                      {apt.status !== 'cancelled' && (
                        <button
                          disabled={updating === apt.id}
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                      {apt.status !== 'pending' && (
                        <button
                          disabled={updating === apt.id}
                          onClick={() => updateStatus(apt.id, 'pending')}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors disabled:opacity-50"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Pending
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}
