/**
 * Shared validation and rate-limiting utilities for booking forms.
 * Centralised here so both /booking and /book pages stay in sync.
 */

// ── Validation helpers ──────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;
const MAX_FIELD_LEN = 200;
const MAX_NOTES_LEN = 1000;

export type ValidationErrors = Record<string, string>;

export function validateBookingForm(fields: {
  full_name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  // Full name
  const name = fields.full_name.trim();
  if (!name) {
    errors.full_name = 'Full name is required.';
  } else if (name.length > MAX_FIELD_LEN) {
    errors.full_name = `Name must be under ${MAX_FIELD_LEN} characters.`;
  }

  // Email
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  } else if (fields.email.length > MAX_FIELD_LEN) {
    errors.email = `Email must be under ${MAX_FIELD_LEN} characters.`;
  }

  // Phone
  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(fields.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  // Service
  if (!fields.service) {
    errors.service = 'Please select a service.';
  }

  // Date — must be today or future
  if (!fields.preferred_date) {
    errors.preferred_date = 'Please select a date.';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(fields.preferred_date + 'T00:00:00');
    if (selected < today) {
      errors.preferred_date = 'Date must be today or in the future.';
    }
  }

  // Time
  if (!fields.preferred_time) {
    errors.preferred_time = 'Please select a time.';
  }

  // Notes (optional but bounded)
  if (fields.message && fields.message.length > MAX_NOTES_LEN) {
    errors.message = `Notes must be under ${MAX_NOTES_LEN} characters.`;
  }

  return errors;
}

// ── Rate-limiting (client-side throttle) ────────────────────────────

const COOLDOWN_KEY = 'booking_last_submit';
const COOLDOWN_MS = 60_000; // 60 seconds between submissions

export function checkRateLimit(): { allowed: boolean; waitSeconds: number } {
  try {
    const last = localStorage.getItem(COOLDOWN_KEY);
    if (last) {
      const elapsed = Date.now() - parseInt(last, 10);
      if (elapsed < COOLDOWN_MS) {
        return { allowed: false, waitSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000) };
      }
    }
  } catch {
    // localStorage unavailable — allow
  }
  return { allowed: true, waitSeconds: 0 };
}

export function recordSubmission(): void {
  try {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
  } catch {
    // silently fail if localStorage unavailable
  }
}
