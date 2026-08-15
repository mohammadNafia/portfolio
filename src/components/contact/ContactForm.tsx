'use client';

import { useId, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { contactSchema, type ContactResponse } from '@/lib/contact-schema';
import { Button } from '../ui/Button';
import { site } from '@/lib/site';

type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'network' | 'unavailable';
type Errors = Partial<Record<string, string>>;

/**
 * Contact form — borderless `--surface` fields, dark submit pill, right-aligned.
 *
 * Error styling carries no colour: the system has no red token and forbids
 * introducing one, so the message itself does the work — bold ink text,
 * associated via `aria-describedby`, with a persistent neutral ring on the
 * field. Meaning never rests on colour alone.
 */
export function ContactForm({
  locale,
  dict,
  services,
}: {
  locale: Locale;
  dict: Dictionary;
  services: string[];
}) {
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const f = dict.contact.form;
  const v = dict.contact.validation;
  const s = dict.contact.states;

  const messageFor = (key?: string) =>
    key ? ((v as Record<string, string>)[key] ?? key) : undefined;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'submitting') return;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      company: String(data.get('company') ?? ''),
      service: String(data.get('service') ?? ''),
      summary: String(data.get('summary') ?? ''),
      timeline: String(data.get('timeline') ?? ''),
      budget: String(data.get('budget') ?? ''),
      contactMethod: String(data.get('contactMethod') ?? ''),
      language: String(data.get('language') ?? ''),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? '');
        if (field && !next[field]) next[field] = issue.message;
      }
      setErrors(next);
      setState('idle');
      const first = Object.keys(next)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setState('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.status === 'ok') {
        setState('success');
        formRef.current?.reset();
      } else if (result.status === 'unavailable') {
        setState('unavailable');
      } else if (result.status === 'invalid') {
        const next: Errors = {};
        for (const error of result.errors) next[error.field] = error.messageKey;
        setErrors(next);
        setState('idle');
      } else {
        setState('error');
      }
    } catch {
      setState('network');
    }

    statusRef.current?.focus();
  }

  /*
   * Success is the one state on this form that carries colour, and only this
   * one — the failure paths below stay deliberately colourless.
   *
   * The system has no red token and forbids adding one, so errors do their work
   * with bold ink and a neutral ring. That rule is about not encoding failure
   * in a hue nobody can see. Success is the opposite case: it is not a warning
   * anybody has to act on, it needs to be distinguishable at a glance from the
   * neutral notice it used to look like, and the accent is already the site's
   * one affirmative colour.
   *
   * Contrast is checked, not assumed. `--accent` is the TEXT half of the split
   * accent (see globals.css) and measures 5.25:1 on white; on the 6% tint below
   * it is 5.0:1, still past AA for the 15px body. `--accent-bright` is the
   * text-free half, so it is used for the disc and nothing else. And the state
   * is not carried by colour alone — the heading says it, the tick draws it,
   * and `role="status"` announces it.
   */
  if (state === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-card p-8 text-center"
        style={{
          background: 'color-mix(in srgb, var(--color-accent) 6%, #ffffff)',
        }}
      >
        <span
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill"
          style={{ background: 'var(--color-accent-bright)' }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h3 className="pixel-title !text-[26px] mt-5" style={{ color: 'var(--color-accent)' }}>
          {s.successTitle}
        </h3>

        <p
          className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed"
          style={{ color: 'var(--color-accent)' }}
        >
          {s.successText}
        </p>

        <div className="mt-6 flex justify-center">
          <Button variant="dark" onClick={() => setState('idle')}>
            {s.successAgain}
          </Button>
        </div>
      </div>
    );
  }

  const submitting = state === 'submitting';
  const problem = state === 'error' || state === 'network' || state === 'unavailable';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <div ref={statusRef} tabIndex={-1} className="outline-none">
        {problem ? (
          <div role="alert" className="mb-6 rounded-input bg-surface p-5">
            <h3 className="text-[15px] font-bold text-ink">
              {state === 'unavailable'
                ? s.unavailableTitle
                : state === 'network'
                  ? s.networkErrorTitle
                  : s.errorTitle}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {state === 'unavailable'
                ? s.unavailableText
                : state === 'network'
                  ? s.networkErrorText
                  : s.errorText}
            </p>
            {state === 'unavailable' ? (
              <a href={`mailto:${site.email}`} className="wavy ltr-island mt-3 inline-block text-[15px]">
                {site.email}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <Field
        id={`${baseId}-name`}
        name="name"
        label={f.name}
        placeholder={f.namePlaceholder}
        error={messageFor(errors['name'])}
        autoComplete="name"
        required
      />

      <Field
        id={`${baseId}-email`}
        name="email"
        type="email"
        label={f.email}
        placeholder={f.emailPlaceholder}
        error={messageFor(errors['email'])}
        autoComplete="email"
        ltr
        required
      />

      {/*
        `ltr` on an Arabic page is not cosmetic. A number typed as
        "+964 770 123 4567" in an RTL context has its leading `+` reordered to
        the visual right by the bidi algorithm, so the field shows a number
        that reads as a different one — and the `+` looks like it belongs to
        whatever follows. The island pins the whole value to LTR, which is how
        phone numbers are written in Arabic text anyway.
      */}
      <Field
        id={`${baseId}-phone`}
        name="phone"
        type="tel"
        inputMode="tel"
        label={f.phone}
        placeholder={f.phonePlaceholder}
        error={messageFor(errors['phone'])}
        autoComplete="tel"
        ltr
        required
      />

      <SelectField
        id={`${baseId}-service`}
        name="service"
        label={f.service}
        placeholder={f.servicePlaceholder}
        options={services}
        error={messageFor(errors['service'])}
        required
      />

      <Field
        id={`${baseId}-company`}
        name="company"
        label={f.company}
        hint={f.companyOptional}
        placeholder={f.companyPlaceholder}
        error={messageFor(errors['company'])}
        autoComplete="organization"
      />

      <Field
        id={`${baseId}-summary`}
        name="summary"
        label={f.summary}
        placeholder={f.summaryPlaceholder}
        error={messageFor(errors['summary'])}
        multiline
        required
      />

      <div className="grid gap-x-[22px] sm:grid-cols-2">
        <SelectField
          id={`${baseId}-timeline`}
          name="timeline"
          label={f.timeline}
          placeholder={f.timelinePlaceholder}
          options={[...f.timelineOptions]}
        />
        <SelectField
          id={`${baseId}-budget`}
          name="budget"
          label={f.budget}
          hint={f.budgetOptional}
          placeholder={f.budgetPlaceholder}
          options={[...f.budgetOptions]}
        />
      </div>

      <div className="grid gap-x-[22px] sm:grid-cols-2">
        <SelectField
          id={`${baseId}-contactMethod`}
          name="contactMethod"
          label={f.contactMethod}
          placeholder={f.contactMethods[0] ?? ''}
          options={[...f.contactMethods]}
        />
        <SelectField
          id={`${baseId}-language`}
          name="language"
          label={f.language}
          placeholder={f.languageOptions[locale === 'ar' ? 1 : 0] ?? ''}
          options={[...f.languageOptions]}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-end gap-4">
        {Object.keys(errors).length > 0 ? (
          <p role="alert" className="text-[14px] font-semibold text-ink">
            {v.formInvalid}
          </p>
        ) : null}
        <Button variant="dark" type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? f.submitting : dict.common.sendMessage}
        </Button>
      </div>
    </form>
  );
}

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id}>
        {label}
        {hint ? <span> ({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  id,
  name,
  label,
  hint,
  placeholder,
  type = 'text',
  inputMode,
  error,
  multiline,
  autoComplete,
  ltr,
  required,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  inputMode?: 'tel' | 'email' | 'text' | 'numeric';
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
  ltr?: boolean;
  required?: boolean;
}) {
  const shared = {
    id,
    name,
    placeholder,
    autoComplete,
    inputMode,
    'aria-required': required || undefined,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    className: ltr ? 'ltr-island' : undefined,
    /*
     * `dir` as well as the class. `.ltr-island` sets direction for rendering,
     * but a text input also needs the attribute for the CARET and for how the
     * browser orders characters as they are typed — without it the first
     * keystroke in an RTL document still lands right-to-left.
     */
    dir: ltr ? ('ltr' as const) : undefined,
  };

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      {multiline ? <textarea {...shared} rows={6} /> : <input {...shared} type={type} />}
    </FieldShell>
  );
}

function SelectField({
  id,
  name,
  label,
  hint,
  placeholder,
  options,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  placeholder: string;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
