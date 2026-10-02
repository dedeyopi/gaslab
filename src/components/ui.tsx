import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ---------------------------------- Card --------------------------------- */
export function Card({
  children,
  className = '',
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl border border-slate-200 bg-white',
        'shadow-[0_2px_4px_-1px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]',
        interactive
          ? 'transition hover:border-cyan-300 hover:shadow-[0_4px_8px_-2px_rgba(6,182,212,0.10),0_16px_40px_-16px_rgba(6,182,212,0.28)]'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

/* ------------------------------ SectionTitle ----------------------------- */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <header className="mb-6 animate-fadeUp">
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
          {eyebrow}
        </p>
      )}
      <div className="flex items-start gap-3">
        {icon && (
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-600 shadow-sm">
            {icon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- Button -------------------------------- */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 border border-cyan-500/40 shadow-[0_8px_20px_-8px_rgba(6,182,212,0.65)]',
  secondary:
    'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 border border-slate-200',
  danger:
    'bg-gradient-to-br from-rose-500 to-rose-600 text-white hover:from-rose-400 hover:to-rose-500 border border-rose-500/40 shadow-[0_8px_20px_-8px_rgba(244,63,94,0.55)]',
  success:
    'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 border border-emerald-500/40 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.55)]',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* ------------------------------- ProgressBar ------------------------------ */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div
        className="h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress belajar'}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-[width] duration-700 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------- Callout -------------------------------- */
type Tone = 'info' | 'success' | 'warn' | 'danger' | 'neutral';

const TONES: Record<Tone, string> = {
  info: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function Callout({
  tone = 'neutral',
  title,
  children,
  className = '',
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${TONES[tone]} ${className}`}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      {children}
    </div>
  );
}

/* ---------------------------------- Pill --------------------------------- */
export function Pill({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'sky';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: 'border-slate-200 bg-slate-100 text-slate-700',
    cyan: 'border-cyan-200 bg-cyan-100 text-cyan-800',
    emerald: 'border-emerald-200 bg-emerald-100 text-emerald-800',
    amber: 'border-amber-200 bg-amber-100 text-amber-800',
    rose: 'border-rose-200 bg-rose-100 text-rose-800',
    sky: 'border-sky-200 bg-sky-100 text-sky-800',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* --------------------------------- Textarea ------------------------------ */
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      />
    </div>
  );
}

/* --------------------------------- Toggle -------------------------------- */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="cursor-pointer text-sm font-semibold text-slate-700">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition ${
          checked
            ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-emerald-500'
            : 'border-slate-300 bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

/* ------------------------------- EmptyState ------------------------------ */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}